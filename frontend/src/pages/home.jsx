import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import FileUpload from "../components/FileUpload";
import DetectionResult from "../components/DetectionResult";

export default function Home() {
  const [result, setResult] = useState(null);

  const { mutate: uploadFile, isLoading } = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to analyze file");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: () => {
      alert("Failed to analyze file. Please try again.");
    },
  });

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>DeepFake Detection</h2>
      <p>Upload an image or video to analyze it for potential deep fake manipulation.</p>
      <FileUpload onUpload={uploadFile} isUploading={isLoading} />
      {result && <DetectionResult result={result} />}
    </div>
  );
}
