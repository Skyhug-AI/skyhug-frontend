
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun } from 'lucide-react';

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
            S
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <div className={cn(
          "rounded-2xl px-4 py-3 max-w-md",
          isUser 
            ? "bg-gradient-to-br from-blush-50 to-blush-100 text-gray-800" 
            : "bg-sky-50 text-sky-800",
          isUser ? "" : "flex items-start space-x-2"
        )}>
          {!isUser && <Sun className="h-5 w-5 text-yellow-500 mr-2" />}
          <p className="whitespace-pre-wrap font-medium">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1 px-1 opacity-50 hover:opacity-100 transition-opacity">
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
