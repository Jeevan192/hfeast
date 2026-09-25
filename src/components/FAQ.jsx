import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  const faqs = [
    {
      q: 'What is CBIT Hacktoberfest Hackathon?',
      a: 'CBIT Hacktoberfest Hackathon is a 24-hour, in-person event where students collaborate, learn, and build practical open-source projects at CBIT Campus.',
    },
    {
      q: 'Who can participate?',
      a: 'Any currently enrolled undergraduate, postgraduate, or diploma student from any college or university across India can participate. Beginners and experienced builders are both welcome.',
    },
    {
      q: 'Is there a registration fee?',
      a: 'Yes. The registration fee is ₹200 per participant. It includes campus access, meals, mentorship, Wi-Fi, event essentials, and certificates.',
    },
    {
      q: 'Is this event open to beginners?',
      a: 'Absolutely. Pre-event workshops and on-site mentors will help participants get started with Git, GitHub, open source, and hackathon project development.',
    },
    {
      q: 'What is Open Source?',
      a: 'Open source is software whose source code is available for people to view, use, improve, and share. Hacktoberfest celebrates this collaborative way of building technology.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="section-wrapper" id="faq">
      <div className="section-header">
        <h2 className="section-title">FAQ</h2>
      </div>

      <div className="faq-accordion">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`faq-row ${isOpen ? 'open' : ''}`}>
              <button
                className="faq-trigger"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <svg
                  className="faq-chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {isOpen && (
                <div className="faq-content">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
