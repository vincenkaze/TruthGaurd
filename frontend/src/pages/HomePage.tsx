import NewsChecker from "../components/NewsChecker";
import { useAuth } from "../context/AuthContext";

interface HomePageProps {
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HomePage({ setShowSignUp }: HomePageProps) {
  const { isAuthenticated } = useAuth();

  const maybeRequireSignup = () => {
    const count = Number(localStorage.getItem("predict_count") || 0);
    if (!isAuthenticated && count >= 2) {
      setShowSignUp(true);
    } else {
      localStorage.setItem("predict_count", String(count + 1));
    }
  };

  return (
    <>
      <header className="hero-section text-white text-center">
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-4">Check Before You Share Something</h1>
          <p className="lead mb-5">
            Our advanced AI analyzes news content to help you identify misinformation and stay informed.
          </p>

          <div className="news-checker-card p-4 rounded shadow-lg bg-white">
            <h3 className="mb-4">Check News Authenticity</h3>
            <NewsChecker requireAuthCheck={maybeRequireSignup} />
          </div>
        </div>
      </header>

      <section id="about" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              <h2 className="fw-bold mb-4">About TruthGuard</h2>
              <p className="lead">TruthGuard is an AI-powered platform designed to combat misinformation.</p>
              <p>We analyze news for deception, bias, or inaccuracy using NLP + ML.</p>
              <p>Multiple verification techniques give users a full reliability picture.</p>
            </div>
            <div className="col-lg-6">
              <img
                src="/image/horizon.png"
                alt="TruthGuard digital shield"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100">
                  <i className="fas fa-rss fa-2x text-primary mb-3"></i>
                  <h5>Step 1: Collect</h5>
                  <p className="text-muted">TruthGuard automatically gathers news from trusted RSS feeds in real-time.</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100">
                  <i className="fas fa-brain fa-2x text-success mb-3"></i>
                  <h5>Step 2: Analyze</h5>
                  <p className="text-muted">Our AI model uses NLP + ML to detect bias, misinformation, or manipulative patterns.</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100">
                  <i className="fas fa-check-circle fa-2x text-info mb-3"></i>
                  <h5>Step 3: Verify</h5>
                  <p className="text-muted">The system provides a clear Fake/Real classification with confidence score and feedback options.</p>
                </div>
              </div>
            </div>
        </div>
      </section>

      <section id="faq" className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">

              <div className="accordion-item">
                <h2 className="accordion-header" id="faq1">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse1"
                    aria-expanded="true"
                    aria-controls="collapse1"
                    >
                      How accurate is TruthGuard?
                  </button>
                </h2>
              <div id="collapse1" className="accordion-collapse collapse show" aria-labelledby="faq1" data-bs-parent="#faqAccordion">
              <div className="accordion-body">
                TruthGuard achieves high accuracy using ML models trained on large datasets. Accuracy improves as more users contribute feedback.
              </div>
            </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="faq2">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse2"
              aria-expanded="false"
              aria-controls="collapse2"
            >
              Do I need an account to use it?
            </button>
          </h2>
        <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="faq2" data-bs-parent="#faqAccordion">
          <div className="accordion-body">
            No account is required to check news. However, features like saving results and submitting feedback require a free account.
          </div>
        </div>
      </div>

      <div className="accordion-item">
        <h2 className="accordion-header" id="faq3">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse3"
            aria-expanded="false"
            aria-controls="collapse3"
          >
            Can I fully trust the results?
          </button>
        </h2>
        <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="faq3" data-bs-parent="#faqAccordion">
          <div className="accordion-body">
            No system is perfect. TruthGuard provides probabilities and context, but users should always verify with multiple trusted sources.
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

    </>
  );
}