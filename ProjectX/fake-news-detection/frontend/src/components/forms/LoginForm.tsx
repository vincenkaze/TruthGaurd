import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void; // Trigger forgot password modal
}

export default function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrors({});
    setIsLoading(true);

    try {
      await login(email, password);
      localStorage.removeItem("predict_count");
      if (onSuccess) onSuccess();
    } catch (err) {
      // If backend returns error, map it to password field
      setErrors({ password: err instanceof Error ? err.message : "Login failed" });
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      {/* Password with eye toggle */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <img
          src={showPassword ? "/icons/eye-off.png" : "/icons/eye.png"}
          alt="Toggle password visibility"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" name="remember-me" /> Remember me
        </label>

        {onForgotPassword ? (
          <span
            className="link cursor-pointer"
            onClick={onForgotPassword}
          >
            Forgot password?
          </span>
        ) : (
          <Link to="/forgot-password" className="link">
            Forgot password?
          </Link>
        )}
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
