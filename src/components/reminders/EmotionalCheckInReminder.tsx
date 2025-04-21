
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
    <span className="text-xs text-serenity-600 animate-fade-in font-medium">Sky is thinking…</span>
    <div className="flex space-x-1 ml-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-serenity-400"
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
    <Card className="bg-white border-[#E5E7EB] shadow-lg mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Gradient Avatar Wrapper */}
          <div className="relative flex-shrink-0">
            <div
              className="p-[2.5px] rounded-full"
              style={{
                background:
                  "linear-gradient(to right, #bdb2ff, #a0c4ff)",
              }}
            >
              <Avatar className="h-12 w-12 bg-white rounded-full relative z-10">
                <AvatarFallback className="bg-serenity-500 text-white text-lg font-bold">
                  S
                </AvatarFallback>
              </Avatar>
            </div>
            <Sparkles className="absolute -top-1.5 -right-1 h-4 w-4 text-serenity-400 drop-shadow" />
          </div>

          <div className="flex-1">
            <div className="mb-2 text-xs text-muted-foreground font-semibold tracking-wide">Sky</div>
            {/* Speech Bubble */}
            <div className="relative max-w-xl mb-3">
              <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-gradient-to-tr from-[#e0d8fd] via-[#e8f0fe] to-[#c4e0fb] shadow-sm border border-skyhug-50 text-[#31214A] text-base font-normal leading-snug transition-all">
                Hey {firstName}, I noticed your week had some ups and downs. Want to check in together?
                {isThinking && <AssistantThinking />}
              </div>
              {/* Optional cute caret */}
              <div className="absolute left-2 bottom-[-13px] w-4 h-4">
                <svg width="20" height="16">
                  <polygon
                    points="0,0 20,0 10,16"
                    fill="#e0d8fd"
                    opacity="0.8"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                {/* Start Session */}
                <Button
                  onClick={handleCheckIn}
                  size="sm"
                  className="bg-serenity-500 hover:bg-serenity-600 transition-all duration-150 rounded shadow-md font-semibold px-5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-serenity-300
                  hover:shadow-glow-blue"
                  style={{
                    boxShadow:
                      "0 2px 8px 0 rgba(135, 144, 255, 0.08)",
                  }}
                >
                  Start a Session
                </Button>
                {/* Text Me */}
                <Button
                  onClick={handleTextChat}
                  variant="outline"
                  size="sm"
                  className="border-serenity-200 hover:bg-serenity-50 transition-all duration-150 rounded-full font-semibold shadow-md group 
                    hover:shadow-glow-blue"
                  style={{
                    boxShadow:
                      "0 2px 8px 0 rgba(135, 144, 255, 0.08)",
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="group-hover:text-serenity-600 transition-colors">Text me</span>
                </Button>
              </div>
              <div className="flex items-center gap-1 text-sm text-serenity-600 font-medium">
                <Star className="h-4 w-4" />
                <span>+50 Calm Points</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <style>{`
        .hover\\:shadow-glow-blue:hover {
          box-shadow: 0 0 12px 4px #a0c4ff33, 0 2px 8px 0 rgba(107, 114, 255, 0.07);
        }
      `}</style>
    </Card>
  );
};

export default EmotionalCheckInReminder;
