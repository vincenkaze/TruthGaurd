import SignUpForm from "../forms/SignUpForm";

interface SignUpModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignUpModal({ onClose, onSwitchToLogin }: SignUpModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Create a new account</h2>

        {/* Reusable SignUpForm */}
        <SignUpForm onSuccess={onClose} />

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={onSwitchToLogin}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
