import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Preptember from './components/Preptember';
import PreptemberPage from './components/PreptemberPage';
import Mentors from './components/Mentors.jsx';
import Timeline from './components/Timeline';
import Sponsors from './components/Sponsors';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import FeedbackModal from './components/FeedbackModal';
import Toast from './components/Toast';

import AtmosphericBackground from './components/AtmosphericBackground.jsx';

// Toggle to true post-event to enable feedback modal
const SHOW_FEEDBACK = false;

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'preptember'
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.section-wrapper:not(.hero) > *');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });

    revealItems.forEach((item) => {
      item.classList.add('scroll-reveal');
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [currentView]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  return (
    <div className="app-root">
      {/* Rich atmospheric background with auroras, grid, and Hacktoberfest 2026 pixel art */}
      <AtmosphericBackground />

      {/* Navigation Header */}
      <Navbar
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onNavigateHome={() => setCurrentView('home')}
      />

      <main>
        {currentView === 'preptember' ? (
          <PreptemberPage onBackToHome={() => setCurrentView('home')} />
        ) : (
          <>
            {/* Hero Section */}
            <Hero onOpenRegister={() => setRegisterModalOpen(true)} />

            {/* About Section */}
            <About />

            {/* Preptember Section */}
            <Preptember onOpenPreptemberPage={() => setCurrentView('preptember')} />

            {/* Mentors Section */}
            <Mentors />

            {/* 2025-Style Proper Timeline */}
            <Timeline />

            {/* Sponsors Section with Interactive Hover Illumination */}
            <Sponsors />

            {/* Frequently Asked Questions */}
            <FAQ />

            {/* Contact Section */}
            <Contact />
          </>
        )}
      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Interactive Modals */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSubmitSuccess={(msg) => showToast(msg)}
      />

      {SHOW_FEEDBACK && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          onSubmitSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Real-time Toast Alerts */}
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </div>
  );
}
