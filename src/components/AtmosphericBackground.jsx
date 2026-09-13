import React from 'react';

export default function AtmosphericBackground() {
  return (
    <div className="app-background" aria-hidden="true">
      {/* Dynamic ambient color auroras */}
      <div className="bg-aurora aurora-blue"></div>
      <div className="bg-aurora aurora-red"></div>
      <div className="bg-aurora aurora-yellow"></div>
      <div className="bg-aurora aurora-coral"></div>

      {/* Cybernetic dot grid mesh */}
      <div className="bg-grid-mesh"></div>

      {/* Official Hacktoberfest 2026 Geometric Pixel Art Motifs */}
      <div className="bg-pixel-decorations">
        {/* Top-Left: Diagonal 4-step white/blue pixel staircase */}
        <svg className="bg-motif motif-top-left" width="160" height="160" viewBox="0 0 160 160" fill="none">
          <rect x="20" y="110" width="22" height="22" fill="#FFFFFF" opacity="0.3" rx="2" />
          <rect x="42" y="88"  width="22" height="22" fill="#FFFFFF" opacity="0.35" rx="2" />
          <rect x="64" y="66"  width="22" height="22" fill="#8BB2DE" opacity="0.4" rx="2" />
          <rect x="86" y="44"  width="22" height="22" fill="#8BB2DE" opacity="0.45" rx="2" />
          <rect x="108" y="22" width="22" height="22" fill="#FFFFFF" opacity="0.3" rx="2" />
        </svg>

        {/* Top-Right: Hacktoberfest Vermilion & Yellow pixel cluster */}
        <svg className="bg-motif motif-top-right" width="180" height="180" viewBox="0 0 180 180" fill="none">
          <rect x="120" y="20" width="20" height="20" fill="#F5B726" opacity="0.35" rx="2" />
          <rect x="100" y="40" width="20" height="20" fill="#F5B726" opacity="0.35" rx="2" />
          <rect x="80"  y="60" width="20" height="20" fill="#E53927" opacity="0.4" rx="2" />
          <rect x="40" y="50" width="12" height="50" fill="#E53927" opacity="0.3" rx="2" />
          <rect x="56" y="30" width="12" height="70" fill="#E97B77" opacity="0.35" rx="2" />
          <rect x="72" y="70" width="12" height="30" fill="#E53927" opacity="0.3" rx="2" />
        </svg>

        {/* Middle-Left: Equalizer Pixel Bars */}
        <svg className="bg-motif motif-mid-left" width="120" height="180" viewBox="0 0 120 180" fill="none">
          <rect x="10" y="40" width="14" height="90" fill="#E53927" opacity="0.25" rx="2" />
          <rect x="30" y="15" width="14" height="115" fill="#E97B77" opacity="0.3" rx="2" />
          <rect x="50" y="60" width="14" height="70" fill="#F5B726" opacity="0.3" rx="2" />
          <rect x="70" y="30" width="14" height="100" fill="#8BB2DE" opacity="0.25" rx="2" />
        </svg>

        {/* Middle-Right: Bauhaus Geometric bracket motif */}
        <svg className="bg-motif motif-mid-right" width="160" height="160" viewBox="0 0 160 160" fill="none">
          <rect x="40" y="30" width="24" height="24" fill="#8BB2DE" opacity="0.3" rx="2" />
          <rect x="64" y="30" width="24" height="24" fill="#671912" opacity="0.35" rx="2" />
          <rect x="88" y="30" width="24" height="24" fill="#F5B726" opacity="0.35" rx="2" />
          <rect x="88" y="54" width="24" height="24" fill="#E53927" opacity="0.3" rx="2" />
          <rect x="88" y="78" width="24" height="24" fill="#E97B77" opacity="0.35" rx="2" />
        </svg>

        {/* Bottom-Left: Diagonal Yellow/Blue pixel stairs */}
        <svg className="bg-motif motif-bottom-left" width="180" height="180" viewBox="0 0 180 180" fill="none">
          <rect x="20" y="30" width="22" height="22" fill="#F5B726" opacity="0.3" rx="2" />
          <rect x="42" y="52" width="22" height="22" fill="#F5B726" opacity="0.35" rx="2" />
          <rect x="64" y="74" width="22" height="22" fill="#8BB2DE" opacity="0.35" rx="2" />
          <rect x="86" y="96" width="22" height="22" fill="#8BB2DE" opacity="0.3" rx="2" />
          <path d="M120 120 L150 120 L150 150" stroke="#E97B77" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
        </svg>

        {/* Bottom-Right: Corner Pixel Bracket */}
        <svg className="bg-motif motif-bottom-right" width="160" height="160" viewBox="0 0 160 160" fill="none">
          <path d="M50 30 L20 30 L20 60" stroke="#8BB2DE" strokeWidth="4" opacity="0.3" strokeLinecap="square" />
          <rect x="60" y="50" width="20" height="20" fill="#E53927" opacity="0.3" rx="2" />
          <rect x="80" y="70" width="20" height="20" fill="#F5B726" opacity="0.3" rx="2" />
          <rect x="100" y="90" width="20" height="20" fill="#FFFFFF" opacity="0.25" rx="2" />
        </svg>
      </div>

      {/* Atmospheric Vignette overlay for depth */}
      <div className="bg-vignette"></div>
    </div>
  );
}
