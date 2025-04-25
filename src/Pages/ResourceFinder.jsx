import React, { useState, useRef } from "react";
import { FaFileUpload, FaMagic, FaSpinner, FaCopy } from "react-icons/fa";
import * as mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";
import "../Style/ResourceFinder.css";

const ResourceFinder = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [keyPoints, setKeyPoints] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const fileInputRef = useRef(null);

  const extractText = async (file) => {
    setIsProcessing(true);
    setKeyPoints([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = "";

      if (file.type === "application/pdf") {
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + " ";
        }
      } else if (file.type.includes("word") || file.name.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type.includes("text") || file.name.endsWith(".txt")) {
        text = await file.text();
      } else {
        throw new Error("Unsupported file type");
      }

      setExtractedText(text);
      setUploadedFile(file);
    } catch (error) {
      console.error("Error processing document:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateKeyPoints = async () => {
    if (!extractedText) return;

    setIsSummarizing(true);

    try {
      const sentences = extractedText
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);
      const importantSentences = sentences
        .filter((s) => s.split(" ").length > 5)
        .sort((a, b) => b.split(" ").length - a.split(" ").length)
        .slice(0, 10);

      setKeyPoints(
        importantSentences.map((sentence, index) => ({
          id: index,
          point: sentence.trim(),
          isImportant: index < 4,
        }))
      );
    } catch (error) {
      console.error("Error generating key points:", error);
      alert("Failed to generate key points");
    } finally {
      setIsSummarizing(false);
    }
  };

  const copyKeyPoints = () => {
    const textToCopy = keyPoints.map((kp) => `• ${kp.point}`).join("\n");
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert("Key points copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className="Keypnt">
      <div className="resource-finder-container">
        <h2 className="section-title">Study Material Summarizer</h2>
        <h3 className="keypnt-desc">
          {" "}
          "From pages to punchlines in seconds! <br />
          📑➡️✨
          <br />
          SmartSummary uses AI to extract the golden nuggets from your
          documents. No more highlighting wars - get automatic, organized key
          points perfect for last-minute revisions and cheat sheets."
        </h3>
        <p className="section-description">
          Upload your study materials to extract key points
        </p>

        <div className="upload-section">
          <label className="upload-btn">
            <FaFileUpload className="upload-icon" />
            <span>{uploadedFile ? uploadedFile.name : "Upload Document"}</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                e.target.files[0] && extractText(e.target.files[0])
              }
              accept=".pdf,.docx,.txt"
            />
          </label>
          {uploadedFile && (
            <button
              onClick={() => fileInputRef.current.click()}
              className="change-file-btn"
            >
              Change File
            </button>
          )}
        </div>

        {isProcessing && (
          <div className="processing-indicator">
            <FaSpinner className="spinner" />
            <p>Processing document...</p>
          </div>
        )}

        {extractedText && !isProcessing && (
          <div className="action-section">
            <button
              onClick={generateKeyPoints}
              disabled={isSummarizing}
              className="summarize-btn"
            >
              <FaMagic className="summarize-icon" />
              {isSummarizing
                ? "Generating Key Points..."
                : "Extract Key Points"}
            </button>
          </div>
        )}

        {isSummarizing && (
          <div className="processing-indicator">
            <FaSpinner className="spinner" />
            <p>Analyzing document content...</p>
          </div>
        )}

        {keyPoints.length > 0 && (
          <div className="key-points-section">
            <div className="key-points-header">
              <h3>Key Points</h3>
              <button
                onClick={copyKeyPoints}
                className="copy-btn"
                title="Copy to clipboard"
              >
                <FaCopy /> Copy
              </button>
            </div>

            <ul className="key-points-list">
              {keyPoints.map((point) => (
                <li
                  key={point.id}
                  className={`key-point ${
                    point.isImportant ? "important" : ""
                  }`}
                >
                  {point.point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="supported-formats">
          <p>Supported formats: PDF, DOCX, TXT</p>
        </div>
      </div>
    </div>
  );
};

export default ResourceFinder;
