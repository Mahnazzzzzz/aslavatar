import React, { useState, useRef, useCallback } from "react";
import { API, Auth, Storage } from "aws-amplify";
import "./ASLForm.css";
import uuid from "react-uuid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const ASLForm = () => {
  const [inputText, setInputText] = useState("");
  const [signVideo, setSignVideo] = useState("");
  const [poseVideo, setPoseVideo] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [letterCount, setLetterCount] = useState(0);
  
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setLetterCount(transcript.replace(/[^a-zA-Z]/g, "").length);
        
        if (transcript.trim()) {
          handleGenerateASL({ Text: transcript });
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Speech recognition failed. Please try again.');
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleTextChange = useCallback((event) => {
    const value = event.target.value;
    setInputText(value);
    setLetterCount(value.replace(/[^a-zA-Z]/g, "").length);
    setError(""); // Clear any previous errors
  }, []);

  const handleStartListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setInputText("");
      setLetterCount(0);
      setError("");
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Failed to start speech recognition.');
    }
  }, []);

  const handleStopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const handleRecording = useCallback((event) => {
    event.preventDefault();
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  }, [isListening, handleStartListening, handleStopListening]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (!inputText.trim()) {
      setError("Please enter some text to translate.");
      return;
    }
    handleGenerateASL({ Text: inputText.trim() });
  }, [inputText]);

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const keyName = `uploads/${uuid()}/${file.name}`;
      await Storage.put(keyName, file, {
        contentType: file.type,
        level: 'public'
      });
      
      await handleGenerateASL({
        BucketName: "genasl-data",
        KeyName: `public/${keyName}`,
      });
      
      setSuccess('Audio file uploaded and processed successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload audio file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateASL = useCallback(async (queryParams) => {
    setIsLoading(true);
    setError("");
    setSignVideo("");
    setPoseVideo("");
    
    try {
      const apiName = "Audio2Sign";
      const path = "/sign";
      
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      
      const myInit = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        response: true,
        queryStringParameters: queryParams,
      };

      const response = await API.get(apiName, path, myInit);
      
      if (response.data) {
        setSignVideo(response.data.SignURL || "");
        setPoseVideo(response.data.PoseURL || "");
        setSuccess('ASL translation generated successfully!');
      } else {
        setError('No response data received from the server.');
      }
    } catch (error) {
      console.error('Error generating ASL:', error);
      setError('Failed to generate ASL translation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return (
    <div className="asl-form-container">
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <section className="discover-section">
        <div className="translate-view">
          {/* Input Section */}
          <div className="box input-box">
            <div className="box-header">
              <h3>English Input</h3>
              <div className="header-divider"></div>
            </div>
            
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleTextChange}
              className="text-area"
              placeholder="Enter English text to translate to ASL..."
              disabled={isLoading}
            />
            
            <div className="box-controls">
              <div className="char-counter">
                <span className={letterCount > 450 ? 'warning' : ''}>
                  {letterCount}/500 characters
                </span>
              </div>
              
              <div className="function-buttons">
                <Tooltip title="Translate to ASL" placement="top">
                  <IconButton 
                    onClick={handleSubmit}
                    disabled={isLoading || !inputText.trim()}
                    className="action-btn translate-btn"
                  >
                    <img
                      className="btn-icon"
                      src={require("../assets/sign-language-green.png")}
                      alt="Translate"
                    />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Upload Audio File" placement="top">
                  <IconButton
                    component="label"
                    disabled={isLoading}
                    className="action-btn upload-btn"
                  >
                    <input
                      accept="audio/*"
                      type="file"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <img
                      className="btn-icon"
                      src={require("../assets/upload-red.png")}
                      alt="Upload Audio"
                    />
                  </IconButton>
                </Tooltip>
                
                <Tooltip 
                  title={isListening ? "Stop Recording" : "Start Voice Recording"} 
                  placement="top"
                >
                  <IconButton 
                    onClick={handleRecording}
                    disabled={isLoading}
                    className={`action-btn voice-btn ${isListening ? 'recording' : ''}`}
                  >
                    <img
                      className="btn-icon"
                      src={
                        isListening
                          ? require("../assets/stop-button.png")
                          : require("../assets/voice-blue.png")
                      }
                      alt="Voice Recording"
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            
            {isLoading && (
              <div className="loading-indicator">
                <CircularProgress size={24} />
                <span>Generating ASL translation...</span>
              </div>
            )}
          </div>

          {/* Avatar Section */}
          <div className="box video-box">
            <div className="box-header">
              <h3>3D Avatar</h3>
              <div className="header-divider"></div>
            </div>
            
            <div className="video-container pose-video">
              {poseVideo ? (
                <video
                  key={`pose-${poseVideo}`}
                  autoPlay
                  playsInline
                  loop
                  muted
                  controls
                  className="video-player"
                >
                  <source src={poseVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="video-placeholder">
                  <p>Avatar will appear here after translation</p>
                </div>
              )}
            </div>
          </div>

          {/* ASL Section */}
          <div className="box video-box">
            <div className="box-header">
              <h3>American Sign Language</h3>
              <div className="header-divider"></div>
            </div>
            
            <div className="video-container sign-video">
              {signVideo ? (
                <video
                  key={`sign-${signVideo}`}
                  autoPlay
                  playsInline
                  loop
                  muted
                  controls
                  className="video-player"
                >
                  <source src={signVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="video-placeholder">
                  <p>ASL video will appear here after translation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ASLForm;
