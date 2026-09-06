import React from 'react';

export default function ThemeSection() {
  const tracks = [
    { title: 'AI for Accessibility & Inclusion', desc: 'Assistive tools, vernacular language AI, speech & screen adaptations.' },
    { title: 'Healthcare & Public Wellness', desc: 'Predictive health monitors, telemedicine assistants, and clinical workflow tools.' },
    { title: 'Open EdTech & Student Tools', desc: 'Intelligent tutors, open study aids, peer learning platforms, and curriculum tools.' },
    { title: 'Civic Infrastructure & Sustainability', desc: 'Smart waste management, energy tracking, traffic analytics, and urban resilience.' },
    { title: 'Open Source DevTools & Infrastructure', desc: 'Linters, performance analyzers, documentation agents, and CI/CD enhancements.' },
  ];

  return (
    <section className="section-wrapper" id="theme">
      <div className="theme-showcase-box">
        <div className="theme-details">
          <div className="pill-badge red">
            <span className="badge-dot"></span>
            <span>2026 Core Focus</span>
          </div>

          <h2 className="theme-headline">
            AI BELONGS TO <br />
            <span>EVERYONE.</span>
          </h2>

          <p className="theme-body-text">
            Artificial intelligence shouldn't be locked behind walled gardens or multi-billion dollar enterprise contracts.
            True innovation flourishes when students, independent builders, and open-source creators have access to modern AI tools
            to solve human problems.
          </p>

          <p className="theme-body-text">
            Our 2026 theme challenges hackers to build lightweight, accessible, and ethical AI-powered systems that empower
            regular people, solve grassroots issues, and demonstrate that anyone willing to code can build with AI.
          </p>

          <div className="open-source-edge-callout">
            <div className="edge-lead">THE OPEN SOURCE EDGE</div>
            <p className="edge-desc">
              In 2025, <strong>India added over 5 million developers to GitHub</strong>, making it the world's largest contributor base
              for public and open-source projects. Supporting and participating in CBIT Hacktoberfest means driving this global wave.
            </p>
          </div>
        </div>

        <div className="tracks-list-card">
          <div className="tracks-header">KEY APPLICATION DOMAINS</div>
          {tracks.map((track, i) => (
            <div key={i} className="track-item-pill">
              <div className="geo-shape-cell cell-yellow" style={{ width: '8px', height: '8px', borderRadius: '2px' }}></div>
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700 }}>{track.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>{track.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
