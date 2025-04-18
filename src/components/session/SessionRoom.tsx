import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/context/TherapistContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import ChatAtmosphere from '@/components/chat/ChatAtmosphere';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const SessionRoom = () => {
  const { messages, sendMessage, isProcessing } = useTherapist();
  const [isVoiceMode, setIsVoiceMode] = useState(true);
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
      sendMessage(message);
    }
  };

  const handleVoiceRecorded = (transcript: string) => {
    sendMessage(transcript);
  };

  const handleEndChat = () => {
    navigate('/session-summary');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col relative">
      <ChatAtmosphere />
      
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
              ease: "easeInOut"
            }}
          />
          <span>Sky is listening...</span>
        </div>
      )}

      <div className="flex-grow overflow-y-auto py-6 relative">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky bottom-0 border-t border-gray-100 bg-white p-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help me answer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600"
          >
            Skip question
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600"
            onClick={handleEndChat}
          >
            End chat & continue
          </Button>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVoiceMode(!isVoiceMode)}
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
    </div>
  );
};

export default SessionRoom;
