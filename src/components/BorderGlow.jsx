import React, { useState, useRef, useCallback } from 'react';

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor,
  backgroundColor = 'var(--bg-glass)',
  borderRadius = 22,
  glowRadius = 50,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#8BB2DE', '#F5B726', '#E53927'],
  showInnerSpotlight = true,
  style = {},
  ...props
}) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [edgeFactor, setEdgeFactor] = useState(0);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      if (edgeSensitivity > 0) {
        const distLeft = x;
        const distRight = rect.width - x;
        const distTop = y;
        const distBottom = rect.height - y;
        const minDist = Math.min(distLeft, distRight, distTop, distBottom);

        // Clamped factor: higher near borders
        const factor = Math.max(0, Math.min(1, 1 - minDist / (edgeSensitivity * 2)));
        setEdgeFactor(factor);
      } else {
        setEdgeFactor(1);
      }
    },
    [edgeSensitivity]
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -1000, y: -1000 });
    setEdgeFactor(0);
  };

  const gradientColors = '#8BB2DE, #F5B726, #E53927';

  const glowOpacity = isHovered ? Math.min(1, (0.4 + edgeFactor * 0.6) * glowIntensity) : 0;
  const rad = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;

  return (
    <div
      ref={containerRef}
      className={`border-glow-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        borderRadius: rad,
        border: '1px solid rgba(139, 178, 222, 0.3)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.32)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        height: style?.height || undefined,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      {...props}
    >
      {/* Interactive Border Spotlight Layer */}
      <div
        className="border-glow-outline"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1.5px',
          pointerEvents: 'none',
          opacity: glowOpacity,
          transition: isHovered ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
          background: `radial-gradient(${glowRadius * 3}px circle at ${mousePos.x}px ${mousePos.y}px, ${gradientColors}, transparent 75%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          zIndex: 2,
        }}
      />



      {/* Main Content Container */}
      <div
        className="border-glow-content"
        style={{
          position: 'relative',
          background: backgroundColor,
          borderRadius: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
