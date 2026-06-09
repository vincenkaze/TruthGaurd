import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../services/authService";

export interface PasswordRecoveryFormProps {
  onClose?: () => void;       // for modal usage (optional)
  onBackToLogin?: () => void; // standardized name
  onSuccess?: () => void;     //  notify parent (e.g., modal) on success
}

export default function PasswordRecoveryForm({
  onClose,
  onBackToLogin,
  onSuccess,
}: PasswordRecoveryFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await requestPasswordReset(email);

      // If a parent handler is provided (modal case), let it handle the UX.
      if (onSuccess) {
        onSuccess();
      } else {
        // Page case: show inline confirmation.
        setSuccess("Check your email for the reset link.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.status === 404
          ? "We couldn't find that endpoint. The reset email may not be enabled on the server yet."
          : err?.response?.data?.detail || err?.message || "Unable to send reset link.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      {/* success only shows in page usage (modal uses onSuccess to show its own message) */}
      {!onSuccess && success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label htmlFor="recovery-email">Email address</label>
        <input
          id="recovery-email"
          type="email"
          name="email"
          placeholder="Enter your account email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send reset link"}
      </button>

      <div className="auth-footer" style={{ marginTop: "0.75rem" }}>
        {onBackToLogin ? (
          <button
            type="button"
            onClick={onBackToLogin}
            className="link"
            style={{ background: "none", border: "none", padding: 0, font: "inherit" }}
          >
            Back to login
          </button>
        ) : (
          <Link to="/login" className="link">
            Back to login
          </Link>
        )}
        {onClose && (
          <>
            {" · "}
            <button
              type="button"
              onClick={onClose}
              className="link"
              style={{ background: "none", border: "none", padding: 0, font: "inherit" }}
            >
              Close
            </button>
          </>
        )}
      </div>
    </form>
  );
}