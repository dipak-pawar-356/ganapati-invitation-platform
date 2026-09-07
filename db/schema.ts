import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";

// =========================================================
// MANDALS TABLE (Multi-tenant core)
// =========================================================
export const mandals = pgTable(
  "mandals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    refNumber: text("ref_number"),
    mandalName: text("mandal_name").notNull(),
    mandalType: text("mandal_type").default("Public Mandal"), // 'Public Mandal' | 'Home Ganapati' | 'Society' | 'Institution'
    subtitle: text("subtitle"),
    establishedYear: text("established_year"),
    language: text("language").notNull().default("mr"),
    inviteMessage: text("invite_message").notNull(),
    themeId: text("theme_id").notNull().default("royal_gold"), // 'royal_gold' | 'peshwai' | 'divine_saffron' | 'night_darshan'
    status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'rejected' | 'need_changes' | 'payment_pending' | 'published' | 'suspended'
    paymentStatus: text("payment_status").notNull().default("paid"), // 'pending' | 'paid'
    amount: integer("amount").default(499),
    heroVideoUrl: text("hero_video_url"),
    heroBgUrl: text("hero_bg_url"),
    musicUrl: text("music_url"),
    contactPersonName: text("contact_person_name"),
    contact: text("contact").notNull(),
    mobileNumber: text("mobile_number"),
    whatsappNumber: text("whatsapp_number"),
    email: text("email"),
    address: text("address").notNull(),
    city: text("city"),
    district: text("district"),
    state: text("state"),
    pincode: text("pincode"),
    mapEmbedUrl: text("map_embed_url"),
    mapsLink: text("maps_link"),
    instagramUrl: text("instagram_url"),
    facebookUrl: text("facebook_url"),
    youtubeUrl: text("youtube_url"),
    websiteUrl: text("website_url"),
    logoUrl: text("logo_url"),
    ganpatiMurtiUrl: text("ganpati_murti_url"),
    pdfCardImageUrl: text("pdf_card_image_url"),
    dailyAartiTime: text("daily_aarti_time"),
    upiId: text("upi_id"),
    accountHolder: text("account_holder"),
    qrCodeUrl: text("qr_code_url"),
    supportMobile: text("support_mobile"),
    donationMessage: text("donation_message"),
    donationAmountOptions: text("donation_amount_options").default("101,251,501,1001,2100"),
    aboutMandal: text("about_mandal"),
    history: text("history"),
    footerText: text("footer_text"),
    teamPhotoUrl: text("team_photo_url"),
    committeeName: text("committee_name"),
    committeeDescription: text("committee_description"),
    presidentGroupPhotoUrl: text("president_group_photo_url"),
    committeeGroupPhotoUrl: text("committee_group_photo_url"),
    volunteerGroupPhotoUrl: text("volunteer_group_photo_url"),
    teamCaption: text("team_caption"),
    teamDescription: text("team_description"),
    showTeamSection: integer("show_team_section").default(1),
    rejectionReason: text("rejection_reason"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    editToken: text("edit_token"),
    flowerCount: integer("flower_count").notNull().default(108),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("mandals_slug_idx").on(table.slug),
    index("mandals_status_idx").on(table.status),
    index("mandals_ref_number_idx").on(table.refNumber),
  ]
);

// =========================================================
// USERS TABLE (Authentication & Roles)
// =========================================================
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("MANDAL_ADMIN"), // 'PLATFORM_ADMIN' | 'MANDAL_ADMIN'
    mandalId: uuid("mandal_id").references(() => mandals.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_mandal_id_idx").on(table.mandalId),
  ]
);

// =========================================================
// MANDAL CREDENTIALS TABLE (Super Admin Generated Accounts)
// =========================================================
export const mandalCredentials = pgTable(
  "mandal_credentials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").notNull().references(() => mandals.id, { onDelete: "cascade" }),
    username: text("username").notNull(),
    tempPassword: text("temp_password").notNull(),
    status: text("status").notNull().default("active"), // 'active' | 'deactivated'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("mandal_cred_mandal_idx").on(table.mandalId),
    index("mandal_cred_username_idx").on(table.username),
  ]
);

// =========================================================
// VERSION HISTORY TABLE (Audit Trail & Rollbacks)
// =========================================================
export const versionHistory = pgTable(
  "version_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").notNull().references(() => mandals.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    editedBy: text("edited_by").notNull(),
    changeSummary: text("change_summary").notNull(),
    snapshotData: text("snapshot_data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("version_history_mandal_idx").on(table.mandalId)]
);

// =========================================================
// PAYMENTS TABLE (Transaction & Approval Records)
// =========================================================
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").references(() => mandals.id, { onDelete: "cascade" }),
    customerName: text("customer_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    amount: integer("amount").notNull().default(499),
    paymentGateway: text("payment_gateway").notNull().default("Razorpay"), // 'Razorpay' | 'UPI_QR'
    transactionId: text("transaction_id"),
    paymentStatus: text("payment_status").notNull().default("pending"), // 'pending' | 'verified' | 'failed'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("payments_mandal_idx").on(table.mandalId),
    index("payments_status_idx").on(table.paymentStatus),
  ]
);

// =========================================================
// TIMELINE EVENTS TABLE
// =========================================================
export const timelineEvents = pgTable(
  "timeline_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").notNull().references(() => mandals.id, { onDelete: "cascade" }),
    day: text("day"),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    eventDate: text("event_date").notNull(),
    eventTime: text("event_time").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    bgColor: text("bg_color"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("timeline_mandal_idx").on(table.mandalId)]
);

// =========================================================
// GALLERY ITEMS TABLE
// =========================================================
export const galleryItems = pgTable(
  "gallery_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").notNull().references(() => mandals.id, { onDelete: "cascade" }),
    mediaType: text("media_type").notNull().default("image"), // 'image' | 'video'
    url: text("url").notNull(),
    caption: text("caption"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("gallery_mandal_idx").on(table.mandalId)]
);

// =========================================================
// COMMITTEE MEMBERS TABLE
// =========================================================
export const committeeMembers = pgTable(
  "committee_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").notNull().references(() => mandals.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    position: text("position").notNull(),
    photoUrl: text("photo_url"),
    phone: text("phone"),
    instagramUrl: text("instagram_url"),
    facebookUrl: text("facebook_url"),
    isDisplayed: integer("is_displayed").notNull().default(1),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("committee_mandal_idx").on(table.mandalId)]
);

// =========================================================
// MURTI PHOTOS TABLE
// =========================================================
export const murtiPhotos = pgTable(
  "murti_photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").notNull().references(() => mandals.id, { onDelete: "cascade" }),
    photoUrl: text("photo_url").notNull(),
    caption: text("caption"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("murti_mandal_idx").on(table.mandalId)]
);

// =========================================================
// DONATION TRANSACTIONS TABLE (Public Visitor Donations)
// =========================================================
export const donationTransactions = pgTable(
  "donation_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").notNull().references(() => mandals.id, { onDelete: "cascade" }),
    donorName: text("donor_name").notNull(),
    donorWhatsapp: text("donor_whatsapp").notNull(),
    amount: integer("amount").notNull(),
    utrNumber: text("utr_number").notNull(),
    screenshotUrl: text("screenshot_url"),
    status: text("status").notNull().default("pending"), // 'pending' | 'verified' | 'rejected'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("donation_trans_mandal_idx").on(table.mandalId),
    index("donation_trans_status_idx").on(table.status),
  ]
);

// Types
export type Mandal = typeof mandals.$inferSelect;
export type NewMandal = typeof mandals.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type MandalCredential = typeof mandalCredentials.$inferSelect;
export type NewMandalCredential = typeof mandalCredentials.$inferInsert;
export type VersionHistoryRecord = typeof versionHistory.$inferSelect;
export type NewVersionHistoryRecord = typeof versionHistory.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type CommitteeMember = typeof committeeMembers.$inferSelect;
export type MurtiPhoto = typeof murtiPhotos.$inferSelect;
export type DonationTransaction = typeof donationTransactions.$inferSelect;
export type NewDonationTransaction = typeof donationTransactions.$inferInsert;


