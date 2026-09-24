import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Preptember from './components/Preptember';
import PreptemberPage from './components/PreptemberPage';
import RegisterPage from './components/RegisterPage';
import Mentors from './components/Mentors.jsx';
import Timeline from './components/Timeline';
import Sponsors from './components/Sponsors';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FeedbackModal from './components/FeedbackModal';
import Toast from './components/Toast';
import InteractiveBackground from './components/InteractiveBackground.jsx';


// Toggle to true post-event to enable feedback modal
const SHOW_FEEDBACK = false;

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'preptember' | 'register'
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync view with URL hash
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#register') {
        setCurrentView('register');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#preptember') {
        setCurrentView('preptember');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    handleHashSync();

    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'register') {
      window.location.hash = '#register';
    } else if (view === 'preptember') {
      window.location.hash = '#preptember';
    } else {
      if (window.location.hash === '#register' || window.location.hash === '#preptember') {
        history.pushState(null, '', window.location.pathname);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const navigateToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPreptember = () => {
    setCurrentView('preptember');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      <InteractiveBackground />

      {/* Navigation Header */}
      <Navbar
        onOpenRegister={() => navigateTo('register')}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onNavigateHome={() => navigateTo('home')}
      />

      <main>
        {currentView === 'register' ? (
          <RegisterPage
            onBackToHome={() => navigateTo('home')}
            onSubmitSuccess={(msg) => showToast(msg)}
          />
        ) : currentView === 'preptember' ? (
          <PreptemberPage onBackToHome={() => navigateTo('home')} />
        ) : (
          <>
            {/* Hero Section */}
            <Hero onOpenRegister={() => navigateTo('register')} />

            {/* About Section */}
            <About />

            {/* Preptember Section */}
            <Preptember onOpenPreptemberPage={() => navigateTo('preptember')} />

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

