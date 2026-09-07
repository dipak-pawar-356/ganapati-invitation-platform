"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import CornerDecoration from "@/components/common/CornerDecoration";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowUpRight,
  ChevronRight,
  X,
} from "lucide-react";

export type TimelineEvent = {
  title: string;
  summary: string;
  date?: string;
  time?: string;
  place?: string;
};

type TimelineProps = {
  events: TimelineEvent[];
};

export default function Timeline({ events }: TimelineProps) {
  const [active, setActive] = useState<TimelineEvent | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  /* ============================================================
     LOCK BODY SCROLL WHEN MODAL IS OPEN
  ============================================================ */

  useEffect(() => {
    if (!active) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [active]);

  /* ============================================================
     ESCAPE KEY
  ============================================================ */

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (!events.length) {
    return null;
  }

  return (
   <section
  className="
    relative
    overflow-hidden
    px-4
    py-16
    sm:px-6
    sm:py-20
    lg:px-8
    lg:py-24
  "
>
  {/* BACKGROUND */}
  <Image
    src="/images/backgrounds/timeline-bg.png"
    alt=""
    fill
    priority
    sizes="100vw"
    className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center"
  />

  {/* SOFT OVERLAY */}
  <div
    aria-hidden="true"
    className="
      pointer-events-none
      absolute
      inset-0
      -z-10
      bg-[#fff8e8]/20
    "
  />

      {/* ========================================================
          BACKGROUND DECORATION
      ======================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-20
          h-72
          w-72
          -translate-x-1/2
          rounded-full
          bg-amber-300/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-32
          top-1/3
          h-64
          w-64
          rounded-full
          bg-orange-300/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-20
          h-64
          w-64
          rounded-full
          bg-amber-400/10
          blur-3xl
        "
      />

      {/* ========================================================
          HEADER
      ======================================================== */}

      <motion.header
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 24,
              }
        }
        whileInView={
          shouldReduceMotion
            ? undefined
            : {
                opacity: 1,
                y: 0,
              }
        }
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10
          mx-auto
          mb-12
          max-w-2xl
          text-center
          sm:mb-16
        "
      >
        <p className="text-xs font-bold tracking-[0.25em] text-amber-300 uppercase">
          ॥ श्री गणेशाय नमः ॥
        </p>

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.8,
                }
          }
          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  scale: 1,
                }
          }
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="my-3 flex justify-center"
        >
          <Image
            src="/images/decorations/om.png"
            alt=""
            width={38}
            height={38}
            className="h-8 w-8 object-contain sm:h-9 sm:w-9 filter drop-shadow-[0_4px_10px_var(--t-primary-glow)]"
          />
        </motion.div>

        <h2
          className="
            font-display
            text-3xl
            font-extrabold
            tracking-tight
            text-[var(--t-primary-light)]
            drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]
            sm:text-4xl
            lg:text-5xl
          "
        >
          उत्सवाचा मंगल प्रवास
        </h2>

        <div className="mx-auto mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[var(--t-divider)]/70 sm:w-16" />

          <span className="text-sm font-bold text-[var(--t-primary)]">
            ✦
          </span>

          <span className="h-px w-10 bg-[var(--t-divider)]/70 sm:w-16" />
        </div>

        <p
          className="
            mx-auto
            mt-4
            max-w-lg
            text-sm
            leading-relaxed
            text-[var(--t-text-soft)]
            sm:text-base
            font-medium
          "
        >
          गणरायाच्या आगमनापासून विसर्जनापर्यंत प्रत्येक
          मंगल क्षणाची माहिती
        </p>
      </motion.header>

      {/* ========================================================
          TIMELINE
      ======================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
        "
      >
        {/* ======================================================
            DESKTOP CENTER LINE
        ======================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-6
            left-1/2
            top-6
            hidden
            w-px
            -translate-x-1/2
            bg-gradient-to-b
            from-transparent
            via-amber-300
            to-transparent
            lg:block
          "
        />

        {/* ======================================================
            MOBILE / TABLET LINE
        ======================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-6
            left-[22px]
            top-6
            w-px
            bg-gradient-to-b
            from-amber-200
            via-amber-400/60
            to-amber-200
            sm:left-[28px]
            lg:hidden
          "
        />

        {/* ======================================================
            EVENTS
        ======================================================= */}

        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
          {events.map((event, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={`${event.title}-${index}`}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 35,
                      }
                }
                whileInView={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                      }
                }
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.65,
                  delay: Math.min(index * 0.04, 0.2),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                  relative
                  grid
                  items-center
                  lg:grid-cols-[1fr_80px_1fr]
                  ${
                    isEven
                      ? ""
                      : "lg:[&>div:first-child]:order-3"
                  }
                `}
              >
                {/* ==================================================
                    EVENT CARD
                =================================================== */}

                <div
                  className={`
                    pl-12
                    sm:pl-16
                    lg:pl-0
                    ${
                      isEven
                        ? "lg:pr-12"
                        : "lg:pl-12"
                    }
                  `}
                >
                  <motion.button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      setActive(event);
                      setActiveIndex(index);
                    }}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: -5,
                          }
                    }
                    whileTap={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 0.985,
                          }
                    }
                    className="
                      group
                      relative
                      w-full
                      overflow-visible
                      rounded-2xl
                      border
                      border-amber-200/80
                      bg-white/90
                      p-4
                      text-left
                      shadow-[0_8px_30px_rgba(120,70,20,0.08)]
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:border-amber-300
                      hover:shadow-[0_14px_40px_rgba(120,70,20,0.14)]
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-amber-500
                      focus-visible:ring-offset-2
                      sm:rounded-3xl
                      sm:p-5
                    "
                  >
                    {/* Engraved Card Corner Decorations */}
                    <CornerDecoration size={28} opacity={0.3} />

                    {/* Alternating Bal Ganesh PNG Image per card (Odd: Left, Even: Right) */}
                    {index % 2 === 0 ? (
                      <motion.div
                        className="pointer-events-none absolute z-20 w-[60px] sm:w-[80px] lg:w-[100px] -left-4 -bottom-4"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      >
                        <Image
                          src="/images/decorations/bal-ganesh-left.png"
                          alt="बाल गणपती"
                          width={100}
                          height={100}
                          sizes="(max-width: 639px) 60px, (max-width: 1023px) 80px, 100px"
                          className="h-auto w-full object-contain filter drop-shadow-[0_8px_16px_rgba(234,88,12,0.35)] transition-transform duration-300 group-hover:scale-110"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="pointer-events-none absolute z-20 w-[60px] sm:w-[80px] lg:w-[100px] -right-4 -bottom-4"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
                      >
                        <Image
                          src="/images/decorations/bal-ganesh-right.png"
                          alt="बाल गणपती"
                          width={100}
                          height={100}
                          sizes="(max-width: 639px) 60px, (max-width: 1023px) 80px, 100px"
                          className="h-auto w-full object-contain filter drop-shadow-[0_8px_16px_rgba(234,88,12,0.35)] transition-transform duration-300 group-hover:scale-110"
                        />
                      </motion.div>
                    )}

                    {/* Gold top animation */}
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        left-0
                        top-0
                        h-1
                        w-full
                        origin-left
                        scale-x-0
                        bg-gradient-to-r
                        from-orange-500
                        via-amber-400
                        to-yellow-300
                        transition-transform
                        duration-500
                        group-hover:scale-x-100
                      "
                    />

                    <div className="flex items-start gap-4">
                      {/* Number */}

                      <div
                        className="
                          relative
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-gradient-to-br
                          from-orange-500
                          to-amber-600
                          text-sm
                          font-bold
                          text-white
                          shadow-[0_6px_18px_rgba(234,88,12,0.25)]
                          sm:h-12
                          sm:w-12
                        "
                      >
                        {String(index + 1).padStart(2, "0")}

                        <span
                          aria-hidden="true"
                          className="
                            absolute
                            -right-1
                            -top-1
                            h-2
                            w-2
                            rounded-full
                            bg-yellow-300
                          "
                        />
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            className="
                              text-base
                              font-bold
                              text-amber-950
                              sm:text-lg
                            "
                          >
                            {event.title}
                          </h3>

                          <span
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-amber-50
                              text-amber-700
                              transition-all
                              duration-300
                              group-hover:bg-amber-500
                              group-hover:text-white
                            "
                          >
                            <ArrowUpRight
                              size={16}
                              strokeWidth={2}
                            />
                          </span>
                        </div>

                        <p
                          className="
                            mt-1.5
                            line-clamp-2
                            text-sm
                            leading-5
                            text-amber-800/70
                          "
                        >
                          {event.summary}
                        </p>

                        {/* Metadata */}

                        {(event.date ||
                          event.time ||
                          event.place) && (
                          <div
                            className="
                              mt-3
                              flex
                              flex-wrap
                              gap-x-3
                              gap-y-1.5
                            "
                          >
                            {event.date && (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700">
                                <CalendarDays size={12} />
                                {event.date}
                              </span>
                            )}

                            {event.time && (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700">
                                <Clock3 size={12} />
                                {event.time}
                              </span>
                            )}
                          </div>
                        )}

                        {/* More info */}

                        <div
                          className="
                            mt-3
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-orange-600
                          "
                        >
                          अधिक माहिती

                          <ChevronRight
                            size={14}
                            className="
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* ==================================================
                    TIMELINE NODE
                =================================================== */}

                <div
                  className="
                    absolute
                    left-[22px]
                    top-1/2
                    z-20
                    -translate-x-1/2
                    -translate-y-1/2
                    sm:left-[28px]
                    lg:static
                    lg:col-start-2
                    lg:row-start-1
                    lg:translate-x-0
                    lg:translate-y-0
                  "
                >
                  <motion.div
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    whileInView={{
                      scale: 1,
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                    className="
                      relative
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-amber-300
                      bg-amber-50
                      shadow-[0_0_0_6px_rgba(255,248,232,0.95),0_8px_24px_rgba(120,70,20,0.12)]
                    "
                  >
                    <span className="text-sm font-bold text-amber-700">
                      {index + 1}
                    </span>

                    <motion.span
                      aria-hidden="true"
                      className="
                        absolute
                        inset-1
                        rounded-full
                        border
                        border-amber-400/30
                      "
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : {
                              scale: [1, 1.15, 1],
                              opacity: [0.5, 0, 0.5],
                            }
                      }
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  </motion.div>
                </div>

                {/* ==================================================
                    EMPTY DESKTOP SIDE
                =================================================== */}

                <div
                  className={`
                    hidden
                    lg:block
                    ${
                      isEven
                        ? "lg:col-start-3"
                        : "lg:col-start-1"
                    }
                  `}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          FOOTER DECORATION
      ======================================================== */}

      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                scaleX: 0.5,
              }
        }
        whileInView={
          shouldReduceMotion
            ? undefined
            : {
                opacity: 1,
                scaleX: 1,
              }
        }
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
        }}
        className="
          relative
          z-10
          mx-auto
          mt-12
          flex
          items-center
          justify-center
          gap-3
        "
      >
        <span className="h-px w-12 bg-amber-300/60 sm:w-20" />

        <span className="text-sm text-amber-500">
          ❖
        </span>

        <span className="h-px w-12 bg-amber-300/60 sm:w-20" />
      </motion.div>

      {/* ========================================================
          PREMIUM EVENT MODAL
      ======================================================== */}

      <AnimatePresence>
        {active && (
          <motion.div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-[var(--t-bg-card)]/65
              px-4
              py-6
              backdrop-blur-md
              sm:px-6
            "
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            onClick={() => setActive(null)}
          >
            {/* ==================================================
                ACTUAL MODAL CARD
            =================================================== */}

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="timeline-dialog-title"
              className="
                relative
                w-full
                max-w-[390px]
                overflow-hidden
                rounded-[28px]
                border
                border-[var(--t-border)]
                bg-[#fff8e8]
                shadow-[0_30px_100px_rgba(0,0,0,0.38)]
              "
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.90,
                rotateX: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.94,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                mass: 0.8,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* ==================================================
                  MODAL BACKGROUND IMAGE
              =================================================== */}

              <Image
                src="/images/backgrounds/timeline-modal-bg.png"
                alt=""
                fill
                priority
                sizes="(max-width: 640px) calc(100vw - 32px), 390px"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-0
                  select-none
                  object-cover
                "
              />

              {/* ==================================================
                  READABILITY OVERLAY
              =================================================== */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  z-[1]
                  bg-gradient-to-b
                  from-[#fffaf0]/70
                  via-[#fff8e9]/88
                  to-[#f7e5bf]/82
                "
              />

              {/* ==================================================
                  SOFT CENTER LIGHT
              =================================================== */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  z-[1]
                  h-[280px]
                  w-[280px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-white/25
                  blur-3xl
                "
              />

              {/* ==================================================
                  MODAL CONTENT
              =================================================== */}

              <div
                className="
                  relative
                  z-10
                  max-h-[88vh]
                  overflow-y-auto
                  overscroll-contain
                  px-5
                  pb-7
                  pt-7
                  sm:px-7
                "
              >
                {/* ==================================================
                    MOBILE DRAG INDICATOR
                =================================================== */}

                <div
                  aria-hidden="true"
                  className="
                    mx-auto
                    mb-5
                    h-1
                    w-10
                    rounded-full
                    bg-amber-300
                    sm:hidden
                  "
                />

                {/* ==================================================
                    CLOSE BUTTON
                =================================================== */}

                <motion.button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="बंद करा"
                  whileHover={{
                    scale: 1.08,
                    rotate: 5,
                  }}
                  whileTap={{
                    scale: 0.92,
                  }}
                  className="
                    absolute
                    right-4
                    top-4
                    z-20
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#d9a441]/50
                    bg-[#fffaf0]/90
                    text-[#8f5518]
                    shadow-[0_3px_12px_rgba(120,70,20,0.10)]
                    backdrop-blur-sm
                    transition-colors
                    hover:bg-amber-100
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-amber-500
                  "
                >
                  <X size={17} />
                </motion.button>

                {/* ==================================================
                    MODAL HEADER
                =================================================== */}

                <div className="text-center">
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.1,
                    }}
                    className="
                      text-[10px]
                      font-semibold
                      tracking-[0.25em]
                      text-[#9a5b17]
                      sm:text-xs
                    "
                  >
                    ॥ श्री गणेशाय नमः ॥
                  </motion.p>

                  {/* Ornament */}

                  <div className="mx-auto my-3 flex items-center justify-center gap-2">
                    <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--t-primary)]" />

                    <motion.span
                      initial={{
                        opacity: 0,
                        scale: 0,
                        rotate: -45,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        delay: 0.15,
                        type: "spring",
                        stiffness: 260,
                      }}
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#d9a441]/70
                        bg-[#fff1c9]
                        text-[10px]
                        text-[#9a5b17]
                        shadow-sm
                      "
                    >
                      ✦
                    </motion.span>

                    <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--t-primary)]" />
                  </div>

                  {/* Title */}

                  <motion.h3
                    id="timeline-dialog-title"
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.18,
                      duration: 0.45,
                    }}
                    className="
                      text-[25px]
                      font-bold
                      tracking-tight
                      text-[#63320f]
                      sm:text-3xl
                    "
                  >
                    {active.title}
                  </motion.h3>

                  {/* Summary */}

                  <motion.p
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.25,
                    }}
                    className="
                      mx-auto
                      mt-3
                      max-w-[310px]
                      text-sm
                      leading-6
                      text-[#8b5a2b]
                    "
                  >
                    {active.summary}
                  </motion.p>
                </div>

                {/* ==================================================
                    EVENT DETAILS
                =================================================== */}

                <div className="mt-6 space-y-3">
                  {active.date && (
                    <PremiumDetail
                      icon={<CalendarDays size={18} />}
                      label="दिनांक"
                      value={active.date}
                      delay={0.3}
                    />
                  )}

                  {active.time && (
                    <PremiumDetail
                      icon={<Clock3 size={18} />}
                      label="वेळ"
                      value={active.time}
                      delay={0.36}
                    />
                  )}

                  {active.place && (
                    <PremiumDetail
                      icon={<MapPin size={18} />}
                      label="स्थळ"
                      value={active.place}
                      delay={0.42}
                    />
                  )}
                </div>

                {/* ==================================================
                    BOTTOM ORNAMENT
                =================================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scaleX: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scaleX: 1,
                  }}
                  transition={{
                    delay: 0.48,
                    duration: 0.5,
                  }}
                  className="
                    mt-7
                    flex
                    items-center
                    justify-center
                    gap-3
                  "
                >
                  <span className="h-px w-12 bg-[var(--t-primary)]/60" />

                  <span className="text-sm text-[#b87318]">
                    ❖
                  </span>

                  <span className="h-px w-12 bg-[var(--t-primary)]/60" />
                </motion.div>

                {/* ==================================================
                    EVENT COUNTER
                =================================================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.52,
                  }}
                  className="mt-4 flex justify-center"
                >
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[var(--t-border)]
                      bg-[#fffaf0]/90
                      px-4
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-[#965714]
                      shadow-[0_3px_12px_rgba(120,70,20,0.08)]
                      backdrop-blur-sm
                    "
                  >
                    <span>
                      कार्यक्रम {activeIndex + 1}
                    </span>

                    <span className="text-[#d4a13b]">
                      •
                    </span>

                    <span>
                      {events.length} पैकी
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* ==================================================
                  PREMIUM GOLD BOTTOM EDGE
              =================================================== */}

              <div
                aria-hidden="true"
                className="
                  relative
                  z-20
                  h-[3px]
                  w-full
                  bg-gradient-to-r
                  from-[#a86618]
                  via-[#f0c85b]
                  to-[#a86618]
                "
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ================================================================
   PREMIUM DETAIL ITEM
================================================================ */

function PremiumDetail({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -15,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-[var(--t-border)]
        bg-[#fffdf8]/90
        px-4
        py-3.5
        shadow-[0_5px_20px_rgba(120,70,20,0.06)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:border-[var(--t-primary)]
        hover:bg-white
        hover:shadow-[0_8px_25px_rgba(120,70,20,0.12)]
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-[var(--t-border)]
          bg-gradient-to-br
          from-[#fff0c7]
          to-[#ffe3a0]
          text-[#9a5b17]
          shadow-inner
          transition-transform
          duration-300
          group-hover:scale-105
        "
      >
        {icon}
      </div>

      {/* Text */}

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-[#b87920]
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            break-words
            text-sm
            font-bold
            text-[#63320f]
          "
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}