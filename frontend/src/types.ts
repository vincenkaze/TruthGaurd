export interface User {
    id: string;
    email: string;
    name: string;
    role?: "user" | "admin";
    createdAt?: string;
  }
  
  export interface PredictionResult {
    predictionId: string;
    prediction: "FAKE" | "REAL";
    confidence: number;
  }
  
  export interface Feedback {
    predictionId: string;
    rating: number;
    userId?: string;
  }