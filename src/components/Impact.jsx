import React, { useState } from 'react';

export default function Impact() {
  const [selectedYear, setSelectedYear] = useState('2025');

  const historyData = [
    { year: '2020', reach: '180+', height: 16, note: 'Initial Virtual Community Sprint' },
    { year: '2021', reach: '250+', height: 24, note: 'Expanding Across Colleges' },
    { year: '2022', reach: '520+', height: 42, note: 'Statewide Open Source Outreach' },
    { year: '2023', reach: '1,000+', height: 65, note: 'National Milestone Reached' },
    { year: '2024', reach: '1,150+', height: 74, note: '1100+ Registrations Across States' },
    { year: '2025', reach: '1,750+', height: 96, note: 'Peak Virtual Edition with 4.46/5.0 Rating' },
  ];

  return (
    <section className="section-wrapper" id="impact">
      <div className="section-header">
        <div className="pill-badge blue">
          <span className="badge-dot"></span>
          <span>Proven Track Record</span>
        </div>
        <h2 className="section-title">COMMUNITY IMPACT & GROWTH</h2>
        <p className="section-subtitle">
          With exceptional participant feedback and year-over-year community expansion, CBIT Hacktoberfest
          has established itself as one of the premier collegiate hackathons in India.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-stat-card">
          <div className="stat-huge yellow">4.46 <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ 5.0</span></div>
          <div className="stat-label">Overall Experience Rating</div>
          <div className="stat-desc">Backed by an 88.4% top-tier satisfaction score across all categories.</div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-huge blue">91.3%</div>
          <div className="stat-label">Event Organization & Logistics</div>
          <div className="stat-desc">Flawless scheduling, active helpdesk, seamless check-ins, and high transparency.</div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-huge red">89.9%</div>
          <div className="stat-label">Problem Statement Relevance</div>
          <div className="stat-desc">Carefully calibrated challenges reflecting realistic engineering demands.</div>
        </div>

        <div className="metric-stat-card">
          <div className="stat-huge pink">65%+</div>
          <div className="stat-label">5-Star Mentorship Scores</div>
          <div className="stat-desc">Constant hands-on checkpoints and debugging guidance from industry leads.</div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="growth-chart-wrapper">
        <div className="chart-meta-row">
          <div className="chart-title-group">
            <h3>CBIT Hacktoberfest Reach Trajectory (2020 – 2025)</h3>
            <p>Click on any year to inspect milestone details</p>
          </div>
          <div className="pill-badge" style={{ margin: 0 }}>
            <span>Active: {historyData.find(d => d.year === selectedYear)?.note}</span>
          </div>
        </div>

        <div className="bars-track-container">
          {historyData.map((item) => (
            <div
              key={item.year}
              className={`bar-column ${selectedYear === item.year ? 'active' : ''}`}
              onClick={() => setSelectedYear(item.year)}
            >
              <div
                className="bar-body"
                style={{ height: `${item.height}%` }}
              >
                <span className="bar-count-tag">{item.reach}</span>
              </div>
              <span className="bar-year-label">{item.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Past Events */}
      <div className="past-events-strip">
        <span className="strip-label">COSC RECENT FLAGSHIP INITIATIVES</span>
        <div className="events-chips-list">
          <span className="event-chip-item">
            <span className="badge-dot" style={{ background: 'var(--color-blue)' }}></span>
            Global Open Source Awareness Session
          </span>
          <span className="event-chip-item">
            <span className="badge-dot" style={{ background: 'var(--color-yellow)' }}></span>
            Git & GitHub Workshop
          </span>
          <span className="event-chip-item">
            <span className="badge-dot" style={{ background: 'var(--color-red)' }}></span>
            Decipher [OpenSys]
          </span>
          <span className="event-chip-item">
            <span className="badge-dot" style={{ background: 'var(--color-pink)' }}></span>
            Git Arcana [OpenSys]
          </span>
        </div>
      </div>
    </section>
  );
}
