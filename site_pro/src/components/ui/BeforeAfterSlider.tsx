import React, { useState, useRef, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.buttons !== 1) return;
    updatePosition(e.clientX);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    // Capture pointer so dragging works outside the element bounds
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video overflow-hidden rounded-lg select-none touch-none bg-sayso-yellow/5 ${className}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      style={{ cursor: "ew-resize" }}
    >
      {/* After image (background) */}
      <img
        src={afterImage}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Before image (foreground masked) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-md flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
            <div className="w-0.5 h-3 bg-gray-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-2 px-2 py-1 text-[10px] font-bold tracking-wider text-white bg-black/50 rounded pointer-events-none uppercase backdrop-blur-sm">
        Before
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-1 text-[10px] font-bold tracking-wider text-white bg-black/50 rounded pointer-events-none uppercase backdrop-blur-sm">
        After
      </div>
    </div>
  );
}
