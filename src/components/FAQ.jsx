import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is CBIT Hacktoberfest Hackathon?',
      a: 'CBIT Hacktoberfest Hackathon is an intense 24-hour hackathon celebrating open-source software, collaboration and community innovation. Organised annually by COSC at Chaitanya Bharathi Institute of Technology (CBIT) in Hyderabad, this edition marks our very first in-person gathering on campus.',
    },
    {
      q: 'Who is eligible to participate?',
      a: 'Any currently enrolled college or university student across any branch, department or degree program. Whether you are a first-year beginner just getting started with Git or an experienced final-year engineer, all curious builders are welcome.',
    },
    {
      q: 'Is there any registration fee?',
      a: 'No. Registration and participation in CBIT Hacktoberfest Hackathon are 100% free. We believe learning and open-source opportunities must be accessible without financial barriers.',
    },
    {
      q: 'I am a complete beginner to hackathons and open source. Can I still join?',
      a: 'Yes. We host our dedicated Preptember sessions before the hackathon specifically to train beginners in Git, GitHub collaboration, tech stack selection and project pitching. Additionally, experienced mentors will be available on the campus floor 24/7 during the hackathon.',
    },
    {
      q: 'Where will the event be hosted and what should I bring?',
      a: 'The event will be hosted physically at the CBIT Campus, Gandipet, Hyderabad. Participants should bring their personal laptop, chargers, valid student ID card, extension cords (recommended) and an eagerness to build. High-speed Wi-Fi, workspace and refreshments will be provided on campus.',
    },
    {
      q: 'What is Open Source and why should I care?',
      a: 'Open Source refers to software whose underlying source code is made publicly available for anyone to inspect, modify and enhance. In 2025 alone, India added over 5 million developers to GitHub. Contributing to open source builds your real-world portfolio, teamwork skills and global developer network.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="section-wrapper" id="faq">
      <div className="section-header">
        <h2 className="section-title">FAQ</h2>
        <p className="section-subtitle">
          Everything you need to know about eligibility, team size, venue logistics and hackathon guidelines.
        </p>
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
