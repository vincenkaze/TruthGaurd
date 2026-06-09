import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="auth-container animate-fadeIn">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to TruthGuard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Track news authenticity with AI
          </p>
        </div>

        {/* Reusable login form */}
        <LoginForm onSuccess={() => navigate("/")} />
        <div className="auth-footer">
          <p>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
