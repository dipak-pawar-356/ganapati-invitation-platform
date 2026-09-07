# CLAUDE.md — Claude Code Developer Manual

This document provides definitive instructions, coding rules, architectural guidelines, and operational patterns for **Claude Code** when working on the **Ganapati Mandal Digital Invitation & Donation Platform** (`ganapati-invitation-platform` / package `ganapati-mandal`).

---

## 1. Core Principles & Non-Negotiable Mandates

1. **Never Break Existing Functionality**: Every change must preserve backwards compatibility with all 4 themes, active tenant sites (`/[slug]`), and admin portals.
2. **Zero Assumptions**: Never hallucinate database tables, API routes, or features. Always check `db/schema.ts`, `lib/mandal-actions.ts`, and `PROJECT_ARCHITECTURE.md`.
3. **Preserve Financial & Donation Accuracy**: Never alter donation calculation logic, UTR tracking, transaction statuses (`pending`, `verified`, `rejected`), or Razorpay HMAC SHA-256 verification routines.
4. **Preserve Audit Trail**: Whenever modifying mandal core data, timeline, gallery, or committee records in server actions, always invoke `saveVersionHistory()`.
5. **Never Hardcode Secrets or Credentials**: Never put raw database connection strings, passwords, or API keys in code or commit messages. Always use environment variables (`process.env.DATABASE_URL`, `process.env.PLATFORM_ADMIN_PASSWORD`).
6. **Reuse Existing Components & Utilities**:
   - Slugification: Always use `slugify()` and `getUniqueSlug()` from `lib/slug.ts`.
   - Database: Always use the Drizzle instance `db` from `db/index.ts`.
   - Image Compression: Always use `uploadPhoto()` / `uploadPhotos()` from `lib/photo-upload.ts`.
   - Design System: Always check `components/common/DesignSystem.tsx`, `components/common/SectionDivider.tsx`, and `components/common/ThemeDecorations.tsx`.
7. **Mobile-First Mindset**: 80% of devotees access invitations on smartphones. Always test UI layouts, touch targets, and typography on small viewports first.

---

## 2. Project Architecture & Technology Map

- **Framework**: Next.js 16.3.1 (App Router, Server Actions, Dynamic Routes)
- **UI Engine**: React 19.2.8
- **Styling**: Tailwind CSS 4 with CSS Custom Properties (`var(--t-primary)`, `var(--t-bg)`, `var(--admin-gold)`)
- **Database**: Neon Serverless PostgreSQL with connection pooler (`@neondatabase/serverless` HTTP driver)
- **ORM**: Drizzle ORM v0.45.2 (`drizzle-orm/neon-http`, `drizzle-orm/pg-core`)
- **Animations**: Framer Motion 13.1 & GSAP 3.15
- **Payment Gateway**: Razorpay 2.9.8 (lazy singleton in `lib/razorpay.ts`)

---

## 3. Coding Standards & Conventions

### 3.1 TypeScript & Next.js Rules
- **Server Actions**: Must declare `"use server";` at the top of the file or action body.
- **Client Components**: Must declare `"use client";` at the top of the file whenever using React hooks (`useState`, `useEffect`), browser APIs (`window`, `localStorage`, `navigator`), or Framer Motion/GSAP.
- **Async Route Params**: Next.js 16 requires `params` and `searchParams` in server components and routes to be typed as Promises:
  ```typescript
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // ...
  }
  ```
- **Error Handling in Server Actions**: Never crash server actions silently. Use the established pattern:
  ```typescript
  try {
    // operation
  } catch (error) {
    handleActionError(error, "Action Context Name");
  }
  ```

### 3.2 Database & Drizzle Rules
- All tables must be defined in `db/schema.ts` using `pgTable`.
- Primary keys must use `uuid("id").defaultRandom().primaryKey()`.
- Foreign keys must explicitly specify `{ onDelete: "cascade" }`.
- Foreign key columns must be indexed in the table builder callback:
  ```typescript
  export const myTable = pgTable("my_table", {
    id: uuid("id").defaultRandom().primaryKey(),
    mandalId: uuid("mandal_id").notNull().references(() => mandals.id, { onDelete: "cascade" }),
    // ...
  }, (table) => [
    index("my_table_mandal_idx").on(table.mandalId),
  ]);
  ```
- After modifying `db/schema.ts`, apply changes with `npx drizzle-kit push`.

### 3.3 UI & CSS Theme Tokens
The platform uses dynamic CSS custom properties tailored for cultural mandal themes. Never hardcode colors directly when building theme-aware components; use theme tokens:
- Primary Gold Accent: `var(--t-primary)`
- Secondary Accent: `var(--t-secondary)`
- Theme Background: `var(--t-bg)`
- Theme Card Background: `var(--t-bg-card)`
- Text High-Contrast: `var(--t-text)`
- Soft Text: `var(--t-text-soft)`
- Admin Panel Background: `var(--admin-bg)`
- Admin Card Background: `var(--admin-card)`
- Admin Gold Accent: `var(--admin-gold)`

### 3.4 Marathi Language & Devanagari Guidelines
- The public tenant experience is primarily in Marathi.
- Standard terminology:
  - मंडळाचे नाव (Mandal Name)
  - स्थापना वर्ष (Established Year)
  - निमंत्रण संदेश (Invitation Message)
  - आरती वेळापत्रक (Aarti Schedule)
  - देणगी / वर्गणी (Donation)
  - छायाचित्र दालन (Photo Gallery)
  - उत्सव समिती (Festival Committee)
  - सुपर ॲडमिन (Super Admin)
  - मंजुरी प्रलंबित (Pending Approval)

---

## 4. Role-Based Access Control (RBAC) Rules

1. **Platform Super Admin (`PLATFORM_ADMIN`)**:
   - Access verified via `requirePlatformAdmin()` in `lib/auth.ts`.
   - Has full access to all mandals, can change tenant statuses, view credentials vault, and delete records.
2. **Mandal Admin (`MANDAL_ADMIN`)**:
   - Access verified via `requireMandalAdmin(mandalId)` in `lib/auth.ts`.
   - Cannot access or modify records belonging to other mandal tenants.
3. **Unapproved Tenant Shielding**:
   - Any mandal with `status !== 'approved' && status !== 'published'` must never render publicly on `/[slug]`.
   - Always display the pending approval shield screen unless accessed by a verified `PLATFORM_ADMIN` via `/admin/preview/[mandalId]`.

---

## 5. Instructions for Common Claude Tasks

### Task 1: How Claude Should Add a New Feature
1. **Locate Architectural Placement**: Check `PROJECT_ARCHITECTURE.md` to identify affected layers (database table, server action, API endpoint, theme component, or admin panel).
2. **Update Schema (if needed)**: Add columns or tables in `db/schema.ts` with proper indexes, types, and cascade rules.
3. **Implement Server Action**: Add strongly typed mutations in `lib/mandal-actions.ts` or `lib/admin-actions.ts`. Enforce authorization (`requirePlatformAdmin()` or `requireMandalAdmin()`).
4. **Preserve Snapshot**: If tenant content changes, invoke `saveVersionHistory()`.
5. **Update UI Components**: Integrate into `components/admin/MandalContentEditor.tsx` and the 4 themes in `components/themes/`.
6. **Revalidate Next.js Cache**: Include `revalidatePath('/[slug]')` and `revalidatePath('/admin')`.

### Task 2: How Claude Should Fix Bugs
1. **Diagnose without Assumptions**: Inspect the exact lines of code where the error originates.
2. **Check Database Availability**: If database queries fail, verify `process.env.DATABASE_URL` and ensure connection pooler parameters are present (`?sslmode=require`).
3. **Verify Null Safety**: Always account for optional fields (`logoUrl`, `heroVideoUrl`, `upiId`, `mapsLink`) when rendering UI.
4. **Hydration Warning Prevention**: If displaying timestamps or random numbers on client components, use `suppressHydrationWarning` on the specific HTML node.
5. **Test Mobile Breakpoints**: Ensure that bug fixes do not introduce horizontal scrollbars on mobile screens (`overflow-x-hidden`).

### Task 3: How Claude Should Refactor Code
1. **Never Change Component Prop Interfaces**: When refactoring shared components (`Hero.tsx`, `Timeline.tsx`, `Gallery.tsx`, `DonationWidget.tsx`), ensure existing prop shapes remain backwards-compatible with all 4 themes.
2. **Never Duplicate Existing Helpers**: Before creating a slugifier, password generator, or database query, search `lib/` for existing implementations.
3. **Preserve Dead Code Warnings**: If cleaning up code, report unused files in `DOCUMENTATION_CHANGELOG.md` rather than deleting without user confirmation.

---

## 6. Development & Verification Commands

```bash
# Start local development server
npm run dev

# Run TypeScript & Lint checks
npm run lint

# Push schema changes to Neon DB
npm run db:push

# Seed demo mandals & credentials
npm run db:seed

# Production build verification
npm run build
```

---

## 7. Operational Prompting Guidelines

When the user asks you to modify or extend the codebase, follow this internal sequence:
1. **Analyze Dependencies**: What existing files import or call the target code?
2. **Check Data Integrity**: Does this operation impact tenant separation, financial records, or credentials?
3. **Execute Minimal, Robust Edits**: Write concise, surgical edits without removing surrounding docstrings or logic.
4. **Verify Build**: Ensure no TypeScript or build regressions were introduced.
