import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "react-speech-kit";

interface TherapistContextType {
  messages?: { id?: string; content: string; isUser: boolean; timestamp?: string; tts_path?: string }[];
  messageHistory: { text: string; isUser: boolean }[];
  sendMessage?: (message: string, isAudio?: boolean) => void;
  sendAudioMessage?: (audioMessage: string) => void;
  isProcessing?: boolean;
  addMessage: (message: string, isUser: boolean) => void;
  clearMessages: () => void;
  ttsLoading: boolean;
  generateTTS: (message: string) => Promise<void>;
  playMessageAudio: (tts_path: string) => Promise<void>;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  listening: boolean;
  finalTranscript: string;
  setFinalTranscript: React.Dispatch<React.SetStateAction<string>>;
  setVoiceEnabled?: (enabled: boolean) => Promise<void>;
  endConversation?: () => Promise<void>;
}

const TherapistContext = createContext<TherapistContextType | undefined>(
  undefined
);

interface TherapistProviderProps {
  children: ReactNode;
}

export const TherapistProvider: React.FC<TherapistProviderProps> = ({
  children,
}) => {
  const [messageHistory, setMessageHistory] = useState<
    { text: string; isUser: boolean }[]
  >([]);
  const [ttsLoading, setTTSLoading] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const { toast } = useToast();
  const { listen, listening, stop, transcript, reset } =
    useSpeechRecognition({
      onResult: (result) => {
        setFinalTranscript(result);
      },
    });

  useEffect(() => {
    if (!listening) {
      reset();
    }
  }, [listening, reset]);

  const addMessage = (message: string, isUser: boolean) => {
    setMessageHistory((prevHistory) => [
      ...prevHistory,
      { text: message, isUser },
    ]);
  };

  const clearMessages = () => {
    setMessageHistory([]);
  };

  const generateTTS = async (message: string) => {
    setTTSLoading(true);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.tts_path) {
        playMessageAudio(data.tts_path); // Play the audio immediately after generating
      } else {
        toast({
          title: "TTS Generation Failed",
          description: "Failed to generate text-to-speech audio.",
        });
      }
    } catch (error) {
      console.error("Error generating TTS:", error);
      toast({
        title: "TTS Generation Error",
        description:
          "An error occurred while generating text-to-speech audio.",
      });
    } finally {
      setTTSLoading(false);
    }
  };

  const playMessageAudio = async (tts_path: string): Promise<void> => {
    try {
      const audio = new Audio(tts_path);
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const startListening = () => {
    listen();
  };

  const stopListening = () => {
    stop();
  };

  const setVoiceEnabled = async (enabled: boolean) => {
    console.log(`Voice enabled set to: ${enabled}`);
  };

  const endConversation = async () => {
    console.log("Conversation ended");
    clearMessages();
  };

  return (
    <TherapistContext.Provider
      value={{
        messageHistory,
        addMessage,
        clearMessages,
        ttsLoading,
        generateTTS,
        playMessageAudio,
        transcript,
        startListening,
        stopListening,
        listening,
        finalTranscript,
        setFinalTranscript,
        setVoiceEnabled,
        endConversation,
      }}
    >
      {children}
    </TherapistContext.Provider>
  );
};

export const useTherapist = () => {
  const context = useContext(TherapistContext);
  if (!context) {
    throw new Error("useTherapist must be used within a TherapistProvider");
  }
  return context;
};
