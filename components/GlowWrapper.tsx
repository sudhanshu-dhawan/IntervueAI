'use client';

import React, { useState } from 'react';

const GlowWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Glow Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,212,255,0.15), transparent 70%)`,
          borderRadius: 'inherit',
        }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowWrapper;
