"use client";

import Image from "next/image";

type SectionDividerProps = {
  className?: string;
  showPetals?: boolean;
  showCenterIcon?: boolean;
};

export default function SectionDivider({
  className = "",
}: SectionDividerProps) {
  return (
    <div className={`relative z-20 w-full py-6 flex items-center justify-center pointer-events-none select-none ${className}`}>
      <div className="flex items-center justify-center w-full max-w-4xl px-4 gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e8a93b]/60 to-[#e8a93b]" />
        <span className="text-[#f3d089] text-xs font-bold tracking-widest uppercase opacity-80">
          ❖
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-[#e8a93b] via-[#e8a93b]/60 to-transparent" />
      </div>
    </div>
  );
}
