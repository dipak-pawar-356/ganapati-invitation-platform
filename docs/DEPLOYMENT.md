# Production Deployment Guide (Vercel & Neon)

This document provides step-by-step instructions for deploying the **Adviks SoftTech Ganapati Mandal SaaS Platform** to **Vercel** backed by **Neon Serverless PostgreSQL**.

---

## 1. Prerequisites

1. **GitHub Repository**: Code pushed to your repository (`main` branch).
2. **Neon Account**: A free or paid account at [neon.tech](https://neon.tech/).
3. **Vercel Account**: An account at [vercel.com](https://vercel.com/).
4. **Node.js**: Version 20.x or higher installed locally.

---

## 2. Step 1: Database Setup on Neon

1. Log in to [Neon Console](https://console.neon.tech/) and click **Create Project**.
2. Name your project (e.g. `ganapati-mandal-invitations`).
3. Select your preferred AWS cloud region (e.g., `ap-southeast-1` Singapore or `ap-south-1` Mumbai).
4. Copy your connection string from the Dashboard. Ensure **Pooled connection** is enabled for serverless operation:
   ```text
   postgresql://neondb_owner:<password>@<endpoint>-pooler.region.aws.neon.tech/ganapati-mandal-invitations?sslmode=require
   ```
5. Set this connection string locally in `.env.local` as `DATABASE_URL`.
6. Push the schema to your Neon database:
   ```bash
   npm run db:push
   ```
7. Seed initial Super Admin and demonstration mandals:
   ```bash
   npm run db:seed
   ```

---

## 3. Step 2: Vercel Project Deployment

1. Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New > Project**.
2. Import your GitHub repository (`ganapati-invitation-platform`).
3. Configure the build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add your **Environment Variables** in the Vercel project settings:

| Variable Name | Environment | Example / Value |
| :--- | :---: | :--- |
| `DATABASE_URL` | Production | Neon pooled PostgreSQL connection string |
| `NEON_DATABASE_URL` | Production | Same as `DATABASE_URL` |
| `PLATFORM_ADMIN_EMAIL` | Production | `advikssoftware@ganpatiplatform.com` |
| `PLATFORM_ADMIN_PASSWORD` | Production | Strong random password (16+ chars) |
| `ADMIN_PASSWORD` | Production | Strong random password |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://your-custom-domain.com` |
| `RAZORPAY_KEY_ID` | Production | `rzp_live_xxxxxxxx` (optional) |
| `RAZORPAY_KEY_SECRET` | Production | Razorpay live secret (optional) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production | `rzp_live_xxxxxxxx` (optional) |
| `RAZORPAY_WEBHOOK_SECRET` | Production | Webhook secret (optional) |

5. Click **Deploy**. Vercel will compile the Next.js 16 app router bundles, optimize assets, and deploy to edge locations worldwide.

---

## 4. Step 3: Post-Deployment Verification

1. **Verify Home Page**: Open `https://your-app.vercel.app/` and test background video playback, temple bell chimes, and theme links.
2. **Verify Database Health**:
   - Navigate to `https://your-app.vercel.app/admin/database`
   - Confirm status displays: `CONNECTED & HEALTHY 🟢`
   - Check that Ping Latency is below `150 ms` and table counts match expectations.
3. **Verify Super Admin Login**:
   - Log in at `/admin/login` using `PLATFORM_ADMIN_EMAIL` and `PLATFORM_ADMIN_PASSWORD`.
   - Ensure the Super Admin dashboard renders with tenant moderation tabs.
4. **Test Dynamic OG Image Generation**:
   - Open `https://your-app.vercel.app/api/og?slug=shri-jay-malhar-ganesh-mandal`
   - Verify that the 1200x630px social card generates with Devanagari text.
