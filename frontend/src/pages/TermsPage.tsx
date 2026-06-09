import { useState, useEffect } from "react";

export default function TermsPage() {
  const [effectiveDate, setEffectiveDate] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    const date = new Date();

    // Date formatting
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setEffectiveDate(date.toLocaleDateString("en-US", options));
    setCurrentYear(String(date.getFullYear()));
  }, []);

  return (
    <>
      <header className="terms-header text-white text-center py-5 mb-4">
        <div className="container">
          <h1 className="display-4 fw-bold">Terms of Service</h1>
          <p className="lead">Your rights, your data, your choice—always</p>
          <p>Effective: {effectiveDate}</p>
        </div>
      </header>

      <main className="container mb-5">
        <section className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to TruthGuard. By accessing or using our services, you agree
            to these Terms of Service...
          </p>
        </section>

        <section className="terms-section">
          <h2>2. User Rights and Freedom of Choice</h2>
          <ul className="list-unstyled">
            <li><i className="fas fa-check-circle icon-bullet" /> Access, modify, or delete your account and data.</li>
            <li><i className="fas fa-check-circle icon-bullet" /> No service denial for withdrawing consent to data collection.</li>
            <li><i className="fas fa-check-circle icon-bullet" /> No forced terms without consent.</li>
            <li><i className="fas fa-check-circle icon-bullet" /> Data never sold, shared, or used for purposes beyond what you have agreed to.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Acceptable Use</h2>
          <div className="warning-box">
            <ul>
              <li>No illegal activity</li>
              <li>No abuse or platform misuse</li>
              <li>No system hacking or harm</li>
              <li>No unlawful data submission</li>
            </ul>
          </div>
          <p className="legal-highlight">
            We prohibit unlawful actions on our platform. Any such actions will result in immediate termination of access and may lead to legal liabilities.
          </p>
          <h3>Consequences of Violation</h3>
          <ul>
            <li>Immediate account termination for serious violations</li>
            <li>Permanent blacklisting for repeat offenders</li>
            <li>Cooperation with law enforcement when legally required</li>
            <li>Civil and criminal liability for unlawful activities</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. Privacy and Data Protection</h2>
          <p>
            Your privacy is paramount. We do not track, share, or sell your data. Our Privacy Policy governs how your information is handled, and you may review it at any time to ensure full transparency. If you choose to withdraw consent for data collection, your experience will remain unaffected.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Updates and Modifications</h2>
          <div className="notice-box">
            <ul className="list-unstyled">
              <li><i className="fas fa-bell icon-bullet" /> Advance notice for any changes</li>
              <li><i className="fas fa-handshake icon-bullet" /> Your explicit consent is required before updates take effect</li>
              <li><i className="fas fa-door-open icon-bullet" /> You may continue using the existing version or opt out without penalties</li>
            </ul>
          </div>
        </section>

        <section className="terms-section">
          <h2>6. Account Suspension and Termination</h2>
          <p>You have the right to delete your account at any time, and all your data will be permanently removed.</p>
          <h3>Right to Appeal</h3>
          <p>
            If you believe your account has been suspended by mistake, you may submit an appeal to our support team. We use both automated systems and human review to ensure fair evaluation of all appeals.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Liability and Disclaimers</h2>
          <p>
            We strive to provide a seamless experience but cannot guarantee uninterrupted service. You use our platform at your own discretion.
          </p>
          <div className="warning-box">
            <p className="legal-highlight">
              We are not responsible for user actions that result in legal consequences. Users bear full responsibility for unlawful activities conducted through our platform.
            </p>
          </div>
        </section>

        <section className="terms-section">
          <h2>8. Intellectual Property Rights</h2>
          <p>
            All platform content, software, and AI algorithms are protected under international copyright laws.
          </p>
          <div className="warning-box">
            <p className="legal-highlight">
              This platform is NOT open source. Unauthorized reproduction, modification, or distribution of our software or algorithms constitutes a prosecutable offense.
            </p>
          </div>
        </section>

        <section className="terms-section">
          <h2>9. Contact and Support</h2>
          <div className="mt-4">
            <p><i className="fas fa-envelope me-2" /> Email: legal@truthguard.example</p>
            <p><i className="fas fa-globe me-2" /> Website: <a href="https://truthguard.example/support">truthguard.example/support</a></p>
          </div>
        </section>
      </main>

      <footer className="bg-dark text-white text-center py-4">
        <div className="container">
          <p className="mb-0">&copy; {currentYear} TruthGuard. All rights reserved.</p>
          <p className="mb-0">
            <a href="/privacy" className="text-white me-3">Privacy Policy</a>
            <a href="/" className="text-white">Return to Home</a>
          </p>
        </div>
      </footer>
    </>
  );
}