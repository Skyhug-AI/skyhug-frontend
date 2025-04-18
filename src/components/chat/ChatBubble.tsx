
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          <AvatarFallback className="bg-serenity-100 text-serenity-600">S</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <div className={cn(
          isUser 
            ? "chat-bubble-user" 
            : "chat-bubble-ai animate-scale-up"
        )}>
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1 px-1">
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
