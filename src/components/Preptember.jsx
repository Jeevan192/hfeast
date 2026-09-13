import React from 'react';
import GlareHover from './GlareHover.jsx';
import BorderGlow from './BorderGlow.jsx';
import SpecularButton from './SpecularButton.jsx';

export default function Preptember({ onOpenPreptemberPage }) {
  return (
    <section className="section-wrapper" id="preptember">
      <div className="section-header">
        <h2 className="section-title">PREPTEMBER</h2>
      </div>

      <div className="preptember-outer-wrap">
        <BorderGlow borderRadius={20} colors={['#F5B726', '#E53927', '#8BB2DE']} edgeSensitivity={40} glowRadius={70}>
          <GlareHover borderRadius={20} glareOpacity={0.2} glareSize={320}>
            <div className="preptember-card-container">
              <p className="preptember-lead">
                Prepare for <strong>CBIT Hacktoberfest Hackathon</strong> with Preptember. Get on board with COSC as a month of learning, coding and open source contributions awaits!
              </p>

              <SpecularButton 
                size="lg"
                radius={14}
                baseColor="var(--hf-red)"
                lineColor="#FFFFFF"
                intensity={1}
                followMouse={true}
                onClick={onOpenPreptemberPage}
              >
                <span>Explore Preptember</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </SpecularButton>
            </div>
          </GlareHover>
        </BorderGlow>
      </div>
    </section>
  );
}
