import React from 'react';
import GlareHover from './GlareHover.jsx';

export default function Sponsors() {
  const sponsors = [
    {
      name: 'Dr.Cita',
      role: 'Healthcare Innovation Partner',
      link: 'https://drcita.com/',
      hoverClass: 'sponsor-drcita',
      logoSrc: '/drcita-logo.svg',
    },
    {
      name: 'GitHub',
      role: 'Open Source Platform Partner',
      link: 'https://github.com/',
      hoverClass: 'sponsor-github',
      logoSrc: '/github-logo.svg',
    },
  ];

  return (
    <section className="section-wrapper" id="sponsors">
      <div className="section-header">
        <h2 className="section-title">OUR SPONSORS</h2>
      </div>

      <div className="sponsors-grid">
        {sponsors.map((s, idx) => (
          <GlareHover 
            key={idx} 
            borderRadius={20} 
            glareColor={s.name === 'Dr.Cita' ? '#2BB673' : '#FFFFFF'} 
            glareOpacity={1} 
            glareSize={240}
          >
            <a
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`sponsor-glass-card ${s.hoverClass}`}
              title={`Visit ${s.name}`}
              aria-label={`${s.name} – ${s.role}`}
            >
              <div className="sponsor-logo-box">
                <img src={s.logoSrc} alt={s.name} className="sponsor-logo-img" />
              </div>
              <div className="sponsor-role-tag">{s.role}</div>
            </a>
          </GlareHover>
        ))}
      </div>
    </section>
  );
}