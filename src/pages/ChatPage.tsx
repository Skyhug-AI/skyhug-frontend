
import React, { useRef, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import { useTherapist } from "@/context/TherapistContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, Smile } from "lucide-react";
import BackgroundEffects from "@/components/chat/BackgroundEffects";

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
    scrollToBottom();
  }, [messages, isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundEffects />
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center relative px-2 md:px-0">
        <div className="w-full flex flex-col items-center justify-center flex-grow">
          {/* Chat container: Glassy, rounded, floating */}
          <div
            className="
              relative glass-panel
              max-w-3xl w-full mx-auto mt-10 mb-10 p-0
              bg-white/60 border border-white/40
              rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.03)]
              flex flex-col min-h-[600px] min-w-0
              overflow-hidden
              "
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
            }}
          >
            {/* Decorative floating "sky cloud" mascot (bottom right) */}
            <div className="absolute bottom-4 right-4 z-30 select-none pointer-events-none flex flex-col items-center">
              <span
                className="block bg-cloud-100 rounded-full shadow-md"
                style={{
                  width: "62px",
                  height: "40px",
                  filter: "blur(0.7px)",
                  opacity: 0.94,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Smile
                  className="text-skyhug-400 drop-shadow"
                  size={34}
                  style={{ position: "absolute", left: "14px", top: "6px" }}
                />
              </span>
              <span className="text-xs text-gray-400 mt-[-6px]">sky cloud</span>
            </div>

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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatPage;
