import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as mammoth from "mammoth";
import {
  FaFileUpload,
  FaSpinner,
  FaQuestionCircle,
  FaVolumeUp,
} from "react-icons/fa";
import "../Style/QuizGenerator.css";

const QuizGenerator = ({ onDocumentProcessed, documentText }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  const processDocument = async (file) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = "";

      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(arrayBuffer);
      } else if (file.type.includes("word") || file.name.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type.includes("text")) {
        text = await file.text();
      } else {
        throw new Error("Unsupported file type");
      }

      onDocumentProcessed(text);
      generateQuizQuestions(text);
    } catch (error) {
      console.error("Document processing error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromPDF = async (arrayBuffer) => {
    try {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      let text = "";
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const page = pdfDoc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ");
      }
      return text;
    } catch (error) {
      console.error("PDF processing error:", error);
      throw new Error("Failed to process PDF");
    }
  };

  const generateQuizQuestions = (text) => {
    setIsLoading(true);
    try {
      const sentences = text
        .split(/[.!?]\s+/)
        .filter((s) => s.trim().length > 30);
      const importantTerms = extractImportantTerms(text);

      const generatedQuestions = sentences
        .slice(0, 5)
        .map((sentence, index) => {
          const questionType =
            Math.random() > 0.5 ? "comprehension" : "term-definition";

          if (questionType === "comprehension" && importantTerms.length > 3) {
            return {
              id: `q${index}`,
              type: "comprehension",
              question: `According to the document, what is ${importantTerms[0]}?`,
              options: shuffleArray([
                importantTerms[1],
                importantTerms[2],
                importantTerms[3],
                `The correct answer would be found in: "${sentence.substring(
                  0,
                  100
                )}..."`,
              ]),
              correctAnswer: 3,
              source: sentence,
            };
          } else {
            return {
              id: `q${index}`,
              type: "term-definition",
              question: `What does "${
                importantTerms[0] || "this concept"
              }" refer to in the document?`,
              options: shuffleArray([
                importantTerms[1] || "Option 1",
                importantTerms[2] || "Option 2",
                importantTerms[3] || "Option 3",
                `It refers to: "${sentence.substring(0, 100)}..."`,
              ]),
              correctAnswer: 3,
              source: sentence,
            };
          }
        });

      setQuizQuestions(generatedQuestions);
      return generatedQuestions;
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractImportantTerms = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const freqMap = {};
    words.forEach((word) => {
      if (word.length > 5) freqMap[word] = (freqMap[word] || 0) + 1;
    });
    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([term]) => term);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section id="quiz-section" className="quiz-generator-section">
      <div className="quiz-container">
        <h2 className="section-title">
          <FaQuestionCircle className="icon" />
          <h3>Quiz Generator</h3>
        </h2>

        <div className="document-upload">
          <label className="upload-label">
            <FaFileUpload className="upload-icon" />
            <span>Upload Document</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) =>
                e.target.files[0] && processDocument(e.target.files[0])
              }
              className="file-input"
            />
          </label>
          <p className="upload-hint">Supports PDF, DOCX, and TXT files</p>
        </div>

        {isLoading && (
          <div className="loading-state">
            <FaSpinner className="spinner" />
            <p>Processing your document...</p>
          </div>
        )}

        {quizQuestions.length > 0 && (
          <div className="quiz-results">
            <h3>Generated Quiz Questions</h3>
            <div className="questions-list">
              {quizQuestions.map((question) => (
                <div key={question.id} className="question-card">
                  <div className="question-header">
                    <h4>{question.question}</h4>
                    <button
                      onClick={() => speakText(question.question)}
                      className="speak-button"
                    >
                      <FaVolumeUp />
                    </button>
                  </div>

                  <div className="options-grid">
                    {question.options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`option-button ${
                          userAnswers[question.id] === idx ? "selected" : ""
                        } ${
                          userAnswers[question.id] !== undefined &&
                          idx === question.correctAnswer
                            ? "correct"
                            : ""
                        }`}
                        onClick={() => handleAnswerSelect(question.id, idx)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {userAnswers[question.id] !== undefined && (
                    <div className="question-feedback">
                      {userAnswers[question.id] === question.correctAnswer ? (
                        <span className="correct-feedback">✓ Correct!</span>
                      ) : (
                        <span className="incorrect-feedback">✗ Try again</span>
                      )}
                      <button
                        onClick={() =>
                          speakText(
                            `The correct answer is: ${
                              question.options[question.correctAnswer]
                            }`
                          )
                        }
                        className="speak-answer-button"
                      >
                        <FaVolumeUp /> Hear Answer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="quiz-actions">
              <button
                onClick={() => generateQuizQuestions(documentText)}
                className="generate-button"
              >
                Generate New Questions
              </button>

              <button
                onClick={() => speakText(documentText)}
                className="speech-button"
              >
                <FaVolumeUp /> Use Document for Text-to-Speech
              </button>

              <button
                onClick={() => window.speechSynthesis.cancel()}
                className="stop-speech-button"
              >
                Stop Speech
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizGenerator;
