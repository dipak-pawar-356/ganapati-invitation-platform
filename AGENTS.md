<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Universal AI Agent Operational Guide — Ganapati Mandal SaaS Platform

This document serves as the **universal standard operating guide** for all autonomous AI coding assistants, code generators, and pair programmers (including **Claude, ChatGPT, Cursor, GitHub Copilot, Gemini, Windsurf, Continue.dev, Aider, and OpenHands**) working in the `ganapati-invitation-platform` repository.

---

## 1. Project Overview & Multi-Tenant Paradigm

The repository hosts the **Adviks Softtech Ganapati Mandal Digital Invitation & Online Donation SaaS Platform** (package `ganapati-mandal`).

- **Architecture**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Neon Serverless PostgreSQL with Drizzle ORM.
- **Tenancy**: Multi-tenant via URL slug (`/[slug]`).
- **Core Entities**: 10 relational tables defined in `db/schema.ts` (`mandals`, `users`, `mandal_credentials`, `version_history`, `payments`, `timeline_events`, `gallery_items`, `committee_members`, `murti_photos`, `donation_transactions`).
- **Themes**: 4 interchangeable spiritual themes rendered dynamically via `components/themes/ThemeRenderer.tsx`.

---

## 2. Allowed vs. Forbidden Practices

### ✅ Allowed & Encouraged Practices
1. **Reuse Established Architecture**: Use server actions in `lib/mandal-actions.ts` and `lib/admin-actions.ts` for database writes.
2. **Strict Cascade Deletion**: Always ensure child records in `timeline_events`, `gallery_items`, etc., are bound with `{ onDelete: "cascade" }`.
3. **Audit Snapshotting**: Always call `saveVersionHistory(mandalId, summary, editedBy)` whenever tenant content is modified.
4. **Mobile First**: Design every UI element for mobile viewports (360px–420px width) before desktop testing.
5. **Client-Side Compression**: Use `uploadPhoto()` from `lib/photo-upload.ts` for handling image inputs to protect bandwidth and server payload limits.
6. **Graceful Degradation**: Always provide fallbacks for optional mandal fields (`logoUrl`, `heroVideoUrl`, `upiId`, `mapsLink`).

### ❌ Strictly Forbidden Practices
1. **Never Invent Fake Features**: Do not add expense splitters, personal loan managers, or non-existent features. Everything must strictly reflect the actual Ganapati Mandal platform implementation.
2. **Never Bypass Super Admin Moderation**: Never allow unapproved mandals (`status = 'pending'`) to render public invitation layouts on `/[slug]`.
3. **Never Hardcode Secrets**: Never hardcode database connection strings, passwords, or Razorpay API keys in any code file.
4. **Never Modify Financial Values Silently**: Never alter incoming donation amounts, UTR numbers, or transaction IDs without explicit administrative confirmation.
5. **Never Delete Code Without Documenting**: Do not delete unused utility or legacy files (`lib/supabase-*.ts`, `components/common/DesignSystem.tsx`) without documenting your findings in `DOCUMENTATION_CHANGELOG.md`.
6. **Never Remove the Next.js Agent Block**: Always preserve `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->` at the top of this file.

---

## 3. Checklist Before Modifying Code

Before generating or modifying any file, verify:
- [ ] Have you checked `PROJECT_ARCHITECTURE.md` to understand where this component fits into the system?
- [ ] Have you reviewed `db/schema.ts` to verify exact table names, column types, and foreign key relationships?
- [ ] Will this change break any of the 4 spiritual themes (`royal_gold`, `peshwai`, `divine_saffron`, `night_darshan`)?
- [ ] Does this route or server action require authorization guards (`requirePlatformAdmin()` or `requireMandalAdmin()`)?
- [ ] If modifying a Next.js 16 server component, are `params` and `searchParams` properly typed and awaited as Promises?

---

## 4. Checklist After Modifying Code

After completing code changes, verify:
- [ ] Does the project compile cleanly without TypeScript errors? (`npm run build` or `npm run lint`)
- [ ] If database schema was altered, did you run `npm run db:push`?
- [ ] If tenant data was altered, did you call `revalidatePath('/[slug]')` and `revalidatePath('/admin')`?
- [ ] Are all external image domains declared in `next.config.ts`?
- [ ] Are hydration warnings prevented for client-side dates or counters using `suppressHydrationWarning`?
- [ ] Is `saveVersionHistory()` invoked to preserve point-in-time rollback capability?

---

## 5. Security & Financial Rules

1. **Donation Verification**:
   - Devotee donations are submitted with `status = 'pending'`.
   - The UTR / Transaction ID must be captured and verified before marking status as `verified`.
   - Admin verification actions must be protected by server-side session checks.
2. **Razorpay Payments**:
   - Razorpay order creation (`/api/razorpay/create-order`) must occur on the server.
   - Payment signatures must be verified using HMAC SHA-256 with `RAZORPAY_KEY_SECRET`.
3. **Session Management**:
   - Sessions are stored in the HTTP-only cookie `mandal_saas_session`.
   - Role checks (`PLATFORM_ADMIN` vs `MANDAL_ADMIN`) must be strictly enforced before executing tenant mutations.

---

## 6. Code Review & Pull Request Guidelines

1. **Commit Messages**: Format as Conventional Commits:
   - `feat: add WhatsApp donation receipt sharing`
   - `fix: correct audio player autoplay on iOS Safari`
   - `docs: update project architecture diagram`
2. **Review Criteria**:
   - 100% type safety without `any` casts where types are known.
   - Zero regression across all 4 theme renderers.
   - Preserved Marathi Devanagari terminology.
   - No leaked API keys or passwords.
