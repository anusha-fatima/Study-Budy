import React, { useState, useCallback } from "react";
import * as mammoth from "mammoth";
import { FaFileUpload, FaSpinner, FaQuestionCircle, FaVolumeUp } from "react-icons/fa";
import "../Style/QuizGenerator.css";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();


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

const createComprehensionQuestion = (terms, sentence, index) => ({
  id: `q${index}-comp`,
  type: "comprehension",
  question: `According to the document, what is ${terms[0]}?`,
  options: shuffleArray([
    terms[1],
    terms[2],
    terms[3],
    `The correct answer would be found in: "${sentence.substring(0, 100)}..."`,
  ]),
  correctAnswer: 3,
  source: sentence,
});

const createTermDefinitionQuestion = (terms, sentence, index) => ({
  id: `q${index}-term`,
  type: "term-definition",
  question: `What does "${terms[0] || "this concept"}" refer to in the document?`,
  options: shuffleArray([
    terms[1] || "Option 1",
    terms[2] || "Option 2",
    terms[3] || "Option 3",
    `It refers to: "${sentence.substring(0, 100)}..."`,
  ]),
  correctAnswer: 3,
  source: sentence,
});

const generateQuestions = (text) => {
  const sentences = text
    .split(/[.!?]\s+/)
    .filter((s) => s.trim().length > 30);
  const importantTerms = extractImportantTerms(text);

  return sentences.slice(0, 5).map((sentence, index) => {
    const questionType = Math.random() > 0.5 ? "comprehension" : "term-definition";

    return questionType === "comprehension" && importantTerms.length > 3
      ? createComprehensionQuestion(importantTerms, sentence, index)
      : createTermDefinitionQuestion(importantTerms, sentence, index);
  });
};

const QuizGenerator = ({ onDocumentProcessed, documentText }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  const extractTextFromPDF = useCallback(async (arrayBuffer) => {
    try {
      const loadingTask = getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      let text = "";

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ");
        if (i % 5 === 0) await new Promise(resolve => setTimeout(resolve, 0));
      }

      return text;
    } catch (error) {
      console.error("PDF processing error:", error);
      throw new Error("Failed to process PDF. Please ensure it contains selectable text.");
    }
  }, []);

  const processDocument = useCallback(async (file) => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit");
      }

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
      await generateQuizQuestions(text);
    } catch (error) {
      console.error("Document processing error:", error);
      setQuizQuestions([]);
      alert(`Error: ${error.message}. Please try a different file.`);
    } finally {
      setIsLoading(false);
    }
  }, [extractTextFromPDF, onDocumentProcessed]);

  const generateQuizQuestions = useCallback(async (text) => {
    setIsLoading(true);
    try {
      
      const questions = await Promise.resolve().then(() => generateQuestions(text));
      setQuizQuestions(questions);
      return questions;
    } catch (error) {
      console.error("Error generating quiz:", error);
      setQuizQuestions([]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswerSelect = useCallback((questionId, answerIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  }, []);

  const speakText = useCallback((text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <section id="quiz-section" className="quiz-generator-section" aria-labelledby="quiz-generator-heading">
      <div className="quiz-container">
        <div className="section-title">
          <h2 id="quiz-generator-heading">
            <FaQuestionCircle className="icon" aria-hidden="true" />
            Quiz Generator
          </h2>
        </div>

        <div className="document-upload">
          <label className="upload-label">
            <FaFileUpload className="upload-icon" aria-hidden="true" />
            <span>Upload Document</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => processDocument(e.target.files[0])}
              className="file-input"
              aria-label="Upload document for quiz generation"
              disabled={isLoading}
            />
          </label>
          <p className="upload-hint">Supports PDF, DOCX, and TXT files (max 5MB)</p>
        </div>

        {isLoading && (
          <div className="loading-state" aria-live="polite">
            <FaSpinner className="spinner" aria-hidden="true" />
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
                      aria-label={`Speak question: ${question.question}`}
                    >
                      <FaVolumeUp aria-hidden="true" />
                    </button>
                  </div>

                  <div className="options-grid" role="group" aria-label="Answer options">
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
                        aria-pressed={userAnswers[question.id] === idx}
                        disabled={userAnswers[question.id] !== undefined}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {userAnswers[question.id] !== undefined && (
                    <div className="question-feedback" aria-live="polite">
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
                        aria-label="Hear correct answer"
                      >
                        <FaVolumeUp aria-hidden="true" /> Hear Answer
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
                disabled={isLoading}
                aria-label="Generate new quiz questions"
              >
                Generate New Questions
              </button>

              <button
                onClick={() => speakText(documentText)}
                className="speech-button"
                disabled={isLoading || !documentText}
                aria-label="Read entire document text"
              >
                <FaVolumeUp aria-hidden="true" /> Use Document for Text-to-Speech
              </button>

              <button
                onClick={() => window.speechSynthesis.cancel()}
                className="stop-speech-button"
                aria-label="Stop speech synthesis"
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