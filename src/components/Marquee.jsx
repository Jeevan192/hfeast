import React from 'react';

export default function Marquee() {
  const items = [
    { text: 'LEARN • CODE • SHARE', color: 'red' },
    { text: 'AI BELONGS TO EVERYONE', color: 'blue' },
    { text: '1ST IN-PERSON EDITION ON CAMPUS', color: 'yellow' },
    { text: 'CBIT HACKTOBERFEST 2026', color: 'pink' },
    { text: '24-HOUR NON-STOP HACKATHON', color: 'red' },
    { text: '1100+ PARTICIPANTS LAST YEAR', color: 'blue' },
    { text: 'COSC • CBIT OPEN SOURCE COMMUNITY', color: 'yellow' },
  ];

  return (
    <div className="marquee-container" aria-hidden="true">
      <div className="marquee-content">
        {items.concat(items).map((item, idx) => (
          <span key={idx} className="marquee-phrase">
            <span className={`marquee-dot ${item.color}`}></span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
