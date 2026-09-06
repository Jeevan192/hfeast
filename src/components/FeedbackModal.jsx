import React, { useState } from 'react';

export default function FeedbackModal({ isOpen, onClose, onSubmitSuccess }) {
  const [ratings, setRatings] = useState({
    org: 5,
    problems: 5,
    mentors: 5,
    overall: 5,
  });

  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    overallText: '',
    suggestions: '',
    highlights: '',
  });

  if (!isOpen) return null;

  const setCategoryRating = (cat, val) => {
    setRatings({ ...ratings, [cat]: val });
  };

  const handleInputChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitSuccess('Thank you for your valuable feedback! COSC appreciates your thoughts.');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <div className="modal-header-title">EVENT FEEDBACK</div>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="modal-scrollable-body">
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Share Your Thoughts
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Your feedback directly impacts how we craft workshops, mentor checkpoints, and future editions.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Star Ratings Block */}
            <div className="star-rating-block">
              <div className="star-item-row">
                <span className="star-item-label">Organization & Logistics</span>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-click ${ratings.org >= star ? 'filled' : ''}`}
                      onClick={() => setCategoryRating('org', star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="star-item-row">
                <span className="star-item-label">Problem Statements Quality</span>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-click ${ratings.problems >= star ? 'filled' : ''}`}
                      onClick={() => setCategoryRating('problems', star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="star-item-row">
                <span className="star-item-label">Mentorship & Checkpoint Support</span>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-click ${ratings.mentors >= star ? 'filled' : ''}`}
                      onClick={() => setCategoryRating('mentors', star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="star-item-row">
                <span className="star-item-label">Overall Hackathon Experience</span>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-click ${ratings.overall >= star ? 'filled' : ''}`}
                      onClick={() => setCategoryRating('overall', star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-field-row">
              <div className="form-field-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  value={feedback.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-field-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@domain.com"
                  value={feedback.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-field-group">
              <label>How was your overall experience with CBIT Hacktoberfest? *</label>
              <textarea
                name="overallText"
                rows="3"
                required
                placeholder="Tell us what you liked most and how the event went for your team..."
                value={feedback.overallText}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="form-field-group">
              <label>What suggestions or improvements do you have for future events?</label>
              <textarea
                name="suggestions"
                rows="2"
                placeholder="Ideas for workshops, timeline adjustments, or new tracks..."
                value={feedback.suggestions}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="form-field-group">
              <label>What were the highlights of the event for you?</label>
              <textarea
                name="highlights"
                rows="2"
                placeholder="Key moments, ice-breaker games, mentorship interactions..."
                value={feedback.highlights}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="modal-actions-row">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <span>Submit Feedback</span>
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
