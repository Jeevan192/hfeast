import React, { useState, useRef, useCallback, useEffect } from 'react';

export default function SpecularButton({
  children,
  size = 'md',
  radius = 14,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#FFFFFF',
  lineColor = '#ffffff',
  baseColor = 'var(--hf-red)',
  glowColor,
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1.5,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  onClick,
  className = '',
  style = {},
  disabled = false,
  as = 'button',
  href,
  ...props
}) {
  const btnRef = useRef(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!btnRef.current || !followMouse) return;
    const rect = btnRef.current.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const distX = e.clientX - btnCenterX;
    const distY = e.clientY - btnCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance <= proximity) {
      setIsNear(true);
      const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setCoords({ x: xPct, y: yPct });
    } else {
      setIsNear(false);
    }
  }, [followMouse, proximity]);

  useEffect(() => {
    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [followMouse, handleMouseMove]);

  // Size variations
  const sizeStyles = {
    sm: { padding: '0.45rem 1rem', fontSize: '0.85rem' },
    md: { padding: '0.75rem 1.6rem', fontSize: '0.95rem' },
    lg: { padding: '0.95rem 2.2rem', fontSize: '1.05rem', fontWeight: 700 },
  }[size] || { padding: '0.75rem 1.6rem', fontSize: '0.95rem' };

  const Component = as === 'a' ? 'a' : 'button';
  const buttonProps = as === 'a' ? { href } : { type: 'button' };

  const specularOpacity = isHovered ? intensity : isNear ? intensity * 0.7 : intensity * 0.35;

  const isRedButton = baseColor === 'var(--hf-red)' || baseColor === '#E53927';
  const defaultGlow = isRedButton 
    ? 'rgba(229, 57, 39, 0.45)' 
    : 'rgba(139, 178, 222, 0.28)';
  const activeGlow = glowColor || defaultGlow;

  return (
    <Component
      ref={btnRef}
      className={`specular-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        background: baseColor,
        color: textColor,
        borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
        border: `${thickness}px solid rgba(255, 255, 255, 0.12)`,
        textDecoration: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-main)',
        fontWeight: 600,
        overflow: 'hidden',
        boxShadow: isHovered
          ? `0 6px 24px ${activeGlow}, 0 0 0 1px rgba(255, 255, 255, 0.2)`
          : `0 4px 16px rgba(0, 0, 0, 0.35)`,
        transition: `all ${speed}s cubic-bezier(0.16, 1, 0.3, 1)`,
        transform: isHovered ? 'translateY(-2px)' : 'none',
        backdropFilter: blur ? `blur(${blur}px)` : undefined,
        ...sizeStyles,
        ...style,
      }}
      {...buttonProps}
      {...props}
    >
      {/* Specular Perimeter Beam Highlight */}
      <span
        style={{
          position: 'absolute',
          inset: `-${thickness}px`,
          borderRadius: 'inherit',
          padding: `${thickness + 1}px`,
          pointerEvents: 'none',
          opacity: specularOpacity,
          transition: `opacity ${speed}s ease`,
          background: `radial-gradient(${shineFade * 3}px circle at ${coords.x}% ${coords.y}%, ${lineColor} 0%, rgba(255, 255, 255, 0.1) ${shineSize * 3}%, transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          zIndex: 2,
        }}
      />

      {/* Top Glass Bevel Glaze */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Inner Hover Radial Glow */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: isHovered ? 0.2 : 0,
          transition: `opacity ${speed}s ease`,
          background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, ${tint}, transparent 60%)`,
          zIndex: 1,
        }}
      />

      {/* Button Content */}
      <span style={{ position: 'relative', zIndex: 3, display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
        {children}
      </span>
    </Component>
  );
}
