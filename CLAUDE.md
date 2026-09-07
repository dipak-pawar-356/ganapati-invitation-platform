# CLAUDE.md — Claude Code Developer Manual & Operational Guide

This document is the **definitive AI coding guide** for **Claude Code** when working in the **Adviks SoftTech Ganapati Mandal SaaS Platform** (`ganapati-invitation-platform` / package `ganapati-mandal`). It provides strict architectural principles, database rules, coding conventions, operational recipes, and safety checklists.

---

## 1. Project Overview & Multi-Tenant Paradigm

The repository hosts the **Adviks SoftTech Ganapati Mandal Digital Invitation & Online Donation SaaS Platform**.
- **Architecture**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Neon Serverless PostgreSQL with Drizzle ORM.
- **Tenancy**: Multi-tenant via URL slug (`/[slug]`).
- **Core Tables**: 10 relational tables in `db/schema.ts` (`mandals`, `users`, `mandal_credentials`, `version_history`, `payments`, `timeline_events`, `gallery_items`, `committee_members`, `murti_photos`, `donation_transactions`).
- **Themes**: 4 interchangeable spiritual themes rendered dynamically via `components/themes/ThemeRenderer.tsx`.

---

## 2. Folder Structure & Responsibilities

| Folder | Responsibility | Rules & Conventions |
| :--- | :--- | :--- |
| `app/` | Next.js 16 App Router pages, layouts, and route handlers | Keep server components default. Client components must declare `"use client";`. All `params` and `searchParams` are Promises. |
| `app/[slug]/` | Public tenant invitation layout | Never render unapproved mandals (`status !== 'approved'`). |
| `app/admin/` | Unified admin dashboard, login, database inspector, and previews | Gated by `requirePlatformAdmin()` or `requireMandalAdmin()`. |
| `app/api/` | Public and internal REST API handlers | Route handlers must return `NextResponse.json()` with explicit HTTP status codes. |
| `components/` | Reusable React 19 UI components | Mobile-first; never hardcode colors, use theme CSS variables. |
| `components/admin/`| Specialized admin panels (editor, credentials, donations, history) | Keep logic reactive with modular sub-components. |
| `components/themes/`| The 4 spiritual theme implementations and `ThemeRenderer.tsx` | Must consume identical `FullMandalData` props without data loss. |
| `db/` | Neon connection (`index.ts`), schema (`schema.ts`), and seed script (`seed.ts`) | Only modify schema when running `npm run db:push` immediately after. |
| `docs/` | Modular technical architecture manuals | Keep documentation updated when altering database or API contracts. |
| `lib/` | Core server actions, auth, photo compression, slugification, Razorpay | Server actions must declare `"use server";` and use `handleActionError()`. |
| `public/` | Static media assets (audio, videos, transparent murtis, branding) | Optimize all asset formats (WebP/SVG preferred). |

---

## 3. Strict Coding & Naming Standards

### 3.1 Naming Conventions
- **Files & Components**: PascalCase for React components (`Hero.tsx`, `Theme1RoyalGold.tsx`, `AdminSidebar.tsx`).
- **Utilities & Actions**: kebab-case for utility files (`mandal-actions.ts`, `photo-upload.ts`, `admin-auth.ts`).
- **Database Tables & Columns**:
  - Drizzle table exports: camelCase (`timelineEvents`, `galleryItems`, `donationTransactions`).
  - SQL column names: snake_case (`mandal_id`, `event_date`, `display_order`, `utr_number`).
- **Server Actions**: camelCase ending in `Action` (`approveMandalAction()`, `submitDonationTransactionAction()`).

### 3.2 React 19 & Next.js 16 Guidelines
- **Server Actions**: Always declare `"use server";` at the top of the file or action function.
- **Client Components**: Always declare `"use client";` when using React state, effects, or browser events.
- **Async Route Params**: Next.js 16 requires awaiting route parameters:
  ```typescript
  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // ...
  }
  ```
- **Hydration Warning Suppression**: If rendering client-side timestamps or random numbers, use `suppressHydrationWarning` on the specific HTML tag.
- **Cache Revalidation**: Always call `revalidatePath('/[slug]')` and `revalidatePath('/admin')` following any tenant mutation.

---

## 4. Database Rules (Neon & Drizzle ORM)

1. **Cascade Deletions**: Every foreign key referencing `mandals.id` MUST specify `{ onDelete: "cascade" }`.
2. **Explicit Indexes**: All foreign key columns and frequently queried filter columns (`slug`, `status`, `refNumber`) must have explicit indexes in the table builder callback:
   ```typescript
   (table) => [
     index("timeline_mandal_idx").on(table.mandalId),
   ]
   ```
3. **No Direct DDL in Production**: Never execute raw unchecked DDL statements. Always modify `db/schema.ts` and apply changes via `npm run db:push`.
4. **Point-in-Time Audit Trail**: Every server action modifying tenant data must invoke `saveVersionHistory(mandalId, changeSummary, editedBy)`.

---

## 5. Security & Permission Rules

1. **Role Hierarchy**:
   - `PLATFORM_ADMIN`: Super admin with global authority. Gated via `requirePlatformAdmin()`.
   - `MANDAL_ADMIN`: Tenant admin with authority restricted to their own `mandalId`. Gated via `requireMandalAdmin(mandalId)`.
2. **Password Standards**: Passwords must be hashed using `bcryptjs` with `10` salt rounds. Plaintext passwords must never be stored in the `users` table.
3. **Session Cookie**: Sessions reside in the HTTP-only cookie `mandal_saas_session`. Never expose session tokens to client-side scripts.
4. **Unapproved Tenant Shielding**: Mandals with `status !== 'approved'` must never render public invitation layouts on `/[slug]`.

---

## 6. Financial & Donation Rules

1. **Donation Status Lifecycle**: Incoming donations default to `status = 'pending'`. Only an authenticated Mandal Admin or Super Admin can mark a donation as `verified` after checking the 12-digit UTR against bank records.
2. **Zero Tampering**: Never silently modify incoming donation amounts, UTR numbers, or transaction IDs.
3. **Razorpay Validation**: Razorpay order verification strictly requires cryptographic HMAC SHA-256 signature matching using `RAZORPAY_KEY_SECRET`.
4. **Devanagari WhatsApp Formatting**: Donation WhatsApp notifications must follow the established Devanagari template (`🙏 *नवीन देणगी प्राप्त* ...`).

---

## 7. Operational Prompting Recipes for Claude

### Recipe 1: How Claude Should Add a New Feature
1. Review `PROJECT_ARCHITECTURE.md` to identify affected layers.
2. If schema updates are needed, add columns to `db/schema.ts` with appropriate indexes and cascade rules.
3. Add or update server actions in `lib/mandal-actions.ts` with authorization guards (`requirePlatformAdmin()` or `requireMandalAdmin()`).
4. Ensure `saveVersionHistory()` is called to record the change snapshot.
5. Update `components/admin/MandalContentEditor.tsx` and the 4 theme renderers in `components/themes/`.
6. Invoke `revalidatePath('/[slug]')` and `revalidatePath('/admin')`.

### Recipe 2: How Claude Should Fix Bugs
1. Inspect the exact code origin; do not guess.
2. Ensure proper null-checks on optional mandal fields (`logoUrl`, `heroVideoUrl`, `upiId`, `mapsLink`).
3. If handling database errors, route through `handleActionError()`.
4. Ensure mobile viewports (360px–420px) render cleanly without horizontal overflow.

### Recipe 3: How Claude Should Perform Refactoring
1. Never alter component prop shapes if it breaks any of the 4 spiritual themes.
2. Never duplicate existing utilities (`slugify`, `uploadPhoto`, `db`).
3. Document any dead code findings in `DOCUMENTATION_CHANGELOG.md` instead of deleting without notice.

---

## 8. Do's and Don'ts

### ✅ DO
- Always design mobile-first (360px–420px width).
- Always compress client-side images using `uploadPhoto()` from `lib/photo-upload.ts`.
- Always use theme CSS variables (`var(--t-primary)`, `var(--t-bg)`) instead of hardcoded hex codes.
- Always use `revalidatePath` to keep Next.js edge caches fresh.
- Always preserve Marathi Devanagari terminology in tenant-facing UI.

### ❌ DON'T
- Never invent fake features (no personal expense splitters or unrelated tools).
- Never hardcode API keys, passwords, or connection strings in code.
- Never bypass the pending moderation check on `/[slug]`.
- Never remove the Next.js agent block in `AGENTS.md`.
- Never use `dangerouslySetInnerHTML`.
