
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MessageSquare, Loader, Play, Pause, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

const SessionRoom = () => {
  const { toast } = useToast();
  const {
    messages = [],
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const lastTranscriptRef = useRef<string | null>(null);
  const lastSendRef = useRef<{ text: string; time: number }>({ text: "", time: 0 });
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  // Track if we're handling voice recognition pausing/resuming
  const [recognitionPaused, setRecognitionPaused] = useState(false);
  const playedTtsRef = useRef<Set<string>>(new Set());

  // only hide assistant bubbles until tts arrives *when* voice mode is on
  const displayedMessages = messages.filter(msg =>
    // always show user
    msg.isUser ||
    // always show assistant in chat mode
    !isVoiceMode ||
    // in voice mode, only once audio is ready
    Boolean(msg.ttsHasArrived)
  );


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
    // helper to pause & clear our single Audio instance
    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = audioRef.current.duration;
        audioRef.current = null;
      }
    };
  
    // 1) When the browser is about to unload (close/refresh), stop audio
    window.addEventListener("beforeunload", stopAudio);
  
    return () => {
      // 2) When SessionRoom unmounts (navigating inside your SPA), also stop audio
      stopAudio();
      window.removeEventListener("beforeunload", stopAudio);
    };
  }, []);

  useEffect(() => {
    // helper to pause & clear our single Audio instance
    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = audioRef.current.duration;
        audioRef.current = null;
      }
    };
  
    // 1) When the browser is about to unload (close/refresh), stop audio
    window.addEventListener("beforeunload", stopAudio);
  
    return () => {
      // 2) When SessionRoom unmounts (navigating inside your SPA), also stop audio
      stopAudio();
      window.removeEventListener("beforeunload", stopAudio);
    };
  }, []);


  useEffect(() => {
    for (const msg of displayedMessages) {
      // only auto-play new assistant messages whose TTS just arrived
      if (
        !msg.isUser &&
        msg.ttsHasArrived &&
        msg.tts_path &&
        !playedTtsRef.current.has(msg.id)
      ) {
        playedTtsRef.current.add(msg.id);
        // clear the "thinking" spinner
        setWaitingForResponse(false);
        handlePlayAudio(msg.tts_path);
        break; // only play the first new one
      }
    }
  }, [displayedMessages]);
  
  

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
    if (trimmed === lastText && now - lastTime < 3000) return;
    lastSendRef.current = { text: trimmed, time: now };
  
    setHasStartedChat(true);
    // start showing “Sky is thinking...” immediately
    setWaitingForResponse(true);
    sendMessage(trimmed);
  };
  

  const handlePlayAudio = async (tts_path?: string | null) => {
    if (!tts_path) {
      toast({
        title: "No audio available",
        description: "This message doesn't have audio",
        variant: "destructive",
      });
      return;
    }
  
    // If we're clicking the same clip that's already loaded, toggle pause/play
    if (currentlyPlayingPath === tts_path && audioRef.current) {
      // If it's currently playing, pause it and immediately free the mic
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        setIsPaused(true);
        setIsMicLocked(false);   // unlock mic as soon as user pauses
      }
      // If it's currently paused, resume playback and lock the mic again
      else {
        try {
          await audioRef.current.play();
          setIsPaused(false);
          setIsMicLocked(true);  // lock mic while audio plays
        } catch (e) {
          console.error("Error resuming audio:", e);
        }
      }
      return;
    }
  
    // Otherwise, tearing down any previous audio and starting a new clip:
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  
    setIsMicLocked(true);
    setCurrentlyPlayingPath(tts_path);
    setIsPaused(false);
  
    const { data, error } = await supabase
      .storage
      .from("tts-audio")
      .createSignedUrl(tts_path, 60);
  
    if (error || !data?.signedUrl) {
      toast({ title: "Audio error", description: "Could not load TTS audio", variant: "destructive" });
      setWaitingForResponse(false);
      setIsMicLocked(false);
      setCurrentlyPlayingPath(null);
      return;
    }
  
    const audio = new Audio(data.signedUrl);
    audioRef.current = audio;
    audio.preload = 'auto';
  
    // stop “thinking…” as soon as we have audio buffered
    audio.onloadeddata = () => {
      setWaitingForResponse(false);
    };
    // also in case play begins right away
    audio.onplay = () => {
      setWaitingForResponse(false);
    };
  
    audio.onended = () => {
      setIsMicLocked(false);
      setCurrentlyPlayingPath(null);
      setIsPaused(false);
      audioRef.current = null;
    };
    audio.onerror = () => {
      console.error("Audio playback error");
      setWaitingForResponse(false);
      setIsMicLocked(false);
      setCurrentlyPlayingPath(null);
    };
  
    try {
      await audio.play();
    } catch (e) {
      console.error("Error starting audio:", e);
      setWaitingForResponse(false);
      setIsMicLocked(false);
      setCurrentlyPlayingPath(null);
    }
  };
  


  
  const handleRecognitionPaused = () => {
    console.log("Voice recognition paused");
    setRecognitionPaused(true);
  };
  
  const handleRecognitionResumed = () => {
    console.log("Voice recognition resumed");
    setRecognitionPaused(false);
  };

const interruptPlayback = () => {
  // If there’s a clip still loaded, stop & skip it
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = audioRef.current.duration;
    audioRef.current = null;
  }

  // Unlock the mic immediately
  setIsMicLocked(false);

  // Clear your UI “playing” flags
  if (currentlyPlayingPath) {
    setAudioStates(prev => ({ ...prev, [currentlyPlayingPath]: false }));
    setCurrentlyPlayingPath(null);
  }
};

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            {isVoiceMode && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2 text-sm">
          {recognitionPaused ? (
            <X className="w-4 h-4 text-red-500" />
          ) : (
            <motion.div
              className="w-2 h-2 rounded-full bg-skyhug-500"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
          <span className={recognitionPaused ? "text-red-500" : "text-gray-600"}>
            {recognitionPaused ? "Sky is not listening..." : "Sky is listening..."}
          </span>
        </div>
      )}


      <div
        className="flex-grow overflow-y-auto py-6 scroll-smooth"
        ref={chatContainerRef}
        style={{ maxHeight: "calc(100vh - 12rem)" }}
      >
        <div className="space-y-6 flex flex-col min-h-full">
          <div className="flex-grow" />
          {displayedMessages.map((message) => (
          <div key={message.id} className="relative group">
            <ChatBubble
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
                  {currentlyPlayingPath === message.tts_path && !isPaused
                    ? <Pause className="h-4 w-4" />
                    : <Play className="h-4 w-4" />
                  }
                </Button>
              )}
            </div>
          ))}
          {(isProcessing || waitingForResponse) && (
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
                shouldPauseRecognition={ isMicLocked || waitingForResponse }
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
