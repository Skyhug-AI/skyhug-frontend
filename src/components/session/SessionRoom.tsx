
import React, { useState } from 'react';
import { useTherapist } from '@/context/TherapistContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SessionRoom = () => {
  const { messages, sendMessage, isProcessing } = useTherapist();
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage(message);
      setCurrentMessage('');
    }
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
          >
            End chat & continue
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex-grow">
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder="Write your answer"
              isDisabled={isProcessing}
            />
          </div>
          <Button
            size="icon"
            className="rounded-full bg-blue-500 hover:bg-blue-600"
            disabled={!currentMessage.trim() || isProcessing}
            onClick={() => handleSendMessage(currentMessage)}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionRoom;
