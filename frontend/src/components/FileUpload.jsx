// src/components/FileUpload.jsx
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import axios from "axios";

// Helper to format confidence as a percentage with qualitative feedback
function formatConfidence(confidence) {
  const percentage = (confidence * 100).toFixed(1);
  if (confidence >= 0.7) {
    return `High likelihood: ${percentage}% chance this video is a deepfake.`;
  } else if (confidence <= 0.3) {
    return `Low likelihood: ${percentage}% chance this video is a deepfake.`;
  } else {
    return `Inconclusive: ${percentage}% chance this video is a deepfake.`;
  }
}

export default function FileUpload({ onUpload, isUploading }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setResult(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "video/*": [".mp4", ".mov"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
      if (onUpload) onUpload(response.data);
      setFile(null);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to analyze file. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="upload-container">
      <div {...getRootProps()} className={`upload-area ${isDragActive ? "upload-active" : ""} ${file ? "upload-has-file" : ""}`}>
        <input {...getInputProps()} />
        {file ? (
          <div className="upload-file">
            <span className="upload-filename">{file.name}</span>
            <button className="button button-ghost" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
              <X className="icon" />
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <Upload className="upload-icon" />
            <p className="upload-text">Drag & drop or click to upload</p>
          </div>
        )}
      </div>
      {file && (
        <button className="button button-default upload-button" onClick={handleUpload} disabled={isUploading || processing}>
          {processing ? "Processing..." : "Analyze File"}
        </button>
      )}
      {processing && (
        <div className="cube-loader">
          <div className="cube">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>
      )}
      {result && (
        <div className="result badass-result">
          <h3>Detection Result</h3>
          <p><strong>Filename:</strong> {result.filename}</p>
          <p><strong>Confidence:</strong> {formatConfidence(result.confidence)}</p>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}





