
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/context/TherapistContext';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toggle } from "@/components/ui/toggle";
import { useToast } from '@/hooks/use-toast';

const SessionRoom = () => {
  const { messages, sendMessage, isProcessing } = useTherapist();
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [showBreathReminder, setShowBreathReminder] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Show breath reminder after 5 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBreathReminder(true);
      setTimeout(() => setShowBreathReminder(false), 8000);
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearTimeout(timer);
  }, []);

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

  const handleHelpAnswer = () => {
    toast({
      title: "💡 Suggestions",
      description: "Try expressing how you feel right now or talk about what's on your mind today",
      duration: 5000,
    });
  };

  const handleSkipQuestion = () => {
    sendMessage("I'd like to skip this question");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-[#f9fafe] to-[#f4f2ff]">
      <div className="flex-grow overflow-y-auto py-6 px-2 space-y-6">
        {showBreathReminder && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-md bg-blue-50/80 backdrop-blur-sm p-3 rounded-xl border border-blue-100 text-center"
          >
            <p className="text-blue-700">🌬️ Take a breath. You're doing great.</p>
          </motion.div>
        )}
        
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
        className="sticky bottom-0 border-t border-blue-100/30 bg-white/80 backdrop-blur-md p-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 rounded-full border-blue-200 hover:bg-blue-50"
            onClick={handleHelpAnswer}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help me answer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 rounded-full border-blue-200 hover:bg-blue-50"
            onClick={handleSkipQuestion}
          >
            ✨ Skip question
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 rounded-full border-blue-200 hover:bg-blue-50"
            onClick={handleEndChat}
          >
            Save session
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-3 py-1 text-xs font-medium ${isVoiceMode ? 'bg-transparent text-blue-500' : 'bg-blue-100/50 text-blue-700'}`}
              onClick={() => setIsVoiceMode(false)}
            >
              <MessageSquare className="h-3 w-3 mr-1" /> Text Mode
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-3 py-1 text-xs font-medium ${!isVoiceMode ? 'bg-transparent text-blue-500' : 'bg-blue-100/50 text-blue-700'}`}
              onClick={() => setIsVoiceMode(true)}
            >
              <Mic className="h-3 w-3 mr-1" /> Voice Mode
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
