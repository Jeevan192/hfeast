import React from 'react';
import BorderGlow from './BorderGlow.jsx';

export default function About() {
  return (
    <section className="section-wrapper" id="about">
      <div className="section-header">
        <h2 className="section-title">ABOUT</h2>
      </div>

      {/* High-Impact Bento Grid with High Contrast & Streamlined Copy */}
      <div className="bento-grid">
        {/* Card 1: All-Inclusive Fee & Pass (Featured Card) */}
        <BorderGlow borderRadius={22} colors={['#F5B726', '#E53927']} edgeSensitivity={35} glowRadius={75}>
          <div className="bento-card">
            <span className="bento-badge-tag" style={{ background: 'rgba(245, 183, 38, 0.2)', color: '#F5B726', border: '1px solid rgba(245, 183, 38, 0.45)' }}>
              ₹200 / Head • Complete Access
            </span>
            <h3 className="bento-title">All-Inclusive Hackathon Experience</h3>
            <p className="bento-desc">
              Your registration of ₹200 per participant covers everything you need for 24 hours of non-stop creation: full catering, midnight energy snacks, official Hacktoberfest swag kit, Wi-Fi, workspace, and live mentor support.
            </p>
            <div className="bento-features-row">
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#F5B726' }}>Meals & Snacks</span>
                <span className="bento-feature-lbl">All food included</span>
              </div>
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#E53927' }}>Swag & Badges</span>
                <span className="bento-feature-lbl">Exclusive kit</span>
              </div>
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#8BB2DE' }}>24/7 Floor</span>
                <span className="bento-feature-lbl">CBIT Campus</span>
              </div>
            </div>
          </div>
        </BorderGlow>

        {/* Card 2: 24-Hour Non-stop Sprint */}
        <BorderGlow borderRadius={22} colors={['#8BB2DE', '#FFFFFF']} edgeSensitivity={35} glowRadius={75}>
          <div className="bento-card">
            <span className="bento-badge-tag" style={{ background: 'rgba(139, 178, 222, 0.2)', color: '#8BB2DE', border: '1px solid rgba(139, 178, 222, 0.4)' }}>
              In-Person Sprint • 10–11 Oct
            </span>
            <h3 className="bento-title">First Time In-Person on Campus</h3>
            <p className="bento-desc">
              Experience the unmatched electricity of 500+ student developers coding together. Teams of 3 to 5 builders collaborate overnight in a high-octane atmosphere packed with ice-breakers, music, and lightning demos.
            </p>
            <div className="bento-features-row">
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#8BB2DE' }}>3–5</span>
                <span className="bento-feature-lbl">Members / Team</span>
              </div>
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#FFFFFF' }}>24 Hrs</span>
                <span className="bento-feature-lbl">Non-Stop Sprint</span>
              </div>
            </div>
          </div>
        </BorderGlow>

        {/* Card 3: 1-on-1 Mentorship */}
        <BorderGlow borderRadius={22} colors={['#3D5F58', '#8BB2DE']} edgeSensitivity={35} glowRadius={75}>
          <div className="bento-card">
            <span className="bento-badge-tag" style={{ background: 'rgba(61, 95, 88, 0.35)', color: '#81C7B7', border: '1px solid rgba(88, 166, 148, 0.45)' }}>
              Expert Guidance
            </span>
            <h3 className="bento-title">Mentorship Throughout the Night</h3>
            <p className="bento-desc">
              Get unblocked fast. Domain mentors, alumni architects, and open-source contributors will be with you on the floor to review technical design, optimize code, and refine project pitches.
            </p>
            <div className="bento-features-row">
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#81C7B7' }}>1-on-1</span>
                <span className="bento-feature-lbl">Code Reviews</span>
              </div>
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#F5B726' }}>Checkpoints</span>
                <span className="bento-feature-lbl">Stage guidance</span>
              </div>
            </div>
          </div>
        </BorderGlow>

        {/* Card 4: Prizes & Recognition */}
        <BorderGlow borderRadius={22} colors={['#E97B77', '#E53927']} edgeSensitivity={35} glowRadius={75}>
          <div className="bento-card">
            <span className="bento-badge-tag" style={{ background: 'rgba(233, 123, 119, 0.2)', color: '#E97B77', border: '1px solid rgba(233, 123, 119, 0.45)' }}>
              Prizes & Certificates
            </span>
            <h3 className="bento-title">Win Prizes & Launch Your Career</h3>
            <p className="bento-desc">
              Compete for generous track prize pools, special partner awards, and verified certificates of participation. Build a standout open-source project for your GitHub portfolio.
            </p>
            <div className="bento-features-row">
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#E97B77' }}>Cash & Swag</span>
                <span className="bento-feature-lbl">Podium prizes</span>
              </div>
              <div className="bento-feature-item">
                <span className="bento-feature-val" style={{ color: '#FFFFFF' }}>Certificates</span>
                <span className="bento-feature-lbl">All participants</span>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}

