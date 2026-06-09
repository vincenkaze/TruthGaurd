import { Link } from "react-router-dom";
import SignUpForm from "../components/forms/SignUpForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="auth-container animate-fadeIn">
        <h2>Create a new account</h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in here
          </Link>
        </p>

        <div className="mt-6 w-full">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
