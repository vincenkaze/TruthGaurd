import { useState } from "react";
import LoginForm from "../forms/LoginForm";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function LoginModal({ onClose, onSwitchToSignUp }: LoginModalProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <>
      {!showForgotPassword ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Log in to your account</h2>

            {/* Pass onForgotPassword so the inline link opens the modal */}
            <LoginForm onSuccess={onClose} onForgotPassword={() => setShowForgotPassword(true)} />

            <p className="text-sm mt-4 text-center">
              Don’t have an account?{" "}
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={onSwitchToSignUp}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      ) : (
        <ForgotPasswordModal
          onClose={onClose}
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      )}
    </>
  );
}