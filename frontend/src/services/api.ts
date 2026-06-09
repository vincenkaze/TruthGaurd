import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface PredictionResponse {
  predictionId: string;
  prediction: "FAKE" | "REAL";
  confidence: number;
}

export const predictFakeNews = async (text: string): Promise<PredictionResponse> => {
  try {
    const response = await axios.post<PredictionResponse>(`${API_URL}/predict`, { text });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to analyze news");
  }
};