
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MessageSquare, Loader, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const SessionRoom = () => {
  const { toast } = useToast();
  const {
    messages,
    sendMessage,
    isProcessing,
    clearMessages,
    setVoiceEnabled,
    endConversation,
    playMessageAudio,
  } = useTherapist();
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [currentlyPlayingPath, setCurrentlyPlayingPath] = useState<string | null>(null);
  const [audioStates, setAudioStates] = useState<{[key: string]: boolean}>({});
  const [isMicLocked, setIsMicLocked] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastPlayedId = useRef<string | null>(null);
  const lastPlayedRef = useRef<string | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const lastTranscriptRef = useRef<string | null>(null);
  const lastSendRef = useRef<{ text: string; time: number }>({ text: "", time: 0 });

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setHasStartedChat(true);
    }

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // This effect unlocks the mic when playback stops
  useEffect(() => {
    if (!currentlyPlayingPath) {
      setIsMicLocked(false);
    }
  }, [currentlyPlayingPath]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (
      lastMsg &&
      !lastMsg.isUser &&
      lastMsg.tts_path &&
      lastPlayedRef.current !== lastMsg.id
    ) {
      console.log('►►► SessionRoom auto-playing message', lastMsg.id);
      lastPlayedRef.current = lastMsg.id;
      // reset the transcript guard on every new assistant reply:
      lastTranscriptRef.current = null;
  
      handlePlayAudio(lastMsg.tts_path);
    }
  }, [messages]);

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      setHasStartedChat(true);
      sendMessage(message);
    }
  };

  const handleEndSession = async () => {
    toast({
      title: "Session ended",
      description: "Thank you for sharing today. Take care!",
      duration: 3000,
    });
    await endConversation();
    navigate("/session-summary");
  };

  const handleVoiceRecorded = (transcript: string) => {
    const trimmed = transcript.trim();
    if (!trimmed) return;
  
    const now = Date.now();
    const { text: lastText, time: lastTime } = lastSendRef.current;
  
    // 1) If it’s literally the same as last time and within 3s, ignore
    if (trimmed === lastText && now - lastTime < 3000) {
      console.log("⏭️ Duplicate transcript ignored:", trimmed);
      return;
    }
    // 2) Otherwise update our guard
    lastSendRef.current = { text: trimmed, time: now };
  
    // 3) Dispatch it exactly once
    setHasStartedChat(true);
    sendMessage(trimmed);
  };
  

  const handlePlayAudio = async (tts_path?: string | null) => {
    // 1️⃣ Guard against missing path
    if (!tts_path) {
      toast({
        title: "No audio available",
        description: "This message doesn't have audio",
        variant: "destructive",
      });
      return;
    }
  
    // 2️⃣ If something’s already playing, stop it immediately
    if (audioEl) {
      audioEl.onended = null;           // remove old handler
      audioEl.pause();
      audioEl.currentTime = audioEl.duration;  // skip to end
    }
  
    // Also clear the old UI state
    if (currentlyPlayingPath) {
      setAudioStates(prev => ({
        ...prev,
        [currentlyPlayingPath]: false
      }));
    }
  
    // 3️⃣ Lock mic & mark this clip as “playing”
    console.log("🔒 locking mic for", tts_path);
    setIsMicLocked(true);
    setCurrentlyPlayingPath(tts_path);
    setAudioStates(prev => ({
      ...prev,
      [tts_path]: true
    }));
  
    // 4️⃣ Kick off TTS playback via your context, capture the <audio> back
    const newAudio = await playMessageAudio(tts_path);
    if (!newAudio) {
      // If for any reason no element was returned, unlock immediately
      setIsMicLocked(false);
      setCurrentlyPlayingPath(null);
      setAudioStates(prev => ({
        ...prev,
        [tts_path]: false
      }));
      return;
    }
  
    // 5️⃣ Store it for “interrupt” use
    setAudioEl(newAudio);
  
    // 6️⃣ When it truly ends, unlock and clear state
    newAudio.onended = () => {
      console.log("🔓 TTS finished, unlocking mic for", tts_path);
      setIsMicLocked(false);
      setCurrentlyPlayingPath(null);
      setAudioStates(prev => ({
        ...prev,
        [tts_path]: false
      }));
      setAudioEl(null);
    };
  };
  

  // Track if we're handling voice recognition pausing/resuming
  const [recognitionPaused, setRecognitionPaused] = useState(false);
  
  const handleRecognitionPaused = () => {
    console.log("Voice recognition paused");
    setRecognitionPaused(true);
  };
  
  const handleRecognitionResumed = () => {
    console.log("Voice recognition resumed");
    setRecognitionPaused(false);
  };

  const interruptPlayback = () => {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = audioEl.duration;
    }
    setIsMicLocked(false);
    if (currentlyPlayingPath) {
      setAudioStates(prev => ({ ...prev, [currentlyPlayingPath]: false }));
      setCurrentlyPlayingPath(null);
    }
    setAudioEl(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {isVoiceMode && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2 text-sm text-gray-600">
          <motion.div
            className="w-2 h-2 rounded-full bg-skyhug-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span>Sky is listening...</span>
        </div>
      )}

      <div
        className="flex-grow overflow-y-auto py-6 scroll-smooth"
        ref={chatContainerRef}
        style={{ maxHeight: "calc(100vh - 12rem)" }}
      >
        <div className="space-y-6 flex flex-col min-h-full">
          <div className="flex-grow" />
          {messages.map((message, index) => (
            <div key={index} className="relative group">
              <ChatBubble
                key={index}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
              {!message.isUser && message.tts_path && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handlePlayAudio(message.tts_path)}
                  disabled={isMicLocked && currentlyPlayingPath !== message.tts_path}
                >
                  {audioStates[message.tts_path || ""] ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {audioStates[message.tts_path || ""] ? "Pause audio" : "Play audio"}
                  </span>
                </Button>
              )}
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 px-4 py-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Loader className="h-4 w-4 text-skyhug-500" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600"
              >
                Sky is thinking...
              </motion.span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={false}
          animate={{
            y: hasStartedChat ? 0 : -200,
            position: hasStartedChat ? "sticky" : "relative",
          }}
          className="border-t border-gray-100 bg-transparent backdrop-blur-sm p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" size="sm" className="text-gray-900">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help me answer
            </Button>
            <Button variant="outline" size="sm" className="text-gray-900">
              Skip question
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-900"
              onClick={handleEndSession}
            >
              End chat & continue
            </Button>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const next = !isVoiceMode;
                  setIsVoiceMode(next);
                  await setVoiceEnabled(next);
                }}
                className="rounded-full w-8 h-8"
              >
                {isVoiceMode ? (
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                ) : (
                  <Mic className="h-4 w-4 text-gray-600" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {isVoiceMode ? (
              <VoiceRecorder
                onVoiceRecorded={handleVoiceRecorded}
                isDisabled={isProcessing}
                shouldPauseRecognition={isMicLocked}
                onRecognitionPaused={handleRecognitionPaused}
                onRecognitionResumed={handleRecognitionResumed}
                onInterruptPlayback={interruptPlayback} 
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
      </AnimatePresence>
    </div>
  );
};

export default SessionRoom;
