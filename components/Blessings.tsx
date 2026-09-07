"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const PETAL_IMAGES = [
  "/images/decorations/Plumeria.png",
];

type Petal = {
  id: number;
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
  img: string;
  delay: number;
  duration: number;
  rotateEnd: number;
  size: number;
};

type LightParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
};

function makePetal(id: number): Petal {
  const side = Math.random();

  let startX: number;
  let startY: number;

  if (side < 0.35) {
    startX = -25 - Math.random() * 20;
    startY = 10 + Math.random() * 50;
  } else if (side < 0.7) {
    startX = 105 + Math.random() * 20;
    startY = 10 + Math.random() * 50;
  } else {
    startX = Math.random() * 100;
    startY = -20 - Math.random() * 15;
  }

  const midX = 35 + Math.random() * 30;
  const midY = 30 + Math.random() * 25;

  const endX = midX + (Math.random() - 0.5) * 40;
  const endY = 100 + Math.random() * 20;

  return {
    id,
    startX,
    startY,
    midX,
    midY,
    endX,
    endY,
    img: PETAL_IMAGES[
      Math.floor(Math.random() * PETAL_IMAGES.length)
    ],
    delay: Math.random() * 1.4,
    duration: 4.5 + Math.random() * 2.5,
    rotateEnd: (Math.random() - 0.5) * 540,
    size: 22 + Math.random() * 14,
  };
}

export default function Blessings() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [lights, setLights] = useState<LightParticle[]>([]);

  useEffect(() => {
    setLights(
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 15 + Math.random() * 60,
        size: 3 + Math.random() * 5,
        driftX: (Math.random() - 0.5) * 40,
        driftY: (Math.random() - 0.5) * 40,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  const showerFlowers = () => {
    const newPetals = Array.from({ length: 22 }).map((_, i) =>
      makePetal(Date.now() + i)
    );

    setPetals((p) => [...p, ...newPetals]);

    setTimeout(() => {
      setPetals((p) =>
        p.filter((pt) => !newPetals.includes(pt))
      );
    }, 9000);
  };

  return (
    <section className="relative overflow-hidden px-6 py-14 text-center">

      {/* =====================================================
          RESPONSIVE BACKGROUND images
      ====================================================== */}

      <Image
        src="/images/backgrounds/invitation-desktop-bg.png"
        alt=""
        fill
        priority
        className="
          pointer-events-none
          hidden
          object-cover
          md:block
        "
      />

      <Image
        src="/images/backgrounds/blessing-bg.png"
        alt=""
        fill
        priority
        className="
          pointer-events-none
          object-cover
          md:hidden
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-gradient-to-b
          from-amber-950/70
          to-amber-900/70
        "
      />

      {/* =====================================================
          LEFT MARIGOLD GARLAND
          LARGE + WIND SWING + SHADOW
      ====================================================== */}

   <div
  className="
    pointer-events-none
    absolute
    left-[-40px]
    top-[-10px]
    z-20
     h-[350px]
    w-[230px]

    sm:left-[-65px]
    sm:top-[-12px]
    sm:h-[470px]
    sm:w-[315px]

    md:left-[-80px]
    md:top-[-15px]
    md:h-[550px]
    md:w-[370px]

    lg:left-[-95px]
    lg:top-[-18px]
    lg:h-[630px]
    lg:w-[420px]

    overflow-visible
  "
>
        <motion.div
          className="
            absolute
            -left-[25px]
            -top-[18px]

            h-full
            w-full

            origin-top-left
          "
          animate={{
            rotate: [
              -2.5,
              1.8,
              -1.2,
              2.2,
              -0.8,
              -2.5,
            ],

            x: [
              0,
              5,
              -3,
              6,
              2,
              0,
            ],

            y: [
              0,
              2,
              -2,
              3,
              0,
              0,
            ],

            scale: [
              1,
              1.008,
              0.995,
              1.01,
              1,
              1,
            ],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* ==============================================
              GARLAND SHADOW
          ============================================== */}

          <Image
            src="/images/decorations/marigold_garland.png"
            alt=""
            fill
            priority
            sizes="390px"
            className="
              absolute
              translate-x-[7px]
              translate-y-[12px]

              object-contain
              object-left-top

              opacity-60

              blur-[3px]

              brightness-50

              scale-[1.01]
            "
          />

          {/* ==============================================
              SOFT AMBIENT SHADOW
          ============================================== */}

          <Image
            src="/images/decorations/marigold_garland.png"
            alt=""
            fill
            sizes="390px"
            className="
              absolute
              translate-x-[4px]
              translate-y-[7px]

              object-contain
              object-left-top

              opacity-35

              blur-[1.5px]

              brightness-75
            "
          />

          {/* ==============================================
              MAIN GARLAND
          ============================================== */}

          <Image
            src="/images/decorations/marigold_garland.png"
            alt=""
            fill
            sizes="390px"
            className="
              relative
              object-contain
              object-left-top

              drop-shadow-[0_14px_12px_rgba(0,0,0,0.30)]
              drop-shadow-[0_28px_26px_rgba(0,0,0,0.20)]
            "
          />
        </motion.div>
      </div>

      {/* =====================================================
          RIGHT MARIGOLD GARLAND
          LARGE + WIND SWING + SHADOW
      ====================================================== */}

      <div
  className="
    pointer-events-none
    absolute
    right-[-68px]
    top-[-10px]
    z-20
    h-[350px]
    w-[230px]

    sm:right-[-65px]
    sm:top-[-12px]
    sm:h-[470px]
    sm:w-[315px]

    md:right-[-80px]
    md:top-[-15px]
    md:h-[550px]
    md:w-[370px]

    lg:right-[-95px]
    lg:top-[-18px]
    lg:h-[630px]
    lg:w-[420px]

    overflow-visible
  "
>
        <motion.div
          className="
            absolute
            -right-[25px]
            -top-[18px]

            h-full
            w-full

            origin-top-right
          "
          animate={{
            rotate: [
              2.5,
              -1.8,
              1.2,
              -2.2,
              0.8,
              2.5,
            ],

            x: [
              0,
              -5,
              3,
              -6,
              -2,
              0,
            ],

            y: [
              0,
              2,
              -2,
              3,
              0,
              0,
            ],

            scale: [
              1,
              1.008,
              0.995,
              1.01,
              1,
              1,
            ],
          }}
          transition={{
            duration: 7.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.45,
          }}
        >
          {/* ==============================================
              GARLAND SHADOW
          ============================================== */}

          <Image
            src="/images/decorations/marigold_garland.png"
            alt=""
            fill
            sizes="390px"
            className="
              absolute

              -translate-x-[7px]
              translate-y-[12px]

              object-contain
              object-right-top

              opacity-60

              blur-[3px]

              brightness-50

              scale-[1.01]

              -scale-x-100
            "
          />

          {/* ==============================================
              SOFT AMBIENT SHADOW
          ============================================== */}

          <Image
            src="/images/decorations/marigold_garland.png"
            alt=""
            fill
            sizes="390px"
            className="
              absolute

              -translate-x-[4px]
              translate-y-[7px]

              object-contain
              object-right-top

              opacity-35

              blur-[1.5px]

              brightness-75

              -scale-x-100
            "
          />

          {/* ==============================================
              MAIN GARLAND
          ============================================== */}

          <Image
            src="/images/decorations/marigold_garland.png"
            alt=""
            fill
            sizes="390px"
            className="
              relative

              object-contain
              object-right-top

              drop-shadow-[0_14px_12px_rgba(0,0,0,0.30)]
              drop-shadow-[0_28px_26px_rgba(0,0,0,0.20)]

              -scale-x-100
            "
          />
        </motion.div>
      </div>

      {/* =====================================================
          HEADING
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-30"
      >
        <h2 className="text-2xl font-bold text-amber-100">
          बाप्पाचे आशीर्वाद
        </h2>

        <p className="mt-2 text-sm text-amber-300">
          स्पर्श करा आणि गणरायाचे मंगल आशीर्वाद प्राप्त करा
        </p>
      </motion.div>

      {/* =====================================================
          GANAPATI AREA
      ====================================================== */}

      <div className="relative z-30 mx-auto mt-6 w-52">

        {/* ==================================================
            AMBIENT LIGHT PARTICLES
        ================================================== */}

        <div className="pointer-events-none absolute inset-[-40%] z-0">
          {lights.map((l) => (
            <motion.span
              key={l.id}
              className="absolute rounded-full bg-amber-200"
              style={{
                left: `${l.x}%`,
                top: `${l.y}%`,
                width: l.size,
                height: l.size,
                boxShadow:
                  "0 0 8px 2px rgba(251,191,36,0.7)",
              }}
              animate={{
                x: [0, l.driftX, 0],
                y: [0, l.driftY, 0],
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: l.duration,
                delay: l.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* ==================================================
            FALLING / THROWN PETALS
        ================================================== */}

        <div className="pointer-events-none absolute inset-[-60%] z-20 overflow-visible">
          <AnimatePresence>
            {petals.map((p) => (
              <motion.div
                key={p.id}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.size,
                }}
                initial={{
                  left: `${p.startX}%`,
                  top: `${p.startY}%`,
                  opacity: 0,
                  rotate: 0,
                  scale: 0.6,
                }}
                animate={{
                  left: [
                    `${p.startX}%`,
                    `${p.midX}%`,
                    `${p.endX}%`,
                  ],
                  top: [
                    `${p.startY}%`,
                    `${p.midY}%`,
                    `${p.endY}%`,
                  ],
                  opacity: [0, 1, 1, 0],
                  rotate: [
                    0,
                    p.rotateEnd * 0.4,
                    p.rotateEnd,
                  ],
                  scale: [0.6, 1, 0.9],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeInOut",
                  times: [0, 0.35, 1],
                }}
              >
                <Image
                  src={p.img}
                  alt=""
                  width={p.size}
                  height={p.size}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 360° Rotating Divine Halo Mandala Behind Idol (mandala-f2.png) */}
        <div className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] opacity-65 mix-blend-screen z-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <Image
              src="/images/decorations/mandala-f2.png"
              alt=""
              width={320}
              height={320}
              unoptimized
              className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(232,169,59,0.85)]"
            />
          </motion.div>
        </div>

        {/* Symmetrical Glowing Diyas (diya.png) - Shifted Downwards by 70px Responsively */}
        <div className="pointer-events-none absolute -left-6 sm:-left-10 md:-left-12 top-[calc(50%+70px)] -translate-y-1/2 z-20 w-12 sm:w-16">
          <Image
            src="/images/diyas/diya.png"
            alt="समई/दिवा"
            width={64}
            height={64}
            unoptimized
            className="w-full h-auto object-contain filter drop-shadow-[0_0_16px_rgba(245,158,11,0.85)]"
          />
        </div>
        <div className="pointer-events-none absolute -right-6 sm:-right-10 md:-right-12 top-[calc(50%+70px)] -translate-y-1/2 z-20 w-12 sm:w-16">
          <Image
            src="/images/diyas/diya.png"
            alt="समई/दिवा"
            width={64}
            height={64}
            unoptimized
            className="w-full h-auto object-contain filter drop-shadow-[0_0_16px_rgba(245,158,11,0.85)] -scale-x-100"
          />
        </div>

        {/* GANAPATI MURTI */}
        <motion.div
          className="relative z-10"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/images/ganapati/ganapati-murti.png"
            alt="गणपती बाप्पा"
            width={300}
            height={340}
            unoptimized
            className="w-full h-auto object-contain filter drop-shadow-[0_12px_30px_rgba(232,169,59,0.5)]"
          />
        </motion.div>
      </div>

      {/* =====================================================
          FLOWER BUTTON
      ====================================================== */}

      <motion.button
        type="button"
        suppressHydrationWarning
        onClick={showerFlowers}
        whileHover={{
          scale: 1.04,
        }}
        whileTap={{
          scale: 0.96,
        }}
        animate={{
          boxShadow: [
            "0 6px 20px rgba(0,0,0,0.18)",
            "0 8px 28px rgba(251,146,60,0.35)",
            "0 6px 20px rgba(0,0,0,0.18)",
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          relative
          z-30
          mt-6
          rounded-full
          bg-orange-500
          px-7
          py-3
          font-medium
          text-white 
          shadow-lg
        "
      >
        🌸 फुलांची उधळण करा
      </motion.button>
    </section>
  );
}