
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SkyCloudMascot from "@/components/chat/SkyCloudMascot";

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
  // If first message, could personalize; for now just normal render
  return (
    <div className={cn(
      "flex gap-3 max-w-full mb-[22px]",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="self-end flex-shrink-0 mr-1">
          <div className="rounded-full bg-gradient-to-r from-[#bdb2ff] to-[#a0c4ff] p-[2.5px] shadow-md transition-all duration-200">
            <SkyCloudMascot size={38} mood="neutral" />
          </div>
        </div>
      )}
      <div className="flex flex-col max-w-[75vw]">
        <div className={cn(
          "relative rounded-[20px] px-4 py-2 max-w-md shadow-sm border-none text-sm backdrop-blur-[2px] break-words",
          isUser
            ? "bg-[#cce7f8] text-[#11366d] rounded-br-md shadow-md"
            : "bg-gradient-to-b from-[#e8edff] to-[#f5f5ff] text-[#23274a] shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-fade-in select-text",
        )}>
          {/* Optionally insert sun icon, left for future */}
          <p className={cn(
            "whitespace-pre-wrap font-plus-jakarta leading-[1.52] text-[16px]",
            isUser ? "" : "font-[400]",
          )}>
            {message}
          </p>
        </div>
        {timestamp && (
          <span className={cn(
            "text-xs text-muted-foreground rounded mt-1 px-1 opacity-60 hover:opacity-95 transition-opacity",
            isUser ? "text-right" : "text-left"
          )}>
            {timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 self-center">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-[#A0B0FF] to-[#C5CDFF] text-white">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatBubble;
