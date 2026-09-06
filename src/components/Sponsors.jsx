import React from 'react';

// Dr.Cita SVG logo - matching their brand identity (green stethoscope + text)
const DrCitaLogo = () => (
  <svg viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg" width="200" height="75">
    <defs>
      <linearGradient id="drcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2ECC9A" />
        <stop offset="100%" stopColor="#1AAB78" />
      </linearGradient>
    </defs>
    {/* Outer circle */}
    <circle cx="44" cy="45" r="38" fill="none" stroke="url(#drcGrad)" strokeWidth="3.5"/>
    {/* Stethoscope head */}
    <circle cx="44" cy="45" r="12" fill="none" stroke="url(#drcGrad)" strokeWidth="3"/>
    {/* Stethoscope tube */}
    <path d="M56 45 Q70 45 70 32 Q70 20 58 20 Q46 20 46 30" fill="none" stroke="url(#drcGrad)" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Ear tips */}
    <circle cx="46" cy="30" r="3.5" fill="#2ECC9A"/>
    {/* Pulse line inside circle */}
    <path d="M34 45 L38 38 L42 52 L46 40 L50 48 L54 45" fill="none" stroke="#2ECC9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Dr text */}
    <text x="96" y="36" fontFamily="'Outfit', Arial, sans-serif" fontSize="32" fontWeight="900" fill="#2ECC9A">Dr</text>
    {/* dot accent */}
    <circle cx="133" cy="30" r="4" fill="#F5B820"/>
    {/* Cita text */}
    <text x="140" y="36" fontFamily="'Outfit', Arial, sans-serif" fontSize="32" fontWeight="900" fill="#F2F7F5">Cita</text>
    {/* Tagline */}
    <rect x="96" y="46" width="136" height="22" rx="4" fill="#2ECC9A" opacity="0.9"/>
    <text x="104" y="61" fontFamily="'Outfit', Arial, sans-serif" fontSize="10" fontWeight="700" fill="white" letterSpacing="1.5">Click · Consult · Cure</text>
  </svg>
);

// GitHub SVG logo - official style
const GitHubLogo = () => (
  <svg viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg" width="200" height="75">
    {/* GitHub Octocat mark */}
    <g transform="translate(10, 5)">
      <path d="M40 6C23.4 6 10 19.4 10 36C10 49.5 18.5 61 30.7 65.2C32.2 65.5 32.7 64.5 32.7 63.7C32.7 63 32.7 60.7 32.7 57.5C24.4 59.3 22.7 53.8 22.7 53.8C21.3 50.2 19.4 49.2 19.4 49.2C16.8 47.4 19.6 47.5 19.6 47.5C22.5 47.7 24 50.5 24 50.5C26.6 55.1 30.9 53.8 32.9 53C33.2 51.1 33.9 49.8 34.8 49C27.7 48.3 20.2 45.6 20.2 33.8C20.2 30.4 21.4 27.6 23.4 25.5C23.1 24.7 22 21.6 23.7 17.5C23.7 17.5 26.2 16.7 32.7 20.6C35.2 19.9 37.8 19.6 40.4 19.6C42.9 19.6 45.5 19.9 48 20.6C54.5 16.7 57 17.5 57 17.5C58.7 21.6 57.6 24.7 57.3 25.5C59.3 27.6 60.5 30.4 60.5 33.8C60.5 45.7 53 48.2 45.9 48.9C47 49.9 48 51.8 48 54.7C48 59 47.9 62.4 47.9 63.6C47.9 64.5 48.4 65.5 49.9 65.2C62.1 61 70.6 49.5 70.6 36C70.6 19.4 57.2 6 40 6Z" fill="#e8eaea"/>
    </g>
    {/* GitHub wordmark */}
    <text x="92" y="52" fontFamily="'Outfit', Arial, sans-serif" fontSize="36" fontWeight="800" fill="#e8eaea" letterSpacing="-0.5">GitHub</text>
  </svg>
);

export default function Sponsors() {
  const sponsors = [
    {
      name: 'Dr.Cita',
      role: 'Healthcare Innovation Partner',
      link: 'https://drcita.com/',
      hoverClass: 'sponsor-drcita',
      Logo: DrCitaLogo,
    },
    {
      name: 'GitHub',
      role: 'Open Source Platform Partner',
      link: 'https://github.com/',
      hoverClass: 'sponsor-github',
      Logo: GitHubLogo,
    },
  ];

  return (
    <section className="section-wrapper" id="sponsors">
      <div className="section-header">
        <h2 className="section-title">OUR SPONSORS</h2>
        <p className="section-subtitle">Proudly supported by industry leaders who believe in open source</p>
      </div>

      <div className="sponsors-grid">
        {sponsors.map((s, idx) => {
          const Logo = s.Logo;
          return (
            <a
              key={idx}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`sponsor-glass-card ${s.hoverClass}`}
              title={`Visit ${s.name}`}
              aria-label={`${s.name} – ${s.role}`}
            >
              <div className="sponsor-logo-wrap">
                <Logo />
              </div>
              <div className="sponsor-role-tag">{s.role}</div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
