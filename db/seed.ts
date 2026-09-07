import { db } from "./index";
import {
  mandals,
  users,
  timelineEvents,
  galleryItems,
  committeeMembers,
} from "./schema";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export async function seedDemoData() {
  console.log("Seeding Ganapati Mandal SaaS Platform Demo Data with full details...");

  const platformAdminEmail = process.env.PLATFORM_ADMIN_EMAIL;
  const platformAdminPassword = process.env.PLATFORM_ADMIN_PASSWORD;

  
  if (!platformAdminEmail || !platformAdminPassword) {
    throw new Error(
      "Missing PLATFORM_ADMIN_EMAIL or PLATFORM_ADMIN_PASSWORD in environment variables (.env.local)"
    );
  }

  try {
    const platformAdminPasswordHash = await bcrypt.hash(platformAdminPassword, 10);
    const mandalPasswordHash = await bcrypt.hash("mandal123", 10);

    // 1. Platform Admin User
    await db
      .insert(users)
      .values({
        email: platformAdminEmail,
        passwordHash: platformAdminPasswordHash,
        role: "PLATFORM_ADMIN",
      })
      .onConflictDoNothing();

    // =========================================================
    // DEMO MANDAL 1: Shri Jay Malhar Ganesh Mandal (Theme 1: Royal Gold)
    // =========================================================
    const [mandal1] = await db
      .insert(mandals)
      .values({
        refNumber: "REF-2026-JM01",
        slug: "shri-jay-malhar-ganesh-mandal",
        mandalName: "श्री जय मल्हार गणेश मंडळ",
        mandalType: "Public Mandal",
        establishedYear: "१९९८",
        language: "mr",
        themeId: "royal_gold",
        inviteMessage: "आमच्या श्री जय मल्हार गणेश मंडळाच्या २५ व्या रौप्य महोत्सवी गणेशोत्सवास सर्व भाविक भक्तांना सस्नेह निमंत्रण! बाप्पांच्या दर्शनाचा व महाप्रसादाचा लाभ घ्यावा.",
        contactPersonName: "श्री. अमोल पाटील",
        contact: "+91 98231 23456 / +91 98231 23457",
        mobileNumber: "9823123456",
        whatsappNumber: "9823123456",
        email: "jaymalhar.kothrud@gmail.com",
        address: "मुख्य चौक, कार्वे रोड, कोथरूड, पुणे, महाराष्ट्र - ४११०३८",
        city: "पुणे",
        district: "पुणे",
        state: "महाराष्ट्र",
        pincode: "४११०३८",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.560123!2d73.812345!3d18.507890!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1",
        mapsLink: "https://maps.google.com/?q=Karve+Road+Kothrud+Pune",
        instagramUrl: "https://instagram.com/shri_jay_malhar_mandal",
        upiId: "jaymalhar@oksbi",
        accountHolder: "श्री जय मल्हार गणेश मंडळ ट्रस्ट",
        supportMobile: "9823123456",
        donationMessage: "मंडळाच्या सामाजिक व सांस्कृतिक उपक्रमांसाठी ऐच्छिक देणगी अर्पण करा.",
        musicUrl: "/audio/bhajan.mp3",
        heroVideoUrl: "/video/bg-video-mobile.mp4",
        heroBgUrl: "/images/backgrounds/hero-background-desktop.webp",
        status: "approved",
        paymentStatus: "paid",
        flowerCount: 1008,
      })
      .onConflictDoNothing()
      .returning();

    if (mandal1) {
      await db.insert(users).values({
        email: "jaymalhar.kothrud@gmail.com",
        passwordHash: mandalPasswordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal1.id,
      }).onConflictDoNothing();

      await db.insert(users).values({
        email: "admin@jaymalhar.com",
        passwordHash: mandalPasswordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal1.id,
      }).onConflictDoNothing();

      await db.insert(timelineEvents).values([
        { mandalId: mandal1.id, title: "श्री गणेश मूर्ती आगमन मिरवणूक", subtitle: "ढोल-ताशांच्या गजरात आगमन", eventDate: "दिवस १ - ७ सप्टें", eventTime: "सकाळी ९:०० वा.", description: "भव्य मिरवणूक व पुष्पवृष्टीसह बाप्पांचे मंडपात आगमन.", displayOrder: 1 },
        { mandalId: mandal1.id, title: "प्राणप्रतिष्ठापना व महाआरती", subtitle: "वेदमूर्ती शास्त्रीजींच्या हस्ते", eventDate: "दिवस १ - ७ सप्टें", eventTime: "दुपारी १२:१५ वा.", description: "शास्त्रोक्त विधीनुसार प्राणप्रतिष्ठापना व महाआरती.", displayOrder: 2 },
        { mandalId: mandal1.id, title: "सांस्कृतिक भजन संध्या", subtitle: "प्रसिद्ध भजनी मंडळ", eventDate: "दिवस ३ - ९ सप्टें", eventTime: "रात्री ८:०० वा.", description: "पारंपारिक भजनांचा मंत्रमुग्ध करणारा कार्यक्रम.", displayOrder: 3 },
        { mandalId: mandal1.id, title: "भव्य महाप्रसाद सोहळा", subtitle: "सर्व भाविकांसाठी प्रसाद", eventDate: "दिवस ७ - १३ सप्टें", eventTime: "दुपारी १:०० वा.", description: "महाप्रसादाचा नैवेद्य आणि भोजन वितरण सोहळा.", displayOrder: 4 },
        { mandalId: mandal1.id, title: "निरोप मिरवणूक व विसर्जन", subtitle: "उत्तरपूजा व भावपूर्ण निरोप", eventDate: "दिवस १० - १६ सप्टें", eventTime: "दुपारी ४:०० वा.", description: "गणरायाचा भावपूर्ण निरोप व विसर्जन सोहळा.", displayOrder: 5 },
      ]);

      await db.insert(galleryItems).values([
        { mandalId: mandal1.id, url: "/images/gallery/gallery-1.webp", caption: "श्रींची सुवर्ण अलंकारयुक्त प्रतिष्ठापना मूर्ती", displayOrder: 1 },
        { mandalId: mandal1.id, url: "/images/gallery/gallery-2.png", caption: "सायंकाळची महाआरती व भाविकांची गर्दी", displayOrder: 2 },
        { mandalId: mandal1.id, url: "/images/gallery/gallery-3.webp", caption: "भव्य पुष्पवृष्टी आणि मंदिराची आकर्षक सजावट", displayOrder: 3 },
      ]);

      await db.insert(committeeMembers).values([
        { mandalId: mandal1.id, name: "श्री. अमोल पाटील", position: "अध्यक्ष", photoUrl: "/images/family/person-1.png", phone: "+91 98231 23456", displayOrder: 1 },
        { mandalId: mandal1.id, name: "श्री. नितीन देशपांडे", position: "उपाध्यक्ष", photoUrl: "/images/family/person-2.png", phone: "+91 98231 23457", displayOrder: 2 },
        { mandalId: mandal1.id, name: "श्री. सचिन मोरे", position: "सचिव", photoUrl: "/images/family/person-3.png", phone: "+91 98231 23458", displayOrder: 3 },
        { mandalId: mandal1.id, name: "श्री. राहुल शिंदे", position: "खजिनदार", photoUrl: "/images/family/person-1.png", phone: "+91 98231 23459", displayOrder: 4 },
      ]);
    }

    // =========================================================
    // DEMO MANDAL 2: Shri Swami Samarth Mitra Mandal (Theme 2: Peshwai Heritage)
    // =========================================================
    const [mandal2] = await db
      .insert(mandals)
      .values({
        refNumber: "REF-2026-SS02",
        slug: "shri-swami-samarth-mitra-mandal",
        mandalName: "श्री स्वामी समर्थ मित्र मंडळ",
        mandalType: "Public Mandal",
        establishedYear: "१९८८",
        language: "mr",
        themeId: "peshwai",
        inviteMessage: "कराड शहरातील श्री स्वामी समर्थ मित्र मंडळाच्या ३६ व्या वार्षिक गणेशोत्सवात बाप्पांचे दर्शन घेण्यास आपणास व आपल्या परिवारास सस्नेह आमंत्रण.",
        contactPersonName: "श्री. संभाजीराव कदम",
        contact: "+91 98502 34567 / +91 98502 34568",
        mobileNumber: "9850234567",
        whatsappNumber: "9850234567",
        email: "swamisamarth.karad@gmail.com",
        address: "सोमवारा पेठ, कृष्ण काट रस्ता, कराड, सातारा, महाराष्ट्र - ४१५११०",
        city: "कराड",
        district: "सातारा",
        state: "महाराष्ट्र",
        pincode: "४१५११०",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.123456!2d74.181234!3d17.288901!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1",
        mapsLink: "https://maps.google.com/?q=Somwar+Peth+Karad",
        instagramUrl: "https://instagram.com/swamisamarthmandal_karad",
        upiId: "swamisamarth@okaxis",
        accountHolder: "श्री स्वामी समर्थ मित्र मंडळ ट्रस्ट",
        supportMobile: "9850234567",
        donationMessage: "धार्मिक व सामाजिक उपक्रमांसाठी वर्गणी / देणगी अर्पण करा.",
        musicUrl: "/audio/welcome-chant.mp3",
        heroVideoUrl: "/video/bg-video-mobile.mp4",
        heroBgUrl: "/images/backgrounds/FamilySection.webp",
        status: "approved",
        paymentStatus: "paid",
        flowerCount: 750,
      })
      .onConflictDoNothing()
      .returning();

    if (mandal2) {
      await db.insert(users).values({
        email: "swamisamarth.karad@gmail.com",
        passwordHash: mandalPasswordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal2.id,
      }).onConflictDoNothing();

      await db.insert(users).values({
        email: "admin@swamisamarth.com",
        passwordHash: mandalPasswordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal2.id,
      }).onConflictDoNothing();

      await db.insert(timelineEvents).values([
        { mandalId: mandal2.id, title: "पारंपारिक पालखी सोहळा व प्रतिष्ठापना", subtitle: "पुणेरी पगडी व तुतारीच्या गजरात", eventDate: "दिवस १", eventTime: "सकाळी १०:०० वा.", description: "शाही मिरवणूक आणि वैदिक सूक्तांचे पठन.", displayOrder: 1 },
        { mandalId: mandal2.id, title: "दैनिक प्रभात आरती व अथर्वशीर्ष", subtitle: "मंत्रमुग्ध सकाळची आरती", eventDate: "दररोज", eventTime: "सकाळी ८:३० वा.", description: "अथर्वशीर्ष पठन व महाआरती.", displayOrder: 2 },
        { mandalId: mandal2.id, title: "महिलांसाठी हळदी-कुंकू व रांगोळी", subtitle: "सांस्कृतिक स्पर्धा सोहळा", eventDate: "दिवस ४", eventTime: "सायंकाळी ६:०० वा.", description: "महिला सक्षमीकरण व सांस्कृतिक कार्यक्रम.", displayOrder: 3 },
        { mandalId: mandal2.id, title: "विधीवत उत्तरपूजा व विसर्जन मिरवणूक", subtitle: "भावपूर्ण निरोप", eventDate: "दिवस १०", eventTime: "सायंकाळी ५:०० वा.", description: "कृष्णा नदी घाटावर विसर्जन सोहळा.", displayOrder: 4 },
      ]);

      await db.insert(galleryItems).values([
        { mandalId: mandal2.id, url: "/images/gallery/gallery-2.png", caption: "ऐतिहासिक वाडा देखावा व राजेशाही सिंहासन", displayOrder: 1 },
        { mandalId: mandal2.id, url: "/images/gallery/gallery-4.png", caption: "तुतारी वादनाने बाप्पांचे स्वागत", displayOrder: 2 },
      ]);

      await db.insert(committeeMembers).values([
        { mandalId: mandal2.id, name: "श्री. संभाजीराव कदम", position: "अध्यक्ष", photoUrl: "/images/family/person-2.png", phone: "+91 98502 34567", displayOrder: 1 },
        { mandalId: mandal2.id, name: "श्री. विक्रमसिंह जगताप", position: "उपाध्यक्ष", photoUrl: "/images/family/person-3.png", phone: "+91 98502 34568", displayOrder: 2 },
        { mandalId: mandal2.id, name: "श्री. गणेश चव्हाण", position: "सचिव", photoUrl: "/images/family/person-1.png", phone: "+91 98502 34569", displayOrder: 3 },
      ]);
    }

    // =========================================================
    // DEMO MANDAL 3: Shri Shivneri Ganeshotsav Mandal (Theme 3: Modern Divine)
    // =========================================================
    const [mandal3] = await db
      .insert(mandals)
      .values({
        refNumber: "REF-2026-SH03",
        slug: "shri-shivneri-ganesh-mandal",
        mandalName: "श्री शिवनेरी सार्वजनिक गणेशोत्सव मंडळ",
        mandalType: "Public Mandal",
        establishedYear: "२००२",
        language: "mr",
        themeId: "divine_saffron",
        inviteMessage: "सातारा नगरीतील श्री शिवनेरी सार्वजनिक गणेशोत्सव मंडळातर्फे सर्व भाविकांना गणेशोत्सवाच्या हार्दिक शुभेच्छा! बाप्पांच्या दर्शन सोहळ्यास नक्की या.",
        contactPersonName: "श्री. महेश भोसले",
        contact: "+91 99703 45678 / +91 99703 45679",
        mobileNumber: "9970345678",
        whatsappNumber: "9970345678",
        email: "shivneri.satara@gmail.com",
        address: "पोवई नाका, राजवाडा रस्ता, सातारा, महाराष्ट्र - ४१५००१",
        city: "सातारा",
        district: "सातारा",
        state: "महाराष्ट्र",
        pincode: "४१५००१",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3816.234567!2d73.991234!3d17.688901!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1",
        mapsLink: "https://maps.google.com/?q=Powai+Naka+Satara",
        instagramUrl: "https://instagram.com/shivneri_ganesh_satara",
        upiId: "shivnerimandal@oksbi",
        accountHolder: "श्री शिवनेरी सार्वजनिक गणेशोत्सव मंडळ",
        supportMobile: "9970345678",
        donationMessage: "सामाजिक कार्यासाठी ऐच्छिक देणगी अर्पण करा.",
        musicUrl: "/audio/bhajan.mp3",
        heroBgUrl: "/images/backgrounds/invitation-desktop-bg.png",
        status: "approved",
        paymentStatus: "paid",
        flowerCount: 888,
      })
      .onConflictDoNothing()
      .returning();

    if (mandal3) {
      await db.insert(users).values({
        email: "shivneri.satara@gmail.com",
        passwordHash: mandalPasswordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal3.id,
      }).onConflictDoNothing();

      await db.insert(users).values({
        email: "admin@shivneri.com",
        passwordHash: mandalPasswordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal3.id,
      }).onConflictDoNothing();

      await db.insert(timelineEvents).values([
        { mandalId: mandal3.id, title: "गणेश आगमन व स्थापन विधी", subtitle: "प्रभावी भगवी आरास", eventDate: "दिवस १", eventTime: "सकाळी ९:३० वा.", description: "धार्मिक वातावरणात बाप्पांचे आगमन.", displayOrder: 1 },
        { mandalId: mandal3.id, title: "रक्तदान व मोफत आरोग्य शिबीर", subtitle: "सामाजिक उपक्रम", eventDate: "दिवस ३", eventTime: "दुपारी ५:०० वा.", description: "समाजोपयोगी मोफत आरोग्य तपासणी शिबीर.", displayOrder: 2 },
        { mandalId: mandal3.id, title: "बाल कलावंत स्पर्धा व पारितोषिक", subtitle: "सांस्कृतिक संध्या", eventDate: "दिवस ६", eventTime: "सायंकाळी ६:३० वा.", description: "लहान मुलांच्या नृत्य व चित्रकला स्पर्धा.", displayOrder: 3 },
      ]);

      await db.insert(galleryItems).values([
        { mandalId: mandal3.id, url: "/images/gallery/gallery-4.png", caption: "श्री शिवनेरी गणेश दर्शन २०२५", displayOrder: 1 },
        { mandalId: mandal3.id, url: "/images/gallery/gallery-1.webp", caption: "दिव्य रोषणाई व मंडप सजावट", displayOrder: 2 },
      ]);

      await db.insert(committeeMembers).values([
        { mandalId: mandal3.id, name: "श्री. महेश भोसले", position: "अध्यक्ष", photoUrl: "/images/family/person-3.png", phone: "+91 99703 45678", displayOrder: 1 },
        { mandalId: mandal3.id, name: "श्री. रोहन सुतार", position: "सचिव", photoUrl: "/images/family/person-1.png", phone: "+91 99703 45679", displayOrder: 2 },
      ]);
    }

    // =========================================================
    // DEMO MANDAL 4: Shri Sant Dnyaneshwar Ganesh Mandal (Theme 4: Night Darshan)
    // =========================================================
    const [mandal4] = await db
      .insert(mandals)
      .values({
        refNumber: "REF-2026-SD04",
        slug: "shri-sant-dnyaneshwar-ganesh-mandal",
        mandalName: "श्री संत ज्ञानेश्वर गणेश मंडळ",
        mandalType: "Public Mandal",
        establishedYear: "१९९३",
        language: "mr",
        themeId: "night_darshan",
        inviteMessage: "सांगली येथील श्री संत ज्ञानेश्वर गणेश मंडळाच्या भव्य रोषणाई व रात्र दर्शन सोहळ्यात सहकुटुंब सहभागी व्हावे ही नम्र विनंती.",
        contactPersonName: "श्री. दत्तात्रय कुलकर्णी",
        contact: "+91 94224 56789 / +91 94224 56790",
        mobileNumber: "9422456789",
        whatsappNumber: "9422456789",
        email: "dnyaneshwar.sangli@gmail.com",
        address: "स्टेशन रोड, विश्रामबाग, सांगली, महाराष्ट्र - ४१६४१५",
        city: "सांगली",
        district: "सांगली",
        state: "महाराष्ट्र",
        pincode: "४१६४१५",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.345678!2d74.581234!3d16.858901!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1",
        mapsLink: "https://maps.google.com/?q=Vishrambag+Sangli",
        instagramUrl: "https://instagram.com/dnyaneshwarganeshmandal",
        upiId: "dnyaneshwarsangli@icici",
        accountHolder: "श्री संत ज्ञानेश्वर गणेश मंडळ सांगली",
        supportMobile: "9422456789",
        donationMessage: "मंडळाच्या कार्यासाठी देणगी अर्पण करा.",
        musicUrl: "/audio/temple-bell.mp3",
        heroBgUrl: "/images/backgrounds/ganpati-desktop-bg.png",
        status: "approved",
        paymentStatus: "paid",
        flowerCount: 1500,
      })
      .onConflictDoNothing()
      .returning();

    if (mandal4) {
      await db.insert(users).values({
        email: "dnyaneshwar.sangli@gmail.com",
        passwordHash: mandalPasswordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal4.id,
      }).onConflictDoNothing();

      await db.insert(users).values({
        email: "admin@dnyaneshwar.com",
        passwordHash: mandalPasswordHash,
        role: "MANDAL_ADMIN",
        mandalId: mandal4.id,
      }).onConflictDoNothing();

      await db.insert(timelineEvents).values([
        { mandalId: mandal4.id, title: "श्रींची विधीवत प्रतिष्ठापना", subtitle: "मंत्रोच्चार सोहळा", eventDate: "दिवस १", eventTime: "सकाळी १०:१५ वा.", description: "वेदमूर्तींच्या उपस्थितीत प्रतिष्ठापना सोहळा.", displayOrder: 1 },
        { mandalId: mandal4.id, title: "दीपोत्सव व रात्र महाआरती", subtitle: "१००१ दिव्यांची मनमोहक रोषणाई", eventDate: "दिवस ५", eventTime: "रात्री ८:०० वा.", description: "रात्रीची भव्य आरती व दीपोत्सव सोहळा.", displayOrder: 2 },
        { mandalId: mandal4.id, title: "अनंत चतुर्दशी विसर्जन मिरवणूक", subtitle: "निरोप सोहळा", eventDate: "दिवस १०", eventTime: "सायंकाळी ६:०० वा.", description: "ढोल ताशांच्या गजरात विसर्जन सोहळा.", displayOrder: 3 },
      ]);

      await db.insert(galleryItems).values([
        { mandalId: mandal4.id, url: "/images/gallery/gallery-6.webp", caption: "रात्र दर्शनाची विलोभनीय रोषणाई", displayOrder: 1 },
        { mandalId: mandal4.id, url: "/images/gallery/gallery-3.webp", caption: "दीपोत्सवाची भव्य आरास", displayOrder: 2 },
      ]);

      await db.insert(committeeMembers).values([
        { mandalId: mandal4.id, name: "श्री. दत्तात्रय कुलकर्णी", position: "अध्यक्ष", photoUrl: "/images/family/person-1.png", phone: "+91 94224 56789", displayOrder: 1 },
        { mandalId: mandal4.id, name: "श्री. वैभव इंगळे", position: "उपाध्यक्ष", photoUrl: "/images/family/person-2.png", phone: "+91 94224 56790", displayOrder: 2 },
      ]);
    }

    console.log("Demo seed successfully completed with full email, upi, refNumber, and mapsLink details!");
  } catch (error) {
    console.error("Error during demo seeding:", error);
  }
}

if (require.main === module) {
  seedDemoData().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
