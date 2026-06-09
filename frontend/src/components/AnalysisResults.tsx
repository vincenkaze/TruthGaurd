import { PredictionResult } from "../types";

interface Props {
  result: PredictionResult;
}

export default function AnalysisResults({ result }: Props) {
  const isCredible = result.prediction === "REAL";
  const confidencePercent = (result.confidence * 100).toFixed(1);
  const barColor = isCredible ? "bg-green-500" : "bg-yellow-500";
  const tagColor = isCredible
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";

  return (
    <div className="mt-6 bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">Analysis Results</h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${tagColor}`}>
          {result.prediction} ({confidencePercent}%)
        </span>
      </div>

      <div className="w-full h-3 rounded bg-gray-200 overflow-hidden mb-3">
        <div
          className={`${barColor} h-full transition-all duration-500`}
          style={{ width: `${result.confidence * 100}%` }}
        ></div>
      </div>

      <p className="text-sm mb-4">
        This content appears to be{" "}
        <span className="font-semibold">
          {isCredible ? "credible" : "potentially misleading"}
        </span>
        . AI confidence: <span className="font-bold">{confidencePercent}%</span>.
      </p>

      <div className="text-center">
        <button
          className="text-sm px-4 py-2 border rounded hover:bg-gray-50 transition"
          onClick={() => window.location.reload()}
        >
          <i className="fas fa-sync-alt mr-2"></i> New Analysis
        </button>
      </div>
    </div>
  );
}