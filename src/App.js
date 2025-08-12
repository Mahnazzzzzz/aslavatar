// import { withAuthenticator } from "@aws-amplify/ui-react";
// import "@aws-amplify/ui-react/styles.css";

// import { Amplify, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import "./App.css";
import ASLForm from "./components/ASLForm.js";

// Amplify.configure(awsconfig);
// Auth.configure(awsconfig);

function App() {
  return (
    <div className="main-container">
      <header className="main-container-header">
        <div className="header-content">
          <div className="gen-asl-logo">
            <img
              src={require("./assets/gen-asl-logo.png")}
              alt="GenASL Logo"
              className="logo-image"
            />
          </div>
          <div className="header-text">
            <h1>GenASL Avatar Generator</h1>
            <p>Transform English text and audio into American Sign Language</p>
          </div>
          <div className="user-info">
            <span>Welcome to GenASL Avatar Generator</span>
            <button className="sign-out-btn" disabled>
              Demo Mode
            </button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <ASLForm />
      </main>
      
      <footer className="footer">
        <p>&copy; 2024 GenASL Avatar Generator. Powered by AWS and AI.</p>
      </footer>
    </div>
  );
}

export default App;
