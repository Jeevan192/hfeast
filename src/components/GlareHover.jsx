import React, { useState, useRef, useCallback } from 'react';

export default function GlareHover({
  children,
  glareColor = '#8BB2DE',
  glareOpacity = 0.85,
  glareSize = 200,
  transitionDuration = 400,
  playOnce = false,
  borderRadius = 16,
  className = '',
  style = {},
  ...props
}) {
  const containerRef = useRef(null);
  const [glarePos, setGlarePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlarePos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setGlarePos({ x: -1000, y: -1000 });
  }, []);

  const rad = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  return (
    <div
      ref={containerRef}
      className={`glare-hover-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: rad,
        ...style,
      }}
      {...props}
    >
      {/* Pure Border-Only Highlight Layer — Interior is 100% masked out, ZERO inner blob */}
      <div
        className="glare-border-highlight"
        style={{
          position: 'absolute',
          inset: 0,
          padding: '1.5px',
          borderRadius: rad,
          pointerEvents: 'none',
          zIndex: 5,
          opacity: isHovered ? glareOpacity : 0,
          transition: isHovered ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
          background: `radial-gradient(circle ${glareSize}px at ${glarePos.x}px ${glarePos.y}px, ${glareColor}, rgba(255,255,255,0.4) 35%, transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Child Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: rad,
        }}
      >
        {children}
      </div>
    </div>
  );
}
