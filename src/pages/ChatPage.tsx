
import React, { useRef, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useTherapist } from "@/context/TherapistContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Pause } from "lucide-react";
import BackgroundEffects from "@/components/chat/BackgroundEffects";

const ChatPage = () => {
  const {
    messages,
    isProcessing,
    sendMessage,
    clearMessages,
    endConversation,
    playMessageAudio,
    isAudioPlaying,
    currentPlayingPath,
  } = useTherapist();

  const { patientReady } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [canStartChat, setCanStartChat] = useState(false);

  useEffect(() => {
    if (patientReady) {
      setCanStartChat(true);
    }
  }, [patientReady]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handlePlayAudio = (tts_path?: string | null) => {
    if (tts_path) {
      playMessageAudio(tts_path);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: "linear-gradient(180deg, #d3e4fd 0%, #ffffff 100%)",
      }}
    >
      <BackgroundEffects />
      <Header />

      <main className="flex-grow flex flex-col">
        <div className="bg-serenity-50 py-6 px-4 md:px-8 border-b border-border">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Chat with Serenity
            </h1>
            <p className="text-center text-muted-foreground mt-2">
              Share your thoughts and feelings in a safe, judgment-free space.
            </p>
          </div>
        </div>

        <div className="flex-grow flex flex-col bg-gradient-to-b from-white to-serenity-50 relative">
          <div className="max-w-5xl w-full mx-auto flex-grow flex flex-col">
            <div className="p-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={async () => {
                  if (canStartChat) {
                    await endConversation();
                    clearMessages();
                  } else {
                    console.warn("⏳ Patient row not ready yet...");
                  }
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>

            <div className="flex-grow overflow-y-auto px-4 md:px-8 py-4">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className="relative group">
                    <ChatBubble
                      key={index}
                      message={message.content}
                      isUser={message.isUser}
                    />
                    {!message.isUser && message.tts_path && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handlePlayAudio(message.tts_path)}
                      >
                        {currentPlayingPath === message.tts_path && isAudioPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                ))}
                {isProcessing && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <ChatInput
              onSendMessage={sendMessage}
              isVoiceEnabled={false}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatPage;
