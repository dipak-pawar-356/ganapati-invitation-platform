"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type InvitationCardProps = {
  mandalName: string;
  message: string;
};

export default function InvitationCard({
  mandalName,
  message,
}: InvitationCardProps) {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-gradient-to-b
        from-amber-50
        via-[#fffaf0]
        to-white
        px-4
        py-10
        sm:px-6
        sm:py-12
      "
    >
      {/* =====================================================
          TOP DIVIDER
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scaleX: 0.7,
        }}
        whileInView={{
          opacity: 1,
          scaleX: 1,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-5 flex justify-center items-center w-full max-w-xs mx-auto"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--t-primary)]/50 to-transparent" />
      </motion.div>

      {/* =====================================================
          CARD WRAPPER
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-md
          sm:max-w-lg
        "
      >
        {/* ===================================================
            MAIN INVITATION CARD
        ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.97,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            z-10

            w-full

            overflow-hidden

            rounded-3xl

            border
            border-[var(--t-border)]

            bg-gradient-to-b
            from-amber-50
            via-[#fffaf0]
            to-[#fff7e5]

            px-6
            pb-8
            pt-24

            text-center

            shadow-[0_18px_50px_rgba(120,70,20,0.15)]

            sm:px-8
            sm:pb-9
            sm:pt-28
          "
        >
          {/* =================================================
              SUBTLE INNER LIGHT
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-3xl

              bg-gradient-to-b
              from-white/55
              via-transparent
              to-amber-100/20
            "
          />

          {/* =================================================
              TOP LEFT CORNER
          ================================================= */}

          <Image
            src="/images/decorations/corner.png"
            alt=""
            width={40}
            height={40}
            style={{ width: 40, height: 40 }}
            className="
              absolute
              left-3
              top-3
              z-20
              opacity-90
            "
          />

          {/* =================================================
              TOP RIGHT CORNER
          ================================================= */}

          <Image
            src="/images/decorations/corner.png"
            alt=""
            width={40}
            height={40}
            style={{ width: 40, height: 40 }}
            className="
              absolute
              right-3
              top-3
              z-20
              -scale-x-100
              opacity-90
            "
          />

          {/* =================================================
              LEFT BAL GANESH

              IMPORTANT:
              This is INSIDE the card.
              overflow-hidden on card prevents it from
              ever going outside the card boundary.
          ================================================= */}

          <motion.div
            className="
              pointer-events-none

              absolute
              left-[-15px]
              top-[8px]

              z-30

              h-[145px]
              w-[110px]

              sm:left-[-25px]
              sm:top-[5px]
              sm:h-[165px]
              sm:w-[125px]

              [perspective:1000px]
            "
            initial={{
              opacity: 0,
              x: -65,
              scale: 0.82,
              rotateY: 18,
              rotateZ: -5,
            }}
            animate={{
              /*
                LEFT GANESH SEQUENCE

                0   = hidden outside left edge
                1   = enters card
                2   = visible
                3   = slowly leaves
                4   = hidden
              */
              opacity: [0, 0, 1, 1, 0, 0],

              x: [-65, -65, -8, 2, -28, -65],

              y: [8, 8, 2, -2, 4, 8],

              scale: [
                0.82,
                0.82,
                0.97,
                1.015,
                0.91,
                0.82,
              ],

              rotateY: [
                18,
                18,
                5,
                0,
                8,
                18,
              ],

              rotateZ: [
                -5,
                -5,
                -1,
                0,
                -2,
                -5,
              ],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              repeatDelay: 0.8,

              times: [
                0,
                0.08,
                0.25,
                0.45,
                0.63,
                0.76,
              ],

              ease: "easeInOut",
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Soft light behind Ganesh */}

            <motion.div
              className="
                pointer-events-none

                absolute
                left-1/2
                top-[20%]

                h-[75%]
                w-[80%]

                -translate-x-1/2

                rounded-full

                bg-amber-400/20

                blur-2xl
              "
              animate={{
                opacity: [0.15, 0.4, 0.15],
                scale: [0.9, 1.08, 0.9],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <Image
              src="/images/decorations/bal-ganesh-left.png"
              alt=""
              fill
              priority
              sizes="125px"
              style={{
                filter:
                  "drop-shadow(0 8px 7px rgba(65,35,5,0.32)) drop-shadow(0 18px 18px rgba(0,0,0,0.18))",
              }}
              className="
                select-none
                object-contain
              "
            />
          </motion.div>

          {/* =================================================
              RIGHT BAL GANESH

              Starts after LEFT animation.
          ================================================= */}

          <motion.div
            className="
              pointer-events-none

              absolute
              right-[-12px]
              top-[8px]

              z-30

              h-[145px]
              w-[110px]

              sm:right-[-25px]
              sm:top-[5px]
              sm:h-[165px]
              sm:w-[125px]

              [perspective:1000px]
            "
            initial={{
              opacity: 0,
              x: 65,
              scale: 0.82,
              rotateY: -18,
              rotateZ: 5,
            }}
            animate={{
              /*
                RIGHT GANESH SEQUENCE

                Delayed until LEFT GANESH is finished.
              */

              opacity: [
                0,
                0,
                0,
                0,
                1,
                1,
                0,
                0,
              ],

              x: [
                65,
                65,
                65,
                65,
                8,
                -2,
                28,
                65,
              ],

              y: [
                8,
                8,
                8,
                8,
                2,
                -2,
                4,
                8,
              ],

              scale: [
                0.82,
                0.82,
                0.82,
                0.82,
                0.97,
                1.015,
                0.91,
                0.82,
              ],

              rotateY: [
                -18,
                -18,
                -18,
                -18,
                -5,
                0,
                -8,
                -18,
              ],

              rotateZ: [
                5,
                5,
                5,
                5,
                1,
                0,
                2,
                5,
              ],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              repeatDelay: 0.8,

              times: [
                0,
                0.08,
                0.25,
                0.43,
                0.52,
                0.68,
                0.84,
                0.96,
              ],

              ease: "easeInOut",
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Soft light behind Ganesh */}

            <motion.div
              className="
                pointer-events-none

                absolute
                left-1/2
                top-[20%]

                h-[75%]
                w-[80%]

                -translate-x-1/2

                rounded-full

                bg-amber-400/20

                blur-2xl
              "
              animate={{
                opacity: [0.15, 0.4, 0.15],
                scale: [0.9, 1.08, 0.9],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            <Image
              src="/images/decorations/bal-ganesh-right.png"
              alt=""
              fill
              sizes="125px"
              style={{
                filter:
                  "drop-shadow(0 8px 7px rgba(65,35,5,0.32)) drop-shadow(0 18px 18px rgba(0,0,0,0.18))",
              }}
              className="
                select-none
                object-contain
              "
            />
          </motion.div>

          {/* =================================================
              CARD CONTENT
          ================================================= */}

          <div className="relative z-40">
            {/* Invitation Label */}

            <motion.p
              initial={{
                opacity: 0,
                y: 8,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.25,
                duration: 0.5,
              }}
              className="
                text-xs
                tracking-widest
                text-amber-700
              "
            >
              ॥ सप्रेम निमंत्रक ॥
            </motion.p>

            {/* Mandal Name */}

            <motion.h2
              initial={{
                opacity: 0,
                y: 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.35,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                mt-3
                text-2xl
                font-bold
                text-amber-900

                sm:text-3xl
              "
            >
              {mandalName}
            </motion.h2>

            {/* Animated Divider */}

            <motion.div
              initial={{
                width: 0,
                opacity: 0,
              }}
              whileInView={{
                width: 64,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.55,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="
                mx-auto
                my-4
                h-0.5

                bg-gradient-to-r
                from-transparent
                via-[var(--t-primary)]
                to-transparent
              "
            />

            {/* Message */}

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.65,
                duration: 0.6,
              }}
              className="
                leading-relaxed
                text-amber-800
              "
            >
              {message}
            </motion.p>
          </div>

          {/* =================================================
              BOTTOM LEFT CORNER
          ================================================= */}

          <Image
            src="/images/decorations/corner.png"
            alt=""
            width={40}
            height={40}
            style={{ width: 40, height: 40 }}
            className="
              absolute
              bottom-3
              left-3
              z-40
              scale-y-[-1]
              opacity-90
            "
          />

          {/* =================================================
              BOTTOM RIGHT CORNER
          ================================================= */}

          <Image
            src="/images/decorations/corner.png"
            alt=""
            width={40}
            height={40}
            style={{ width: 40, height: 40 }}
            className="
              absolute
              bottom-3
              right-3
              z-40
              -scale-100
              opacity-90
            "
          />
        </motion.div>
      </div>

      {/* =====================================================
          BOTTOM DIVIDER
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scaleX: 0.7,
        }}
        whileInView={{
          opacity: 1,
          scaleX: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-6 flex justify-center items-center w-full max-w-xs mx-auto"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--t-primary)]/50 to-transparent" />
      </motion.div>
    </section>
  );
}