import React from 'react';
import SpecularButton from './SpecularButton.jsx';

export default function PreptemberPage({ onBackToHome }) {
  return (
    <div className="preptember-page-view">
      <div className="section-wrapper" style={{ maxWidth: '800px', textAlign: 'center' }}>
        <h1 className="preptember-page-title">Preptember</h1>
        <p className="preptember-page-sub">Your learning starts here</p>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Resources, session guides and workshops will be available here soon. Stay tuned to COSC announcements!
        </p>

        <SpecularButton 
          size="lg"
          radius={14}
          baseColor="var(--bg-surface-elevated)"
          lineColor="#8BB2DE"
          intensity={0.85}
          followMouse={true}
          onClick={onBackToHome}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Hackathon Home</span>
        </SpecularButton>
      </div>
    </div>
  );
}
