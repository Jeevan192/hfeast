import React, { useState, useEffect } from 'react';
import GlareHover from './GlareHover.jsx';
import SpecularButton from './SpecularButton.jsx';
import BorderGlow from './BorderGlow.jsx';

export default function Hero({ onOpenRegister }) {
  // Target: October 10, 2026 17:00:00 IST
  const targetDate = new Date('2026-10-10T17:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="hero" id="hero">
      <div className="section-wrapper">
        <div className="hero-layout">

          {/* Main Title */}
          <h1 className="hero-main-title">
            CBIT HACKTOBERFEST <br />
            <span className="gradient-text">HACKATHON'26</span>
          </h1>

          {/* Concise Lead Text */}
          <p className="hero-lead-text">
            The premier 24-hour celebration of open source is now live in-person on campus.
            500+ student builders, 1-on-1 industry mentors, all-inclusive catering & swag, and an electrifying weekend of community innovation.
          </p>

          {/* Event Quick Metadata Grid */}
          <div className="meta-chips-grid">
            <GlareHover borderRadius={14} glareOpacity={0.25} glareSize={180}>
              <div className="meta-chip">
                <div className="chip-icon red">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="chip-info">
                  <span className="chip-label">Dates</span>
                  <span className="chip-value">10–11 Oct 2026</span>
                </div>
              </div>
            </GlareHover>

            <GlareHover borderRadius={14} glareOpacity={0.25} glareSize={180}>
              <div className="meta-chip">
                <div className="chip-icon blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="chip-info">
                  <span className="chip-label">Venue</span>
                  <span className="chip-value">CBIT Hyderabad</span>
                </div>
              </div>
            </GlareHover>

            <GlareHover borderRadius={14} glareOpacity={0.25} glareSize={180}>
              <div className="meta-chip">
                <div className="chip-icon yellow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="chip-info">
                  <span className="chip-label">Duration</span>
                  <span className="chip-value">24-Hour Sprint</span>
                </div>
              </div>
            </GlareHover>

            <GlareHover borderRadius={14} glareOpacity={0.25} glareSize={180}>
              <div className="meta-chip">
                <div className="chip-icon pink">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div className="chip-info">
                  <span className="chip-label">Registration Fee</span>
                  <span className="chip-value" style={{ color: 'var(--hf-yellow)', fontWeight: 700 }}>₹200 / Head</span>
                </div>
              </div>
            </GlareHover>
          </div>

          {/* Real-time Countdown Timer with BorderGlow */}
          <BorderGlow 
            borderRadius={20} 
            colors={['#8BB2DE', '#FFFFFF']} 
            showInnerSpotlight={false}
            edgeSensitivity={40} 
            glowRadius={65}
            className="countdown-glow-container"
          >
            <div className="countdown-box">
              <span className="countdown-label">Hackathon Kickoff Countdown</span>
              <div className="timer-units">
                <div className="unit-card">
                  <span className="unit-number">{timeLeft.days}</span>
                  <span className="unit-text">DAYS</span>
                </div>
                <span className="timer-separator">:</span>
                <div className="unit-card">
                  <span className="unit-number">{timeLeft.hours}</span>
                  <span className="unit-text">HOURS</span>
                </div>
                <span className="timer-separator">:</span>
                <div className="unit-card">
                  <span className="unit-number">{timeLeft.minutes}</span>
                  <span className="unit-text">MINS</span>
                </div>
                <span className="timer-separator">:</span>
                <div className="unit-card">
                  <span className="unit-number">{timeLeft.seconds}</span>
                  <span className="unit-text">SECS</span>
                </div>
              </div>
            </div>
          </BorderGlow>

          {/* Hero Actions: Specular Buttons */}
          <div className="hero-cta-row">
            <SpecularButton
              size="lg"
              radius={14}
              baseColor="var(--hf-red)"
              lineColor="#FFFFFF"
              shineSize={12}
              shineFade={45}
              intensity={1}
              followMouse={true}
              onClick={onOpenRegister}
            >
              <span>Register Now</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </SpecularButton>

            <SpecularButton
              as="a"
              href="#timeline"
              size="lg"
              radius={14}
              baseColor="var(--bg-surface-elevated)"
              lineColor="#8BB2DE"
              glowColor="rgba(139, 178, 222, 0.3)"
              shineSize={12}
              shineFade={45}
              intensity={0.85}
              followMouse={true}
            >
              <span>View Timeline</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </SpecularButton>
          </div>

        </div>
      </div>
    </section>
  );
}
