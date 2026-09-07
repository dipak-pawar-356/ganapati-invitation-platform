# Spiritual Themes Architecture & Customization Guide

This document details the multi-theme rendering system implemented in the **Adviks SoftTech Ganapati Mandal SaaS Platform**. The platform includes **4 distinct, interchangeable spiritual themes** designed specifically for traditional Maharashtrian Ganesh festival celebrations.

---

## 1. Theme Architecture Overview

Themes are decoupled from the tenant's data layer. Regardless of which theme is assigned to a mandal (`mandal.themeId`), the core database fields, 10-day timeline schedule, photo gallery, and committee lists remain identical.

The theme dispatcher (`components/themes/ThemeRenderer.tsx`) dynamically renders the selected theme component:

```typescript
// components/themes/ThemeRenderer.tsx
export default function ThemeRenderer({ mandal }: { mandal: FullMandalData }) {
  switch (mandal.themeId) {
    case "peshwai":
      return <Theme2Peshwai mandal={mandal} />;
    case "divine_saffron":
      return <Theme3DivineSaffron mandal={mandal} />;
    case "night_darshan":
      return <Theme4NightDarshan mandal={mandal} />;
    case "royal_gold":
    default:
      return <Theme1RoyalGold mandal={mandal} />;
  }
}
```

---

## 2. In-Depth Theme Specifications

### Theme 1: Royal Temple Gold (`royal_gold`)
- **Aesthetic Concept**: Suvarna Mandir (Golden Temple) darshan with royal palace pillars, brass lamps, and rich gold filigree borders.
- **Component**: `components/themes/Theme1RoyalGold.tsx`
- **Background**: Deep Maroon (`#1c0609`) with `/images/backgrounds/hero-background-desktop.webp` overlay.
- **Primary Accents**: Gold (`#e8a93b`) & Light Gold (`#f3d089`).
- **Decorations**: Traditional brass hanging bells (`animate-bell-swing-gentle`), temple archway header, and royal floral garlands.
- **Best Suited For**: Historic, high-budget public mandals and centenary celebrations.

### Theme 2: Peshwai Heritage (`peshwai`)
- **Aesthetic Concept**: 18th-century Maratha Peshwa Wada heritage with wooden carved pillars, tutari instruments, and deep royal crimson tones.
- **Component**: `components/themes/Theme2Peshwai.tsx`
- **Background**: Deep Burgundy / Dark Wine (`#2c0507`) with `/images/backgrounds/FamilySection.webp` texture.
- **Primary Accents**: Saffron-Crimson (`#d96a2b`) & Warm Amber (`#fcd34d`).
- **Decorations**: Traditional wada door frames, tutari brass fanfare motifs, and wooden filigree borders.
- **Best Suited For**: Heritage mandals in Pune, Satara, Kolhapur, and traditional city wadas.

### Theme 3: Divine Saffron (`divine_saffron`)
- **Aesthetic Concept**: Spiritual Bhagwa glow with modern glassmorphism cards and clean, contemporary typography.
- **Component**: `components/themes/Theme3DivineSaffron.tsx`
- **Background**: Deep Terracotta Saffron (`#180a03`).
- **Primary Accents**: Vivid Saffron (`#ea580c`) & Glowing Orange (`#f97316`).
- **Decorations**: Divine radial halo pulses (`animate-divine-halo`), white plumeria flower accents, and semi-transparent frosted cards.
- **Best Suited For**: Youth mandals, housing societies, and modern corporate festivals.

### Theme 4: Night Darshan (`night_darshan`)
- **Aesthetic Concept**: Midnight temple illumination and deepam roshnai with glowing oil diyas against a starry night sky.
- **Component**: `components/themes/Theme4NightDarshan.tsx`
- **Background**: Deep Midnight Slate/Blue (`#050b14`).
- **Primary Accents**: Neon Gold (`#38bdf8`) & Warm Diya Flame Amber (`#f59e0b`).
- **Decorations**: Glowing oil lamp flames (`animate-diya-flame`), ambient particle floating stars, and luminous golden glow drop-shadows.
- **Best Suited For**: Mandals renowned for spectacular lighting displays, late-night aartis, and immersion processions.

---

## 3. CSS Variable System & Design Tokens

Every theme provides styling tokens via custom CSS properties defined in `app/globals.css`:

```css
:root {
  /* Default Golden Temple Palette */
  --t-primary: #e8a93b;
  --t-primary-light: #f3d089;
  --t-primary-glow: rgba(232, 169, 59, 0.4);
  --t-secondary: #d96a2b;
  --t-bg: #1c0609;
  --t-bg-card: #2a080c;
  --t-bg-footer: #140305;
  --t-border: rgba(232, 169, 59, 0.35);
  --t-text: #fef9eb;
  --t-text-soft: rgba(254, 249, 235, 0.8);
  --t-text-muted: rgba(254, 249, 235, 0.5);

  /* Platform Admin Theme Tokens */
  --admin-bg: #140407;
  --admin-card: #1f070b;
  --admin-border: rgba(232, 169, 59, 0.25);
  --admin-gold: #e8a93b;
  --admin-gold-light: #f3d089;
  --admin-text: #fef9eb;
  --admin-text-soft: rgba(254, 249, 235, 0.75);
  --admin-text-muted: rgba(254, 249, 235, 0.45);
}
```

---

## 4. Keyframe Animations Inventory

| Keyframe Animation | Purpose | CSS Rule / Class |
| :--- | :--- | :--- |
| `bell-swing-gentle` | Physics-based swing for temple bells on click/idle | `animate-bell-swing-gentle` |
| `divine-halo` | Pulsing golden glow behind Ganapati murti | `animate-divine-halo` |
| `rotate-ultra-slow` | 360-degree rotating sacred mandala aura | `animate-rotate-ultra-slow` |
| `diya-flame` | Realistic flickering of oil lamp flame | `animate-diya-flame` |
| `ganapati-float` | Gentle vertical floating translation for murti | `animate-ganapati-float` |
| `petal-fall` | Cascading flower petal shower | `animate-petal-fall` |

---

## 5. Developer Guide: How to Add a 5th Theme

Follow these 4 steps to add a new theme (e.g. `kokan_nisarga`):

### Step 1: Update Schema Enum
In `db/schema.ts`, update the comment and type definitions for `themeId`:
```typescript
themeId: text("theme_id").notNull().default("royal_gold"), // 'royal_gold' | 'peshwai' | 'divine_saffron' | 'night_darshan' | 'kokan_nisarga'
```

### Step 2: Create Theme Component
Create `components/themes/Theme5KokanNisarga.tsx`:
```typescript
"use client";

import { FullMandalData } from "@/lib/mandal-actions";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Gallery from "@/components/Gallery";
import DonationWidget from "@/components/DonationWidget";
import Footer from "@/components/Footer";

export default function Theme5KokanNisarga({ mandal }: { mandal: FullMandalData }) {
  return (
    <div className="relative min-h-screen bg-[#071a10] text-[#f0fdf4]">
      {/* Custom Kokan Green Decor & Layout */}
      <Hero mandalName={mandal.mandalName} inviteLine={mandal.inviteMessage} />
      {/* Sections ... */}
      <Footer mandalName={mandal.mandalName} contact={mandal.contact} address={mandal.address} />
    </div>
  );
}
```

### Step 3: Register in ThemeRenderer
Import and add the case in `components/themes/ThemeRenderer.tsx`:
```typescript
case "kokan_nisarga":
  return <Theme5KokanNisarga mandal={mandal} />;
```

### Step 4: Add to Admin Dropdowns
Add the theme option in `components/SubmitForm.tsx` and `components/admin/MandalContentEditor.tsx`:
```typescript
{ id: "kokan_nisarga", name: "Kokan Nisarga (कोकण निसर्ग)", bg: "from-emerald-800 to-green-700" }
```
