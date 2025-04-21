
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { Lightbulb, SkipForward, Cloud, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import TypingIndicator from "@/components/chat/TypingIndicator";

const SessionRoom = () => {
  const { toast } = useToast();
  const {
    messages,
    sendMessage,
    isProcessing,
    clearMessages,
    setVoiceEnabled,
    endConversation,
  } = useTherapist();
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      setHasStartedChat(true);
      sendMessage(message);
    }
  };

  const handleEndSession = async () => {
    toast({
      title: "Session ended",
      description: "Thank you for sharing today. Take care!",
      duration: 3000,
    });
    await endConversation();
    navigate("/session-summary");
  };

  const handleVoiceRecorded = (transcript: string) => {
    setHasStartedChat(true);
    sendMessage(transcript);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col z-10 relative">
      {/* Listening indicator, styled cloud card and anchored */}
      {isVoiceMode && (
        <div className="fixed bottom-6 left-6 flex flex-col items-center z-30 select-none pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="bg-gradient-to-br from-[#f5f5ff] via-[#e8edff] to-white shadow-lg rounded-full p-3 ring-2 ring-skyhug-100">
              <motion.div
                className="w-9 h-9 rounded-full bg-orb-gradient border-2 border-[#A0C4FF] shadow-lg"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [1, 0.80, 1],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Sky mascot, tiny */}
              <span className="absolute top-2 left-2 pointer-events-none">
                <svg width="15" height="14" viewBox="0 0 24 23"><ellipse cx="12" cy="15" rx="8.5" ry="7.2" fill="#bdb2ff" /><ellipse cx="17" cy="10" rx="5" ry="4" fill="#a0c4ff" /><ellipse cx="9" cy="12" rx="5" ry="3" fill="#f5f5ff" /></svg>
              </span>
            </div>
          </div>
          <span className="mt-2 text-xs text-skyhug-500 font-plus-jakarta bg-white/80 px-3 py-1 rounded-xl shadow border border-skyhug-100">
            Sky is listening with care…
          </span>
        </div>
      )}

      <div className="flex-grow overflow-y-auto py-6">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        {isProcessing && (
          <TypingIndicator />
        )}
        <div ref={messagesEndRef} />
      </div>

      <AnimatePresence>
        <motion.div
          initial={false}
          animate={{
            y: hasStartedChat ? 0 : -200,
            position: hasStartedChat ? "sticky" : "relative",
            marginTop: hasStartedChat ? 0 : "auto",
            marginBottom: hasStartedChat ? 0 : "auto",
          }}
          className="border-t border-gray-100 bg-white/60 backdrop-blur-md p-4 rounded-b-2xl z-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-plus-jakarta px-4 py-2 gap-2 flex items-center bg-white shadow transition-transform duration-150 hover:scale-105 hover:shadow-lg"
            >
              <Lightbulb className="h-4 w-4 text-skyhug-400" />
              Help me answer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-plus-jakarta px-4 py-2 gap-2 flex items-center bg-white shadow transition-transform duration-150 hover:scale-105 hover:shadow-lg"
            >
              <SkipForward className="h-4 w-4 text-cloud-400" />
              Skip question
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-plus-jakarta px-4 py-2 gap-2 flex items-center bg-white border-skyhug-300 text-skyhug-500 hover:bg-skyhug-50 shadow transition-transform duration-150 hover:scale-102 hover:shadow-xl"
              onClick={handleEndSession}
            >
              <Cloud className="h-4 w-4 text-skyhug-400" />
              <ArrowRight className="h-4 w-4 text-skyhug-400 -ml-2" />
              End chat
            </Button>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const next = !isVoiceMode;
                  setIsVoiceMode(next);
                  await setVoiceEnabled(next);
                }}
                className="rounded-full w-8 h-8 transition-transform duration-150 hover:scale-110"
              >
                {isVoiceMode ? (
                  <span><svg width="20" height="18" viewBox="0 0 34 18"><ellipse cx="17" cy="13" rx="15" ry="5" fill="#bdb2ff" /><ellipse cx="25" cy="9" rx="7" ry="2.5" fill="#a0c4ff" /><ellipse cx="10" cy="11" rx="8" ry="2" fill="#f5f5ff" /></svg></span>
                ) : (
                  <svg width="18" height="20" viewBox="0 0 20 18" fill="none"><rect x="2" y="2" width="16" height="14" rx="5" fill="#cce7f8" /><rect x="6" y="6" width="8" height="6" rx="2" fill="#9b87f5" /></svg>
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {isVoiceMode ? (
              <VoiceRecorder
                onVoiceRecorded={handleVoiceRecorded}
                isDisabled={isProcessing}
              />
            ) : (
              <div className="flex-grow">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  placeholder="Write your answer"
                  isDisabled={isProcessing}
                />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SessionRoom;
