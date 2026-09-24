import React from 'react';

export default function About() {
  return (
    <section className="section-wrapper about-wrap" id="about">
      <div className="section-header">
        <h2 className="section-title">ABOUT</h2>
      </div>

      {/* Event overview */}
      <div className="about-stats">
        <div className="about-stat c-yellow">
          <span className="about-stat-num">24</span>
          <span className="about-stat-lbl">Hours</span>
        </div>
        <div className="about-stat c-mint">
          <span className="about-stat-num">3-5</span>
          <span className="about-stat-lbl">Team size</span>
        </div>
        <div className="about-stat c-pink">
          <span className="about-stat-num about-stat-num--dates">Oct 10-11</span>
          <span className="about-stat-lbl">Event dates</span>
        </div>
      </div>

      {/* About cards */}
      <div className="about-qa">
        <article className="about-qa-card qa-blue">
          <h3 className="about-qa-q">What is Hacktoberfest?</h3>
          <p className="about-qa-a">
            Hacktoberfest is a month-long global celebration of all things open source,
            presented by DigitalOcean, Cloudflare, and Quira. Hacktoberfest celebrates
            giving back to these projects, honing skills, and recognizing the people who
            make open source exceptional.
          </p>
        </article>

        <article className="about-qa-card qa-yellow">
          <h3 className="about-qa-q">Why We're Thrilled?</h3>
          <p className="about-qa-a">
            The CBIT Hacktoberfest '26 is a thrilling 24-hour hackathon that inspires
            students and enthusiasts through community, collaboration and skill-building.
            Participants will embrace the spirit of open source while diving into
            innovation and teamwork.
          </p>
        </article>

        <article className="about-qa-card qa-mint">
          <h3 className="about-qa-q">Who Are We?</h3>
          <p className="about-qa-a">
            We are the Chaitanya Bharathi Institute of Technology Open Source Community
            (COSC) in Hyderabad. Our mission is to promote open source values, provide a
            platform for students to explore and contribute to tech, and craft experiences
            that nurture a lifelong love for open source.
          </p>
        </article>
      </div>

      {/* Registration and outcomes */}
      <div className="about-reg">
        <div className="about-reg-col">
          <span className="about-reg-kicker">Registration</span>
          <p className="about-reg-summary"><strong>₹200</strong> per participant</p>
          <p className="about-reg-note">
            Covers meals, event swag, Wi-Fi, workspace, mentor support, and a certificate.
          </p>
        </div>
        <div className="about-reg-col">
          <span className="about-reg-kicker">Outcomes</span>
          <p className="about-reg-note">
            Track prizes and partner awards are decided by judges. Every participant
            receives a certificate.
          </p>
        </div>
      </div>
    </section>
  );
}