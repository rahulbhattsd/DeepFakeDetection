import { useQuery } from "@tanstack/react-query";
import DetectionResult from "../components/DetectionResult";

function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card" style={{ height: "200px" }}></div>
      ))}
    </div>
  );
}

export default function History() {
  const { data: detections, isLoading } = useQuery({
    queryKey: ["/api/history"],
  });

  if (isLoading) {
    return <HistorySkeleton />;
  }

  if (!detections?.length) {
    return (
      <div style={{ textAlign: "center", color: "#666" }}>
        No detection history yet
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {detections.map((detection) => (
        <DetectionResult key={detection.id} result={detection} />
      ))}
    </div>
  );
}
