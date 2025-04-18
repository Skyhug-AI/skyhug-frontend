import React, { useRef, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useTherapist } from "@/context/TherapistContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ChatPage = () => {
  const {
    messages,
    isProcessing,
    sendMessage,
    sendAudioMessage,
    clearMessages,
    endConversation,
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  return (
    <div className="min-h-screen flex flex-col">
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

        <div className="flex-grow flex flex-col bg-gradient-to-b from-white to-serenity-50">
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
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                ))}
                {isProcessing && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <ChatInput
              onSendMessage={sendMessage}
              onStartVoice={sendAudioMessage}
              isVoiceEnabled={true}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatPage;
