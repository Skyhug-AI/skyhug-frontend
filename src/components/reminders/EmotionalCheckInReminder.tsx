
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Star, Sparkles, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

const AssistantThinking = () => (
  <div className="mt-2 flex gap-2 items-center">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bdb2ff] opacity-70"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a0c4ff]"></span>
    </span>
    <span className="text-xs text-[#7E69AB] animate-fade-in font-medium">Sky is thinking…</span>
    <div className="flex space-x-1 ml-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[#b9c6ff]"
          style={{
            animation: "pulse-slow 1.2s ease-in-out infinite",
            animationDelay: `${i * 150}ms`,
            display: "inline-block",
          }}
        ></span>
      ))}
    </div>
  </div>
);

const EmotionalCheckInReminder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const [isThinking, setIsThinking] = useState(false);

  const handleCheckIn = () => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      navigate("/session");
      toast({
        title: "Calm Points Earned! ⭐",
        description: "+10 points for checking in. Keep up the great work!",
      });
    }, 1300);
  };

  const handleTextChat = () => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      navigate("/chat");
      toast({
        title: "Starting text chat 💭",
        description: "Let's chat through what's on your mind",
      });
    }, 1300);
  };

  return (
    <Card className="bg-white/80 glass-panel border-[#ECEAFD] shadow-md mb-6 rounded-2xl p-0">
      <CardContent className="flex items-center p-6 gap-5">
        {/* Avatar with orbital gradient shimmer */}
        <div className="flex flex-col items-center pt-2 pr-1">
          <div className="relative flex-shrink-0">
            <div
              className="bg-gradient-to-tr from-[#bdb2ff] to-[#a0c4ff] p-[3.5px] rounded-full shadow-lg animate-soft-pulse"
              style={{
                boxShadow: "0 2px 12px 0 rgba(135, 144, 255, 0.15)",
              }}
            >
              <Avatar className="h-12 w-12 bg-white rounded-full relative z-10">
                <AvatarFallback className="bg-[#9b87f5] text-white text-lg font-bold">S</AvatarFallback>
              </Avatar>
            </div>
            <Sparkles className="absolute -top-2 -right-1 h-4 w-4 text-[#809af4] drop-shadow pointer-events-none" />
          </div>
          <span className="text-xs mt-2 text-[#7E69AB] font-semibold tracking-wide">Sky</span>
        </div>

        {/* Speech bubble + actions wrapper */}
        <div className="flex flex-col justify-center flex-grow">
          <div
            className="relative mb-2 rounded-[22px] max-w-2xl text-[16.5px] px-5 py-4 font-normal leading-snug gradient-bubble shadow-sm border border-[#ebe9fd] text-[#1A1F2C]"
            style={{
              background: "linear-gradient(90deg, #e3e8fa 70%, #e4e1fe 100%)",
              boxShadow: "0 4px 24px 0 rgba(164,188,249,0.13)",
              borderBottomLeftRadius: "6px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              minWidth: 260,
            }}
          >
            Hey {firstName}, I noticed your week had some ups and downs. Want to check in together?
            {isThinking && <AssistantThinking />}
            {/* speech bubble caret */}
            <span className="absolute left-4 -bottom-4">
              <svg width="28" height="20">
                <polygon
                  points="0,0 28,0 14,20"
                  fill="#e3e8fa"
                  opacity="0.95"
                />
              </svg>
            </span>
          </div>
          {/* Action Buttons and Calm Points */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-3">
              {/* Start a Session button */}
              <Button
                onClick={handleCheckIn}
                size="sm"
                className="bg-gradient-to-r from-[#a0c4ff] to-[#bdb2ff] hover:from-[#bdb2ff]/90 hover:to-[#a0c4ff]/90 transition-all duration-200 rounded-md shadow font-semibold px-7 h-11 text-base flex items-center
                  text-white border-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#bdb2ff] hover:shadow-glow-blur"
                style={{
                  boxShadow: "0 1.5px 6px 0 rgba(135, 144, 255, 0.08)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: 0.02,
                }}
              >
                Start a Session
              </Button>
              {/* Text Me Button */}
              <Button
                onClick={handleTextChat}
                variant="outline"
                size="sm"
                className="border-[#dde3f5] hover:bg-[#f7f3fd] transition-all duration-200 font-semibold rounded-xl h-11 px-6 flex items-center text-[#222] shadow-sm
                group bg-white/95 hover:border-[#bdb2ff] hover:text-[#8E9196] border-2"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <MessageSquare className="mr-2 h-5 w-5 text-[#8E9196]" />
                <span className="group-hover:text-[#7E69AB] transition-colors">Text me</span>
              </Button>
            </div>
            <div className="flex items-center gap-2 text-[15.5px] text-[#6379ed] font-semibold whitespace-nowrap pl-2 pr-1.5">
              <Star className="h-5 w-5" strokeWidth={2} />
              <span>+50 Calm Points</span>
            </div>
          </div>
        </div>
      </CardContent>
      {/* Button Glow Animation */}
      <style>{`
        .hover\\:shadow-glow-blur:hover {
          box-shadow: 0 0 18px 0 #bdb2ff55, 0 4px 20px 0 #a0c4ff19;
        }
        .gradient-bubble {
          /* fallback for browsers without gradients */
          background: linear-gradient(90deg, #e3e8fa 70%, #e4e1fe 100%);
        }
        @media (max-width: 640px) {
          .gradient-bubble {
            min-width: 0 !important;
            font-size: 15px;
            padding-bottom: 26px;
          }
        }
      `}</style>
    </Card>
  );
};

export default EmotionalCheckInReminder;

