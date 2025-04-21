
// Update the three action buttons with pastel colored backgrounds like in the example (soft green, soft yellow, soft blue).

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MessageSquare, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
  }, [messages]);

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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {isVoiceMode && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2 text-sm text-gray-600">
          <motion.div
            className="w-2 h-2 rounded-full bg-skyhug-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span>Sky is listening...</span>
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
          <div className="flex items-center gap-2 px-4 py-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Loader className="h-4 w-4 text-skyhug-500" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600"
            >
              Sky is thinking...
            </motion.span>
          </div>
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
          className="border-t border-gray-100 bg-white/50 backdrop-blur-sm p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-900 bg-[#F2FCE2] border-transparent hover:bg-[#DDF7BF]"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help me answer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-900 bg-[#FEF7CD] border-transparent hover:bg-[#FFF9B3]"
            >
              Skip question
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-900 bg-[#D3E4FD] border-transparent hover:bg-[#B4CDFA]"
              onClick={handleEndSession}
            >
              End chat & continue
            </Button>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const next = !isVoiceMode;
                  setIsVoiceMode(next);
                  await setVoiceEnabled(next); // ✅ persist voice/chat mode to Supabase
                }}
                className="rounded-full w-8 h-8"
              >
                {isVoiceMode ? (
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                ) : (
                  <Mic className="h-4 w-4 text-gray-600" />
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

