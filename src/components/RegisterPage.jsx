import React, { useState, useEffect, useRef } from 'react';
import SpecularButton from './SpecularButton.jsx';

export default function RegisterPage({ onBackToHome, onSubmitSuccess }) {
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const fieldRefs = useRef({});
  const [currentStep, setCurrentStep] = useState(0);

  const steps = ['Team Details', 'Participants', 'Review Details', 'UPI Payment'];

  const UPI_ID = 'cosc@cbit.ac.in';
  const totalAmount = teamSize * 200;

  // Scroll to top on page mount and step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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

  const validateForm = (step = null) => {
    const errors = {};
    const trimmedTeamName = teamName.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    const cleanPhone = (phone) => phone.trim().replace(/[\s\-()]/g, '');
    const isValidPhone = (phone) => indianPhoneRegex.test(cleanPhone(phone));
    const normalizePhone = (phone) => {
      const cleaned = cleanPhone(phone);
      const localNumber = cleaned.startsWith('+91') ? cleaned.slice(3)
        : cleaned.startsWith('91') ? cleaned.slice(2)
          : cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;
      return `+91${localNumber}`;
    };

    if (trimmedTeamName.length < 2 || trimmedTeamName.length > 50) {
      errors.teamName = 'Team name must be 2 to 50 characters.';
    }

    const validateParticipant = (participant, prefix, label) => {
      const name = participant.name.trim();
      const college = participant.college.trim();
      const email = participant.email.trim();
      if (name.length < 2 || name.length > 80) errors[`${prefix}.name`] = `${label} name must be 2 to 80 characters.`;
      if (!emailRegex.test(email)) errors[`${prefix}.email`] = `Enter a valid email address for ${label}.`;
      if (!isValidPhone(participant.phone)) errors[`${prefix}.phone`] = `Enter a valid 10-digit Indian phone number for ${label}.`;
      if (college.length < 2 || college.length > 120) errors[`${prefix}.college`] = `${label} college must be 2 to 120 characters.`;
    };

    validateParticipant(leader, 'leader', 'Team Leader');

    const activeMembers = members.slice(0, teamSize - 1);
    for (let i = 0; i < activeMembers.length; i++) {
      validateParticipant(activeMembers[i], `member${i}`, `Member ${i + 2}`);
    }

    const allEmails = [leader.email.trim().toLowerCase(), ...activeMembers.map((m) => m.email.trim().toLowerCase())];
    allEmails.forEach((email, index) => {
      if (email && allEmails.indexOf(email) !== index) {
        errors[index === 0 ? 'leader.email' : `member${index - 1}.email`] = 'Each participant must have a unique email address.';
      }
    });

    const allPhones = [normalizePhone(leader.phone), ...activeMembers.map((m) => normalizePhone(m.phone))];
    allPhones.forEach((phone, index) => {
      if (phone && allPhones.indexOf(phone) !== index) {
        errors[index === 0 ? 'leader.phone' : `member${index - 1}.phone`] = 'Each participant must have a unique phone number.';
      }
    });

    const trimmedUtr = utrNumber.trim();
    if (trimmedUtr.length < 6 || trimmedUtr.length > 40) {
      errors.utrNumber = 'UTR / reference number must be 6 to 40 characters.';
    }
    if (!paymentConfirmed) {
      errors.paymentConfirmed = 'Confirm that you have made the UPI payment before submitting.';
    }

    const stepFields = [
      ['teamName'],
      ['leader.name', 'leader.email', 'leader.phone', 'leader.college', ...members.slice(0, teamSize - 1).flatMap((_, index) => [
        `member${index}.name`, `member${index}.email`, `member${index}.phone`, `member${index}.college`,
      ])],
      [], // Step 3 (Review Details)
      Object.keys(errors), // Step 4 (UPI Payment & Final Submit)
    ];
    if (step === null || step === 3) return errors;
    return Object.fromEntries(stepFields[step].filter((field) => errors[field]).map((field) => [field, errors[field]]));
  };

  const focusFirstError = (errors) => {
    setFieldErrors(errors);
    const firstInvalidField = Object.keys(errors)[0];
    if (firstInvalidField) fieldRefs.current[firstInvalidField]?.focus();
  };

  const handleNext = () => {
    const errors = validateForm(currentStep);
    setErrorMessage(null);
    if (Object.keys(errors).length > 0) {
      focusFirstError(errors);
      setErrorMessage('Please correct the highlighted fields before continuing.');
      return;
    }
    setFieldErrors({});
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setFieldErrors({});
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const errors = validateForm(3);
    if (Object.keys(errors).length > 0) {
      focusFirstError(errors);
      setErrorMessage('Please correct the highlighted fields before submitting.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFieldErrors({});
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
        const serverErrors = data.error?.details && typeof data.error.details === 'object' ? data.error.details : {};
        setFieldErrors(serverErrors);
        throw new Error(data.error?.message || data.message || 'Failed to submit registration. Please try again.');
      }

      setSuccessData({
        teamName: payload.teamName,
        registrationId: data.registrationId,
        amount: totalAmount,
      });

      if (onSubmitSuccess) {
        onSubmitSuccess(`Registration successfully submitted for team "${payload.teamName}"!`);
      }
      setCurrentStep(0);
    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred. Please verify your connection.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setFieldRef = (field) => (element) => {
    fieldRefs.current[field] = element;
  };

  const fieldError = (field) => fieldErrors[field] && <small className="field-error">{fieldErrors[field]}</small>;

  return (
    <div className="register-page-view">
      <div className="register-page-container">
        {/* Navigation Breadcrumb */}
        <div className="register-page-nav-bar">
          <button
            type="button"
            className="register-back-link"
            onClick={onBackToHome}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Hackathon Home</span>
          </button>
        </div>

        {/* Page Main Card Container */}
        <div className="register-card">
          {successData ? (
            <div className="register-success-box">
              <div className="register-success-icon-wrap">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="register-success-title">
                Registration Confirmed!
              </h2>
              <p className="register-success-desc">
                Team <strong>"{successData.teamName}"</strong> has been successfully registered. Your payment of <strong>₹{successData.amount}</strong> with reference UTR is queued for organizer verification.
              </p>
              
              <div className="register-id-badge">
                <span className="register-id-label">REGISTRATION ID</span>
                <span className="register-id-value">{successData.registrationId}</span>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <SpecularButton
                  size="lg"
                  radius={12}
                  baseColor="var(--hf-red)"
                  lineColor="#FFFFFF"
                  intensity={1}
                  followMouse={true}
                  onClick={onBackToHome}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Return to Hackathon Home</span>
                </SpecularButton>
              </div>
            </div>
          ) : (
            <>
              {/* Header Title & Event Badges */}
              <div className="register-header">
                <div className="register-kicker-badge">
                  <span>CBIT HACKTOBERFEST '26 • OFFICIAL REGISTRATION</span>
                </div>
                <h1 className="register-main-title">
                  Register Your Team
                </h1>
                <p className="register-main-subtitle">
                  17–18 October 2026 • In-Person 24h Hackathon at CBIT Campus, Hyderabad • Teams of 3–5 Members
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="form-error-banner" role="alert">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Registration Stepper Bar */}
              <div className="registration-progress" aria-label="Registration progress">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`registration-progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'complete' : ''}`}
                    onClick={() => {
                      if (index < currentStep) setCurrentStep(index);
                    }}
                    style={{ cursor: index < currentStep ? 'pointer' : 'default' }}
                  >
                    <span className="registration-progress-number">{index < currentStep ? '✓' : index + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} noValidate>
                {/* STEP 1: TEAM DETAILS */}
                {currentStep === 0 && (
                  <div className="registration-step-panel">
                    <div className="form-field-group">
                      <label>Team Name *</label>
                      <input
                        type="text"
                        required
                        ref={setFieldRef('teamName')}
                        aria-invalid={Boolean(fieldErrors.teamName)}
                        placeholder="e.g. CyberPioneers"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                      />
                      {fieldError('teamName')}
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
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Fee Calculation Banner */}
                    <div className="dynamic-fee-banner">
                      <div className="fee-banner-text">
                        <h4>Registration Fee: ₹200 / Head</h4>
                        <p>Includes hot meals, 24-hr workspace, and certificates for all {teamSize} members</p>
                      </div>
                      <div className="fee-banner-price">
                        <div className="fee-banner-amount">₹{totalAmount}</div>
                        <div className="fee-banner-rate">(₹200 × {teamSize} Members)</div>
                      </div>
                    </div>

                    {/* College Sync Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', padding: '0.25rem 0' }}>
                      <input
                        type="checkbox"
                        id="sameCollegeTogglePage"
                        checked={sameCollege}
                        onChange={(e) => setSameCollege(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--hf-yellow)' }}
                      />
                      <label htmlFor="sameCollegeTogglePage" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        All team members belong to the same college / institute
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 2: PARTICIPANTS */}
                {currentStep === 1 && (
                  <div className="registration-step-panel">
                    {/* Section 1: Team Leader Details */}
                    <div className="member-section-card">
                      <div className="member-section-header">
                        <div className="member-section-title">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7B72" strokeWidth="2.5">
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
                            ref={setFieldRef('leader.name')}
                            aria-invalid={Boolean(fieldErrors['leader.name'])}
                            placeholder="Leader's Full Name"
                            value={leader.name}
                            onChange={(e) => handleLeaderChange('name', e.target.value)}
                          />
                          {fieldError('leader.name')}
                        </div>
                        <div className="form-field-group">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            required
                            ref={setFieldRef('leader.email')}
                            aria-invalid={Boolean(fieldErrors['leader.email'])}
                            placeholder="leader@domain.com"
                            value={leader.email}
                            onChange={(e) => handleLeaderChange('email', e.target.value)}
                          />
                          {fieldError('leader.email')}
                        </div>
                      </div>

                      <div className="form-field-row">
                        <div className="form-field-group">
                          <label>Phone Number (10 Digits) *</label>
                          <input
                            type="tel"
                            required
                            ref={setFieldRef('leader.phone')}
                            aria-invalid={Boolean(fieldErrors['leader.phone'])}
                            placeholder="9876543210"
                            value={leader.phone}
                            onChange={(e) => handleLeaderChange('phone', e.target.value)}
                          />
                          {fieldError('leader.phone')}
                        </div>
                        <div className="form-field-group">
                          <label>College / Institute *</label>
                          <input
                            type="text"
                            required
                            ref={setFieldRef('leader.college')}
                            aria-invalid={Boolean(fieldErrors['leader.college'])}
                            placeholder="e.g. CBIT Hyderabad"
                            value={leader.college}
                            onChange={(e) => handleLeaderChange('college', e.target.value)}
                          />
                          {fieldError('leader.college')}
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
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BB2DE" strokeWidth="2.5">
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
                                ref={setFieldRef(`member${idx}.name`)}
                                aria-invalid={Boolean(fieldErrors[`member${idx}.name`])}
                                placeholder={`Member ${memberNum} Full Name`}
                                value={member.name}
                                onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                              />
                              {fieldError(`member${idx}.name`)}
                            </div>
                            <div className="form-field-group">
                              <label>Email Address *</label>
                              <input
                                type="email"
                                required
                                ref={setFieldRef(`member${idx}.email`)}
                                aria-invalid={Boolean(fieldErrors[`member${idx}.email`])}
                                placeholder={`member${memberNum}@domain.com`}
                                value={member.email}
                                onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                              />
                              {fieldError(`member${idx}.email`)}
                            </div>
                          </div>

                          <div className="form-field-row">
                            <div className="form-field-group">
                              <label>Phone Number (10 Digits) *</label>
                              <input
                                type="tel"
                                required
                                ref={setFieldRef(`member${idx}.phone`)}
                                aria-invalid={Boolean(fieldErrors[`member${idx}.phone`])}
                                placeholder="9876543210"
                                value={member.phone}
                                onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                              />
                              {fieldError(`member${idx}.phone`)}
                            </div>
                            <div className="form-field-group">
                              <label>College / Institute *</label>
                              <input
                                type="text"
                                required
                                ref={setFieldRef(`member${idx}.college`)}
                                aria-invalid={Boolean(fieldErrors[`member${idx}.college`])}
                                placeholder="e.g. CBIT Hyderabad"
                                value={member.college}
                                onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                              />
                              {fieldError(`member${idx}.college`)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 3: REVIEW DETAILS */}
                {currentStep === 2 && (
                  <div className="registration-step-panel registration-review-panel">
                    <div className="review-heading">
                      <div>
                        <span className="review-kicker">TEAM SUMMARY</span>
                        <h4>Review your team registration</h4>
                      </div>
                      <div className="review-total">
                        <span>Total fee</span>
                        <strong>₹{totalAmount}</strong>
                      </div>
                    </div>
                    <div className="review-grid">
                      <div><span>Team</span><strong>{teamName.trim() || 'Not entered'}</strong></div>
                      <div><span>Team size</span><strong>{teamSize} participants</strong></div>
                      <div><span>Team leader</span><strong>{leader.name.trim() || 'Not entered'}</strong></div>
                      <div><span>Leader Email</span><strong>{leader.email.trim() || 'Not entered'}</strong></div>
                      <div><span>Leader Phone</span><strong>{leader.phone.trim() || 'Not entered'}</strong></div>
                      <div><span>College</span><strong>{leader.college.trim() || 'Not entered'}</strong></div>
                    </div>
                    <div className="review-participants">
                      <span>All Participants</span>
                      <strong>{[leader, ...members.slice(0, teamSize - 1)].map((participant) => participant.name.trim() || 'Unnamed participant').join(' • ')}</strong>
                    </div>
                    <p className="review-note">Please review your team details carefully. In the next step, you will make the UPI payment of ₹{totalAmount} to confirm your registration.</p>
                  </div>
                )}

                {/* STEP 4: UPI PAYMENT & SUBMIT */}
                {currentStep === 3 && (
                  <div className="registration-step-panel">
                    <div className="qr-payment-panel">
                      <div className="qr-panel-title">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5B726" strokeWidth="2">
                          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                          <line x1="2" y1="10" x2="22" y2="10"></line>
                        </svg>
                        <span>UPI Payment: ₹{totalAmount}</span>
                      </div>
                      <p className="qr-panel-subtitle">
                        Scan the official QR code below using any UPI application (Google Pay, PhonePe, Paytm, BHIM) to pay the exact fee of <strong>₹{totalAmount}</strong> for your {teamSize}-member team.
                      </p>

                      <div className="qr-box-center">
                        <div className="qr-visual-frame">
                          <svg viewBox="0 0 200 200" width="180" height="180">
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
                              <span style={{ color: '#4ADE80', fontSize: '0.78rem', fontWeight: 600 }}>Copied!</span>
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
                          ref={setFieldRef('utrNumber')}
                          aria-invalid={Boolean(fieldErrors.utrNumber)}
                          placeholder="e.g. 428901234567 (12-digit UTR)"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                        />
                        {fieldError('utrNumber')}
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.35rem', display: 'block' }}>
                          Enter the 6–40 character UTR / reference number shown in your payment app's transaction receipt.
                        </small>
                      </div>

                      {/* Payment Confirmation Checkbox */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginTop: '1rem' }}>
                        <input
                          type="checkbox"
                          id="confirmPaymentCheckPage"
                          required
                          checked={paymentConfirmed}
                          ref={setFieldRef('paymentConfirmed')}
                          aria-invalid={Boolean(fieldErrors.paymentConfirmed)}
                          onChange={(e) => setPaymentConfirmed(e.target.checked)}
                          style={{ marginTop: '0.2rem', width: '18px', height: '18px', accentColor: 'var(--hf-yellow)', cursor: 'pointer' }}
                        />
                        <label htmlFor="confirmPaymentCheckPage" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
                          I confirm that I have transferred ₹{totalAmount} to the official COSC UPI ID and provided the genuine transaction reference ID.
                        </label>
                      </div>
                      {fieldError('paymentConfirmed')}
                    </div>
                  </div>
                )}

                {/* Form Action Buttons */}
                <div className="register-actions-row">
                  {currentStep > 0 ? (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleBack}
                      disabled={isSubmitting}
                    >
                      ← Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={onBackToHome}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  )}

                  <div className="register-actions-forward">
                    {currentStep < steps.length - 1 ? (
                      <SpecularButton
                        type="button"
                        size="md"
                        radius={10}
                        baseColor="var(--hf-blue)"
                        lineColor="#FFFFFF"
                        intensity={0.85}
                        followMouse={true}
                        onClick={handleNext}
                      >
                        <span>{currentStep === 2 ? 'Proceed to Payment' : 'Next Step'}</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 5"></polyline>
                        </svg>
                      </SpecularButton>
                    ) : (
                      <SpecularButton
                        type="submit"
                        size="lg"
                        radius={12}
                        baseColor="var(--hf-red)"
                        lineColor="#FFFFFF"
                        intensity={1}
                        followMouse={true}
                        disabled={isSubmitting}
                      >
                        <span>{isSubmitting ? 'Submitting Registration...' : `Pay ₹${totalAmount} & Complete Registration`}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </SpecularButton>
                    )}
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
