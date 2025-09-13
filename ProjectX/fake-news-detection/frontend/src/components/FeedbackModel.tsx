import { useState, useEffect, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { submitFeedback } from "../services/FeedbackService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
  predictionId: string;
  initialRating?: number;
}

export default function FeedbackModel({
  isOpen,
  onClose,
  onSubmit,
  predictionId,
  initialRating = 0,
}: FeedbackModalProps) {
  const { user, isAuthenticated } = useAuth();

  const [stars, setStars] = useState<number>(initialRating);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) setError("");
  }, [user]);

  // 🔹 Show a polished modal if not logged in
  if (!isAuthenticated) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-modal inset-0 overflow-y-auto"
          onClose={onClose}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            </TransitionChild>

            <TransitionChild
              as={Fragment}
              enter="transition-transform duration-300 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition-transform duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="feedback-modal-panel text-center">
                <DialogTitle className="modal-title">Log in required</DialogTitle>
                <Description className="modal-description">
                  You need to be logged in to share feedback and help improve TruthGuard.
                </Description>
                <div className="modal-actions">
                  <button className="btn btn-later" onClick={onClose}>
                    Maybe Later
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      onClose();
                      // 🔹 Trigger login modal if available
                      const loginButton =
                        document.querySelector<HTMLButtonElement>("#login-btn");
                      loginButton?.click();
                    }}
                  >
                    Log in
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    );
  }

  // 🔹 If logged in, show rating stars
  const handleSubmit = async () => {
    if (stars < 1 || stars > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    if (!predictionId || typeof predictionId !== "string") {
      setError("Invalid prediction ID.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await submitFeedback({
        analysis_id: predictionId,
        rating: stars,
      });

      onSubmit(stars);
      onClose();
      toast.success("Thanks for your feedback!");
    } catch (err: any) {
      console.error("Feedback submission error:", err.response?.data);

      if (err.response?.status === 401) {
        setError("You must be logged in to submit feedback.");
      } else if (err.response?.status === 422) {
        setError("Invalid data sent. Please try again.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to submit feedback. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-modal inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition-transform duration-300 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-transform duration-200 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="feedback-modal-panel">
              <DialogTitle className="modal-title">
                How was your experience?
              </DialogTitle>
              <Description className="modal-description">
                Your feedback helps improve our AI model
              </Description>
              <div className="feedback-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`feedback-star-btn${
                      stars >= star ? " selected" : ""
                    }`}
                    onClick={() => setStars(star)}
                    aria-label={`Rate ${star} star${
                      star !== 1 ? "s" : ""
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="modal-actions">
                <button className="btn btn-later" onClick={onClose}>
                  Maybe Later
                </button>
                <button
                  className="btn btn-submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || stars === 0}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
