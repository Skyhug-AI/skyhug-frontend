import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/context/TherapistContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MessageSquare, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
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
        </div>

        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="inline-flex items-center gap-2 text-[13px] font-medium text-[#7d7d7d]">
                <Brain className="h-4 w-4" />
                AI Therapy with Sky
              </TooltipTrigger>
              <TooltipContent>
                You're currently in a private session with Sky.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="outline"
            size="sm"
            className="text-gray-600"
            onClick={handleEndChat}
          >
            End chat & continue
          </Button>
        </div>
      </div>
      
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
