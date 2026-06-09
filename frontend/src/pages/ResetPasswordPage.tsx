import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";  // auto grab from URL
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setMessage(" Password reset successful! You can now log in.");
    } catch (err: any) {
      setMessage(" Password reset failed: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Set a New Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below to reset your account.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field w-full"
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}