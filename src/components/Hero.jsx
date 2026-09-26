import React, { useState, useEffect } from 'react';
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

          {/* Hero Dual Logos (COSC + Hacktoberfest) */}
          <div className="hero-logos-row">
            <img
              src="/assets/hfest-26-logo.png"
              alt="COSC - CBIT Open Source Community"
              className="hero-logo-img cosc-logo"
            />
            <img
              src="/hfest-26-logo.PNG"
              alt="Hacktoberfest 2026"
              className="hero-logo-img hf-logo"
            />
          </div>

          {/* Main Title in Jockey One Font */}
          <h1 className="hero-main-title hero-title-jockey">
            <span className="hero-title-cbit">CBIT</span>
            <span className="hero-title-hfest">Hacktoberfest</span>
            <span className="hero-title-year">Hackathon '26</span>
          </h1>

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
