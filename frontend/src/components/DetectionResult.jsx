import { AlertTriangle, CheckCircle } from "lucide-react";

export default function DetectionResult({ result }) {
  const isDeepFake = result.confidence > 50;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          {isDeepFake ? (
            <AlertTriangle className="icon icon-warning" style={{ width: "1.25rem", height: "1.25rem" }} />
          ) : (
            <CheckCircle className="icon icon-success" style={{ width: "1.25rem", height: "1.25rem" }} />
          )}
          {result.filename}
        </div>
      </div>
      <div className="card-content">
        <div className="detection-details">
          <div className="confidence-score">
            <div className="score-header">
              <span>Confidence Score</span>
              <span>{Math.round(result.confidence)}%</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${result.confidence}%` }} />
            </div>
          </div>
          <div className="detected-regions">
            <h4 className="regions-title">Detected Regions</h4>
            <div className="grid">
              {result.detectedRegions?.map((region, i) => (
                <div key={i} className="region-item">
                  {region}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

