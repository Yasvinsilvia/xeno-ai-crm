'use client';

import { useEffect, useRef, useState } from 'react';

export default function BackgroundAurora() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPoints((prevPoints) => {
        // Keep the last 25 positions to create the trailing ribbon length
        const newPoints = [...prevPoints, { x: e.clientX, y: e.clientY }];
        if (newPoints.length > 25) newPoints.shift();
        return newPoints;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Slowly shrink the trail when the mouse stops moving
    const shrinkTrail = () => {
      setPoints((prev) => (prev.length > 0 ? prev.slice(1) : []));
      requestRef.current = requestAnimationFrame(shrinkTrail);
    };
    requestRef.current = requestAnimationFrame(shrinkTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Create a smooth SVG path from the points
  const pathData = points.length > 0 
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` 
    : '';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      {/* Subtle background glow so it's not completely pitch black */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,20,30,1)_0%,rgba(0,0,0,1)_100%)]" />

      {/* The Wavy Sketch SVG Overlay */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {/* The "Rainbow" Gradient */}
          <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />   {/* Blue */}
            <stop offset="33%" stopColor="#8b5cf6" />  {/* Purple */}
            <stop offset="66%" stopColor="#ec4899" />  {/* Pink */}
            <stop offset="100%" stopColor="#10b981" /> {/* Emerald */}
          </linearGradient>

          {/* The "Sketch/Wavy" Filter using SVG Math */}
          <filter id="sketchy" x="-20%" y="-20%" width="140%" height="140%">
            {/* Creates a turbulent noise pattern */}
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            {/* Displaces the stroke using the noise to make it wavy and hand-drawn */}
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* The Trailing Line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#rainbowGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#sketchy)"
          className="transition-all duration-75 ease-out opacity-80"
        />
      </svg>
    </div>
  );
}