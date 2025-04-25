import React from "react";
import "../Style/About.css";

const About = () => {
  return (
    <div className="about-container">
      <section className="intro-section">
        <h2 className="titleAbout">About</h2>
      </section>

      <div className="AboutMidSection">
        <div className="AboutContent">
          <h1 className="AboutMidTitle">My Background and Inspiration</h1>
          <p className="AboutDescription"></p>
        </div>
      </div>

      <section className="team-section">
        <div className="team-members">
          <div className="team-member">
            <h4>Anusha Fatima</h4>
            <p>Full-Stack Developer</p>
            <p>
              Full-Stack Developer & Database Architect. Designed and built the
              entire system.
            </p>
            <a
              href="https://github.com/anusha-fatima"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#ad336d" }}
            >
              <i class="fa-brands fa-github"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/anusha-fatima-69743a288/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#ad336d" }}
            >
              <i class="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </section>

      <div className="missionBox">
        <section className="mission-section">
          <h3 className="missionTitle">StudyBuddy AI Learning Platform</h3>
          <p className="missionPara">
            StudyBuddy is an intelligent learning companion designed to
            transform study materials into interactive learning experiences.
            Whether you're tackling textbooks, research papers, or lecture
            notes, our platform converts dense content into digestible audio
            summaries and key concepts, making study sessions more efficient and
            effective.
          </p>

          <h2 className="missionTitle">Our Mission</h2>
          <p className="missionPara">
            Our mission is to revolutionize learning by making educational
            content more accessible through AI-powered tools. We bridge the gap
            between complex materials and student comprehension by providing
            smart summarization, audio learning, and personalized study aids -
            helping learners of all types master their subjects faster.
          </p>

          <h3 className="missionTitle">Features of Our Platform</h3>
          <ul className="missionLIst">
            <li>
              <strong>ReadAloud - Audio Learning:</strong> Convert any study
              material (PDFs, DOCX, or text) into clear audio lectures with
              adjustable playback speeds, perfect for auditory learners and
              on-the-go studying.
            </li>
            <li>
              <strong>SmartSummary - Key Point Extraction:</strong> Our AI
              analyzes your documents to extract and highlight the most
              important concepts, creating instant study guides from lengthy
              materials.
            </li>
            <li>
              <strong>Focus Mode - Distraction-Free Studying:</strong> Special
              interface that eliminates distractions and helps maintain
              concentration during study sessions with Pomodoro timers and goal
              tracking.
            </li>
            <li>
              <strong>Knowledge Reinforcement - Spaced Repetition:</strong> Our
              system uses proven learning science techniques to schedule optimal
              review times for maximum retention.
            </li>
            <li>
              <strong>Developer Team - Learning Innovators:</strong> Created by
              a passionate team including a Full-Stack Developer who built the
              core platform, an AI Engineer who developed the smart algorithms,
              and a UX Designer focused on creating intuitive learning
              experiences.
            </li>
          </ul>

          <h3 className="missionTitle">The Future of Learning</h3>
          <p className="missionPara">
            We invite you to experience StudyBuddy and discover a smarter way to
            learn. By combining AI technology with proven educational methods,
            we're creating tools that adapt to how you learn best - helping you
            achieve more in less time while actually enjoying the learning
            process.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
