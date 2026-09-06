import React, { useState } from 'react';

export default function RegisterModal({ isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: '4',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    college: '',
    track: 'AI for Accessibility & Inclusivity',
    github: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitSuccess(`Registration confirmed for team "${formData.teamName}"! Check your email for next steps.`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <div className="modal-header-title">REGISTRATION PORTAL</div>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="modal-scrollable-body">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Register for CBIT Hacktoberfest '26
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              100% Free Entry • 17–18 October 2026 • CBIT Campus, Hyderabad (In-Person)
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-field-row">
              <div className="form-field-group">
                <label>Team Name *</label>
                <input
                  type="text"
                  name="teamName"
                  required
                  placeholder="e.g. OpenInnovators"
                  value={formData.teamName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label>Team Size *</label>
                <select name="teamSize" value={formData.teamSize} onChange={handleChange}>
                  <option value="1">1 Member (Solo)</option>
                  <option value="2">2 Members</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members (Full Team)</option>
                </select>
              </div>
            </div>

            <div className="form-field-row">
              <div className="form-field-group">
                <label>Team Leader Name *</label>
                <input
                  type="text"
                  name="leaderName"
                  required
                  placeholder="Full Name"
                  value={formData.leaderName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label>Leader Email *</label>
                <input
                  type="email"
                  name="leaderEmail"
                  required
                  placeholder="name@domain.com"
                  value={formData.leaderEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field-row">
              <div className="form-field-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="leaderPhone"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.leaderPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field-group">
                <label>College / Institute *</label>
                <input
                  type="text"
                  name="college"
                  required
                  placeholder="e.g. CBIT Hyderabad"
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field-group">
              <label>Preferred Domain Track *</label>
              <select name="track" value={formData.track} onChange={handleChange}>
                <option value="AI for Accessibility & Inclusivity">AI for Accessibility & Inclusivity</option>
                <option value="Healthcare & Public Wellness">Healthcare & Public Wellness</option>
                <option value="Open EdTech & Student Tools">Open EdTech & Student Tools</option>
                <option value="Civic Infrastructure & Sustainability">Civic Infrastructure & Sustainability</option>
                <option value="Open Source DevTools & Infrastructure">Open Source DevTools & Infrastructure</option>
                <option value="Open Innovation (Wildcard)">Open Innovation (Wildcard)</option>
              </select>
            </div>

            <div className="form-field-group">
              <label>GitHub Profile or Team Repo Link (Optional)</label>
              <input
                type="url"
                name="github"
                placeholder="https://github.com/your-username"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <div className="modal-actions-row">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <span>Confirm Registration</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
