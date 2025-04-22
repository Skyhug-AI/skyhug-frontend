
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  content: string;
  isUser: boolean;
  tts_path?: string | null;
}

interface TherapistContextType {
  messages: Message[];
  isProcessing: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
  endConversation: () => Promise<void>;
  playMessageAudio: (tts_path: string) => Promise<void>;
  pauseMessageAudio: () => void;
  isAudioPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  currentPlayingPath: string | null;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentPlayingPath, setCurrentPlayingPath] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  // Only create AudioContext when needed to avoid autoplay policy issues
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  // Function to process AI response
  const processAIResponse = async (userMessage: string) => {
    setIsProcessing(true);
    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate AI response (this would connect to your actual AI service)
      const aiResponse = generateResponse(userMessage);
      
      // Sample TTS path (in a real app, this would be generated or fetched)
      const tts_path = `sample-response-${Date.now()}.mp3`;
      
      // Add AI response to messages
      setMessages(prev => [...prev, {
        content: aiResponse,
        isUser: false,
        tts_path: tts_path
      }]);
    } catch (error) {
      console.error('Error processing AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Simple response generator for demo purposes
  const generateResponse = (message: string): string => {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return "Hello there! How are you feeling today?";
    } else if (lowercaseMessage.includes('feeling') || lowercaseMessage.includes('mood')) {
      return "It's important to acknowledge your feelings. Can you tell me more about what's going on?";
    } else if (lowercaseMessage.includes('anxious') || lowercaseMessage.includes('anxiety')) {
      return "I understand anxiety can be difficult. Let's try a breathing exercise together. Take a deep breath in for 4 counts, hold for 2, and exhale for 6.";
    } else if (lowercaseMessage.includes('sad') || lowercaseMessage.includes('depressed')) {
      return "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. What's one small thing that brought you joy recently?";
    } else if (lowercaseMessage.includes('thank')) {
      return "You're welcome. I'm here to support you whenever you need someone to talk to.";
    } else {
      return "I appreciate you sharing that with me. How does that make you feel?";
    }
  };

  // Send message function
  const sendMessage = async (message: string) => {
    // Add user message to messages
    setMessages(prev => [...prev, { content: message, isUser: true }]);
    
    // Process AI response
    await processAIResponse(message);
  };

  // Clear all messages function
  const clearMessages = async () => {
    setMessages([]);
    // If audio is playing, stop it
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
      setCurrentPlayingPath(null);
    }
    return Promise.resolve();
  };

  // End conversation function
  const endConversation = async () => {
    // In a real app, you might want to save the conversation to a database
    console.log('Ending conversation');
    // For now, just return a resolved promise
    return Promise.resolve();
  };

  // Play message audio function with pause capability
  const playMessageAudio = async (tts_path: string) => {
    try {
      // If something is already playing
      if (audioRef.current && isAudioPlaying) {
        // If it's the same audio
        if (currentPlayingPath === tts_path) {
          // Pause it
          pauseMessageAudio();
          return;
        } else {
          // Stop current audio
          audioRef.current.pause();
          setIsAudioPlaying(false);
        }
      }
      
      // Get signed URL for the audio file
      const { data, error } = await supabase.storage
        .from("tts-audio")
        .createSignedUrl(tts_path, 60);
        
      if (error || !data?.signedUrl) {
        throw new Error("Could not get signed URL");
      }
      
      console.log("✅ Audio URL obtained:", data.signedUrl);
      
      // Create a new audio element if not exists
      if (!audioRef.current) {
        const audio = new Audio();
        audioRef.current = audio;
      }
      
      // Set up audio element
      audioRef.current.src = data.signedUrl;
      audioRef.current.onended = () => {
        console.log("🔚 Audio playback ended");
        setIsAudioPlaying(false);
        setCurrentPlayingPath(null);
      };
      
      audioRef.current.onloadeddata = () => {
        console.log("✅ Audio loaded successfully");
      };
      
      audioRef.current.onerror = (e) => {
        console.error("❌ Audio error:", e);
        setIsAudioPlaying(false);
        setCurrentPlayingPath(null);
        toast({
          title: "Audio Error",
          description: "Could not play audio",
          variant: "destructive",
        });
      };
      
      // Play the audio
      try {
        await audioRef.current.play();
        console.log("▶️ Audio playing");
        setIsAudioPlaying(true);
        setCurrentPlayingPath(tts_path);
      } catch (playError) {
        console.error("TTS playback exception:", playError);
        setIsAudioPlaying(false);
        setCurrentPlayingPath(null);
        
        // If it's not an abort error (which happens when pause is called), show a toast
        if (playError instanceof Error && playError.name !== "AbortError") {
          toast({
            title: "Audio Error",
            description: "Could not play audio",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error getting audio URL:", error);
      toast({
        title: "Audio Error",
        description: "Could not load audio",
        variant: "destructive",
      });
      setIsAudioPlaying(false);
      setCurrentPlayingPath(null);
    }
  };
  
  // Pause message audio function
  const pauseMessageAudio = () => {
    if (audioRef.current && isAudioPlaying) {
      audioRef.current.pause();
      console.log("⏸️ Audio paused");
      setIsAudioPlaying(false);
    }
  };

  const value = {
    messages,
    isProcessing,
    sendMessage,
    clearMessages,
    endConversation,
    playMessageAudio,
    pauseMessageAudio,
    isAudioPlaying,
    audioRef,
    currentPlayingPath,
  };

  return (
    <TherapistContext.Provider value={value}>
      {children}
    </TherapistContext.Provider>
  );
};

export const useTherapist = (): TherapistContextType => {
  const context = useContext(TherapistContext);
  if (context === undefined) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
};
