import PasswordRecoveryForm from "../components/forms/PasswordRecoveryForm";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address to receive reset instructions.
          </p>
        </div>

        {/* Reusable form */}
        <PasswordRecoveryForm />

        {/* Footer link */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Remembered your password?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}