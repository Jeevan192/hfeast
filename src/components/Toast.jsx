import React from 'react';

export default function Toast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="toast-bar" role="status">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>{message}</span>
      <button
        onClick={onDismiss}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.5rem' }}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}
