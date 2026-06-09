import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          {/* Logo + Tagline */}
          <div className="col-lg-6 mb-3">
            <h5 className="mb-3">
              <i className="fas fa-shield-alt me-2"></i>TruthGuard
            </h5>
            <p className="mb-0 small">
              Combating misinformation with artificial intelligence and media
              literacy education.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-6 col-md-6 mb-3 text-lg-end">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled small">
              <li>
                <Link to="/" className="text-white-50">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-white-50">
                  About
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-white-50">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-white-50">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-3 bg-secondary" />

        {/* Bottom bar */}
        <div className="row">
          <div className="col-md-6 text-center text-md-start small">
            &copy; 2025 TruthGuard. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end small">
            <Link to="/privacy" className="text-white-50">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link to="/terms" className="text-white-50">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}