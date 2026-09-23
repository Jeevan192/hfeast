import React, { useEffect, useRef } from 'react';

/**
 * InteractiveBackground
 * 
 * Lighter, 100% Dense Interlocking Geometric Puzzle Mosaic
 * with Dynamic Hover Color Bloom for CBIT HACKTOBERFEST '26.
 * 
 * Key Features:
 * 1. Lighter Background: Clean, airy pine teal canvas (#204f53 base) with
 *    subtle, light-tinted resting puzzle pieces and crisp light seams.
 * 2. Hover Color Reveal: When the cursor or touch moves over an element, its rich
 *    official brand color (Sky Blue #569AE0, Forest Green #3C7E64, Coral Red #BA3627,
 *    Marigold Yellow #F5B62A, Mint #449776, Rose Pink #E97B77, Burgundy #671912, White #FFFFFF)
 *    vibrantly blooms and illuminates with a smooth trailing wake!
 * 3. 100% Zero-Empty-Spaces: All grid cells are completely occupied by interlocking
 *    elements from elements.png that join flush together like puzzle pieces.
 */

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Official Hacktoberfest 2026 Brand Colors
    const BRAND = {
      blue: '#569AE0',      // Sky Blue
      blueSoft: '#8AB1DA',  // Light/Pastel Blue
      green: '#3C7E64',     // Forest/Pine Green
      greenMint: '#449776', // Mint/Emerald Green
      red: '#BA3627',       // Coral/Rust Red
      yellow: '#F5B62A',    // Marigold Gold
      slate: '#3B746E',     // Slate Teal
      white: '#FFFFFF',     // Crisp Pure White
      burgundy: '#671912',  // Burgundy
      pink: '#E97B77',      // Rose Pink
    };

    // Lighter Resting Tones (clean, airy, technical tones in resting state)
    const RESTING = {
      bg: '#204f53',
      bgGrad1: '#245a5f',
      bgGrad2: '#1d484c',
      tile1: '#2b656a',
      tile2: '#327278',
      tile3: '#275a5f',
      tile4: '#387e85',
      rail: '#2e6b71',
    };

    // Pointer state and trailing wake history for smooth color reveals
    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isHovering: false,
      lastMoveTime: 0,
    };

    const trail = [];
    const MAX_TRAIL_AGE = 700; // ms

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const recordPointer = (x, y) => {
      pointer.x = x;
      pointer.y = y;
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.isHovering = true;
      pointer.lastMoveTime = Date.now();

      // Add to trailing wake
      trail.push({ x, y, time: Date.now() });
      if (trail.length > 20) trail.shift();
    };

    const handlePointerMove = (e) => {
      recordPointer(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        recordPointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handlePointerLeave = () => {
      pointer.isHovering = false;
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.targetX = -9999;
      pointer.targetY = -9999;
      trail.length = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    // Calculate hover color intensity (0.0 = resting light tone, 1.0 = full brand color)
    const getHoverIntensity = (cx, cy) => {
      let intensity = 0;

      // 1. Direct cursor proximity (strictly when hovering)
      if (pointer.isHovering && pointer.x > -9000) {
        const dx0 = cx - pointer.x;
        const dy0 = cy - pointer.y;
        const dist0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
        const cursorRadius = width < 768 ? 140 : 190;
        if (dist0 < cursorRadius) {
          intensity = Math.pow(1 - dist0 / cursorRadius, 1.4);
        }
      }

      // 2. Trailing wake from recent mouse movement
      if (trail.length > 0) {
        const now = Date.now();
        for (let i = trail.length - 1; i >= 0; i--) {
          const pt = trail[i];
          const age = now - pt.time;
          if (age > MAX_TRAIL_AGE) continue;
          const life = 1 - age / MAX_TRAIL_AGE;
          const dx = cx - pt.x;
          const dy = cy - pt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const trailRadius = 130;
          if (dist < trailRadius) {
            const factor = Math.pow(1 - dist / trailRadius, 1.5) * life;
            if (factor > intensity) intensity = factor;
          }
        }
      }

      return Math.min(1, Math.max(0, intensity));
    };

    // Helper: stroke puzzle piece seam with clean 1px outline & luminous highlight
    const strokeSeam = (cx, cy, intensity) => {
      // 1px puzzle seam
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(22, 54, 57, 0.9)`;
      ctx.stroke();

      // Delicate luminous edge highlight
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 + intensity * 0.45})`;
      ctx.stroke();
    };

    // =========================================================================
    // DYNAMIC HOVER PUZZLE PRIMITIVES
    // In resting state: light, clean, technical teal
    // On hover: true brand color appears!
    // =========================================================================

    // 1. Solid Block (Fills W x H completely)
    const renderBlock = (x, y, w, h, brandColor, restingTone = RESTING.tile1) => {
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;
      const intensity = getHoverIntensity(cx, cy);

      // Base: Lighter resting tone
      ctx.fillStyle = restingTone;
      ctx.fillRect(x, y, w, h);

      // Hover: Brand color bloom
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = brandColor;
        ctx.fillRect(x, y, w, h);
        ctx.restore();
      }

      ctx.beginPath();
      ctx.rect(x + 0.5, y + 0.5, w - 1, h - 1);
      strokeSeam(cx, cy, intensity);
    };

    // 2. 2-Triangle Split Square (Fills W x H completely)
    const renderSplitSquare = (x, y, w, h, c1, c2, flip = false) => {
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;
      const intensity = getHoverIntensity(cx, cy);

      // Triangle 1
      ctx.fillStyle = RESTING.tile2;
      ctx.beginPath();
      if (!flip) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x, y + h);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + h);
      }
      ctx.closePath();
      ctx.fill();

      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = c1;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x + w * 0.3, y + h * 0.3, intensity);

      // Triangle 2
      ctx.fillStyle = RESTING.tile3;
      ctx.beginPath();
      if (!flip) {
        ctx.moveTo(x + w, y + h);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x, y + h);
      } else {
        ctx.moveTo(x, y + h);
        ctx.lineTo(x, y);
        ctx.lineTo(x + w, y + h);
      }
      ctx.closePath();
      ctx.fill();

      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = c2;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x + w * 0.7, y + h * 0.7, intensity);
    };

    // 3. 3-Step Staircase Pair (3U x 3U block filled 100% with NO gap)
    const renderStaircasePair = (x, y, u, cA = BRAND.green, cB = BRAND.blueSoft, flip = false) => {
      const w = u * 3;
      const h = u * 3;
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;
      const intensity = getHoverIntensity(cx, cy);

      ctx.save();
      ctx.translate(x, y);
      if (flip) {
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
      }

      // Piece A: Staircase (heights 1, 2, 3)
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h - u * 1);
      ctx.lineTo(u * 1, h - u * 1);
      ctx.lineTo(u * 1, h - u * 2);
      ctx.lineTo(u * 2, h - u * 2);
      ctx.lineTo(u * 2, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.closePath();

      ctx.fillStyle = RESTING.tile1;
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = cA;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(cx, cy, intensity);

      // Piece B: Complementary stepped piece (heights 2, 1, 0)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(u * 2, 0);
      ctx.lineTo(u * 2, h - u * 2);
      ctx.lineTo(u * 1, h - u * 2);
      ctx.lineTo(u * 1, h - u * 1);
      ctx.lineTo(0, h - u * 1);
      ctx.closePath();

      ctx.fillStyle = RESTING.tile2;
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = cB;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(cx, cy, intensity);

      ctx.restore();
    };

    // 4. Thick L-Shape + Slotted Tangram Square (3U x 3U block filled 100%)
    const renderLAndSquare = (x, y, u, cL = BRAND.blue, cT1 = BRAND.pink, cT2 = BRAND.burgundy, rot = 0) => {
      const w = u * 3;
      const h = u * 3;
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;
      const intensity = getHoverIntensity(cx, cy);

      ctx.save();
      ctx.translate(x + w * 0.5, y + h * 0.5);
      ctx.rotate((rot * Math.PI) / 2);
      ctx.translate(-w * 0.5, -h * 0.5);

      // Piece A: Thick L-Shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(u, 0);
      ctx.lineTo(u, u * 2);
      ctx.lineTo(w, u * 2);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      ctx.fillStyle = RESTING.tile3;
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = cL;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(cx, cy, intensity);

      // Piece B: Slotted 2U x 2U Split Square (rendered directly with block intensity)
      // Triangle 1
      ctx.fillStyle = RESTING.tile2;
      ctx.beginPath();
      ctx.moveTo(u, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(u, u * 2);
      ctx.closePath();
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = cT1;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(cx, cy, intensity);

      // Triangle 2
      ctx.fillStyle = RESTING.tile1;
      ctx.beginPath();
      ctx.moveTo(w, u * 2);
      ctx.lineTo(w, 0);
      ctx.lineTo(u, u * 2);
      ctx.closePath();
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = cT2;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(cx, cy, intensity);

      ctx.restore();
    };

    // 5. Tangram Quad-Dissection (4U x 4U square filled 100%)
    const renderTangramQuad = (x, y, size) => {
      const cx = x + size * 0.5;
      const cy = y + size * 0.5;
      const intensity = getHoverIntensity(cx, cy);

      // Triangle 1: Upper-Right
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size, y + size);
      ctx.closePath();
      ctx.fillStyle = RESTING.tile1;
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = BRAND.blue;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x + size * 0.7, y + size * 0.3, intensity);

      // Triangle 2: Center
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.fillStyle = RESTING.tile2;
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = BRAND.yellow;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x + size * 0.3, y + size * 0.7, intensity);

      // Triangle 3: Bottom-Left
      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.6);
      ctx.lineTo(x + size * 0.4, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.fillStyle = RESTING.tile4;
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = BRAND.pink;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x + size * 0.15, y + size * 0.85, intensity);

      // Triangle 4: Bottom-Right
      ctx.beginPath();
      ctx.moveTo(x + size * 0.65, y + size);
      ctx.lineTo(x + size, y + size * 0.65);
      ctx.lineTo(x + size, y + size);
      ctx.closePath();
      ctx.fillStyle = RESTING.tile3;
      ctx.fill();
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = BRAND.burgundy;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x + size * 0.85, y + size * 0.85, intensity);
    };

    // 6. Inverted Stepped Arch with Slotted Barcode (4U x 4U block filled 100%)
    const renderArchAndBarcode = (x, y, u) => {
      const archW = u * 4;
      const archH = u * 4;
      const legW = u * 1;
      const cx = x + archW * 0.5;
      const cy = y + archH * 0.5;
      const intensity = getHoverIntensity(cx, cy);

      // Inner Slotted Barcode & Backing
      const innerX = x + legW;
      const innerW = archW - legW * 2;
      ctx.fillStyle = RESTING.tile3;
      ctx.fillRect(innerX, y, innerW, archH);
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = BRAND.slate;
        ctx.fillRect(innerX, y, innerW, archH);
        ctx.restore();
      }

      const barW = innerW / 4;
      for (let i = 0; i < 4; i++) {
        renderBlock(innerX + i * barW, y + u * 0.4, barW, archH - u * 0.4, i % 2 === 0 ? BRAND.yellow : BRAND.red, RESTING.tile4);
      }

      // Outer Arch: Red top & Pink base
      ctx.fillStyle = RESTING.tile1;
      ctx.fillRect(x, y, legW, archH * 0.65);
      ctx.fillRect(x + archW - legW, y, legW, archH * 0.65);
      ctx.fillRect(x, y, archW, u * 0.8);
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = BRAND.red;
        ctx.fillRect(x, y, legW, archH * 0.65);
        ctx.fillRect(x + archW - legW, y, legW, archH * 0.65);
        ctx.fillRect(x, y, archW, u * 0.8);
        ctx.restore();
      }
      strokeSeam(x + legW * 0.5, y + archH * 0.3, intensity);

      ctx.fillStyle = RESTING.tile2;
      ctx.fillRect(x, y + archH * 0.65, legW, archH * 0.35);
      ctx.fillRect(x + archW - legW, y + archH * 0.65, legW, archH * 0.35);
      if (intensity > 0.01) {
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.fillStyle = BRAND.pink;
        ctx.fillRect(x, y + archH * 0.65, legW, archH * 0.35);
        ctx.fillRect(x + archW - legW, y + archH * 0.65, legW, archH * 0.35);
        ctx.restore();
      }
      strokeSeam(x + legW * 0.5, y + archH * 0.8, intensity);
    };

    // 7. Bauhaus '026' Master Group (10U x 4U block filled 100%)
    const renderBauhaus026 = (x, y, u) => {
      const gH = u * 4;
      const w0 = u * 3.2;
      const w2 = u * 3.4;
      const w6 = u * 3.4;

      // --- GLYPH '0' ---
      const x0 = x;
      renderBlock(x0, y, w0 * 0.32, gH, BRAND.red, RESTING.tile1);

      const cx0 = x0 + w0 * 0.5;
      const cy0 = y + gH * 0.5;
      const int0 = getHoverIntensity(cx0, cy0);

      // Yellow top triangle
      ctx.beginPath();
      ctx.moveTo(x0 + w0 * 0.32, y);
      ctx.lineTo(x0 + w0 * 0.72, y);
      ctx.lineTo(x0 + w0 * 0.72, y + gH * 0.65);
      ctx.closePath();
      ctx.fillStyle = RESTING.tile2;
      ctx.fill();
      if (int0 > 0.01) {
        ctx.save();
        ctx.globalAlpha = int0;
        ctx.fillStyle = BRAND.yellow;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x0 + w0 * 0.5, y + gH * 0.3, int0);

      // Pink bottom triangle
      ctx.beginPath();
      ctx.moveTo(x0 + w0 * 0.32, y);
      ctx.lineTo(x0 + w0 * 0.72, y + gH * 0.65);
      ctx.lineTo(x0 + w0 * 0.72, y + gH);
      ctx.lineTo(x0 + w0 * 0.32, y + gH);
      ctx.closePath();
      ctx.fillStyle = RESTING.tile3;
      ctx.fill();
      if (int0 > 0.01) {
        ctx.save();
        ctx.globalAlpha = int0;
        ctx.fillStyle = BRAND.pink;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x0 + w0 * 0.5, y + gH * 0.75, int0);

      renderBlock(x0 + w0 * 0.72, y, w0 * 0.28, gH, BRAND.blue, RESTING.tile4);

      // --- GLYPH '2' ---
      const x2 = x0 + w0;
      const cx2 = x2 + w2 * 0.5;
      const cy2 = y + gH * 0.5;
      const int2 = getHoverIntensity(cx2, cy2);

      renderBlock(x2, y, w2, gH * 0.28, BRAND.blue, RESTING.tile1);
      renderBlock(x2 + w2 * 0.7, y + gH * 0.28, w2 * 0.3, gH * 0.32, BRAND.blue, RESTING.tile2);
      renderBlock(x2 + w2 * 0.35, y + gH * 0.32, w2 * 0.35, gH * 0.38, BRAND.yellow, RESTING.tile3);
      renderBlock(x2, y + gH * 0.7, w2, gH * 0.3, BRAND.yellow, RESTING.tile4);
      renderBlock(x2, y + gH * 0.28, w2 * 0.35, gH * 0.42, BRAND.blueSoft, RESTING.tile2);

      ctx.beginPath();
      ctx.moveTo(x2 + w2 * 0.55, y + gH);
      ctx.lineTo(x2 + w2, y + gH * 0.55);
      ctx.lineTo(x2 + w2, y + gH);
      ctx.closePath();
      ctx.fillStyle = RESTING.tile1;
      ctx.fill();
      if (int2 > 0.01) {
        ctx.save();
        ctx.globalAlpha = int2;
        ctx.fillStyle = BRAND.burgundy;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x2 + w2 * 0.8, y + gH * 0.8, int2);

      // --- GLYPH '6' ---
      const x6 = x2 + w2;
      const cx6 = x6 + w6 * 0.5;
      const cy6 = y + gH * 0.5;
      const int6 = getHoverIntensity(cx6, cy6);

      renderBlock(x6, y, w6, gH * 0.28, BRAND.blue, RESTING.tile1);
      renderSplitSquare(x6, y + gH * 0.28, w6 * 0.7, gH * 0.42, BRAND.pink, BRAND.burgundy);
      renderBlock(x6 + w6 * 0.7, y + gH * 0.28, w6 * 0.3, gH * 0.42, BRAND.slate, RESTING.tile3);

      ctx.beginPath();
      ctx.moveTo(x6, y + gH * 0.7);
      ctx.lineTo(x6 + w6 * 0.65, y + gH * 0.7);
      ctx.lineTo(x6, y + gH);
      ctx.closePath();
      ctx.fillStyle = RESTING.tile2;
      ctx.fill();
      if (int6 > 0.01) {
        ctx.save();
        ctx.globalAlpha = int6;
        ctx.fillStyle = BRAND.yellow;
        ctx.fill();
        ctx.restore();
      }
      strokeSeam(x6 + w6 * 0.3, y + gH * 0.85, int6);

      renderBlock(x6 + w6 * 0.65, y + gH * 0.7, w6 * 0.35, gH * 0.3, BRAND.red, RESTING.tile4);
    };

    // 8. Continuous 4-Color Rail (W x H)
    const renderPuzzleRail = (x, y, w, h) => {
      const segW = w / 4;
      renderBlock(x, y, segW, h, BRAND.red, RESTING.rail);
      renderBlock(x + segW, y, segW, h, BRAND.yellow, RESTING.rail);
      renderBlock(x + segW * 2, y, segW, h, BRAND.blue, RESTING.rail);
      renderBlock(x + segW * 3, y, segW, h, BRAND.greenMint, RESTING.rail);
    };

    // 9. Segmented Ribbon (1U x 4U)
    const renderSegmentedRibbon = (x, y, w, h) => {
      const segH = h / 4;
      renderBlock(x, y, w, segH, BRAND.blue, RESTING.tile1);
      renderBlock(x, y + segH, w, segH, BRAND.red, RESTING.tile2);
      renderBlock(x, y + segH * 2, w, segH, BRAND.yellow, RESTING.tile3);
      renderBlock(x, y + segH * 3, w, segH, BRAND.pink, RESTING.tile4);
    };

    // 10. Column of 4 White Squares (1U x 4U)
    const renderSquareColumn = (x, y, w, h) => {
      const s = h / 4;
      for (let i = 0; i < 4; i++) {
        renderBlock(x, y + i * s, w, s, BRAND.white, RESTING.tile2);
      }
    };

    // 11. Dual-Stripe Bar (1U x 4U)
    const renderDualStripe = (x, y, w, h) => {
      const colW = w / 2;
      renderBlock(x, y, colW, h, BRAND.red, RESTING.tile1);
      renderBlock(x + colW, y, colW, h, BRAND.yellow, RESTING.tile3);
    };

    // 12. Micro-Pixel Band (W x H)
    const renderMicroPixelBand = (x, y, w, h, cols = 8) => {
      const cellW = w / cols;
      const palette = [BRAND.white, BRAND.blue, BRAND.yellow, BRAND.greenMint, BRAND.red];
      for (let i = 0; i < cols; i++) {
        renderBlock(x + i * cellW, y, cellW, h, palette[i % palette.length], i % 2 === 0 ? RESTING.tile2 : RESTING.tile3);
      }
    };

    // 13. Curled Hook Block (3U x 1U)
    const renderCurledHook = (x, y, w, h) => {
      renderBlock(x, y, w * 0.75, h, BRAND.burgundy, RESTING.tile1);
      renderBlock(x + w * 0.75, y, w * 0.25, h, BRAND.yellow, RESTING.tile2);
    };

    // =========================================================================
    // 100% DENSE MACRO-TILES (A & B)
    // =========================================================================

    const renderDenseTileA = (ox, oy, u) => {
      // Row 0: Rail
      renderPuzzleRail(ox, oy, u * 16, u);

      // Rows 1-4:
      // Left 3U x 4U
      renderLAndSquare(ox, oy + u * 1, u, BRAND.blue, BRAND.pink, BRAND.burgundy, 0);
      renderBlock(ox, oy + u * 4, u, u, BRAND.yellow, RESTING.tile1);
      renderBlock(ox + u, oy + u * 4, u, u, BRAND.red, RESTING.tile2);
      renderBlock(ox + u * 2, oy + u * 4, u, u, BRAND.greenMint, RESTING.tile3);

      // Center 10U x 4U
      renderBauhaus026(ox + u * 3, oy + u * 1, u);

      // Right 3U x 4U
      renderStaircasePair(ox + u * 13, oy + u * 1, u, BRAND.green, BRAND.blueSoft, false);
      renderMicroPixelBand(ox + u * 13, oy + u * 4, u * 3, u, 6);

      // Row 5: Rail
      renderPuzzleRail(ox, oy + u * 5, u * 16, u);

      // Rows 6-9:
      // Col 0-3 (4U x 4U)
      renderTangramQuad(ox, oy + u * 6, u * 4);

      // Col 4-7 (4U x 4U)
      renderArchAndBarcode(ox + u * 4, oy + u * 6, u);

      // Col 8-10 (3U x 4U)
      renderStaircasePair(ox + u * 8, oy + u * 6, u, BRAND.blue, BRAND.greenMint, true);
      renderDualStripe(ox + u * 8, oy + u * 9, u * 1.5, u);
      renderBlock(ox + u * 9.5, oy + u * 9, u * 1.5, u, BRAND.red, RESTING.tile1);

      // Col 11-12 (2U x 4U)
      renderSegmentedRibbon(ox + u * 11, oy + u * 6, u, u * 4);
      renderSquareColumn(ox + u * 12, oy + u * 6, u, u * 4);

      // Col 13-15 (3U x 4U)
      renderLAndSquare(ox + u * 13, oy + u * 6, u, BRAND.greenMint, BRAND.yellow, BRAND.red, 2);
      renderCurledHook(ox + u * 13, oy + u * 9, u * 3, u);
    };

    const renderDenseTileB = (ox, oy, u) => {
      // Row 0: Rail
      renderPuzzleRail(ox, oy, u * 16, u);

      // Rows 1-4:
      // Col 0-3 (4U x 4U)
      renderArchAndBarcode(ox, oy + u * 1, u);

      // Col 4-6 (3U x 4U)
      renderStaircasePair(ox + u * 4, oy + u * 1, u, BRAND.green, BRAND.blueSoft, false);
      renderBlock(ox + u * 4, oy + u * 4, u, u, BRAND.red, RESTING.tile1);
      renderBlock(ox + u * 5, oy + u * 4, u, u, BRAND.yellow, RESTING.tile2);
      renderBlock(ox + u * 6, oy + u * 4, u, u, BRAND.blue, RESTING.tile3);

      // Col 7-8 (2U x 4U)
      renderSegmentedRibbon(ox + u * 7, oy + u * 1, u, u * 4);
      renderSquareColumn(ox + u * 8, oy + u * 1, u, u * 4);

      // Col 9-12 (4U x 4U)
      renderTangramQuad(ox + u * 9, oy + u * 1, u * 4);

      // Col 13-15 (3U x 4U)
      renderLAndSquare(ox + u * 13, oy + u * 1, u, BRAND.blue, BRAND.pink, BRAND.burgundy, 1);
      renderMicroPixelBand(ox + u * 13, oy + u * 4, u * 3, u, 6);

      // Row 5: Rail
      renderPuzzleRail(ox, oy + u * 5, u * 16, u);

      // Rows 6-9:
      // Col 0-2 (3U x 4U)
      renderLAndSquare(ox, oy + u * 6, u, BRAND.greenMint, BRAND.yellow, BRAND.red, 3);
      renderCurledHook(ox, oy + u * 9, u * 3, u);

      // Col 3-12 (10U x 4U)
      renderBauhaus026(ox + u * 3, oy + u * 6, u);

      // Col 13-15 (3U x 4U)
      renderStaircasePair(ox + u * 13, oy + u * 6, u, BRAND.blue, BRAND.greenMint, true);
      renderDualStripe(ox + u * 13, oy + u * 9, u * 1.5, u);
      renderBlock(ox + u * 14.5, oy + u * 9, u * 1.5, u, BRAND.yellow, RESTING.tile2);
    };

    // =========================================================================
    // MAIN RENDER LOOP
    // =========================================================================

    let startTime = performance.now();

    const draw = (time) => {
      const elapsed = time - startTime;

      // Pointer smooth tracking (only when actively hovering)
      if (pointer.isHovering && pointer.targetX > -9000) {
        pointer.x += (pointer.targetX - pointer.x) * 0.25;
        pointer.y += (pointer.targetY - pointer.y) * 0.25;
      } else {
        pointer.x = -9999;
        pointer.y = -9999;
      }

      // 1. Lighter base background fill with soft ambient gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, RESTING.bgGrad1);
      bgGrad.addColorStop(0.5, RESTING.bg);
      bgGrad.addColorStop(1, RESTING.bgGrad2);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Dynamic unit U for responsive scaling
      const u = width < 768 ? 16 : width < 1280 ? 22 : 26;

      const tileW = u * 16;
      const tileH = u * 10;

      const cols = Math.ceil(width / tileW) + 1;
      const rows = Math.ceil(height / tileH) + 1;

      // 2. Render 100% dense interlocking puzzle pieces
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * tileW;
          const oy = r * tileH;
          if ((c + r) % 2 === 0) {
            renderDenseTileA(ox, oy, u);
          } else {
            renderDenseTileB(ox, oy, u);
          }
        }
      }

      // 3. Subtle luminous cursor aura (strictly where cursor actually is)
      if (pointer.isHovering && pointer.x > -9000) {
        const spotGrad = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          width < 768 ? 160 : 220
        );
        spotGrad.addColorStop(0, 'rgba(86, 154, 224, 0.12)');
        spotGrad.addColorStop(0.4, 'rgba(245, 182, 42, 0.05)');
        spotGrad.addColorStop(1, 'rgba(32, 79, 83, 0)');
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, width, height);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        startTime = performance.now();
        animId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="app-background" aria-hidden="true">
      <canvas ref={canvasRef} className="app-background-canvas" />
    </div>
  );
}
