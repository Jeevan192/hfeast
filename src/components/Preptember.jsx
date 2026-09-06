import React from 'react';

export default function Preptember({ onOpenPreptemberPage }) {
  return (
    <section className="section-wrapper" id="preptember">
      <div className="section-header">
        <h2 className="section-title">PREPTEMBER</h2>
      </div>

      <div className="preptember-card-container">
        <p className="preptember-lead">
          Prepare for <strong>CBIT Hacktoberfest Hackathon</strong> with Preptember. Get on board with COSC as a month of learning, coding and open source contributions awaits!
        </p>

        <button 
          onClick={onOpenPreptemberPage}
          className="btn btn-primary btn-lg"
        >
          <span>Explore Preptember</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
}
