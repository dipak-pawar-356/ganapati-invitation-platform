# System Workflows & Execution Pipelines

This document provides visual flowcharts and Mermaid sequence diagrams for all core business and operational workflows in the **Adviks SoftTech Ganapati Mandal SaaS Platform**.

---

## 1. Customer Onboarding & Super Admin Approval Workflow

A multi-step pipeline ensuring quality control before any mandal website is published to the public internet.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Mandal Committee Head
    participant Form as /submit (SubmitForm.tsx)
    participant Action as submitCustomerRequestAction()
    participant DB as Neon PostgreSQL
    actor SuperAdmin as Platform Super Admin
    participant AdminUI as /admin (AdminDashboardClient)
    participant CheckSlug as /api/admin/check-slug
    participant ApproveAction as approveMandalAction()
    participant PublicSite as /[slug] (Public Page)

    Customer->>Form: Completes 7-step details, timeline & photos
    Form->>Action: Invokes action with form payload
    Action->>Action: Validates email, mobile, required fields
    Action->>DB: INSERT mandal (status = 'pending', temporary slug)
    Action->>DB: INSERT timeline, gallery, committee records
    Action->>DB: INSERT initial version_history snapshot
    Action-->>Form: Returns { refNumber, mandalId }
    Form->>Customer: Redirects to /submit/thank-you?ref=REF-XXXX

    Note over SuperAdmin,AdminUI: Moderation & Quality Inspection
    SuperAdmin->>AdminUI: Opens Submissions tab
    AdminUI->>AdminUI: Views preview at /admin/preview/[mandalId]
    SuperAdmin->>AdminUI: Clicks "Approve Mandal" & enters custom slug
    AdminUI->>CheckSlug: GET /api/admin/check-slug?slug=custom-slug
    CheckSlug-->>AdminUI: { available: true }
    SuperAdmin->>AdminUI: Confirms approval
    AdminUI->>ApproveAction: Invokes approveMandalAction(mandalId, customSlug)
    ApproveAction->>DB: UPDATE mandals SET status = 'approved', slug = customSlug
    ApproveAction->>ApproveAction: Generates 10-char random password
    ApproveAction->>DB: INSERT users (role = 'MANDAL_ADMIN', passwordHash)
    ApproveAction->>DB: INSERT mandal_credentials (username, tempPassword)
    ApproveAction->>DB: INSERT version_history (changeSummary = 'Super Admin Approved')
    ApproveAction-->>AdminUI: Returns generated credentials
    AdminUI->>PublicSite: revalidatePath('/[slug]') & revalidatePath('/admin')
    PublicSite-->>Customer: Website is now live at /[slug]!
```

---

## 2. Devotee Donation & WhatsApp Verification Workflow

Provides a direct donation route via official UPI VPAs and QR codes, with automated WhatsApp proof routing to the Mandal Treasurer.

```mermaid
sequenceDiagram
    autonumber
    actor Devotee as Public Devotee
    participant Widget as DonationWidget.tsx
    participant Action as submitDonationTransactionAction()
    participant DB as Neon PostgreSQL
    participant WA as WhatsApp API (Click-to-Chat)
    actor Treasurer as Mandal Treasurer / Admin
    participant AdminPanel as /admin (DonationsPanel.tsx)

    Devotee->>Widget: Chooses donation amount (e.g. ₹501)
    Widget->>Devotee: Renders Mandal's official UPI ID & QR Code
    Devotee->>Devotee: Pays using UPI App (GPay / PhonePe / Paytm)
    Devotee->>Widget: Inputs Name, WhatsApp Number & 12-digit UTR
    Devotee->>Widget: Submits donation verification form
    Widget->>Action: Invokes submitDonationTransactionAction()
    Action->>DB: INSERT donation_transactions (status = 'pending')
    Action->>Action: Formats Devanagari WhatsApp template message
    Action-->>Widget: Returns { success: true, whatsappUrl }
    Widget->>WA: Launches WhatsApp with pre-filled verification text
    WA->>Treasurer: Delivers donation alert with donor name & UTR
    Treasurer->>AdminPanel: Opens Donations panel in /admin
    Treasurer->>Treasurer: Matches UTR with bank statement credit
    Treasurer->>AdminPanel: Clicks "Verify" button
    AdminPanel->>DB: UPDATE donation_transactions SET status = 'verified'
    AdminPanel-->>Treasurer: Status updated to Verified
```

---

## 3. Version History & Snapshot Rollback Workflow

Guarantees full point-in-time state recovery in case of accidental content deletion by Mandal Admins.

```mermaid
flowchart TD
    A[Admin modifies mandal details, timeline, or gallery] --> B[Server Action executes mutations]
    B --> C[Invoke saveVersionHistory mandalId, summary, editedBy]
    C --> D[Fetch full state: mandals + timeline + gallery + committee]
    D --> E[Serialize complete tree into JSON snapshot string]
    E --> F[Calculate next version number count + 1]
    F --> G[INSERT version_history record]
    
    H[Accidental data loss detected] --> I[Super Admin navigates to /admin -> Version History]
    I --> J[Super Admin reviews past snapshots and clicks Restore V_N]
    J --> K[Server Action: restoreVersionAction historyId]
    K --> L[Parse snapshotData JSON string]
    M[Atomic Transaction] --> L
    L --> N[UPDATE mandals with snapshot data]
    L --> O[DELETE active timeline and INSERT snapshot events]
    L --> P[DELETE active gallery and INSERT snapshot items]
    L --> Q[DELETE active committee and INSERT snapshot members]
    Q --> R[Save new audit record: RESTORED_VN]
    R --> S[revalidatePath /slug & /admin]
    S --> T[Mandal state fully restored to Version N!]
```

---

## 4. Client-Side Image Compression & Upload Workflow

Protects server bandwidth and mobile payload limits using in-browser Web Worker compression.

```mermaid
flowchart LR
    File[Devotee / Committee File Input] --> CheckType{Is Image MIME?}
    CheckType -->|No| Reader[Read as raw Data URL]
    CheckType -->|Yes| Worker[Web Worker: browser-image-compression]
    Worker --> Compress[Max Size: 500KB | Max Width/Height: 1200px]
    Compress --> DataURL[FileReader.readAsDataURL]
    Reader --> DataURL
    DataURL --> ActionPayload[Safe Base64 String sent to Server Action]
    ActionPayload --> DB[Stored in PostgreSQL / External Storage]
```
