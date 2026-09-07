# Digital Ganapati Mandal Invitation & Online Donation SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-v0.45-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![Neon Database](https://img.shields.io/badge/Neon-Serverless_PostgreSQL-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

> **A Mobile-First, Multi-Tenant Digital Temple & Festival Invitation Platform** developed by **Adviks Softtech**. Enables Ganesh Mandals, Societies, and Temple Trusts to create animated invitation websites, accept online UPI & QR donations, organize 10-day schedules, showcase media galleries, and manage public requests through a dedicated administrative portal.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Live Demo Websites & Spiritual Themes](#live-demo-websites--spiritual-themes)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup & Migrations](#database-setup--migrations)
  - [Seeding Initial Data](#seeding-initial-data)
  - [Running the Development Server](#running-the-development-server)
- [Authentication & Roles](#authentication--roles)
- [End-to-End Workflows](#end-to-end-workflows)
  - [Tenant Registration & Approval](#tenant-registration--approval)
  - [Online UPI/QR Donations](#online-upiqr-donations)
  - [Audit Trail & Snapshot Rollback](#audit-trail--snapshot-rollback)
- [Available npm Scripts](#available-npm-scripts)
- [Performance & Mobile Optimization](#performance--mobile-optimization)
- [Security & Data Integrity](#security--data-integrity)
- [Roadmap & Known Limitations](#roadmap--known-limitations)
- [Contributing](#contributing)
- [License & Credits](#license--credits)

---

## Overview

Traditional Ganesh festival invitations rely on static paper cards or forwarded text messages that get buried in chat threads. 

**Digital Ganapati Invitation Platform** solves this by providing every Mandal with a high-performance, personalized, and interactive digital website. It features interactive temple bell chimes, ambient background video streams, devotional audio, digital coconut-breaking ceremonies, dynamic flower counters, real-time Google Maps directions, and direct UPI/QR donation collections with instant WhatsApp notification proofs.

The platform is designed with a multi-tenant architecture: a single deployment can host and serve hundreds of mandal websites simultaneously with dedicated sub-paths (`/[slug]`), customizable themes, and isolated role-based admin accounts.

---

## Key Features

### 1. Multi-Tenant Architecture & Dynamic Routing
- Every approved Mandal receives a dedicated URL (`https://<domain>/[slug]`).
- Automatic collision detection and unique slug resolution (`lib/slug.ts`).
- Instant cache revalidation upon updates via Next.js `revalidatePath`.

### 2. Four Authentic Spiritual Themes
- **Theme 1: Royal Temple Gold (`royal_gold`)**: Suvarna Mandir aesthetic, brass temple pillars, traditional doors, and gold filigree.
- **Theme 2: Peshwai Heritage (`peshwai`)**: Maratha wada architecture, deep crimson borders, tutari instruments, and royal Maratha motifs.
- **Theme 3: Divine Saffron (`divine_saffron`)**: Glowing Bhagwa saffron aura, sleek glassmorphism cards, and modern layout.
- **Theme 4: Night Darshan (`night_darshan`)**: Midnight deep blue aesthetic with glowing oil diyas, night illumination, and floating flame particles.

### 3. Interactive Darshan & Cultural Elements
- **Interactive Temple Bells**: Playable bronze bells with realistic swing physics and temple chime audio.
- **Background Video Streams**: Responsive full-bleed hero video background with mobile/desktop fallback posters.
- **Devotional Audio System**: Embedded bhajan and aarti audio player with ambient mute/unmute controls.
- **Live Flower Shower Counter**: Real-time push button incrementing community flower offering counts.
- **Digital Coconut Breaking**: Interactive ritual ceremony triggering auspicious flower showers.

### 4. Direct Online Donations (UPI & Dynamic QR)
- Displays Mandal's official UPI ID and QR code with a one-click copy button.
- Quick donation amount selectors (₹101, ₹251, ₹501, ₹1001, ₹2100) or custom input.
- Transaction UTR / Ref Number recording with optional screenshot upload.
- Automated WhatsApp notification generation sent directly to the Mandal President/Treasurer.
- Admin donation audit log with CSV export capability and verified/rejected approval toggles.

### 5. Multi-Step Onboarding & Approval Pipeline
- Public `/submit` form allowing mandal committees to register details, upload media, and customize programs without requiring prior account creation.
- Submissions receive a unique Reference Number (`REF-YYYYMMDD-XXXX`) and default to `pending` status.
- Dedicated `/track-order` lookup page for mandals to check application approval status.
- Strict Super Admin moderation portal: unapproved mandals remain shielded from public indexing.

### 6. Super Admin & Mandal Admin Control Panel
- **Unified Admin Dashboard (`/admin`)**: Role-aware views for Super Admin and Mandal Admins.
- **Auto-Generated Mandal Credentials**: Upon approval, system auto-generates secure login credentials accessible to Super Admin for distribution.
- **Version History & Audit Log**: Point-in-time full database JSON snapshot tracking with one-click version rollback.
- **Complete Content Editor**: Tabbed interface to edit basic details, 10-day timeline events, photo gallery, committee members, and banking information.
- **Database Health Inspector (`/admin/database`)**: Real-time Neon PostgreSQL connection ping, latency measurement, and table record counts.

### 7. Devotee Sharing & Exports
- **Personalized WhatsApp Inviter**: Devotees can input recipient names to generate custom WhatsApp invitation messages with one click.
- **Dynamic Social Share Cards (`/api/og`)**: Automatic Open Graph image rendering (`1200x630px`) via `@vercel/og` displaying mandal name and banner.
- **Printable PDF Cards**: Digital invitation card with instant download action.

---

## Live Demo Websites & Spiritual Themes

| Theme | Live Demo Slug | Primary Style | Color Palette |
| :--- | :--- | :--- | :--- |
| **Theme 1: Royal Gold** | `/shri-jay-malhar-ganesh-mandal` | Royal Temple & Brass Motifs | Gold (`#e8a93b`) & Deep Maroon (`#1c0609`) |
| **Theme 2: Peshwai** | `/shri-swami-samarth-mitra-mandal` | Historic Peshwa Wada Heritage | Crimson (`#d96a2b`) & Burgundy (`#2c0507`) |
| **Theme 3: Divine Saffron** | `/shri-shivneri-ganesh-mandal` | Modern Glassmorphism & Bhagwa | Vivid Saffron (`#ea580c`) & Dark Terracotta |
| **Theme 4: Night Darshan** | `/shri-sant-dnyaneshwar-ganesh-mandal` | Deep Midnight Temple Illumination | Sky-Gold (`#38bdf8`) & Midnight Blue (`#050b14`) |

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16.3.1](https://nextjs.org/) (App Router, Server Actions, Dynamic Routes) |
| **UI Library** | [React 19.2.8](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) with PostCSS 8 |
| **Typography** | `next/font/google` ([Rozha One](https://fonts.google.com/specimen/Rozha+One) & [Mukta](https://fonts.google.com/specimen/Mukta) Devanagari) |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) (Connection Pooler with SSL) |
| **ORM** | [Drizzle ORM 0.45.2](https://orm.drizzle.team/) & [Drizzle Kit 0.31.10](https://orm.drizzle.team/kit-docs/overview) |
| **Animations** | [Framer Motion 13.1](https://www.framer.com/motion/), [GSAP 3.15](https://gsap.com/), [@gsap/react](https://gsap.com/react/) |
| **Image Compression**| [browser-image-compression 2.0.2](https://www.npmjs.com/package/browser-image-compression) |
| **Icons** | [Lucide React 1.31](https://lucide.dev/), [React Icons 5.7](https://react-icons.github.io/react-icons/) |
| **Payments** | [Razorpay 2.9.8](https://razorpay.com/) (HMAC SHA-256 verification) |
| **Analytics** | [@vercel/analytics 2.0.1](https://vercel.com/analytics) |
| **Execution** | Node.js 20+, TypeScript 5.x, TSX |

---

## Architecture Overview

```text
Public Request (Devotee / Mandal Head)
              │
              ▼
   Next.js 16 App Router Layer
   ├── /               -> Landing page (Adviks showcase, demo links, 7-step process)
   ├── /[slug]         -> Dynamic tenant mandal site (ThemeRenderer -> 4 Themes)
   ├── /submit         -> Public onboarding form -> submitCustomerRequestAction()
   ├── /track-order    -> Status lookup by reference or mobile
   ├── /admin          -> Protected dashboard (RBAC via lib/auth.ts)
   └── /api/*          -> NextRequest route handlers (check-slug, login, og, razorpay)
              │
              ▼
    Server Logic & Business Rules
   ├── lib/auth.ts            -> Base64 signed HTTP-only session cookies & bcrypt
   ├── lib/mandal-actions.ts  -> Drizzle queries, mutations & snapshot history
   └── lib/razorpay.ts        -> Lazy singleton Razorpay client
              │
              ▼
  Database & Cloud Infrastructure
   ├── Neon Serverless PostgreSQL (Drizzle ORM HTTP Driver)
   └── Vercel Edge Network & Analytics
```

For complete structural diagrams, entity relationships, and pipeline charts, see [PROJECT_ARCHITECTURE.md](file:///d:/Project_2k24_25/ganapati-invitation-platform/PROJECT_ARCHITECTURE.md).

---

## Directory Structure

```text
ganapati-invitation-platform/
├── app/
│   ├── [slug]/page.tsx              # Tenant mandal invitation page
│   ├── admin/                       # Dashboard, login, DB diagnostics & previews
│   ├── api/                         # Check-slug, login, og, update & razorpay routes
│   ├── demo/page.tsx                # Theme showcase comparison page
│   ├── edit/[token]/page.tsx        # Token-based secure editing page
│   ├── submit/                      # Public mandal application & thank-you pages
│   ├── track-order/page.tsx         # Application status lookup
│   ├── layout.tsx                   # Devanagari fonts & root layout
│   └── page.tsx                     # Main SaaS marketing landing page
├── components/
│   ├── admin/                       # Admin sidebar, editor, credentials & history panels
│   ├── common/                      # Background video, dividers, theme decorations
│   ├── themes/                      # Theme 1, 2, 3, 4 & ThemeRenderer
│   ├── DonationWidget.tsx           # Public UPI/QR donation widget
│   ├── FestiveAudioAndBlessing.tsx  # Audio player, temple bells & flower counter
│   ├── Hero.tsx                     # 100vh hero banner with floating murti
│   ├── SubmitForm.tsx               # 7-step tenant registration form
│   └── Timeline.tsx                 # 10-day schedule list
├── db/
│   ├── index.ts                     # Neon HTTP serverless connection
│   ├── schema.ts                    # 10 relational tables schema
│   └── seed.ts                      # Demo mandals & accounts seeder
├── lib/
│   ├── admin-actions.ts             # Super admin tenant operations
│   ├── auth.ts                      # Session encryption & RBAC security guards
│   ├── mandal-actions.ts            # Core database server actions
│   ├── photo-upload.ts              # Client-side image compression
│   ├── razorpay.ts                  # Razorpay SDK integration
│   └── slug.ts                      # Marathi slug converter
├── public/                          # Media assets (audio, videos, transparent murtis)
├── drizzle.config.ts                # Drizzle Kit CLI configuration
├── next.config.ts                   # Next.js 16 configuration
└── package.json                     # Project manifest & scripts
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.18.0 or v20+ (Node 20 LTS recommended)
- **Package Manager**: `npm` (v9+) or `pnpm`
- **PostgreSQL**: A cloud PostgreSQL database instance (Neon Serverless PostgreSQL recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/ganapati-invitation-platform.git
   cd ganapati-invitation-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Connection (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://<user>:<password>@<neon-endpoint>-pooler.region.aws.neon.tech/ganapati-mandal-invitations?sslmode=require"
NEON_DATABASE_URL="postgresql://<user>:<password>@<neon-endpoint>-pooler.region.aws.neon.tech/ganapati-mandal-invitations?sslmode=require"

# Platform Super Admin Authentication
PLATFORM_ADMIN_EMAIL="advikssoftware@ganpatiplatform.com"
PLATFORM_ADMIN_PASSWORD="YourSecurePasswordHere"
ADMIN_PASSWORD="YourSecurePasswordHere"

# Domain & Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Optional: Razorpay Payment Gateway (for SaaS onboarding fees)
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

### Database Setup & Migrations

Push the Drizzle schema directly to your Neon database:

```bash
npm run db:push
```

### Seeding Initial Data

Populate the database with the Super Admin account and the 4 demonstration mandals:

```bash
npm run db:seed
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Authentication & Roles

The platform implements a dual-role access control structure:

| Role | Default Username | Scope & Permissions |
| :--- | :--- | :--- |
| **`PLATFORM_ADMIN`** | `advikssoftware@ganpatiplatform.com` | Full control: Approves/rejects mandals, manages custom slugs, accesses the generated credentials vault, views platform analytics, inspects Neon database health, and rolls back audit snapshots. |
| **`MANDAL_ADMIN`** | Auto-assigned or `<slug>-admin` | Tenant control: Modifies only their assigned mandal content, updates the 10-day festival timeline, uploads photos, edits committee members, and verifies incoming devotee donations. |

---

## End-to-End Workflows

### Tenant Registration & Approval
1. Mandal committee submits their application at `/submit`.
2. A unique reference code (`REF-YYYYMMDD-XXXX`) is assigned, and the tenant record is saved with `status = 'pending'`.
3. Super Admin reviews the application in the `/admin` Submissions tab and previews the layout at `/admin/preview/[mandalId]`.
4. Upon clicking **Approve**, Super Admin specifies the permanent URL slug (verified in real time via `/api/admin/check-slug`).
5. The system automatically creates a `MANDAL_ADMIN` user and active credentials in `mandal_credentials`.
6. The tenant website goes live at `/[slug]`.

### Online UPI/QR Donations
1. Public visitors click the **Online Donation** widget on any mandal website.
2. The visitor scans the mandal's official QR code or copies their UPI ID.
3. After transferring funds via GPay, PhonePe, or Paytm, the devotee enters their name, WhatsApp number, and 12-digit bank UTR number.
4. The system records the transaction with `status = 'pending'` and formats a Marathi WhatsApp message sent to the Mandal Admin.
5. The Mandal Admin verifies the bank credit in the `/admin` Donations panel and marks it as `verified`.

### Audit Trail & Snapshot Rollback
1. Any edit made through the admin panel triggers `saveVersionHistory()`.
2. A complete JSON snapshot of the mandal and all relational sub-items is saved to `version_history`.
3. If an inadvertent change occurs, the Super Admin can review the version logs and click **Restore** to instantly revert the entire tenant state.

---

## Available npm Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `next dev` | Starts the Next.js 16 local development server on `http://localhost:3000`. |
| `build` | `next build` | Compiles the production build with type checking and page optimization. |
| `start` | `next start` | Starts the production server. |
| `lint` | `eslint` | Runs ESLint 9 checks across all TypeScript and React files. |
| `db:push` | `drizzle-kit push` | Pushes the Drizzle schema to the Neon database without writing SQL migration files. |
| `db:seed` | `tsx db/seed.ts` | Executes the seed script to create initial admins and 4 demo mandals. |

---

## Performance & Mobile Optimization

- **80% Mobile Focus**: All layouts, touch targets, modals, and navigation systems are designed and tested for mobile screens.
- **Client-Side Image Compression**: Reduces user uploads below 500KB in a background Web Worker prior to transmission, saving server bandwidth.
- **Optimized Fonts**: Native Devanagari font subsets loaded via `next/font/google` eliminate layout shifts (CLS = 0).
- **Reduced Motion Support**: High-performance Framer Motion and GSAP timelines automatically respect `prefers-reduced-motion` settings.

---

## Security & Data Integrity

- **Database Cascade Deletes**: Removing a mandal cleanly removes associated events, photos, committee members, credentials, and donation records.
- **HTTP-Only Cookies**: Authentication session tokens cannot be read by malicious client-side JavaScript.
- **Zero Raw Passwords**: Passwords in `users` are hashed using bcrypt with 10 salt rounds.
- **Razorpay HMAC Signatures**: Payment verification strictly requires cryptographic SHA-256 HMAC validation in production.

---

## Roadmap & Known Limitations

### Roadmap
- [ ] Push notifications for live Aarti webcasts.
- [ ] Automated WhatsApp receipt PDF generation via headless browser.
- [ ] Multi-language switcher (Marathi, Hindi, English) across all tenant themes.
- [ ] Automated SMS notification gateway integration.

### Known Limitations
- Background audio autoplay is subject to mobile browser user-interaction policies.
- Image storage currently uses client-side Data URLs or Supabase public storage links; direct S3/R2 presigned URL uploads are planned for high-scale enterprise tiers.

---

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/spiritual-theme-improvement`
3. Commit your changes: `git commit -m 'feat: add enhanced dhol-tasha animation'`
4. Push to the branch: `git push origin feature/spiritual-theme-improvement`
5. Open a Pull Request.

---

## License & Credits

- **License**: Proprietary / Commercial SaaS Platform. All rights reserved by **Adviks Softtech**.
- **Platform Development**: Developed by **Dipak Pawar** & Adviks Softtech Engineering Team.
- **Spiritual Motivation**: Dedicated to Shree Ganesha devotees across Maharashtra and worldwide.