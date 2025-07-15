import React, { useState } from "react";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";

const DemoChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      message: "Hi there! I'm Sky, your AI therapy companion. How are you feeling today?",
      isUser: false,
      timestamp: new Date().toISOString(),
      hasInitialSunIcon: true
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const demoResponses = [
    "I understand that can be challenging. It's completely normal to feel that way sometimes.",
    "That sounds really difficult. Would you like to explore what might be contributing to these feelings?",
    "Thank you for sharing that with me. It takes courage to open up about personal struggles.",
    "I hear you. Let's work through this together. What would be most helpful for you right now?",
    "That's a great insight. How do you think you could apply this understanding moving forward?",
    "It sounds like you're being really thoughtful about this situation. What feels most important to you?",
    "I'm glad you feel comfortable sharing with me. What would support look like for you in this moment?"
  ];

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      message: text,
      isUser: true,
      timestamp: new Date().toISOString(),
      hasInitialSunIcon: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        message: randomResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
        hasInitialSunIcon: false
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌤️</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Sky</h3>
            <p className="text-white/80 text-sm">Your AI Therapy Companion</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-white/50 backdrop-blur-sm">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.message}
            isUser={message.isUser}
            timestamp={message.timestamp}
            hasInitialSunIcon={message.hasInitialSunIcon}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-white/20">
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder="Type your message to try the demo..."
          isDisabled={isTyping}
        />
      </div>
    </div>
  );
};

export default DemoChatInterface;