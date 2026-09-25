import React, { useEffect, useRef, useState } from 'react';
import GlareHover from './GlareHover.jsx';

export default function Timeline() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const treeRef = useRef(null);
  const lineRef = useRef(null);
  const rowRefs = useRef([]);

  const [reachedSet, setReachedSet] = useState(new Set([0]));

  const events = [
    {
      side: 'left',
      date: '10th October 2026',
      time: '05:00 PM',
      title: 'Opening Ceremony',
      desc: 'Welcome address by COSC faculty and leads, kicking off the 8th edition of CBIT Hacktoberfest Hackathon.',
      colorClass: 'node-blue',
      color: '#569AE0',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"></path>
        </svg>
      ),
    },
    {
      side: 'right',
      date: '10th October 2026',
      time: '06:00 PM',
      title: 'Releasing Problem Statements',
      desc: 'Official release of problem statements across key application domains.',
      colorClass: 'node-yellow',
      color: '#F5B62A',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
    },
    {
      side: 'left',
      date: '10th October 2026',
      time: '06:30 PM',
      title: 'Finalizing Problem Statement',
      desc: 'Teams lock in their chosen problem statement with domain mentors on the floor.',
      colorClass: 'node-green',
      color: '#3C7E64',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <polyline points="17 11 19 13 23 9"></polyline>
        </svg>
      ),
    },
    {
      side: 'right',
      date: '10th October 2026',
      time: '07:00 PM',
      title: 'Coding Begins',
      desc: '24 hours of non-stop collaborative coding, software architecture and repository commits begin.',
      colorClass: 'node-red',
      color: '#BA3627',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      ),
    },
    {
      side: 'left',
      date: '11th October 2026',
      time: '01:00 AM',
      title: 'Ice-Breaker Session-1',
      desc: 'Midnight games, developer humor, refreshments and team energizers.',
      colorClass: 'node-yellow',
      color: '#F5B62A',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="6" y1="12" x2="10" y2="12"></line>
          <line x1="8" y1="10" x2="8" y2="14"></line>
          <line x1="15" y1="13" x2="15.01" y2="13"></line>
          <line x1="18" y1="11" x2="18.01" y2="11"></line>
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
        </svg>
      ),
    },
    {
      side: 'right',
      date: '11th October 2026',
      time: '08:00 AM',
      title: 'Ice-Breaker Session-2',
      desc: 'Morning refresh, breakfast and check-in ahead of the final build sprint.',
      colorClass: 'node-blue',
      color: '#569AE0',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      ),
    },
    {
      side: 'left',
      date: '11th October 2026',
      time: '02:00 PM',
      title: 'Submissions Open',
      desc: 'Portal opens for submitting GitHub repository links, documentation and demo links.',
      colorClass: 'node-green',
      color: '#3C7E64',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      ),
    },
    {
      side: 'right',
      date: '11th October 2026',
      time: '03:00 PM',
      title: 'Coding & Submissions End • Presentations',
      desc: 'Strict code freeze. Teams deliver live prototype demonstrations to jury panels.',
      colorClass: 'node-red',
      color: '#BA3627',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
    },
    {
      side: 'left',
      date: '11th October 2026',
      time: '04:30 PM',
      title: 'Evaluations',
      desc: 'Scoring across code quality, technical execution, innovation and open source practices.',
      colorClass: 'node-yellow',
      color: '#F5B62A',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <polyline points="9 14 11 16 15 12"></polyline>
        </svg>
      ),
    },
    {
      side: 'right',
      date: '11th October 2026',
      time: '05:30 PM',
      title: 'Closing Ceremony & Awards',
      desc: 'Prize distribution, certificates, partner recognitions and grand finale.',
      colorClass: 'node-blue',
      color: '#569AE0',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"></path>
          <path d="M18 4H6v7a6 6 0 0 0 12 0V4z"></path>
        </svg>
      ),
    },
  ];

  useEffect(() => {
    let animId;

    const onScroll = () => {
      const tree = treeRef.current;
      const line = lineRef.current;
      if (!tree || !line) return;

      const treeRect = tree.getBoundingClientRect();
      const viewportFocus = window.innerHeight * 0.55;

      // Distance scrolled through timeline
      const scrollYInTree = viewportFocus - treeRect.top;
      const treeHeight = tree.offsetHeight;

      const clampedHeight = Math.max(0, Math.min(scrollYInTree, treeHeight));
      line.style.height = `${clampedHeight}px`;

      const newReached = new Set();

      rowRefs.current.forEach((row, idx) => {
        if (!row) return;
        const iconNode = row.querySelector('.timeline-icon-node');
        const nodePos = iconNode
          ? iconNode.getBoundingClientRect().top + iconNode.offsetHeight * 0.5 - treeRect.top
          : row.offsetTop + row.offsetHeight * 0.5;

        if (clampedHeight >= nodePos - 20) {
          newReached.add(idx);
        }

      });

      setReachedSet(newReached);

    };

    const handleScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(onScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="section-wrapper" id="timeline">
      <div className="section-header">
        <h2 className="section-title">TIMELINE</h2>
      </div>

      <div className="timeline-tree" ref={treeRef}>
        {/* Progress Beam Line */}
        <div
          className="timeline-progress-line"
          ref={lineRef}
          aria-hidden="true"
        />

        {events.map((evt, idx) => {
          const isReached = reachedSet.has(idx);

          return (
            <div
              key={idx}
              ref={(el) => (rowRefs.current[idx] = el)}
              className={`timeline-row ${evt.side} ${evt.colorClass} ${
                isReached ? 'is-reached' : ''
              }`}
            >
              <GlareHover
                borderRadius={14}
                glareOpacity={isReached ? 0.25 : 0.15}
                glareSize={240}
                className="timeline-card-wrap"
              >
                <div className="timeline-card-box">
                  <div className="t-card-header">
                    <span
                      className="t-card-badge"
                      style={{
                        color: evt.color,
                        borderColor: `${evt.color}44`,
                        backgroundColor: `${evt.color}14`,
                      }}
                    >
                      Step {idx + 1}
                    </span>
                  </div>
                  <h3 className="t-event-title">{evt.title}</h3>
                  <p className="t-event-desc">{evt.desc}</p>
                </div>
              </GlareHover>

              {/* Center Circular Icon Node */}
              <div
                className="timeline-icon-node"
                title={evt.title}
                style={{
                  borderColor: evt.color,
                  boxShadow: `0 0 20px ${evt.color}88, inset 0 0 10px ${evt.color}44`,
                }}
              >
                {evt.icon}
              </div>

              {/* Time Stamp on opposite side */}
              <div className="timeline-time-display">
                <span className="time-label-date">{evt.date}</span>
                <span className="time-label-clock">{evt.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

