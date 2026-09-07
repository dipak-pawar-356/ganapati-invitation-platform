"use client";

import Image from "next/image";

type CornerDecorationProps = {
  className?: string;
  size?: number;
  opacity?: number;
};

export default function CornerDecoration({
  className = "",
  size = 32,
  opacity = 0.35,
}: CornerDecorationProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 overflow-hidden select-none ${className}`}>
      {/* Top Left Corner */}
      <div className="absolute top-2 left-2" style={{ width: size, height: size, opacity }}>
        <Image
          src="/images/decorations/corner.png"
          alt=""
          width={size}
          height={size}
          unoptimized
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-2 right-2" style={{ width: size, height: size, opacity }}>
        <Image
          src="/images/decorations/corner.png"
          alt=""
          width={size}
          height={size}
          unoptimized
          className="w-full h-auto object-contain -scale-x-100"
        />
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-2 left-2" style={{ width: size, height: size, opacity }}>
        <Image
          src="/images/decorations/corner.png"
          alt=""
          width={size}
          height={size}
          unoptimized
          className="w-full h-auto object-contain -scale-y-100"
        />
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-2 right-2" style={{ width: size, height: size, opacity }}>
        <Image
          src="/images/decorations/corner.png"
          alt=""
          width={size}
          height={size}
          unoptimized
          className="w-full h-auto object-contain -scale-x-100 -scale-y-100"
        />
      </div>
    </div>
  );
}
