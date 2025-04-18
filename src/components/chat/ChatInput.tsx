
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Send, Sparkles } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  onStartVoice?: () => void;
  isVoiceEnabled?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onStartVoice, 
  isVoiceEnabled = false,
  placeholder = "Type your message...",
  isDisabled = false
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-blue-100/40 p-4 bg-white/50 backdrop-blur-sm">
      <div className="relative flex-grow">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          className="w-full p-3 pr-10 rounded-full border border-blue-200 bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-serenity-300 transition-all placeholder:text-blue-300"
        />
      </div>
      
      {isVoiceEnabled && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full border-blue-200 bg-blue-50/50"
          onClick={onStartVoice}
          disabled={isDisabled}
        >
          <Mic className="h-5 w-5 text-serenity-500" />
        </Button>
      )}
      
      <Button
        type="submit"
        size="icon"
        className="rounded-full bg-serenity-500 hover:bg-serenity-600"
        disabled={!message.trim() || isDisabled}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
