# Authentication & Role-Based Access Control (RBAC)

This document provides a comprehensive analysis of the security, session handling, password hashing, and role-based access control (RBAC) architecture implemented in the **Adviks SoftTech Ganapati Mandal SaaS Platform**.

---

## 1. Authentication Architecture Overview

Authentication is managed server-side in `lib/auth.ts` and `app/api/admin/login/route.ts` using **HTTP-only, SameSite-hardened session cookies** containing Base64-serialized payloads. No external heavy auth dependencies (like Auth0 or Clerk) are required, keeping the application lightweight, edge-compatible, and cost-effective.

```mermaid
graph TD
    subgraph Client ["Client Browser"]
        LoginForm["Login Form (/admin/login)"]
        SessionCookie["HTTP-Only Cookie: mandal_saas_session"]
    end

    subgraph ServerAuth ["lib/auth.ts"]
        LoginAPI["/api/admin/login"]
        EnvCheck{"Matches PLATFORM_ADMIN_EMAIL & PASSWORD?"}
        DBCheck["db.select().from(users).where(email)"]
        BcryptCheck{"bcrypt.compare(password, passwordHash)"}
        EncodeSession["encodeSession(SessionPayload)"]
    end

    subgraph SessionPayloadModel ["Session Payload Structure"]
        Payload["{ userId, email, role, mandalId }"]
    end

    LoginForm -->|POST { email, password }| LoginAPI
    LoginAPI --> EnvCheck
    EnvCheck -->|Yes| EncodeSession
    EnvCheck -->|No| DBCheck
    DBCheck --> BcryptCheck
    BcryptCheck -->|Match| EncodeSession
    BcryptCheck -->|Mismatch| Reject[Return 401 Unauthorized]
    EncodeSession --> Payload
    Payload -->|Set-Cookie| SessionCookie
```

---

## 2. Session Payload & Cookie Specifications

### Session Payload Interface
```typescript
export interface SessionPayload {
  userId: string;
  email: string;
  role: "PLATFORM_ADMIN" | "MANDAL_ADMIN";
  mandalId?: string | null;
}
```

### Cookie Configuration
The session is stored under the cookie name `mandal_saas_session`:
- **`httpOnly: true`**: Prevents client-side scripts from reading the cookie, mitigating cross-site scripting (XSS) session theft.
- **`secure: process.env.NODE_ENV === "production"`**: Enforces HTTPS transmission in production environments.
- **`sameSite: "lax"`**: Defends against cross-site request forgery (CSRF) on navigation.
- **`path: "/"`**: Accessible across all platform routes.
- **`maxAge: 60 * 60 * 24 * 7`**: 7-day persistent session lifespan.

---

## 3. Password Hashing Standards

User passwords for both Super Admins and auto-generated Mandal Admins are protected using **`bcryptjs`**:
```typescript
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```
- **Salt Rounds**: `10` (Industry standard balancing cryptographic resilience against brute-force attacks and low server compute latency).
- **Plaintext Prohibition**: Plaintext passwords are never written to the `users` table. Only auto-generated temporary passwords are stored in the isolated `mandal_credentials` table solely for Super Admin one-touch WhatsApp sharing.

---

## 4. Role Hierarchy & Access Guards

The system implements two distinct user roles:

```text
               ┌──────────────────────────────┐
               │    PLATFORM_ADMIN (Super)    │
               │  • Full system control       │
               │  • Approves/rejects tenants  │
               │  • Accesses credential vault │
               │  • Inspects Neon DB health   │
               └──────────────┬───────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │     MANDAL_ADMIN (Tenant)    │
               │  • Manages assigned mandal   │
               │  • Updates 10-day timeline   │
               │  • Uploads photos/videos     │
               │  • Verifies public donations │
               └──────────────────────────────┘
```

### 4.1 Platform Super Admin Guard
Verifies that the session exists and possesses the `PLATFORM_ADMIN` role:
```typescript
export async function requirePlatformAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "PLATFORM_ADMIN") {
    throw new Error("Unauthorized: Platform Admin access required");
  }
  return session;
}
```
*Used by*:
- `approveMandalAction()`
- `rejectMandalAction()`
- `requestChangesMandalAction()`
- `deleteMandalAction()`
- `getAllMandalCredentials()`
- `resetMandalPasswordAction()`
- `toggleCredentialStatusAction()`
- `restoreVersionAction()`

### 4.2 Mandal Admin Guard
Validates that the authenticated user is either a `PLATFORM_ADMIN` (who has administrative override across all mandals) or a `MANDAL_ADMIN` whose `mandalId` matches the target tenant:
```typescript
export async function requireMandalAdmin(mandalId: string): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: Please log in");
  }
  if (session.role === "PLATFORM_ADMIN") {
    return session; // Platform admin has full access to any mandal
  }
  if (session.role === "MANDAL_ADMIN" && session.mandalId === mandalId) {
    return session;
  }
  throw new Error("Unauthorized: You do not have permission to manage this Mandal");
}
```
*Used by*:
- `addTimelineEventAction()`
- `deleteTimelineEventAction()`
- `addGalleryItemAction()`
- `deleteGalleryItemAction()`
- `updateGalleryItemCaptionAction()`
- `addCommitteeMemberAction()`
- `deleteCommitteeMemberAction()`

---

## 5. Token-Based Passwordless Access (`editToken`)

For committee members who wish to update basic contact details without navigating formal login forms:
- Each mandal receives an `editToken` (16-byte random hex or UUID) upon creation.
- Navigating to `/edit/[token]` queries `mandals` where `mandals.editToken = token`.
- Mutations sent to `/api/mandal/update` validate the token before executing updates, providing a frictionless administrative alternative for non-technical users.
