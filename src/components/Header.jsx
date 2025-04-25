import "../Style/Header.css";
import QuizGenerator from "../Pages/QuizGenerator";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FcHeadset, FcViewDetails } from "react-icons/fc";

const Header = () => {
  const [documentText, setDocumentText] = useState("");

  const handleDocumentProcessed = (text) => {
    setDocumentText(text);
  };

  return (
    <div className="app-container">
      <section className="hero-section-1">
        <div className="hero-content">
          <h2>  Welcome to StudyBuddy</h2>
          <p>
         Your AI-powered learning companion! Transform your study materials into interactive learning experiences with our smart tools. Upload your documents (PDFs, Word files, or text) and let StudyBuddy help you listen to content with crystal-clear pronunciation or extract key concepts automatically. Perfect for students who learn better by listening or need quick revision notes. Start optimizing your study sessions today!"
          </p>
        </div>

        <div className="book-display">
          <div className="book-stack">
            <div className="book book-1"></div>
            <div className="book book-2"></div>
            <div className="book book-3"></div>
          </div>
        </div>
      </section>

      <div className="header-container">
        <section className="hero-section-2">
          <div className="hero-content-2">
            <h1>Transform Your Study Materials</h1>
            <p>Upload your documents and unlock powerful learning tools</p>
          </div>

          <QuizGenerator
            onDocumentProcessed={handleDocumentProcessed}
            documentText={documentText}
          />
        </section>
      </div>
      <div className="Features">
        <div class="card">
        <FcHeadset className="icon"/>
          <h2>AudioStudy</h2>
          <p>Emphasizes learning through audio</p>
          <button>
            <Link to="/features" className="nav-link-1">
            AudioStudy
            </Link>
          </button>
        </div>
        <div class="card">
        <FcViewDetails className="icon"/>
          <h2>KeyGen</h2>
          <p>Key Points Generator</p>
          <button>
             <Link to="/ResourceFinder" className="nav-link-1">KeyGen</Link>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Header;
