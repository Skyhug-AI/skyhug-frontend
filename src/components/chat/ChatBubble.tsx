
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun } from 'lucide-react';

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  timestamp?: string;
  hasInitialSunIcon?: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isUser, 
  timestamp, 
  hasInitialSunIcon = false 
}) => {
  return (
    <div className={cn(
      "flex gap-3 max-w-full mb-[20px]", // Reduced vertical spacing between messages
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 self-center"> {/* Vertically center avatar */}
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
          "rounded-[20px] px-4 py-3 max-w-md shadow-sm", // Reduced padding to 16px
          isUser 
            ? "bg-gradient-to-br from-[#f2edff] to-[#e8eaff] text-gray-800" 
            : "bg-sky-50 text-sky-800",
          isUser ? "" : "flex items-start space-x-2"
        )}>
          {!isUser && hasInitialSunIcon && <Sun className="h-5 w-5 text-yellow-500 mr-2" />}
          <p className={cn(
            "whitespace-pre-wrap",
            isUser ? "font-medium" : "font-[500]",
            "leading-[1.5]" // Reduced line-height for more compact text
          )}>
            {message}
          </p>
        </div>
        {timestamp && (
          <span className={cn(
            "text-xs text-[#A0A0A0] mt-[8px] px-1 opacity-50 hover:opacity-100 transition-opacity", // Reduced timestamp spacing
            isUser ? "text-right" : "text-left"
          )}>
            {timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 self-center"> {/* Vertically center avatar */}
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
