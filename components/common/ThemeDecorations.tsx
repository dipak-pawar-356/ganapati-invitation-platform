"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function RoyalGoldDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
      {/* Royal Gold Ambient Radial Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-400/15 to-transparent blur-3xl" />
    </div>
  );
}

export function PeshwaiDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
      {/* Traditional Ornate Corner Motifs */}
      <div className="absolute top-4 left-4 w-7 sm:w-10 h-7 sm:h-10 opacity-60">
        <Image src="/images/decorations/corner.png" alt="" width={40} height={40} unoptimized style={{ height: "auto" }} className="w-full h-auto" />
      </div>
      <div className="absolute top-4 right-4 w-7 sm:w-10 h-7 sm:h-10 opacity-60">
        <Image src="/images/decorations/corner.png" alt="" width={40} height={40} unoptimized style={{ height: "auto" }} className="w-full h-auto -scale-x-100" />
      </div>
    </div>
  );
}

export function ModernSaffronDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
      {/* Floating Orange Blur Orbs */}
      <motion.div
        className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-96 right-1/4 h-80 w-80 rounded-full bg-gradient-to-l from-orange-600/15 via-red-500/10 to-transparent blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

export function NightDarshanDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
      {/* Temple Silhouette at Bottom */}
      <div className="absolute bottom-0 inset-x-0 w-full opacity-25 mix-blend-screen pointer-events-none">
        <Image
          src="/images/temple/मंदिराचा फिका silhouette.png"
          alt=""
          width={1400}
          height={300}
          unoptimized
          style={{ height: "auto" }}
          className="w-full h-auto object-cover object-bottom"
        />
      </div>

      {/* Falling Flower Petals Overlay */}
      <motion.div
        className="absolute top-10 left-1/3 w-8 opacity-70"
        animate={{ y: [0, 400], x: [-10, 20], rotate: [0, 180] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <Image src="/images/petals/petals.png" alt="" width={32} height={32} unoptimized style={{ height: "auto" }} className="w-full h-auto" />
      </motion.div>

      <motion.div
        className="absolute top-20 right-1/3 w-8 opacity-70"
        animate={{ y: [0, 450], x: [10, -20], rotate: [0, -180] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 3 }}
      >
        <Image src="/images/petals/petals.png" alt="" width={32} height={32} unoptimized style={{ height: "auto" }} className="w-full h-auto" />
      </motion.div>
    </div>
  );
}
