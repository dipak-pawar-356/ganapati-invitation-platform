"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type DoorsOverlayProps = {
  doorsOpen: boolean;
  onOpen: (e?: React.MouseEvent) => void;
};

export default function DoorsOverlay({ doorsOpen, onOpen }: DoorsOverlayProps) {
  return (
    <AnimatePresence>
      {!doorsOpen && (
        <div
          className="fixed inset-0 z-50 cursor-pointer overflow-hidden bg-transparent"
          onClick={onOpen}
          role="button"
          tabIndex={0}
          aria-label="दार उघडण्यासाठी स्पर्श करा"
        >
          {/* MOBILE DOORS (< md) — priority: visible on first paint for most traffic */}
          <div className="flex h-full w-full md:hidden">
            <motion.div
              className="relative h-full w-1/2 overflow-hidden shadow-[10px_0_35px_rgba(0,0,0,0.7)] z-10"
              initial={{ x: 0 }}
              exit={{ x: "-102%" }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/doors/left-door.webp"
                alt=""
                fill
                priority
                sizes="50vw"
                className="object-cover object-right select-none"
              />
            </motion.div>

            <motion.div
              className="relative h-full w-1/2 overflow-hidden shadow-[-10px_0_35px_rgba(0,0,0,0.7)] z-10"
              initial={{ x: 0 }}
              exit={{ x: "102%" }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/doors/right-door.webp"
                alt=""
                fill
                priority
                sizes="50vw"
                className="object-cover object-left select-none"
              />
            </motion.div>
          </div>

          {/* TABLET + DESKTOP DOORS (>= md) — lazy: display:none on mobile, never fetched there */}
          <div className="hidden h-full w-full md:flex">
            <motion.div
              className="relative h-full w-1/2 overflow-hidden shadow-[15px_0_45px_rgba(0,0,0,0.75)] z-10"
              initial={{ x: 0 }}
              exit={{ x: "-102%" }}
              transition={{ duration: 2.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/doors/desktop-left-door.webp"
                alt=""
                fill
                loading="lazy"
                sizes="50vw"
                className="object-cover object-right select-none"
              />
            </motion.div>

            <motion.div
              className="relative h-full w-1/2 overflow-hidden shadow-[-15px_0_45px_rgba(0,0,0,0.75)] z-10"
              initial={{ x: 0 }}
              exit={{ x: "102%" }}
              transition={{ duration: 2.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/doors/desktop-right-door.webp"
                alt=""
                fill
                loading="lazy"
                sizes="50vw"
                className="object-cover object-left select-none"
              />
            </motion.div>
          </div>

          {/* Center tap area without intrusive UI button */}
          <div className="absolute inset-0 z-30 cursor-pointer" onClick={onOpen} />
        </div>
      )}
    </AnimatePresence>
  );
}
