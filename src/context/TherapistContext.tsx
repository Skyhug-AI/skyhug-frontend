
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Message interface
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

// Context interface
interface TherapistContextType {
  messages: Message[];
  isProcessing: boolean;
  sendMessage: (message: string) => void;
  clearMessages: () => void;
}

// Create context
const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

// Simple AI responses
const aiResponses = [
  "It sounds like you're going through a lot right now. Can you tell me more about how that makes you feel?",
  "I appreciate you sharing that with me. What thoughts come up for you when you experience this?",
  "That's completely understandable. Many people feel that way in similar situations. How long have you been feeling like this?",
  "I'm hearing that this has been challenging for you. What would help you feel better right now?",
  "Sometimes we need to acknowledge our emotions before we can process them. Would it help to explore why you might be feeling this way?",
  "Your feelings are valid. Have you tried any coping strategies that have helped in the past?",
  "That's a thoughtful perspective. How do you think this relates to other areas of your life?",
  "It takes courage to discuss these thoughts. Is there a particular aspect of this situation that concerns you most?",
  "I'm here to support you. What would be a small step you could take toward addressing this?",
  "Thank you for trusting me with this. Let's think about how we might approach this together.",
];

// Provider component
export const TherapistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello, I'm Sky, your AI therapist. How are you feeling today?", // Changed from Serenity
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Send message function
  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate AI response with a delay
    setTimeout(() => {
      // Choose a random response
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  // Clear messages function
  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        content: "Hello, I'm Sky, your AI therapist. How are you feeling today?", // Changed from Serenity
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <TherapistContext.Provider
      value={{
        messages,
        isProcessing,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </TherapistContext.Provider>
  );
};

// Custom hook to use the context
export const useTherapist = (): TherapistContextType => {
  const context = useContext(TherapistContext);
  if (context === undefined) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
};

