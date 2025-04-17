
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/context/TherapistContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toggle } from "@/components/ui/toggle";

const SessionRoom = () => {
  const { messages, sendMessage, isProcessing } = useTherapist();
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const navigate = useNavigate();

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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-grow overflow-y-auto py-6">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
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
          <div className="ml-auto flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <Toggle 
              pressed={!isVoiceMode}
              onPressedChange={(pressed) => setIsVoiceMode(!pressed)}
              aria-label="Toggle input mode"
            >
              <Mic className="h-4 w-4" />
            </Toggle>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-grow">
            {isVoiceMode ? (
              <VoiceRecorder
                onVoiceRecorded={handleVoiceRecorded}
                isDisabled={isProcessing}
              />
            ) : (
              <ChatInput
                onSendMessage={handleSendMessage}
                placeholder="Write your answer"
                isDisabled={isProcessing}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionRoom;
