import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Preptember from './components/Preptember';
import PreptemberPage from './components/PreptemberPage';
import Timeline from './components/Timeline';
import Sponsors from './components/Sponsors';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';
import FeedbackModal from './components/FeedbackModal';
import Toast from './components/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'preptember'
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  return (
    <div className="app-root">
      {/* Beautiful atmospheric background with visible grid and subtle glows */}
      <div className="app-background" aria-hidden="true"></div>

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

            {/* Dynamic Infinite Marquee */}
            <Marquee />

            {/* About Section */}
            <About />

            {/* Preptember Section */}
            <Preptember onOpenPreptemberPage={() => setCurrentView('preptember')} />

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

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmitSuccess={(msg) => showToast(msg)}
      />

      {/* Real-time Toast Alerts */}
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </div>
  );
}
