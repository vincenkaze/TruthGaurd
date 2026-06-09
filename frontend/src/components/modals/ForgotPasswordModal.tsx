import { useState } from "react";
import PasswordRecoveryForm from "../forms/PasswordRecoveryForm";

interface ForgotPasswordModalProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

export default function ForgotPasswordModal({
  onClose,
  onBackToLogin,
}: ForgotPasswordModalProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        {!submitted ? (
          <>
            <h2 className="text-lg font-bold mb-2">Forgot your password?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email and we’ll send you a reset link.
            </p>

            <PasswordRecoveryForm
              onClose={onClose}
              onBackToLogin={onBackToLogin}
              //  hook into success
              onSuccess={() => setSubmitted(true)}
            />
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-2">Check your email</h2>
            <p className="text-sm text-gray-600 mb-4">
               If that email exists, we’ve sent a password reset link. Please check your inbox.
            </p>
          </>
        )}

        <div className="flex justify-end gap-4 mt-4 text-sm">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-blue-600 underline"
          >
            Back to login
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}