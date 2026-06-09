import axios from "axios";

export const submitFeedback = async ({
  analysis_id,
  rating,
}: {
  analysis_id: string;
  rating: number;
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Unauthorized: Please login to submit feedback.");
  }

  return axios.post(
    "http://localhost:8000/feedback",
    {
      analysis_id,
      rating,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};