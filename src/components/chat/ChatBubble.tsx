
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from 'lucide-react';

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  timestamp?: string;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, timestamp }) => {
  return (
    <div className={cn("flex gap-3 max-w-full", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="" alt="AI" />
          <AvatarFallback 
            className="bg-orb-gradient text-white font-semibold flex items-center justify-center"
          >
            🌤️
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <div className={cn(
          "px-4 py-3 rounded-2xl shadow-sm max-w-md",
          isUser 
            ? "bg-sky-50 text-gray-800 border border-sky-100" 
            : "bg-blue-50 text-sky-800 font-medium border border-blue-100 animate-scale-up"
        )}>
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1 px-1 opacity-70 hover:opacity-100 transition-opacity">
            {timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-serenity-500 text-white">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatBubble;
