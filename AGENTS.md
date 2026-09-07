<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Universal AI Agent Operational Guide — Adviks SoftTech Ganapati Platform

This document serves as the **universal standard operating guide** for all autonomous AI coding assistants, code generators, and pair programmers (including **OpenAI, Claude, Cursor, GitHub Copilot, Gemini, Windsurf, Continue, Antigravity, Aider, and OpenHands**) working in the `ganapati-invitation-platform` repository.

---

## 1. Project Overview & Identity

- **Platform Name**: Adviks SoftTech Ganapati Mandal Digital Invitation & Online Donation SaaS Platform (package `ganapati-mandal`).
- **Owner & Creator**: Adviks SoftTech (Lead Developer: Dipak Pawar).
- **Core Paradigm**: Multi-tenant SaaS serving custom cultural invitation websites on `/[slug]`.
- **Primary Tech Stack**: Next.js 16.3.1 (App Router), React 19.2.8, Tailwind CSS 4, Neon Serverless PostgreSQL, Drizzle ORM, Framer Motion, GSAP, Razorpay.

---

## 2. Step-by-Step Developer Recipes for AI Agents

### 2.1 How to Add a New Page
1. Determine route location under `app/`:
   - Public route: `app/<page-name>/page.tsx`
   - Dynamic tenant route: `app/[slug]/page.tsx`
   - Admin protected route: `app/admin/<feature>/page.tsx`
2. Next.js 16 Server Component standard: Route `params` and `searchParams` MUST be typed as Promises and awaited:
   ```typescript
   export default async function NewPage({
     params,
     searchParams,
   }: {
     params: Promise<{ slug?: string }>;
     searchParams: Promise<{ tab?: string }>;
   }) {
     const { slug } = await params;
     const { tab } = await searchParams;
     // ...
   }
   ```
3. Wrap layout with appropriate font and theme styles (`app/globals.css`).

### 2.2 How to Create a Component
1. Create under `components/` or appropriate subfolder (`components/admin/`, `components/common/`, `components/themes/`).
2. If using hooks (`useState`, `useEffect`), browser APIs, or motion libraries, declare `"use client";` at line 1.
3. Design mobile-first (test at 360px–420px width before desktop).
4. Never hardcode colors; consume theme CSS variables (`var(--t-primary)`, `var(--t-bg)`, `var(--admin-gold)`).

### 2.3 How to Create a REST API Route
1. Create `app/api/<route-name>/route.ts`.
2. Export named HTTP verb functions (`GET`, `POST`, `PUT`, `DELETE`).
3. Return responses using `NextResponse.json(payload, { status: code })`.
4. Wrap execution in `try / catch` and return standardized error objects:
   ```typescript
   import { NextRequest, NextResponse } from "next/server";

   export async function POST(req: NextRequest) {
     try {
       const body = await req.json();
       // logic
       return NextResponse.json({ success: true }, { status: 200 });
     } catch (error: any) {
       return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
     }
   }
   ```

### 2.4 How to Edit the Database Schema
1. Open `db/schema.ts`.
2. Define or alter columns using Drizzle PostgreSQL core types (`uuid`, `text`, `integer`, `timestamp`).
3. Ensure every foreign key referencing `mandals.id` defines `{ onDelete: "cascade" }`.
4. Add explicit indexes for all foreign keys and filter columns in the table definition callback.
5. Export inferred TypeScript types (`$inferSelect`, `$inferInsert`).
6. Apply changes immediately by running:
   ```bash
   npm run db:push
   ```

### 2.5 How to Add a New Theme
1. In `db/schema.ts`, update the `themeId` column comment with the new theme ID.
2. Create `components/themes/Theme<N><ThemeName>.tsx` consuming `FullMandalData`.
3. Register the theme in `components/themes/ThemeRenderer.tsx` switch statement.
4. Add the option to theme pickers in `components/SubmitForm.tsx` and `components/admin/MandalContentEditor.tsx`.
5. For full instructions, consult [docs/THEMES.md](docs/THEMES.md).

### 2.6 How to Add File & Image Uploads
1. Never send uncompressed raw multi-megabyte images to the server.
2. Always route image inputs through `uploadPhoto()` or `uploadPhotos()` from `lib/photo-upload.ts`.
3. `uploadPhoto()` compresses images below 500KB and limits maximum dimensions to 1200px using background Web Workers (`browser-image-compression`).

### 2.7 How to Add Admin Features
1. For Super Admin features: Gate execution with `requirePlatformAdmin()` in `lib/auth.ts`.
2. For Mandal Admin features: Gate execution with `requireMandalAdmin(mandalId)` in `lib/auth.ts`.
3. Add UI controls to `components/admin/AdminSidebar.tsx` and `components/admin/AdminDashboardClient.tsx`.
4. Whenever tenant data is modified, always invoke `saveVersionHistory(mandalId, changeSummary, editedBy)`.

---

## 3. Strict Pre-Modification Checklists

### Rules Before Editing Code
- [ ] Have you checked [PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md) to understand where this component fits?
- [ ] Have you confirmed that the task does NOT invent fake features (e.g. personal expense splitters)?
- [ ] Are you reusing existing utilities (`lib/slug.ts`, `lib/photo-upload.ts`, `db/index.ts`)?
- [ ] Will this change preserve all 4 spiritual themes?

### Rules Before Deleting Code
- [ ] Never delete legacy stubs (`lib/supabase-*.ts`, `supabase/schema.sql`) without documenting findings in `DOCUMENTATION_CHANGELOG.md`.
- [ ] Never delete unused UI components (`DesignSystem.tsx`, `ScrollReveal.tsx`) without recording recommendations.

### Rules Before Changing Schema
- [ ] Are all foreign keys configured with `{ onDelete: "cascade" }`?
- [ ] Are all foreign key columns indexed?
- [ ] Will existing tenant rows break? (Use defaults or nullable columns for new fields).

### Rules Before Changing Colors or Branding
- [ ] Never alter Adviks SoftTech branding or credits.
- [ ] Never hardcode hex codes in theme-facing components; use CSS variables (`--t-primary`, `--t-bg`).

---

## 4. Post-Modification Checklists

### Testing Checklist
- [ ] Does `npm run lint` or `npm run build` compile cleanly?
- [ ] Do all 4 live theme demo URLs render properly?
- [ ] Are client-side dates or counters guarded with `suppressHydrationWarning`?
- [ ] Is mobile rendering (360px–420px width) tested with zero horizontal overflow?

### Pull Request & Commit Checklist
- [ ] Formatted using Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`.
- [ ] No hardcoded secrets, database URLs, or API keys in code or commit messages.
- [ ] `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->` intact at top of `AGENTS.md`.

### Production Readiness Checklist
- [ ] Has `npm run db:push` been run if database schema was modified?
- [ ] Are all external image hostnames declared in `next.config.ts`?
- [ ] Are Next.js edge caches invalidated via `revalidatePath('/[slug]')` and `revalidatePath('/admin')`?
- [ ] Is point-in-time rollback capability preserved via `saveVersionHistory()`?
