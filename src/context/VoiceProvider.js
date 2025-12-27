"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  const [isSupported, setIsSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastResult, setLastResult] = useState("");
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const textHistoryRef = useRef("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setListening(true);
        };

        recognition.onend = () => {
          if (shouldListenRef.current) {
            // Commit the last session's text to history
            const lastSessionText = recognition.lastSessionText || "";
            if (lastSessionText) {
              textHistoryRef.current += (textHistoryRef.current ? " " : "") + lastSessionText;
            }
            recognition.lastSessionText = ""; // Reset for next session
            
            try {
              recognition.start();
            } catch (error) {
              console.error("Error restarting recognition:", error);
              setListening(false);
              shouldListenRef.current = false;
            }
          } else {
            setListening(false);
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            shouldListenRef.current = false;
            setListening(false);
          }
        };

        recognition.onresult = (event) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = 0; i < event.results.length; i++) {
            const transcriptSegment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptSegment;
            } else {
              interimTranscript += transcriptSegment;
            }
          }
          
          const sessionText = finalTranscript + interimTranscript;
          recognition.lastSessionText = sessionText; // Store for onend
          
          // Update last result for commands
          const latest = event.results[event.results.length - 1];
          if (latest) {
            setLastResult(latest[0].transcript.trim());
          }

          // Combine history with current session
          setTranscript(textHistoryRef.current + (textHistoryRef.current && sessionText ? " " : "") + sessionText);
        };

        recognitionRef.current = recognition;
        
        // Auto-start if supported
        shouldListenRef.current = true;
        try {
          recognition.start();
        } catch (error) {
          console.error("Error starting recognition:", error);
        }
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      shouldListenRef.current = true;
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false;
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript("");
    textHistoryRef.current = "";
    if (recognitionRef.current) {
      recognitionRef.current.lastSessionText = "";
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        listening,
        transcript,
        lastResult,
        startListening,
        stopListening,
        resetTranscript,
        isSupported,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

// custom hook (clean usage)
export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used inside VoiceProvider");
  }
  return context;
}
