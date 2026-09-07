"use server";

import { db } from "@/db";
import {
  mandals,
  users,
  mandalCredentials,
  versionHistory,
  timelineEvents,
  galleryItems,
  committeeMembers,
  donationTransactions,
  Mandal,
  TimelineEvent,
  GalleryItem,
  CommitteeMember,
  MandalCredential,
  VersionHistoryRecord,
  DonationTransaction,
} from "@/db/schema";
import { eq, asc, desc, sql, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hashPassword, requirePlatformAdmin, requireMandalAdmin } from "./auth";
import { getUniqueSlug, slugify } from "./slug";
import crypto from "crypto";

export interface FullMandalData extends Mandal {
  timeline: TimelineEvent[];
  gallery: GalleryItem[];
  committee: CommitteeMember[];
}

function generateRefNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `REF-${dateStr}-${randomHex}`;
}

function generateRandomPassword(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

/**
 * Diagnostic error translation helper
 */
function handleActionError(error: any, context: string): never {
  const msg = error?.message || String(error);
  console.error(`[Mandal Actions Error - ${context}]:`, error);

  if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
    throw new Error("DATABASE_URL Missing: Please set DATABASE_URL in your .env.local file.");
  }
  if (msg.includes("fetch failed") || msg.includes("Error connecting")) {
    throw new Error("Neon Database Unreachable: Failed to connect to Neon PostgreSQL endpoint.");
  }
  if (msg.includes("password authentication failed")) {
    throw new Error("Database Auth Failed: Invalid credentials in DATABASE_URL.");
  }
  if (msg.includes("relation") && msg.includes("does not exist")) {
    throw new Error("Database Schema Missing: Table does not exist. Run `npx drizzle-kit push`.");
  }
  throw new Error(`${context} failed: ${msg}`);
}

/**
 * Direct Create Mandal Action (Platform Admin)
 */
export async function createMandalAction(input: {
  mandalName: string;
  slug: string;
  adminEmail: string;
  adminPassword: string;
  themeId?: string;
  contact: string;
  address: string;
  establishedYear?: string;
  inviteMessage?: string;
}) {
  await requirePlatformAdmin();

  try {
    const formattedSlug = input.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    const passwordHash = await hashPassword(input.adminPassword);
    const editToken = crypto.randomBytes(16).toString("hex");

    const [newMandal] = await db
      .insert(mandals)
      .values({
        slug: formattedSlug,
        mandalName: input.mandalName,
        establishedYear: input.establishedYear || "२००१",
        inviteMessage: input.inviteMessage || "आमच्या मंडळाच्या श्री गणेशोत्सवास सस्नेह निमंत्रित आहोत!",
        themeId: input.themeId || "royal_gold",
        status: "approved",
        paymentStatus: "paid",
        contact: input.contact,
        address: input.address,
        editToken,
      })
      .returning();

    if (!newMandal) {
      throw new Error("Failed to insert new mandal record into database.");
    }

    await db.insert(users).values({
      email: input.adminEmail,
      passwordHash,
      role: "MANDAL_ADMIN",
      mandalId: newMandal.id,
    });

    await db.insert(mandalCredentials).values({
      mandalId: newMandal.id,
      username: input.adminEmail,
      tempPassword: input.adminPassword,
      status: "active",
    });

    revalidatePath("/admin");
    revalidatePath(`/${formattedSlug}`);
    return newMandal;
  } catch (error) {
    handleActionError(error, "Create Mandal");
  }
}

/**
 * Update Mandal general content
 */
export async function updateMandalAction(
  mandalId: string,
  data: Partial<Omit<Mandal, "id" | "slug" | "createdAt">>
) {
  try {
    const session = await requireMandalAdmin(mandalId);

    // Strict Authorization: After initial submission, only Super Admin (PLATFORM_ADMIN) can change themeId
    if (data.themeId !== undefined) {
      if (session.role !== "PLATFORM_ADMIN") {
        const [currentMandal] = await db
          .select({ themeId: mandals.themeId })
          .from(mandals)
          .where(eq(mandals.id, mandalId))
          .limit(1);

        if (currentMandal && data.themeId !== currentMandal.themeId) {
          throw new Error(
            "अनधिकृत: थीम बदलण्याची परवानगी फक्त सुपर ॲडमिनला (Super Admin) आहे. मंडळाच्या ॲडमिनला थीम बदलता येत नाही. (Unauthorized: Theme can only be changed by Super Admin)"
          );
        }
        // Remove themeId so non-super-admin update never overwrites it
        delete data.themeId;
      }
    }

    if (Object.keys(data).length > 0) {
      await db.update(mandals).set(data).where(eq(mandals.id, mandalId));
    }

    await saveVersionHistory(
      mandalId,
      session.role === "PLATFORM_ADMIN"
        ? `Updated details by Super Admin (${session.email})`
        : `Updated details by Mandal Admin (${session.email})`,
      session.email
    );

    const [updated] = await db.select().from(mandals).where(eq(mandals.id, mandalId));
    if (updated) {
      revalidatePath(`/${updated.slug}`);
    }
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    handleActionError(error, "Update Mandal");
  }
}

/**
 * Update Mandal Theme (Super Admin Only)
 */
export async function updateMandalThemeAction(mandalId: string, themeId: string) {
  const session = await requirePlatformAdmin();
  try {
    const validThemes = ["royal_gold", "peshwai", "divine_saffron", "night_darshan"];
    if (!validThemes.includes(themeId)) {
      throw new Error(`अवैध थीम आयडी (Invalid Theme ID): ${themeId}`);
    }

    await db.update(mandals).set({ themeId }).where(eq(mandals.id, mandalId));

    await saveVersionHistory(
      mandalId,
      `Theme changed to '${themeId}' by Super Admin (${session.email})`,
      session.email
    );

    const [updated] = await db.select().from(mandals).where(eq(mandals.id, mandalId));
    if (updated) {
      revalidatePath(`/${updated.slug}`);
    }
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    handleActionError(error, "Update Mandal Theme");
  }
}

/**
 * Fetch a complete Mandal record by slug
 */
export async function getMandalBySlug(slug: string): Promise<FullMandalData | null> {
  try {
    const mandalRows = await db.select().from(mandals).where(eq(mandals.slug, slug)).limit(1);
    if (!mandalRows || mandalRows.length === 0) {
      return null;
    }

    const mandal = mandalRows[0];

    const [events, gallery, committee] = await Promise.all([
      db.select().from(timelineEvents).where(eq(timelineEvents.mandalId, mandal.id)).orderBy(asc(timelineEvents.displayOrder)),
      db.select().from(galleryItems).where(eq(galleryItems.mandalId, mandal.id)).orderBy(asc(galleryItems.displayOrder)),
      db.select().from(committeeMembers).where(eq(committeeMembers.mandalId, mandal.id)).orderBy(asc(committeeMembers.displayOrder)),
    ]);

    return {
      ...mandal,
      timeline: events,
      gallery,
      committee,
    };
  } catch (error) {
    console.error("Error fetching mandal by slug:", error);
    return null;
  }
}

/**
 * Fetch a complete Mandal record by Reference Number
 */
export async function getMandalByRefNumber(refNumber: string): Promise<FullMandalData | null> {
  try {
    const mandalRows = await db.select().from(mandals).where(eq(mandals.refNumber, refNumber)).limit(1);
    if (!mandalRows || mandalRows.length === 0) {
      return null;
    }

    const mandal = mandalRows[0];

    const [events, gallery, committee] = await Promise.all([
      db.select().from(timelineEvents).where(eq(timelineEvents.mandalId, mandal.id)).orderBy(asc(timelineEvents.displayOrder)),
      db.select().from(galleryItems).where(eq(galleryItems.mandalId, mandal.id)).orderBy(asc(galleryItems.displayOrder)),
      db.select().from(committeeMembers).where(eq(committeeMembers.mandalId, mandal.id)).orderBy(asc(committeeMembers.displayOrder)),
    ]);

    return {
      ...mandal,
      timeline: events,
      gallery,
      committee,
    };
  } catch (error) {
    console.error("Error fetching mandal by refNumber:", error);
    return null;
  }
}

/**
 * Fetch all mandals for Platform Admin Dashboard
 */
export async function getAllMandals() {
  try {
    return await db.select().from(mandals).orderBy(desc(mandals.createdAt));
  } catch (error) {
    console.error("Error fetching mandals in getAllMandals():", error);
    return [];
  }
}

/**
 * Customer Submission Flow Action (No Login Required)
 * Creates a request with status = 'pending'. Does NOT publish or issue credentials immediately.
 */
export async function submitCustomerRequestAction(input: {
  mandalName: string;
  mandalType?: string;
  establishedYear: string;
  contactPersonName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  upiId: string;
  subtitle?: string;
  inviteMessage: string;
  language?: string;
  themeId?: string;
  mapsLink?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  accountHolder?: string;
  qrCodeUrl?: string;
  supportMobile?: string;
  donationDescription?: string;
  donationAmountOptions?: string;
  heroVideoUrl?: string;
  heroBgUrl?: string;
  logoUrl?: string;
  ganpatiMurtiUrl?: string;
  dailyAartiTime?: string;
  aboutMandal?: string;
  history?: string;
  footerText?: string;

  // Group / Team section
  teamPhotoUrl?: string;
  committeeName?: string;
  committeeDescription?: string;
  presidentGroupPhotoUrl?: string;
  committeeGroupPhotoUrl?: string;
  volunteerGroupPhotoUrl?: string;
  teamCaption?: string;
  teamDescription?: string;
  showTeamSection?: boolean;

  // Array data
  timeline: Array<{
    day?: string;
    title: string;
    subtitle?: string;
    eventDate: string;
    eventTime: string;
    description?: string;
    imageUrl?: string;
    bgColor?: string;
    displayOrder?: number;
  }>;
  gallery: Array<{
    url: string;
    caption?: string;
    mediaType?: "image" | "video";
    displayOrder?: number;
  }>;
  committee: Array<{
    name: string;
    position: string;
    photoUrl?: string;
    phone?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    isDisplayed?: boolean;
    displayOrder?: number;
  }>;
}) {
  try {
    // 1. Mandatory Validations
    if (!input.mandalName?.trim()) throw new Error("मंडळाचे नाव आवश्यक आहे.");
    if (!input.establishedYear?.trim()) throw new Error("स्थापना वर्ष आवश्यक आहे.");
    if (!input.contactPersonName?.trim()) throw new Error("संपर्क व्यक्तीचे नाव आवश्यक आहे.");
    if (!input.mobileNumber?.trim()) throw new Error("मोबाईल नंबर आवश्यक आहे.");
    if (!input.whatsappNumber?.trim()) throw new Error("WhatsApp नंबर आवश्यक आहे.");
    if (!input.email?.trim()) throw new Error("ईमेल पत्ता आवश्यक आहे.");
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      throw new Error("कृपया वैध ईमेल पत्ता टाका.");
    }

    // Check duplicate email
    const existingEmail = await db
      .select({ id: mandals.id })
      .from(mandals)
      .where(eq(mandals.email, input.email.trim().toLowerCase()))
      .limit(1);

    if (existingEmail && existingEmail.length > 0) {
      throw new Error("या ईमेल पत्त्यावर आधीच अर्ज सादर केला आहे. कृपया वेगळा ईमेल वापरा.");
    }

    if (!input.address?.trim()) throw new Error("पत्ता आवश्यक आहे.");
    if (!input.city?.trim()) throw new Error("शहर आवश्यक आहे.");
    if (!input.district?.trim()) throw new Error("जिल्हा आवश्यक आहे.");
    if (!input.state?.trim()) throw new Error("राज्य आवश्यक आहे.");
    if (!input.pincode?.trim()) throw new Error("पिनकोड आवश्यक आहे.");
    if (!input.upiId?.trim()) throw new Error("UPI ID आवश्यक आहे.");

    // Generate temporary reference details
    const refNumber = generateRefNumber();
    const temporarySlug = `pending-${refNumber.toLowerCase()}`;
    const editToken = crypto.randomUUID();

    const [newMandal] = await db
      .insert(mandals)
      .values({
        slug: temporarySlug,
        refNumber,
        mandalName: input.mandalName.trim(),
        mandalType: input.mandalType || "Public Mandal",
        establishedYear: input.establishedYear.trim(),
        contactPersonName: input.contactPersonName.trim(),
        contact: input.mobileNumber.trim(),
        mobileNumber: input.mobileNumber.trim(),
        whatsappNumber: input.whatsappNumber.trim(),
        email: input.email.trim().toLowerCase(),
        address: input.address.trim(),
        city: input.city.trim(),
        district: input.district.trim(),
        state: input.state.trim(),
        pincode: input.pincode.trim(),
        upiId: input.upiId.trim(),
        accountHolder: input.accountHolder?.trim() || null,
        qrCodeUrl: input.qrCodeUrl || null,
        supportMobile: input.supportMobile?.trim() || input.mobileNumber.trim(),
        donationMessage: input.donationDescription?.trim() || "मंडळाच्या सामाजिक व धार्मिक कार्यासाठी ऐच्छिक वर्गणी / देणगी अर्पण करा.",
        donationAmountOptions: input.donationAmountOptions || "101,251,501,1001,2100",
        subtitle: input.subtitle || null,
        language: input.language || "mr",
        inviteMessage: input.inviteMessage || "आमच्या मंडळाच्या श्री गणेशोत्सवास सस्नेह निमंत्रित आहोत!",
        themeId: input.themeId || "royal_gold",
        status: "pending", // Always PENDING upon customer submission
        paymentStatus: "paid",
        mapsLink: input.mapsLink || null,
        mapEmbedUrl: input.mapsLink ? `https://maps.google.com/maps?q=${encodeURIComponent(input.address)}&output=embed` : null,
        instagramUrl: input.instagramUrl || null,
        facebookUrl: input.facebookUrl || null,
        youtubeUrl: input.youtubeUrl || null,
        websiteUrl: input.websiteUrl || null,
        heroVideoUrl: input.heroVideoUrl || null,
        heroBgUrl: input.heroBgUrl || null,
        logoUrl: input.logoUrl || null,
        ganpatiMurtiUrl: input.ganpatiMurtiUrl || null,
        dailyAartiTime: input.dailyAartiTime || null,
        aboutMandal: input.aboutMandal || null,
        history: input.history || null,
        footerText: input.footerText || null,

        teamPhotoUrl: input.teamPhotoUrl || null,
        committeeName: input.committeeName || null,
        committeeDescription: input.committeeDescription || null,
        presidentGroupPhotoUrl: input.presidentGroupPhotoUrl || null,
        committeeGroupPhotoUrl: input.committeeGroupPhotoUrl || null,
        volunteerGroupPhotoUrl: input.volunteerGroupPhotoUrl || null,
        teamCaption: input.teamCaption || null,
        teamDescription: input.teamDescription || null,
        showTeamSection: input.showTeamSection !== false ? 1 : 0,

        editToken,
      })
      .returning();

    if (!newMandal) {
      throw new Error("Failed to insert customer submission into database.");
    }

    // Insert Timeline Events
    if (input.timeline && input.timeline.length > 0) {
      await db.insert(timelineEvents).values(
        input.timeline.map((e, index) => ({
          mandalId: newMandal.id,
          day: e.day || null,
          title: e.title,
          subtitle: e.subtitle || null,
          eventDate: e.eventDate || "२०२६",
          eventTime: e.eventTime || "सकाळी ९:०० वा.",
          description: e.description || null,
          imageUrl: e.imageUrl || null,
          bgColor: e.bgColor || null,
          displayOrder: e.displayOrder ?? index + 1,
        }))
      );
    }

    // Insert Gallery Items
    if (input.gallery && input.gallery.length > 0) {
      await db.insert(galleryItems).values(
        input.gallery.map((g, index) => ({
          mandalId: newMandal.id,
          mediaType: g.mediaType || "image",
          url: g.url,
          caption: g.caption || null,
          displayOrder: g.displayOrder ?? index + 1,
        }))
      );
    }

    // Insert Committee Members
    if (input.committee && input.committee.length > 0) {
      await db.insert(committeeMembers).values(
        input.committee.map((c, index) => ({
          mandalId: newMandal.id,
          name: c.name,
          position: c.position,
          photoUrl: c.photoUrl || null,
          phone: c.phone || null,
          instagramUrl: c.instagramUrl || null,
          facebookUrl: c.facebookUrl || null,
          isDisplayed: c.isDisplayed !== false ? 1 : 0,
          displayOrder: c.displayOrder ?? index + 1,
        }))
      );
    }

    // Record initial version history
    await saveVersionHistory(newMandal.id, "Visitor Customer Submission", "SUBMISSION_FORM");

    revalidatePath("/admin");
    return {
      refNumber: newMandal.refNumber || refNumber,
      mandalId: newMandal.id,
      editToken: newMandal.editToken,
      mandalName: newMandal.mandalName,
    };
  } catch (error) {
    handleActionError(error, "Submit Customer Request");
  }
}

/**
 * Super Admin Approval Action
 * - Sets slug (custom assigned by Super Admin)
 * - Changes status to 'approved' / 'published'
 * - Automatically generates Mandal Admin credentials
 * - Saves in `users` and `mandal_credentials`
 */
export async function approveMandalAction(mandalId: string, assignedSlug?: string) {
  await requirePlatformAdmin();
  try {
    const mandalRows = await db.select().from(mandals).where(eq(mandals.id, mandalId)).limit(1);
    if (!mandalRows || mandalRows.length === 0) {
      throw new Error("Mandal not found.");
    }
    const mandal = mandalRows[0];

    let finalSlug = mandal.slug;
    if (assignedSlug && assignedSlug.trim()) {
      const formatted = slugify(assignedSlug.trim());
      // Check if duplicate exists for another mandal
      const existing = await db
        .select({ id: mandals.id })
        .from(mandals)
        .where(and(eq(mandals.slug, formatted), ne(mandals.id, mandalId)))
        .limit(1);

      if (existing && existing.length > 0) {
        throw new Error(`❌ Slug '${formatted}' is already assigned to another mandal. Please choose a different slug.`);
      }
      finalSlug = formatted;
    } else if (mandal.slug.startsWith("pending-")) {
      finalSlug = await getUniqueSlug(mandal.mandalName);
    }

    // Update mandal status and slug
    await db
      .update(mandals)
      .set({ status: "approved", slug: finalSlug })
      .where(eq(mandals.id, mandalId));

    // Generate credentials if not already created
    const existingCreds = await db
      .select()
      .from(mandalCredentials)
      .where(eq(mandalCredentials.mandalId, mandalId))
      .limit(1);

    let username = mandal.email || `${finalSlug}-admin`;
    let tempPassword = generateRandomPassword();

    if (existingCreds && existingCreds.length > 0) {
      username = existingCreds[0].username;
      tempPassword = existingCreds[0].tempPassword;
    } else {
      const passwordHash = await hashPassword(tempPassword);

      // Create Mandal Admin user in users table
      await db.insert(users).values({
        email: username,
        passwordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal.id,
      });

      // Store in mandalCredentials table for Super Admin Credential Panel
      await db.insert(mandalCredentials).values({
        mandalId: mandal.id,
        username,
        tempPassword,
        status: "active",
      });
    }

    await saveVersionHistory(mandal.id, `Super Admin Approved Mandal with slug '${finalSlug}' & Generated Credentials`, "SUPER_ADMIN");

    revalidatePath("/admin");
    revalidatePath(`/${finalSlug}`);

    return {
      success: true,
      slug: finalSlug,
      username,
      tempPassword,
      mandalName: mandal.mandalName,
      mandalEmail: mandal.email,
      mandalWhatsapp: mandal.whatsappNumber || mandal.mobileNumber || mandal.contact,
    };
  } catch (error) {
    handleActionError(error, "Approve Mandal");
  }
}

/**
 * Super Admin Reject Action
 */
export async function rejectMandalAction(mandalId: string, reason?: string) {
  await requirePlatformAdmin();
  try {
    await db
      .update(mandals)
      .set({ status: "rejected", rejectionReason: reason || "Does not meet guidelines." })
      .where(eq(mandals.id, mandalId));

    await saveVersionHistory(mandalId, `Super Admin Rejected: ${reason || "Rejected"}`, "SUPER_ADMIN");
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Reject Mandal");
  }
}

/**
 * Super Admin Request Changes Action
 */
export async function requestChangesMandalAction(mandalId: string, reason: string) {
  await requirePlatformAdmin();
  try {
    await db
      .update(mandals)
      .set({ status: "need_changes", rejectionReason: reason })
      .where(eq(mandals.id, mandalId));

    await saveVersionHistory(mandalId, `Super Admin Requested Changes: ${reason}`, "SUPER_ADMIN");
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Request Changes");
  }
}

/**
 * Super Admin & Mandal Admin Update Action (FULL CONTROL EDIT)
 */
export async function updateFullMandalAction(
  mandalId: string,
  input: {
    mandalData: Partial<Omit<Mandal, "id" | "createdAt">>;
    timeline?: Array<{
      id?: string;
      day?: string;
      title: string;
      subtitle?: string;
      eventDate: string;
      eventTime: string;
      description?: string;
      imageUrl?: string;
      bgColor?: string;
      displayOrder?: number;
    }>;
    gallery?: Array<{
      id?: string;
      mediaType?: string;
      url: string;
      caption?: string;
      displayOrder?: number;
    }>;
    committee?: Array<{
      id?: string;
      name: string;
      position: string;
      photoUrl?: string;
      phone?: string;
      instagramUrl?: string;
      facebookUrl?: string;
      isDisplayed?: boolean;
      displayOrder?: number;
    }>;
  },
  editedBy = "ADMIN"
) {
  try {
    await db.update(mandals).set(input.mandalData).where(eq(mandals.id, mandalId));

    // Update timeline if provided
    if (input.timeline) {
      await db.delete(timelineEvents).where(eq(timelineEvents.mandalId, mandalId));
      if (input.timeline.length > 0) {
        await db.insert(timelineEvents).values(
          input.timeline.map((e, index) => ({
            mandalId,
            day: e.day || null,
            title: e.title,
            subtitle: e.subtitle || null,
            eventDate: e.eventDate,
            eventTime: e.eventTime,
            description: e.description || null,
            imageUrl: e.imageUrl || null,
            bgColor: e.bgColor || null,
            displayOrder: e.displayOrder ?? index + 1,
          }))
        );
      }
    }

    // Update gallery if provided
    if (input.gallery) {
      await db.delete(galleryItems).where(eq(galleryItems.mandalId, mandalId));
      if (input.gallery.length > 0) {
        await db.insert(galleryItems).values(
          input.gallery.map((g, index) => ({
            mandalId,
            mediaType: g.mediaType || "image",
            url: g.url,
            caption: g.caption || null,
            displayOrder: g.displayOrder ?? index + 1,
          }))
        );
      }
    }

    // Update committee if provided
    if (input.committee) {
      await db.delete(committeeMembers).where(eq(committeeMembers.mandalId, mandalId));
      if (input.committee.length > 0) {
        await db.insert(committeeMembers).values(
          input.committee.map((c, index) => ({
            mandalId,
            name: c.name,
            position: c.position,
            photoUrl: c.photoUrl || null,
            phone: c.phone || null,
            instagramUrl: c.instagramUrl || null,
            facebookUrl: c.facebookUrl || null,
            isDisplayed: c.isDisplayed !== false ? 1 : 0,
            displayOrder: c.displayOrder ?? index + 1,
          }))
        );
      }
    }

    await saveVersionHistory(mandalId, `Updated details by ${editedBy}`, editedBy);

    const [updated] = await db.select().from(mandals).where(eq(mandals.id, mandalId));
    if (updated) {
      revalidatePath(`/${updated.slug}`);
    }
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    handleActionError(error, "Update Full Mandal");
  }
}

/**
 * Fetch all Credentials for Super Admin Credential Panel
 */
export async function getAllMandalCredentials(): Promise<
  Array<MandalCredential & { mandalName: string; slug: string }>
> {
  await requirePlatformAdmin();
  try {
    const rows = await db
      .select({
        id: mandalCredentials.id,
        mandalId: mandalCredentials.mandalId,
        username: mandalCredentials.username,
        tempPassword: mandalCredentials.tempPassword,
        status: mandalCredentials.status,
        createdAt: mandalCredentials.createdAt,
        mandalName: mandals.mandalName,
        slug: mandals.slug,
      })
      .from(mandalCredentials)
      .innerJoin(mandals, eq(mandalCredentials.mandalId, mandals.id))
      .orderBy(desc(mandalCredentials.createdAt));

    return rows;
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return [];
  }
}

/**
 * Reset Mandal Admin Password
 */
export async function resetMandalPasswordAction(credentialId: string) {
  await requirePlatformAdmin();
  try {
    const credRows = await db
      .select()
      .from(mandalCredentials)
      .where(eq(mandalCredentials.id, credentialId))
      .limit(1);

    if (!credRows || credRows.length === 0) {
      throw new Error("Credential not found.");
    }
    const cred = credRows[0];
    const newPass = generateRandomPassword();
    const newHash = await hashPassword(newPass);

    // Update in mandalCredentials
    await db
      .update(mandalCredentials)
      .set({ tempPassword: newPass })
      .where(eq(mandalCredentials.id, credentialId));

    // Update in users table
    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.email, cred.username));

    revalidatePath("/admin");
    return { success: true, newPassword: newPass };
  } catch (error) {
    handleActionError(error, "Reset Mandal Password");
  }
}

/**
 * Toggle Credential Status (Active / Deactivated)
 */
export async function toggleCredentialStatusAction(credentialId: string) {
  await requirePlatformAdmin();
  try {
    const credRows = await db
      .select()
      .from(mandalCredentials)
      .where(eq(mandalCredentials.id, credentialId))
      .limit(1);

    if (!credRows || credRows.length === 0) return;
    const cred = credRows[0];
    const newStatus = cred.status === "active" ? "deactivated" : "active";

    await db
      .update(mandalCredentials)
      .set({ status: newStatus })
      .where(eq(mandalCredentials.id, credentialId));

    revalidatePath("/admin");
    return { success: true, status: newStatus };
  } catch (error) {
    handleActionError(error, "Toggle Credential Status");
  }
}

/**
 * Version History Tracker & Saver
 */
export async function saveVersionHistory(mandalId: string, changeSummary: string, editedBy: string) {
  try {
    const fullData = await getMandalBySlug("");
    const mandalRows = await db.select().from(mandals).where(eq(mandals.id, mandalId)).limit(1);
    if (!mandalRows || mandalRows.length === 0) return;

    const mandal = mandalRows[0];
    const [events, gallery, committee] = await Promise.all([
      db.select().from(timelineEvents).where(eq(timelineEvents.mandalId, mandalId)),
      db.select().from(galleryItems).where(eq(galleryItems.mandalId, mandalId)),
      db.select().from(committeeMembers).where(eq(committeeMembers.mandalId, mandalId)),
    ]);

    const snapshot = JSON.stringify({ mandal, events, gallery, committee });

    const existingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(versionHistory)
      .where(eq(versionHistory.mandalId, mandalId));

    const versionNumber = (Number(existingCount[0]?.count) || 0) + 1;

    await db.insert(versionHistory).values({
      mandalId,
      versionNumber,
      editedBy,
      changeSummary,
      snapshotData: snapshot,
    });
  } catch (err) {
    console.error("Failed to save version history:", err);
  }
}

/**
 * Fetch Version History Logs
 */
export async function getVersionHistoryAction(mandalId: string): Promise<VersionHistoryRecord[]> {
  try {
    return await db
      .select()
      .from(versionHistory)
      .where(eq(versionHistory.mandalId, mandalId))
      .orderBy(desc(versionHistory.createdAt));
  } catch (error) {
    console.error("Error fetching version history:", error);
    return [];
  }
}

/**
 * Restore a Previous Version
 */
export async function restoreVersionAction(historyId: string) {
  await requirePlatformAdmin();
  try {
    const rows = await db.select().from(versionHistory).where(eq(versionHistory.id, historyId)).limit(1);
    if (!rows || rows.length === 0) throw new Error("History record not found.");

    const historyRecord = rows[0];
    const snapshot = JSON.parse(historyRecord.snapshotData);

    if (snapshot.mandal) {
      await updateFullMandalAction(
        historyRecord.mandalId,
        {
          mandalData: snapshot.mandal,
          timeline: snapshot.events,
          gallery: snapshot.gallery,
          committee: snapshot.committee,
        },
        `RESTORED_V${historyRecord.versionNumber}`
      );
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    handleActionError(error, "Restore Version");
  }
}

/**
 * Increment Flower Count Live
 */
export async function incrementFlowerCountAction(mandalId: string) {
  try {
    await db
      .update(mandals)
      .set({ flowerCount: sql`${mandals.flowerCount} + 1` })
      .where(eq(mandals.id, mandalId));
  } catch (error) {
    console.error("Failed to update flower count:", error);
  }
}

/**
 * Update Status Action
 */
export async function updateMandalStatusAction(
  mandalId: string,
  status: "approved" | "pending" | "suspended" | "rejected" | "need_changes" | "published"
) {
  await requirePlatformAdmin();
  try {
    await db.update(mandals).set({ status }).where(eq(mandals.id, mandalId));
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Update Mandal Status");
  }
}

/**
 * Delete Mandal permanently
 */
export async function deleteMandalAction(mandalId: string) {
  await requirePlatformAdmin();
  try {
    await db.delete(mandals).where(eq(mandals.id, mandalId));
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Delete Mandal");
  }
}

/**
 * Timeline Events CRUD
 */
export async function addTimelineEventAction(
  mandalId: string,
  event: { title: string; subtitle?: string; eventDate: string; eventTime: string; description?: string; imageUrl?: string; day?: string; bgColor?: string }
) {
  await requireMandalAdmin(mandalId);
  try {
    await db.insert(timelineEvents).values({
      mandalId,
      day: event.day,
      title: event.title,
      subtitle: event.subtitle,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      description: event.description,
      imageUrl: event.imageUrl,
      bgColor: event.bgColor,
    });
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Add Timeline Event");
  }
}

export async function deleteTimelineEventAction(eventId: string, mandalId: string) {
  await requireMandalAdmin(mandalId);
  try {
    await db.delete(timelineEvents).where(eq(timelineEvents.id, eventId));
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Delete Timeline Event");
  }
}

/**
 * Gallery Items CRUD
 */
export async function addGalleryItemAction(
  mandalId: string,
  item: { url: string; caption?: string; mediaType?: "image" | "video" }
) {
  await requireMandalAdmin(mandalId);
  try {
    await db.insert(galleryItems).values({
      mandalId,
      url: item.url,
      caption: item.caption,
      mediaType: item.mediaType || "image",
    });
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Add Gallery Item");
  }
}

export async function deleteGalleryItemAction(itemId: string, mandalId: string) {
  await requireMandalAdmin(mandalId);
  try {
    await db.delete(galleryItems).where(eq(galleryItems.id, itemId));
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Delete Gallery Item");
  }
}

export async function updateGalleryItemCaptionAction(itemId: string, mandalId: string, caption: string) {
  await requireMandalAdmin(mandalId);
  try {
    await db.update(galleryItems).set({ caption }).where(eq(galleryItems.id, itemId));
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Update Gallery Item Caption");
  }
}


/**
 * Committee Members CRUD
 */
export async function addCommitteeMemberAction(
  mandalId: string,
  member: { name: string; position: string; phone?: string; photoUrl?: string; instagramUrl?: string; facebookUrl?: string; isDisplayed?: boolean }
) {
  await requireMandalAdmin(mandalId);
  try {
    await db.insert(committeeMembers).values({
      mandalId,
      name: member.name,
      position: member.position,
      phone: member.phone,
      photoUrl: member.photoUrl,
      instagramUrl: member.instagramUrl,
      facebookUrl: member.facebookUrl,
      isDisplayed: member.isDisplayed !== false ? 1 : 0,
    });
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Add Committee Member");
  }
}

export async function deleteCommitteeMemberAction(memberId: string, mandalId: string) {
  await requireMandalAdmin(mandalId);
  try {
    await db.delete(committeeMembers).where(eq(committeeMembers.id, memberId));
    revalidatePath("/admin");
  } catch (error) {
    handleActionError(error, "Delete Committee Member");
  }
}

/**
 * =========================================================
 * DONATION TRANSACTIONS ACTIONS
 * =========================================================
 */

/**
 * Public Visitor Donation Submission Action
 * - Saves donation transaction with status = 'pending'
 * - Formats WhatsApp message for Mandal Admin
 */
export async function submitDonationTransactionAction(input: {
  mandalId: string;
  donorName: string;
  donorWhatsapp: string;
  amount: number;
  utrNumber: string;
  screenshotUrl?: string;
}) {
  try {
    if (!input.donorName?.trim()) throw new Error("आपले नाव आवश्यक आहे.");
    if (!input.donorWhatsapp?.trim()) throw new Error("WhatsApp नंबर आवश्यक आहे.");
    if (!input.amount || input.amount <= 0) throw new Error("वैध देणगी रक्कम आवश्यक आहे.");
    if (!input.utrNumber?.trim()) throw new Error("UTR / Transaction ID आवश्यक आहे.");

    // Fetch Mandal details to get WhatsApp number and Mandal Name
    const mandalRows = await db.select().from(mandals).where(eq(mandals.id, input.mandalId)).limit(1);
    if (!mandalRows || mandalRows.length === 0) {
      throw new Error("Mandal not found.");
    }
    const mandal = mandalRows[0];

    const [newTransaction] = await db
      .insert(donationTransactions)
      .values({
        mandalId: input.mandalId,
        donorName: input.donorName.trim(),
        donorWhatsapp: input.donorWhatsapp.trim(),
        amount: input.amount,
        utrNumber: input.utrNumber.trim(),
        screenshotUrl: input.screenshotUrl || null,
        status: "pending",
      })
      .returning();

    const todayDate = new Date().toLocaleDateString("mr-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const mandalAdminPhone = mandal.whatsappNumber || mandal.mobileNumber || mandal.contact;

    // Requirement 17 WhatsApp Message format for Mandal Admin
    const whatsappMessage = `🙏 *नवीन देणगी प्राप्त*

*मंडळ:*
${mandal.mandalName}

*देणगीदार:*
${input.donorName.trim()}

*मोबाईल:*
${input.donorWhatsapp.trim()}

*रक्कम:*
₹${input.amount}

*UTR:*
${input.utrNumber.trim()}

*दिनांक:*
${todayDate}

कृपया पडताळणी करा.`;

    const cleanPhone = mandalAdminPhone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(whatsappMessage)}`;

    revalidatePath("/admin");
    revalidatePath(`/${mandal.slug}`);

    return {
      success: true,
      transactionId: newTransaction.id,
      mandalName: mandal.mandalName,
      mandalWhatsapp: mandalAdminPhone,
      whatsappUrl,
      whatsappMessage,
    };
  } catch (error) {
    handleActionError(error, "Submit Donation Transaction");
  }
}

/**
 * Fetch Donation Transactions for Admin Panel
 */
export async function getDonationTransactionsAction(mandalId?: string, statusFilter?: string) {
  try {
    let query = db
      .select({
        id: donationTransactions.id,
        mandalId: donationTransactions.mandalId,
        donorName: donationTransactions.donorName,
        donorWhatsapp: donationTransactions.donorWhatsapp,
        amount: donationTransactions.amount,
        utrNumber: donationTransactions.utrNumber,
        screenshotUrl: donationTransactions.screenshotUrl,
        status: donationTransactions.status,
        createdAt: donationTransactions.createdAt,
        mandalName: mandals.mandalName,
        mandalSlug: mandals.slug,
      })
      .from(donationTransactions)
      .innerJoin(mandals, eq(donationTransactions.mandalId, mandals.id))
      .$dynamic();

    if (mandalId) {
      query = query.where(eq(donationTransactions.mandalId, mandalId));
    }

    if (statusFilter && statusFilter !== "all") {
      query = query.where(eq(donationTransactions.status, statusFilter));
    }

    const rows = await query.orderBy(desc(donationTransactions.createdAt));
    return rows;
  } catch (error) {
    console.error("Error fetching donation transactions:", error);
    return [];
  }
}

/**
 * Update Donation Transaction Status (Approve / Reject)
 */
export async function updateDonationStatusAction(transactionId: string, status: "verified" | "rejected") {
  try {
    await db
      .update(donationTransactions)
      .set({ status })
      .where(eq(donationTransactions.id, transactionId));

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    handleActionError(error, "Update Donation Status");
  }
}

