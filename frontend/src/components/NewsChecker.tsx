import { useState } from "react";
import { useEffect } from "react";
import { predictFakeNews } from "../services/api";
import FeedbackModel from "./FeedbackModel";
import SignUpModal from "./modals/SignUpModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalysisResults from "./AnalysisResults";

interface NewsCheckerProps {
  requireAuthCheck?: () => void;
}

type PredictionResult = {
  predictionId: string;
  prediction: "FAKE" | "REAL";
  confidence: number;
};

export default function NewsChecker({ requireAuthCheck }: NewsCheckerProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const MAX_GUEST_PREDICTS = 3;
  const token = localStorage.getItem("token");
  const [predictCount, setPredictCount] = useState<number>(
    Number(localStorage.getItem("predict_count") || 0)
  );

  const handleAnalyze = async () => {
  const words = text.trim().split(/\s+/);
  console.log(" Input Text:", text);
  console.log(" Word Count:", words.length);

  if (!text.trim()) {
    alert("Please enter or paste a news article to analyze.");
    return;
  }

  if (words.length < 50) {
    alert(`Please enter at least 50 words (you entered ${words.length}).`);
    return;
  }

  if (!token && predictCount >= MAX_GUEST_PREDICTS) {
    setShowSignup(true);
    return;
  }

  if (requireAuthCheck) requireAuthCheck();

  setLoading(true);
  setError("");

  console.log(" Calling predictFakeNews...");
  try {
    const response = await predictFakeNews(text);
    console.log(" API Response:", response);

    const predictionResult: PredictionResult = {
      predictionId: response?.predictionId ?? crypto.randomUUID(),
      prediction: response?.prediction,
      confidence: response?.confidence,
    };

    setResult(predictionResult);
    console.log(" Result Set:", predictionResult);

    if (!token) {
      const updatedCount = predictCount + 1;
      setPredictCount(updatedCount);
      localStorage.setItem("predict_count", String(updatedCount));
    }
  } catch (err) {
    console.error(" API Error:", err);
    setError("Failed to analyze the news. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const clearInput = () => {
    setText("");
    setResult(null);
    setError("");
    setShowFeedback(false);
  };

  console.log(" Render: showFeedback:", showFeedback);
  console.log(" Render: result:", result);

  useEffect(() => {
  console.log(" Effect triggered: result =", result);
  console.log(" showFeedback =", showFeedback);
  if (result && !loading) {
    setTimeout(() => setShowFeedback(true), 5000);
  }
}, [result, loading]);

  return (
    <div>
      {showSignup && (
        <SignUpModal
          onClose={() => {
            setShowSignup(false);
            setText("");
          }}
          onSwitchToLogin={() => {
            setShowSignup(false);
          }}
        />
      )}

      {result && showFeedback && (
        <FeedbackModel
          isOpen={true}
          onClose={() => setShowFeedback(false)}
          predictionId={result.predictionId}
          onSubmit={(rating: number) => {
            console.log("User submitted rating:", rating);
            toast.success("Thanks for your feedback!");
            setShowFeedback(false);
          }}
        />
      )}

      <div className="input-group mb-3">
        <input
          className="form-control form-control-lg"
          placeholder="Paste news article here (minimum 50 words)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="btn btn-primary btn-lg"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <button className="btn btn-outline-secondary me-2" onClick={clearInput}>
          <i className="fas fa-trash-alt me-1" /> Clear
        </button>
      </div>

      {error && (
        <div className="alert alert-danger text-start" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
        <div className="spinner" />
        </div>
      )}

      <div aria-live="polite">
        {result && !loading && (
          <section className="mt-4">
            <AnalysisResults result={result} />
          </section>
        )}
      </div>
    </div>
  );
}