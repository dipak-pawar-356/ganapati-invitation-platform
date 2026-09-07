"use client";

import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";

type LocationProps = {
  mandalName: string;
  address: string;
  contact: string;
  mapEmbedUrl: string;
  mapsLink: string;
};

/* ============================================================
   ANIMATION VARIANTS
============================================================ */

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },

  show: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ============================================================
   COMPONENT
============================================================ */

export default function Location({
  mandalName,
  address,
  contact,
  mapEmbedUrl,
  mapsLink,
}: LocationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        px-6
        py-14
        text-center

        bg-[var(--t-bg)]
        bg-[url('/images/backgrounds/FamilySection.webp')]
        bg-center
        bg-cover
        bg-no-repeat

        md:px-8
        md:py-20
      "
    >
      {/* =====================================================
          BACKGROUND OVERLAYS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/30
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-black/10
          via-transparent
          to-black/45
        "
      />

      {/* =====================================================
          DECORATIVE FLOATING LIGHTS
      ===================================================== */}

      {!shouldReduceMotion && (
        <>
          {/* Light 1 */}

          <motion.div
            className="
              pointer-events-none
              absolute
              left-[12%]
              top-[18%]
              h-2
              w-2
              rounded-full
              bg-amber-300
              blur-[1px]
            "
            animate={{
              y: [0, -16, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Light 2 */}

          <motion.div
            className="
              pointer-events-none
              absolute
              right-[14%]
              top-[28%]
              h-1.5
              w-1.5
              rounded-full
              bg-yellow-200
              blur-[1px]
            "
            animate={{
              y: [0, 18, 0],
              opacity: [0.15, 0.75, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />

          {/* Light 3 */}

          <motion.div
            className="
              pointer-events-none
              absolute
              bottom-[18%]
              left-[20%]
              h-1
              w-1
              rounded-full
              bg-amber-300
            "
            animate={{
              y: [0, -12, 0],
              opacity: [0.1, 0.7, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          />
        </>
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <motion.div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-md
          md:max-w-xl
        "
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={{
          hidden: {},

          show: {
            transition: {
              staggerChildren: 0.13,
            },
          },
        }}
      >
        {/* ===================================================
            HEADING
        =================================================== */}

        <motion.div
          variants={fadeUp}
          className="relative inline-block"
        >
          {!shouldReduceMotion && (
            <motion.div
              className="
                pointer-events-none
                absolute
                inset-x-[-30%]
                inset-y-[-60%]
                -z-10
                rounded-full
                bg-amber-300/20
                blur-3xl
              "
              animate={{
                opacity: [0.25, 0.65, 0.25],
                scale: [0.9, 1.12, 0.9],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <motion.h2
            className="
              font-sans
              text-2xl
              font-bold
              tracking-wide
              text-white
              drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]
              md:text-3xl
            "
          >
            कार्यक्रम स्थळ
          </motion.h2>

          {/* Golden underline */}

          <motion.div
            className="
              mx-auto
              mt-2
              h-[2px]
              rounded-full
              bg-gradient-to-r
              from-transparent
              via-[var(--t-divider)]
              to-transparent
            "
            initial={{
              width: 0,
              opacity: 0,
            }}
            whileInView={{
              width: 80,
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: "easeOut",
            }}
          />
        </motion.div>

        {/* ===================================================
            SUBTITLE
        =================================================== */}

        <motion.p
          variants={fadeUp}
          className="
            mt-3
            font-sans
            text-sm
            leading-relaxed
            text-[var(--t-primary-light)]
            drop-shadow-[0_2px_7px_rgba(0,0,0,0.5)]
            md:text-base
          "
        >
          गणरायाच्या दर्शनासाठी आपले सहर्ष स्वागत आहे
        </motion.p>

        {/* ===================================================
            MAP CARD
        =================================================== */}

        <motion.div
          variants={scaleIn}
          whileHover={
            shouldReduceMotion
              ? undefined
              : {
                  y: -4,
                  scale: 1.015,
                }
          }
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
          className="
            group
            relative
            mt-7
            overflow-hidden
            rounded-2xl
            border
            border-[var(--t-border)]
            bg-black/35
            p-1.5
            shadow-[0_18px_45px_rgba(0,0,0,0.4)]
            backdrop-blur-sm

            md:mt-8
            md:rounded-3xl
            md:p-2
          "
        >
          {/* Animated glow behind map */}

          {!shouldReduceMotion && (
            <motion.div
              className="
                pointer-events-none
                absolute
                -inset-8
                -z-10
                rounded-full
                bg-[var(--t-primary-badge)]
                blur-3xl
              "
              animate={{
                opacity: [0.2, 0.55, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Floating location pin */}

          {!shouldReduceMotion && (
            <motion.div
              className="
                pointer-events-none
                absolute
                left-5
                top-2
                z-20
                text-xl
                drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]
              "
              animate={{
                y: [0, -7, 0],
                rotate: [-3, 3, -3],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              📍
            </motion.div>
          )}

          {/* Map */}

          <div
            className="
              relative
              overflow-hidden
              rounded-xl
              md:rounded-2xl
            "
          >
            <iframe
              src={mapEmbedUrl}
              title={`${mandalName} location map`}
              className="
                block
                h-56
                w-full
                border-0
                md:h-72
              "
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Map shine */}

            {!shouldReduceMotion && (
              <motion.div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  -left-[45%]
                  w-[30%]
                  skew-x-[-18deg]
                  bg-gradient-to-r
                  from-transparent
                  via-white/10
                  to-transparent
                "
                animate={{
                  left: ["-45%", "120%"],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
        </motion.div>

        {/* ===================================================
            MANDAL NAME
        =================================================== */}

        <motion.h3
          variants={fadeUp}
          className="
            mt-7
            font-sans
            text-xl
            font-semibold
            text-[var(--t-text)]
            drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)]
            md:text-2xl
          "
        >
          {mandalName}
        </motion.h3>

        {/* ===================================================
            ADDRESS + CONTACT
        =================================================== */}

        <motion.div
          variants={fadeUp}
          className="
            mt-3
            space-y-1
            font-sans
            text-sm
            leading-relaxed
            text-[var(--t-text-soft)]
            drop-shadow-[0_2px_7px_rgba(0,0,0,0.55)]
          "
        >
          <motion.p
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    x: 3,
                  }
            }
          >
            <span className="text-[var(--t-primary-light)]">
              📍
            </span>{" "}
            {address}
          </motion.p>

          <motion.p
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    x: 3,
                  }
            }
          >
            <span className="text-[var(--t-primary-light)]">
              📞
            </span>{" "}
            {contact}
          </motion.p>
        </motion.div>

        {/* ===================================================
            GOOGLE MAPS BUTTON
        =================================================== */}

        <motion.div variants={fadeUp}>
          <motion.a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 1.045,
                    y: -3,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.96,
                  }
            }
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    boxShadow: [
                      "0 8px 25px rgba(0,0,0,0.25)",
                      "0 10px 35px rgba(251,191,36,0.5)",
                      "0 8px 25px rgba(0,0,0,0.25)",
                    ],
                  }
            }
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              mt-6
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-[var(--t-border-accent)]
              bg-gradient-to-r
              from-amber-400
              via-yellow-300
              to-amber-400
              px-7
              py-3
              font-sans
              text-sm
              font-semibold
              text-[var(--t-bg)]
              shadow-[0_8px_25px_rgba(0,0,0,0.25)]
              transition-all
              md:px-8
              md:py-3.5
              md:text-base
            "
          >
            <span>
              Open in Google Maps
            </span>

            <motion.span
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: [0, 3, 0],
                    }
              }
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ↗
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}