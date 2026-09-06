import React, { useState } from 'react';

export default function Navbar({ onOpenRegister, onOpenFeedback, onNavigateHome }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLinkClick = (hash) => {
    closeMobileMenu();
    if (onNavigateHome) onNavigateHome();
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a 
          href="#hero" 
          className="brand-link" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('#hero'); }}
        >
          <img 
            src="/cosc-logo.svg" 
            alt="COSC Logo" 
            className="brand-logo-img" 
          />
          <div className="brand-title">
            CBIT HACKTOBERFEST <br />
            <span>HACKATHON'26</span>
          </div>
        </a>

        {/* Desktop Links: Just about, preptember, timeline, sponsors, faq, contact */}
        <nav className="nav-links">
          <a 
            href="#about" 
            className="nav-item-link"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#about'); }}
          >
            About
          </a>
          <a 
            href="#preptember" 
            className="nav-item-link"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#preptember'); }}
          >
            Preptember
          </a>
          <a 
            href="#timeline" 
            className="nav-item-link"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#timeline'); }}
          >
            Timeline
          </a>
          <a 
            href="#sponsors" 
            className="nav-item-link"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#sponsors'); }}
          >
            Sponsors
          </a>
          <a 
            href="#faq" 
            className="nav-item-link"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#faq'); }}
          >
            FAQ
          </a>
          <a 
            href="#contact" 
            className="nav-item-link"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#contact'); }}
          >
            Contact
          </a>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <button onClick={onOpenFeedback} className="btn btn-ghost btn-sm" aria-label="Feedback">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Feedback</span>
          </button>
          <button onClick={onOpenRegister} className="btn btn-primary btn-sm" aria-label="Register">
            <span>Register Now</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button 
            className="mobile-menu-btn" 
            onClick={toggleMobileMenu} 
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <a href="#about" className="mobile-nav-link" onClick={() => handleLinkClick('#about')}>About</a>
          <a href="#preptember" className="mobile-nav-link" onClick={() => handleLinkClick('#preptember')}>Preptember</a>
          <a href="#timeline" className="mobile-nav-link" onClick={() => handleLinkClick('#timeline')}>Timeline</a>
          <a href="#sponsors" className="mobile-nav-link" onClick={() => handleLinkClick('#sponsors')}>Sponsors</a>
          <a href="#faq" className="mobile-nav-link" onClick={() => handleLinkClick('#faq')}>FAQ</a>
          <a href="#contact" className="mobile-nav-link" onClick={() => handleLinkClick('#contact')}>Contact</a>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button 
              onClick={() => { closeMobileMenu(); onOpenFeedback(); }} 
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Feedback
            </button>
            <button 
              onClick={() => { closeMobileMenu(); onOpenRegister(); }} 
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Register Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
