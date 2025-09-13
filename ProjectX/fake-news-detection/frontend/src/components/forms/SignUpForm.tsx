import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { validatePassword } from "../../utils/validators";

interface SignUpFormProps {
  onSuccess?: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear field error while typing
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const user = await registerUser(
        formData.email,
        formData.password,
        formData.name
      );

      if (!user) {
        setErrors({ form: "Registration failed. Please try again." });
        return;
      }

      await login(formData.email, formData.password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrors({
        form:
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to create an account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {errors.form && <div className="alert alert-error">{errors.form}</div>}

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      {/* Password with eye toggle */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
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

      {/* Confirm password with eye toggle */}
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-field"
        />
        <img
          src={showConfirmPassword ? "/icons/eye-off.png" : "/icons/eye.png"}
          alt="Toggle confirm password visibility"
          className="password-toggle"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
