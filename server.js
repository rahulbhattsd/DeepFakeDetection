// server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const cors = require("cors");
const fs = require("fs").promises; // using promises for async file operations

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS if your frontend is hosted on a different domain
app.use(cors());

// Ensure a temporary directory exists for storing uploads
const tempDir = path.join(__dirname, "temp");
async function ensureTempDir() {
  try {
    await fs.access(tempDir);
  } catch (err) {
    await fs.mkdir(tempDir);
  }
}

// Endpoint to detect deepfake in an uploaded video
app.post("/api/detect", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Ensure temp directory exists
    await ensureTempDir();

    // Save the uploaded file temporarily
    const tempFilePath = path.join(tempDir, `${Date.now()}-${req.file.originalname}`);
    await fs.writeFile(tempFilePath, req.file.buffer);

    // Spawn the Python process using the required arguments.
    // We pass the file path as --test-dir (your Python script should handle file input) 
    // and include the list of model checkpoints.
    const pythonProcess = spawn("python", [
      "./dfdc_deepfake_challenge/predict_folder.py",
      "--test-dir", tempFilePath,
      "--output", "submission.csv",
      "--models",
      "final_111_DeepFakeClassifier_tf_efficientnet_b7_ns_0_36",
      "final_555_DeepFakeClassifier_tf_efficientnet_b7_ns_0_19",
      "final_777_DeepFakeClassifier_tf_efficientnet_b7_ns_0_29",
      "final_777_DeepFakeClassifier_tf_efficientnet_b7_ns_0_31",
      "final_888_DeepFakeClassifier_tf_efficientnet_b7_ns_0_37",
      "final_888_DeepFakeClassifier_tf_efficientnet_b7_ns_0_40",
      "final_999_DeepFakeClassifier_tf_efficientnet_b7_ns_0_23"
    ]); 
    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
    });

    pythonProcess.on("close", async (code) => {
      // Delete the temporary file regardless of outcome
      await fs.unlink(tempFilePath);

      if (code !== 0) {
        return res.status(500).json({ error: "Prediction process failed" });
      }

      // Parse the output. For example, if your Python script prints the confidence score.
      const confidence = parseFloat(output.trim());
      const detectionResult = {
        filename: req.file.originalname,
        confidence: isNaN(confidence) ? 0.5 : confidence
      };
      res.json(detectionResult);
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


