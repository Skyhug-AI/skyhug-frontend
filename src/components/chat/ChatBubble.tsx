
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun } from 'lucide-react';

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  timestamp?: string;
  editedAt?: string;
  hasInitialSunIcon?: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isUser, 
  editedAt, 
  timestamp,
  hasInitialSunIcon = false 
}) => {
  return (
    <div className={cn(
      "flex gap-3 max-w-full mb-[20px]", 
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 self-center">
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
          "rounded-[16px] px-3 py-2 max-w-md shadow-sm border-none",
          isUser ? "" : "flex items-start space-x-2",
          !isUser && "animate-fade-in",
          "bg-gradient-to-b from-[#f9faff] to-[#fdfcff] bg-opacity-50"
        )}>
          {!isUser && hasInitialSunIcon && <Sun className="h-5 w-5 text-yellow-500 mr-2" />}
          <p className={cn(
            "whitespace-pre-wrap",
            "text-[16px] font-ui-sans-serif text-[#020817]",
            isUser ? "font-normal" : "font-[400]", 
            "leading-[1.5]"
          )}>
            {message}
          </p>
          {editedAt && (
            <span className="text-xs italic opacity-60 ml-2">(edited)</span>
          )}
        </div>
        {timestamp && (
          <span className={cn(
            "text-xs text-muted-foreground rounded mt-1 px-1 opacity-50 hover:opacity-100 transition-opacity",
            isUser ? "text-right" : "text-left"
          )}>
            {timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 self-center">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-[#A0B0FF] to-[#C5CDFF] text-white">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatBubble;
