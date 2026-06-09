import { useState, useEffect } from "react";

export default function PrivacyPage() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const now = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(now);
  }, []);

  return (
    <>
      <header className="privacy-header text-white text-center py-5 mb-4">
        <div className="container">
          <h1 className="display-4 fw-bold">Privacy Policy</h1>
          <p className="lead">Your privacy is our top priority</p>
          <p>Last Updated: {currentDate}</p>
        </div>
      </header>

      <main className="container mb-5">
        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to TruthGuard. This Privacy Policy explains how we collect, use, and protect your information.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. Data Collection and Usage</h2>
          <p>We only collect what’s needed to improve the experience and models.</p>

          <h3>What We Collect:</h3>
          <ul className="list-unstyled">
            <li><i className="fas fa-check-circle icon-bullet" /> <strong>User Inputs:</strong> News text or content for analysis</li>
            <li><i className="fas fa-check-circle icon-bullet" /> <strong>Usage Data:</strong> Clicks, sessions, performance</li>
          </ul>

          <h3>How We Use It:</h3>
          <ul className="list-unstyled">
            <li>To improve predictions and feedback accuracy</li>
            <li>To personalize your experience</li>
            <li>To protect the platform</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. Data Protection and Security</h2>
          <p>We implement strong security measures including:</p>
          <div className="highlight-box">
            <ul className="list-unstyled">
              <li><i className="fas fa-user-shield icon-bullet" /> <strong>Strict Access:</strong> No internal team access to content</li>
              <li><i className="fas fa-trash-alt icon-bullet" /> <strong>Permanent Deletion:</strong> We erase your data after use</li>
              <li><i className="fas fa-gavel icon-bullet" /> <strong>GDPR / CCPA Compliance:</strong> Always privacy-first</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section">
          <h2>4. User Control and Consent</h2>
          <p>Your privacy is paramount. See our{" "}
            <a href="/privacy">Privacy Policy</a> for full details.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. No Third-Party Access or Sharing</h2>
          <p>
            We only respond to official legal orders. No voluntary or informal sharing ever occurs.
          </p>
        </section>

        <section className="privacy-section">
          <h2>6. Law Enforcement Requests</h2>
          <p>
            We aim for 100% uptime, but issues may occur. You use TruthGuard at your own discretion.
          </p>
        </section>

        <section className="privacy-section">
          <h2>7. Contact Us</h2>
          <p>
            Have questions? Contact us:
            <br /><i className="fas fa-envelope me-2" /> <strong>Email:</strong> privacy@truthguard.example
            <br /><i className="fas fa-globe me-2" /> <strong>Web:</strong> <a href="https://truthguard.example/contact">truthguard.example/contact</a>
          </p>
        </section>
      </main>

      <footer className="bg-dark text-white text-center py-4">
        <div className="container">
          <p className="mb-0">&copy; 2025 TruthGuard. All rights reserved.</p>
          <p className="mb-0">
            <a href="/" className="text-white">Return to Home</a>
          </p>
        </div>
      </footer>
    </>
  );
}