import React from 'react';

export default function Contact() {
  const organizers = [
    { name: 'Mugdha', phone: '+91 96760 13204', tel: '+919676013204' },
    { name: 'Sashreek', phone: '+91 79818 63846', tel: '+917981863846' },
    { name: 'Advith', phone: '+91 89899 49450', tel: '+918989949450' },
    { name: 'Jeevan', phone: '+91 83096 85126', tel: '+918309685126' },
  ];

  return (
    <section className="section-wrapper" id="contact">
      <div className="section-header">
        <h2 className="section-title">CONTACT</h2>
        <p className="section-subtitle">
          Have queries regarding registration, mentoring, sponsorships or logistics? We are eager to assist.
        </p>
      </div>

      <div className="contact-grid">
        {/* Venue Card */}
        <div className="contact-card">
          <div className="contact-icon-box" style={{ color: 'var(--color-blue)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h3 className="contact-card-title">Event Venue</h3>
          <p className="contact-card-desc">
            Chaitanya Bharathi Institute of Technology (CBIT)<br />
            Kokapet, Gandipet, Hyderabad, Telangana 500075
          </p>
          <a
            href="https://maps.google.com/?q=Chaitanya+Bharathi+Institute+of+Technology"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
          >
            <span>Google Maps</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>

        {/* Email Card */}
        <div className="contact-card">
          <div className="contact-icon-box" style={{ color: 'var(--color-yellow)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h3 className="contact-card-title">Official Inquiries</h3>
          <p className="contact-card-desc">
            For partnership discussions, press, campus permissions and general queries:
          </p>
          <div style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--color-yellow)' }}>
            cosc@cbit.ac.in
          </div>
          <a
            href="mailto:cosc@cbit.ac.in"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
          >
            <span>Compose Email</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </a>
        </div>

        {/* Organizers List Card */}
        <div className="contact-card">
          <div className="contact-icon-box" style={{ color: 'var(--color-red)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <h3 className="contact-card-title">Event Leads & Coordinators</h3>
          <p className="contact-card-desc" style={{ marginBottom: '0.85rem' }}>
            Direct helpline contacts for participant support:
          </p>
          <div className="organizer-list">
            {organizers.map((org, i) => (
              <div key={i} className="org-item">
                <span className="org-name">{org.name}</span>
                <a href={`tel:${org.tel}`} className="org-tel">{org.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
