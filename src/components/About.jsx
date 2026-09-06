import React from 'react';

export default function About() {
  return (
    <section className="section-wrapper" id="about">
      <div className="section-header">
        <h2 className="section-title">ABOUT CBIT HACKTOBERFEST HACKATHON</h2>
        <p className="section-subtitle">
          Empowering the next generation of engineers through open source culture, collective problem-solving and hands-on community building.
        </p>
      </div>

      {/* 4 Clean Cards Grid */}
      <div className="cards-grid-2x2">
        {/* Card 1 */}
        <div className="clean-card">
          <div className="card-top">
            <span className="card-step-tag">01 / GLOBAL MOVEMENT</span>
            <div className="geo-shape-cell cell-blue" style={{ width: '16px', height: '16px' }}></div>
          </div>
          <h3 className="card-title">What is Hacktoberfest?</h3>
          <p className="card-desc">
            Hacktoberfest is DigitalOcean's annual month-long celebration that inspires developers worldwide to contribute
            to open-source software. Modern technologies rely deeply on projects maintained by passionate contributors.
            Hacktoberfest is about giving back, honing real-world coding skills and honoring the collective spirit of open development.
          </p>
          <div className="card-tags">
            <span className="mini-tag">DigitalOcean</span>
            <span className="mini-tag">Global FOSS Celebration</span>
            <span className="mini-tag">GitHub Contributions</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="clean-card">
          <div className="card-top">
            <span className="card-step-tag">02 / HOST COMMUNITY</span>
            <div className="geo-shape-cell cell-red" style={{ width: '16px', height: '16px' }}></div>
          </div>
          <h3 className="card-title">Who is COSC?</h3>
          <p className="card-desc">
            We are <strong>COSC (CBIT Open Source Community)</strong>, a prestigious student-led technical community based at
            Chaitanya Bharathi Institute of Technology in Hyderabad. We actively champion open collaboration and cultivate
            a space where students learn to build software whose source code is open, transparent and accessible to everyone.
          </p>
          <div className="card-tags">
            <span className="mini-tag">CBIT Hyderabad</span>
            <span className="mini-tag">2,500+ Community</span>
            <span className="mini-tag">Student-Led</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="clean-card">
          <div className="card-top">
            <span className="card-step-tag">03 / OUR PURPOSE</span>
            <div className="geo-shape-cell cell-yellow" style={{ width: '16px', height: '16px' }}></div>
          </div>
          <h3 className="card-title">COSC's Intent & Vision</h3>
          <p className="card-desc">
            We believe in the power of collective progress. Our mission is to bring open source directly to your fingertips
            through year-round hackathons, boot camps, hands-on workshops and tech awareness sessions. We strive to help
            every student transition from just using software to actively authoring and maintaining it.
          </p>
          <div className="card-tags">
            <span className="mini-tag">Hands-on Workshops</span>
            <span className="mini-tag">Mentorship</span>
            <span className="mini-tag">Collective Progress</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="clean-card" style={{ borderColor: 'rgba(231, 125, 138, 0.3)' }}>
          <div className="card-top">
            <span className="card-step-tag" style={{ color: 'var(--color-pink)' }}>04 / IN-PERSON MILESTONE</span>
            <div className="geo-shape-cell cell-pink" style={{ width: '16px', height: '16px' }}></div>
          </div>
          <h3 className="card-title">First Time In-Person on Campus</h3>
          <p className="card-desc">
            Since 2018, the CBIT Hacktoberfest Hackathon has united hundreds of developers virtually. This year, we are taking
            that energy off the screen and directly onto our vibrant campus in Hyderabad. Builders will collaborate under
            one roof for an electrifying 24-hour sprint packed with live mentoring, lightning talks and midnight coding energy.
          </p>
          <div className="card-tags">
            <span className="mini-tag">Offline at CBIT Campus</span>
            <span className="mini-tag">24-Hour Non-stop</span>
            <span className="mini-tag">Direct Mentoring</span>
          </div>
        </div>
      </div>
    </section>
  );
}
