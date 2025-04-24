import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface TherapistContextType {
  isSpeaking: boolean;
  setIsSpeaking: (isSpeaking: boolean) => void;
  ttsLoading: boolean;
  setTtsLoading: (ttsLoading: boolean) => void;
  playTTS: (tts_path: string) => Promise<HTMLAudioElement | null>;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const { token } = useAuth();

  const playTTS = useCallback(async (tts_path: string): Promise<HTMLAudioElement | null> => {
    if (!token) {
      console.error("No token available");
      return null;
    }

    try {
      const audio = new Audio(tts_path);
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = (error) => {
        console.error("Audio playback error:", error);
        setIsSpeaking(false);
      };

      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => resolve());
        audio.addEventListener('error', () => {
          console.error("Error loading audio source:", tts_path);
          reject();
        });
        audio.load();
      });

      audio.play();
      return audio;
    } catch (error) {
      console.error("Failed to play TTS:", error);
      setIsSpeaking(false);
      return null;
    }
  }, [token]);

  const value: TherapistContextType = {
    isSpeaking,
    setIsSpeaking,
    ttsLoading,
    setTtsLoading,
    playTTS,
  };

  return (
    <TherapistContext.Provider value={value}>
      {children}
    </TherapistContext.Provider>
  );
};

export const useTherapist = (): TherapistContextType => {
  const context = useContext(TherapistContext);
  if (!context) {
    throw new Error("useTherapist must be used within a TherapistProvider");
  }
  return context;
};
