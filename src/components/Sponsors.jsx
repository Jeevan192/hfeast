import React from 'react';

export default function Sponsors() {
  const sponsors = [
    {
      name: 'Smart Interviews',
      role: 'Learn • Evolve • Excel',
      link: 'https://smartinterviews.in/',
      hoverClass: 'sponsor-smartinterviews',
    },
    {
      name: 'IDP Education',
      role: 'Global Student Partner',
      link: 'https://www.idp.com/',
      hoverClass: 'sponsor-idp',
    },
    {
      name: 'Nektan',
      role: 'Global Gaming Platform',
      link: 'https://www.nektan.com/',
      hoverClass: 'sponsor-nektan',
    },
    {
      name: 'Skillsoft',
      role: 'Workforce Learning',
      link: 'https://www.skillsoft.com/',
      hoverClass: 'sponsor-skillsoft',
    },
    {
      name: 'Monster Energy',
      role: 'Energy Drink Partner',
      link: 'https://www.monsterenergy.com/',
      hoverClass: 'sponsor-monster',
    },
    {
      name: 'StuMagz',
      role: 'Youth Media Partner',
      link: 'https://www.stumagz.com/',
      hoverClass: 'sponsor-stumagz',
    },
  ];

  return (
    <section className="section-wrapper" id="sponsors">
      <div className="section-header">
        <h2 className="section-title">SPONSORS</h2>
        <p className="section-subtitle">Meet our sponsors</p>
      </div>

      <div className="sponsors-grid">
        {sponsors.map((s, idx) => (
          <a
            key={idx}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`sponsor-glass-card ${s.hoverClass}`}
            title={`Visit ${s.name}`}
          >
            <div className="sponsor-brand-name">{s.name}</div>
            <div className="sponsor-subtitle">{s.role}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
