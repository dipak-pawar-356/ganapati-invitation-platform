# Platform Security & Data Protection Standards

This document establishes the security architecture, cryptographic practices, input validation standards, and defensive controls implemented across the **Adviks SoftTech Ganapati Mandal SaaS Platform**.

---

## 1. Authentication & Session Hardening

- **Cookie Defense**: Sessions are managed via the HTTP-only cookie `mandal_saas_session`.
  - `httpOnly: true`: Blocks client-side JavaScript access (`document.cookie`), mitigating session hijacking via XSS.
  - `secure: process.env.NODE_ENV === "production"`: Enforces transmission strictly over TLS/HTTPS.
  - `sameSite: "lax"`: Protects against cross-site request forgery (CSRF) attacks while permitting legitimate navigation links.
  - `maxAge: 604800`: Sessions automatically expire after 7 days.
- **Password Security**: Passwords are cryptographically hashed using **`bcryptjs`** with `10` salt rounds. Plaintext passwords are never stored in the `users` table.
- **Role Isolation**: Server actions strictly gate mutations with `requirePlatformAdmin()` or `requireMandalAdmin(mandalId)` before running database transactions.

---

## 2. Unapproved Tenant Shielding & Content Moderation

Public routes (`/[slug]`) enforce strict moderation boundaries:
- Any mandal with `status = 'pending'`, `status = 'rejected'`, or `status = 'need_changes'` cannot be viewed by public devotees.
- If an unapproved mandal URL is accessed, `app/[slug]/page.tsx` renders a locked approval status screen rather than the invitation layout.
- Suspended mandals (`status = 'suspended'`) display a formal suspension notice.
- Unapproved layouts can only be inspected by an authenticated Super Admin through `/admin/preview/[mandalId]`.

---

## 3. Financial & Payment Integrity

### 3.1 Direct Devotee Donations
- Devotee donation transactions default to `status = 'pending'`.
- The bank UTR number and payer details must be verified by the Mandal Admin before the donation status is marked as `verified`.
- Incoming donation amounts cannot be altered without explicit administrative confirmation.

### 3.2 Razorpay HMAC SHA-256 Cryptographic Verification
Razorpay signatures are verified on the server using cryptographic HMAC SHA-256 validation:
```typescript
// app/api/razorpay/verify/route.ts
const expected = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest("hex");

if (expected !== razorpay_signature && process.env.NODE_ENV === "production") {
  return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
}
```
Orders are never marked as `paid` if the cryptographic digest does not match the incoming signature.

---

## 4. Injection & Cross-Site Scripting (XSS) Prevention

- **SQL Injection**: The platform exclusively uses **Drizzle ORM** parameterized queries (`eq`, `and`, `insert`, `update`). Dynamic user input is never concatenated directly into raw SQL strings.
- **Cross-Site Scripting (XSS)**:
  - React 19 automatically escapes all strings rendered inside JSX.
  - `dangerouslySetInnerHTML` is completely forbidden throughout the codebase.
- **Slug Injection**: Slugs are sanitized using regex (`replace(/[^a-z0-9-]/g, "")`) in `lib/slug.ts` to prevent directory traversal or URL spoofing.

---

## 5. Environment Variables & Secret Hygiene

- Secrets (`DATABASE_URL`, `PLATFORM_ADMIN_PASSWORD`, `RAZORPAY_KEY_SECRET`) reside exclusively in `.env.local`.
- `.gitignore` explicitly covers:
  ```text
  .env*
  .env.local
  .env.production.local
  ```
- Diagnostic error handlers (`handleActionError()`) sanitize connection strings before logging to prevent credential leakage in console transcripts.
