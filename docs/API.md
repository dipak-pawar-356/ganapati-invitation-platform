# REST API Reference & Endpoint Documentation

This document provides complete technical specifications for all API route handlers implemented in the **Adviks SoftTech Ganapati Mandal SaaS Platform**. All routes are built using the Next.js 16 App Router format (`app/api/**/route.ts`).

---

## Summary of API Endpoints

| Endpoint | Method | Authentication | Rate Limit | Primary Purpose |
| :--- | :---: | :---: | :---: | :--- |
| [`/api/admin/check-slug`](#1-check-slug-availability) | `GET` | None | Public | Validates if a proposed mandal slug is available or already taken |
| [`/api/admin/login`](#2-admin-authentication-login) | `POST` | None | Public | Authenticates Super Admin and Mandal Admins; sets HTTP-only session cookie |
| [`/api/mandal/update`](#3-token-based-mandal-update) | `POST` | Bearer/Body `token` | Token | Updates mandal content without password using a secure `editToken` |
| [`/api/og`](#4-dynamic-open-graph-image-generator) | `GET` | None | Public | Generates dynamic 1200x630px social share image previews |
| [`/api/razorpay/create-order`](#5-razorpay-create-order) | `POST` | None | Public | Initializes a Razorpay order in INR paise for mandal onboarding |
| [`/api/razorpay/verify`](#6-razorpay-verify-signature) | `POST` | None | Public | Validates HMAC SHA-256 signature for Razorpay payments |
| [`/api/razorpay/webhook`](#7-razorpay-webhook-handler) | `POST` | HMAC Header | Webhook | Processes asynchronous payment captured events |

---

## Detailed Specifications

### 1. Check Slug Availability

Validates whether a URL slug is available before a Super Admin approves a mandal or before a tenant is created. Automatically slugifies Marathi/English text to sanitize hyphens and characters.

- **URL**: `/api/admin/check-slug`
- **Method**: `GET`
- **Auth Required**: No (Public)
- **Query Parameters**:
  - `slug` (string, required): The proposed slug string (e.g. `shri-jay-malhar`).

#### Success Response (Available)
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "available": true,
  "formattedSlug": "shri-jay-malhar",
  "message": "✅ Available"
}
```

#### Collision Response (Already Exists)
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "available": false,
  "formattedSlug": "shri-jay-malhar",
  "message": "❌ Already Exists"
}
```

#### Error Response (Missing Slug)
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "available": false,
  "message": "Slug parameter is required."
}
```

---

### 2. Admin Authentication Login

Authenticates credentials for both **Platform Super Admins** (fallback from environment variables) and **Mandal Admins** (via `users` table bcrypt comparison). Upon successful verification, sets the `mandal_saas_session` HTTP-only cookie with a 7-day expiration.

- **URL**: `/api/admin/login`
- **Method**: `POST`
- **Auth Required**: No (Public)
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "advikssoftware@ganpatiplatform.com",
    "password": "YourSecurePassword"
  }
  ```

#### Success Response
```json
HTTP/1.1 200 OK
Set-Cookie: mandal_saas_session=<base64-payload>; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax; Secure
Content-Type: application/json

{
  "success": true
}
```

#### Unauthorized Response
```json
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Galat Email kiवा Password"
}
```

---

### 3. Token-Based Mandal Update

Allows mandal committee representatives to update their public invitation information (address, contact, Instagram URL, etc.) without logging in, using a unique one-time or persistent `editToken` generated during onboarding.

- **URL**: `/api/mandal/update`
- **Method**: `POST`
- **Auth Required**: Valid `token` in request body
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "token": "a1b2c3d4e5f67890",
    "mandal_name": "श्री जय मल्हार गणेश मंडळ",
    "invite_message": "आमच्या गणेशोत्सवास सस्नेह निमंत्रण!",
    "contact": "+91 98231 23456",
    "address": "कार्वे रोड, कोथरूड, पुणे",
    "maps_link": "https://maps.google.com/?q=Kothrud+Pune",
    "instagram_url": "https://instagram.com/jay_malhar"
  }
  ```

#### Success Response
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true
}
```

#### Invalid Token Response
```json
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Invalid edit link"
}
```

---

### 4. Dynamic Open Graph Image Generator

Generates dynamic, branded 1200x630px social media preview images for WhatsApp, Facebook, and Twitter link sharing. Fetches the mandal's first gallery image as background and overlays the formal Devanagari invitation banner.

- **URL**: `/api/og`
- **Method**: `GET`
- **Auth Required**: No (Public)
- **Query Parameters**:
  - `slug` (string, required): The mandal URL slug.

#### Response
```text
HTTP/1.1 200 OK
Content-Type: image/png
Cache-Control: public, max-age=3600, stale-while-revalidate=86400

<binary PNG stream (1200x630px)>
```

---

### 5. Razorpay Create Order

Creates a cryptographic order with Razorpay in INR paise for mandal onboarding or subscription fees.

- **URL**: `/api/razorpay/create-order`
- **Method**: `POST`
- **Auth Required**: No (Public)
- **Request Body**:
  ```json
  {
    "slug": "shri-jay-malhar-ganesh-mandal"
  }
  ```

#### Success Response
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "orderId": "order_EKfLsu8Gmq45gh",
  "amount": 49900,
  "keyId": "rzp_test_placeholder",
  "mandalName": "श्री जय मल्हार गणेश मंडळ",
  "contact": "+91 98231 23456"
}
```

---

### 6. Razorpay Verify Signature

Verifies Razorpay payment signatures using HMAC SHA-256 with `RAZORPAY_KEY_SECRET`. Upon successful signature matching, marks the tenant's `paymentStatus = 'paid'` and `status = 'approved'`.

- **URL**: `/api/razorpay/verify`
- **Method**: `POST`
- **Auth Required**: No (Public)
- **Request Body**:
  ```json
  {
    "razorpay_order_id": "order_EKfLsu8Gmq45gh",
    "razorpay_payment_id": "pay_29QQoUBcxrhBes",
    "razorpay_signature": "9ef4b2...hex",
    "slug": "shri-jay-malhar-ganesh-mandal"
  }
  ```

#### Success Response
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "slug": "shri-jay-malhar-ganesh-mandal"
}
```

---

### 7. Razorpay Webhook Handler

Receives server-to-server webhook notifications from Razorpay when transactions are asynchronously captured.

- **URL**: `/api/razorpay/webhook`
- **Method**: `POST`
- **Auth Required**: `x-razorpay-signature` header verified with `RAZORPAY_WEBHOOK_SECRET`
- **Request Body**: Raw JSON webhook event payload from Razorpay.

#### Success Response
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "received": true
}
```
