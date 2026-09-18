import React, { useState, useEffect } from 'react';
import SpecularButton from './SpecularButton.jsx';

export default function RegisterModal({ isOpen, onClose, onSubmitSuccess }) {
  const [teamSize, setTeamSize] = useState(3);
  const [teamName, setTeamName] = useState('');
  
  // Leader info
  const [leader, setLeader] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
  });

  // Members info (up to 4 additional members for max teamSize 5)
  const [members, setMembers] = useState([
    { name: '', email: '', phone: '', college: '' }, // Member 2
    { name: '', email: '', phone: '', college: '' }, // Member 3
    { name: '', email: '', phone: '', college: '' }, // Member 4
    { name: '', email: '', phone: '', college: '' }, // Member 5
  ]);

  const [sameCollege, setSameCollege] = useState(true);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const UPI_ID = 'cosc@cbit.ac.in';
  const totalAmount = teamSize * 200;

  // Sync same college to members when enabled
  useEffect(() => {
    if (sameCollege && leader.college) {
      setMembers((prev) =>
        prev.map((m) => ({
          ...m,
          college: leader.college,
        }))
      );
    }
  }, [sameCollege, leader.college]);

  if (!isOpen) return null;

  const handleLeaderChange = (field, value) => {
    setLeader((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'college' && sameCollege) {
        setMembers((mList) => mList.map((m) => ({ ...m, college: value })));
      }
      return updated;
    });
  };

  const handleMemberChange = (index, field, value) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const copyUpiToClipboard = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const validateForm = () => {
    // 1. Team Name
    if (!teamName.trim() || teamName.trim().length < 2) {
      return 'Please enter a valid team name (at least 2 characters).';
    }

    // 2. Leader details
    if (!leader.name.trim() || leader.name.trim().length < 2) {
      return 'Please enter a valid name for the Team Leader.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leader.email.trim())) {
      return 'Please enter a valid email address for the Team Leader.';
    }
    const cleanPhone = (p) => p.replace(/\D/g, '').slice(-10);
    if (cleanPhone(leader.phone).length !== 10) {
      return 'Please enter a valid 10-digit phone number for the Team Leader.';
    }
    if (!leader.college.trim()) {
      return 'Please enter the College / Institute for the Team Leader.';
    }

    // 3. Active members details (teamSize - 1)
    const activeMembers = members.slice(0, teamSize - 1);
    for (let i = 0; i < activeMembers.length; i++) {
      const m = activeMembers[i];
      const memberNum = i + 2;
      if (!m.name.trim() || m.name.trim().length < 2) {
        return `Please enter a valid name for Member ${memberNum}.`;
      }
      if (!emailRegex.test(m.email.trim())) {
        return `Please enter a valid email address for Member ${memberNum}.`;
      }
      if (cleanPhone(m.phone).length !== 10) {
        return `Please enter a valid 10-digit phone number for Member ${memberNum}.`;
      }
      if (!m.college.trim()) {
        return `Please enter the college name for Member ${memberNum}.`;
      }
    }

    // 4. Intra-form duplicate check (Emails)
    const allEmails = [leader.email.trim().toLowerCase(), ...activeMembers.map((m) => m.email.trim().toLowerCase())];
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      return 'Duplicate email detected! Each participant in the team must have a unique email address.';
    }

    // 5. Intra-form duplicate check (Phones)
    const allPhones = [cleanPhone(leader.phone), ...activeMembers.map((m) => cleanPhone(m.phone))];
    const uniquePhones = new Set(allPhones);
    if (uniquePhones.size !== allPhones.length) {
      return 'Duplicate phone number detected! Each participant in the team must have a unique phone number.';
    }

    // 6. Payment validation
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      return 'Please enter a valid UPI Reference / UTR Number (minimum 6-12 digits).';
    }
    if (!paymentConfirmed) {
      return 'Please confirm that you have made the UPI payment before submitting.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      const scrollEl = document.querySelector('.modal-scrollable-body');
      if (scrollEl) scrollEl.scrollTop = 0;
      return;
    }

    setIsSubmitting(true);

    const payload = {
      teamName: teamName.trim(),
      teamSize,
      leader: {
        name: leader.name.trim(),
        email: leader.email.trim().toLowerCase(),
        phone: leader.phone.trim(),
        college: leader.college.trim(),
      },
      members: members.slice(0, teamSize - 1).map((m) => ({
        name: m.name.trim(),
        email: m.email.trim().toLowerCase(),
        phone: m.phone.trim(),
        college: m.college.trim(),
      })),
      trackId: 'general',
      payment: {
        utrNumber: utrNumber.trim(),
        amount: totalAmount,
      },
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to submit registration. Please try again.');
      }

      setSuccessData({
        teamName: payload.teamName,
        registrationId: data.registrationId,
        amount: totalAmount,
      });

      if (onSubmitSuccess) {
        onSubmitSuccess(`Registration successfully submitted for team "${payload.teamName}"!`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred. Please verify your connection.');
      const scrollEl = document.querySelector('.modal-scrollable-body');
      if (scrollEl) scrollEl.scrollTop = 0;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSuccessData(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-window" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <div className="modal-header-title">
            <span>OFFICIAL TEAM REGISTRATION</span>
          </div>
          <button className="modal-close-icon-btn" onClick={resetAndClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="modal-scrollable-body">
          {successData ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(245, 183, 38, 0.2)',
                  border: '2px solid var(--hf-yellow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  color: 'var(--hf-yellow)',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Registration Submitted!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                Team <strong>"{successData.teamName}"</strong> has been registered. Your payment of <strong>₹{successData.amount}</strong> with reference UTR is queued for organizer verification.
              </p>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: 'var(--hf-yellow)',
                  marginBottom: '2rem',
                  display: 'inline-block',
                }}
              >
                Registration ID: {successData.registrationId}
              </div>
              <div>
                <SpecularButton
                  size="md"
                  radius={12}
                  baseColor="var(--hf-red)"
                  lineColor="#FFFFFF"
                  intensity={1}
                  followMouse={true}
                  onClick={resetAndClose}
                >
                  <span>Close Window</span>
                </SpecularButton>
              </div>
            </div>
          ) : (
            <>
              {/* Header Info */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Register for CBIT Hacktoberfest '26
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  17–18 October 2026 • In-Person at CBIT Campus, Hyderabad • Teams of 3–5
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="form-error-banner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* 1. Team Name & Team Size Selector */}
                <div className="form-field-group">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CyberPioneers"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>

                {/* Team Size Selector (3, 4, 5) */}
                <div className="team-size-selector-row">
                  <label className="team-size-selector-label">Select Team Size *</label>
                  <div className="team-size-pills">
                    {[3, 4, 5].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`size-pill-btn ${teamSize === size ? 'active' : ''}`}
                        onClick={() => setTeamSize(size)}
                      >
                        <span>{size} Members</span>
                        <span className="size-pill-badge">₹{size * 200} Total</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Fee Calculation Banner */}
                <div className="dynamic-fee-banner">
                  <div className="fee-banner-text">
                    <h4>Registration Fee: ₹200 / Head</h4>
                    <p>Includes meals, midnight snacks, swag kit, 24-hr workspace, and certificates for all {teamSize} members</p>
                  </div>
                  <div className="fee-banner-price">
                    <div className="fee-banner-amount">₹{totalAmount}</div>
                    <div className="fee-banner-rate">(₹200 × {teamSize} Members)</div>
                  </div>
                </div>

                {/* College Sync Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <input
                    type="checkbox"
                    id="sameCollegeToggle"
                    checked={sameCollege}
                    onChange={(e) => setSameCollege(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--hf-yellow)' }}
                  />
                  <label htmlFor="sameCollegeToggle" style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    All team members belong to the same college / institute
                  </label>
                </div>

                {/* Section 1: Team Leader Details */}
                <div className="member-section-card">
                  <div className="member-section-header">
                    <div className="member-section-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7B72" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>1. Team Leader Details</span>
                    </div>
                    <span className="member-tag-badge leader">Team Leader</span>
                  </div>

                  <div className="form-field-row">
                    <div className="form-field-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Leader's Full Name"
                        value={leader.name}
                        onChange={(e) => handleLeaderChange('name', e.target.value)}
                      />
                    </div>
                    <div className="form-field-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="leader@domain.com"
                        value={leader.email}
                        onChange={(e) => handleLeaderChange('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-field-row">
                    <div className="form-field-group">
                      <label>Phone Number (10 Digits) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={leader.phone}
                        onChange={(e) => handleLeaderChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="form-field-group">
                      <label>College / Institute *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CBIT Hyderabad"
                        value={leader.college}
                        onChange={(e) => handleLeaderChange('college', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Additional Member Sections */}
                {Array.from({ length: teamSize - 1 }).map((_, idx) => {
                  const memberNum = idx + 2;
                  const member = members[idx];
                  return (
                    <div key={memberNum} className="member-section-card">
                      <div className="member-section-header">
                        <div className="member-section-title">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8BB2DE" strokeWidth="2.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                          </svg>
                          <span>{memberNum}. Member {memberNum} Details</span>
                        </div>
                        <span className="member-tag-badge member">Member {memberNum}</span>
                      </div>

                      <div className="form-field-row">
                        <div className="form-field-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder={`Member ${memberNum} Full Name`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          />
                        </div>
                        <div className="form-field-group">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder={`member${memberNum}@domain.com`}
                            value={member.email}
                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-field-row">
                        <div className="form-field-group">
                          <label>Phone Number (10 Digits) *</label>
                          <input
                            type="tel"
                            required
                            placeholder="9876543210"
                            value={member.phone}
                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                          />
                        </div>
                        <div className="form-field-group">
                          <label>College / Institute *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. CBIT Hyderabad"
                            value={member.college}
                            onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Payment & QR Code Section */}
                <div className="qr-payment-panel">
                  <div className="qr-panel-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5B726" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    <span>UPI Payment (₹{totalAmount})</span>
                  </div>
                  <p className="qr-panel-subtitle">
                    Scan the QR code below using any UPI application (Google Pay, PhonePe, Paytm, or BHIM) to pay the exact fee of <strong>₹{totalAmount}</strong> for your {teamSize}-member team.
                  </p>

                  <div className="qr-box-center">
                    <div className="qr-visual-frame">
                      {/* Scalable vector QR representation with central UPI badge */}
                      <svg viewBox="0 0 200 200" width="170" height="170">
                        {/* Background */}
                        <rect width="200" height="200" fill="#ffffff" />
                        {/* Corner Position Detection Patterns */}
                        {/* Top-Left */}
                        <rect x="15" y="15" width="45" height="45" fill="#0c1915" rx="4" />
                        <rect x="22" y="22" width="31" height="31" fill="#ffffff" rx="2" />
                        <rect x="28" y="28" width="19" height="19" fill="#E53927" rx="2" />

                        {/* Top-Right */}
                        <rect x="140" y="15" width="45" height="45" fill="#0c1915" rx="4" />
                        <rect x="147" y="22" width="31" height="31" fill="#ffffff" rx="2" />
                        <rect x="153" y="28" width="19" height="19" fill="#8BB2DE" rx="2" />

                        {/* Bottom-Left */}
                        <rect x="15" y="140" width="45" height="45" fill="#0c1915" rx="4" />
                        <rect x="22" y="147" width="31" height="31" fill="#ffffff" rx="2" />
                        <rect x="28" y="153" width="19" height="19" fill="#F5B726" rx="2" />

                        {/* Simulated QR Data Matrix Blocks */}
                        <g fill="#0c1915">
                          <rect x="70" y="18" width="10" height="10" />
                          <rect x="90" y="18" width="10" height="10" />
                          <rect x="110" y="18" width="10" height="10" />
                          <rect x="70" y="38" width="10" height="10" />
                          <rect x="100" y="38" width="10" height="10" />
                          <rect x="120" y="38" width="10" height="10" />
                          <rect x="70" y="58" width="10" height="10" />
                          <rect x="85" y="58" width="10" height="10" />
                          <rect x="115" y="58" width="10" height="10" />

                          <rect x="18" y="70" width="10" height="10" />
                          <rect x="38" y="70" width="10" height="10" />
                          <rect x="58" y="70" width="10" height="10" />
                          <rect x="78" y="70" width="10" height="10" />
                          <rect x="145" y="70" width="10" height="10" />
                          <rect x="165" y="70" width="10" height="10" />

                          <rect x="18" y="90" width="10" height="10" />
                          <rect x="45" y="90" width="10" height="10" />
                          <rect x="135" y="90" width="10" height="10" />
                          <rect x="175" y="90" width="10" height="10" />

                          <rect x="18" y="110" width="10" height="10" />
                          <rect x="35" y="110" width="10" height="10" />
                          <rect x="65" y="110" width="10" height="10" />
                          <rect x="145" y="110" width="10" height="10" />

                          <rect x="70" y="135" width="10" height="10" />
                          <rect x="95" y="135" width="10" height="10" />
                          <rect x="120" y="135" width="10" height="10" />
                          <rect x="150" y="135" width="10" height="10" />
                          <rect x="170" y="135" width="10" height="10" />

                          <rect x="70" y="155" width="10" height="10" />
                          <rect x="105" y="155" width="10" height="10" />
                          <rect x="135" y="155" width="10" height="10" />
                          <rect x="165" y="155" width="10" height="10" />

                          <rect x="80" y="175" width="10" height="10" />
                          <rect x="115" y="175" width="10" height="10" />
                          <rect x="145" y="175" width="10" height="10" />
                        </g>

                        {/* Central UPI / COSC Badge */}
                        <circle cx="100" cy="100" r="22" fill="#ffffff" stroke="#3D5F58" strokeWidth="3" />
                        <text x="100" y="104" textAnchor="middle" fill="#E53927" fontSize="11" fontWeight="bold" fontFamily="monospace">UPI</text>
                      </svg>
                    </div>

                    <div className="upi-chip-display">
                      <span>UPI ID: {UPI_ID}</span>
                      <button
                        type="button"
                        className="copy-upi-btn"
                        onClick={copyUpiToClipboard}
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? (
                          <span style={{ color: '#4ADE80', fontSize: '0.75rem' }}>Copied!</span>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* UTR Input Field */}
                  <div className="form-field-group">
                    <label>UPI Reference ID / Transaction Number (UTR) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 428901234567 (12-digit UTR)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                      Found in your payment app under transaction details.
                    </small>
                  </div>

                  {/* Payment Confirmation Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.75rem' }}>
                    <input
                      type="checkbox"
                      id="confirmPaymentCheck"
                      required
                      checked={paymentConfirmed}
                      onChange={(e) => setPaymentConfirmed(e.target.checked)}
                      style={{ marginTop: '0.2rem', width: '16px', height: '16px', accentColor: 'var(--hf-yellow)', cursor: 'pointer' }}
                    />
                    <label htmlFor="confirmPaymentCheck" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
                      I confirm that I have transferred ₹{totalAmount} to the official COSC UPI ID and provided the genuine transaction reference ID.
                    </label>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="modal-actions-row">
                  <button type="button" className="btn btn-ghost" onClick={resetAndClose} disabled={isSubmitting}>
                    Cancel
                  </button>
                  <SpecularButton
                    type="submit"
                    size="md"
                    radius={12}
                    baseColor="var(--hf-red)"
                    lineColor="#FFFFFF"
                    intensity={1}
                    followMouse={true}
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'Registering Team...' : `Pay ₹${totalAmount} & Register`}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </SpecularButton>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
