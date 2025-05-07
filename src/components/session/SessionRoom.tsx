
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mic, MessageSquare, Loader, Play, Pause, X, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SessionRoom = () => {
  const { toast } = useToast();
  const {
    messages = [],
    sendMessage,
    editMessage,
    isProcessing,
    setVoiceEnabled,
    endConversation,
    conversationId,
    invalidateFrom,
    regenerateAfter
  } = useTherapist();
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [currentlyPlayingPath, setCurrentlyPlayingPath] = useState<string | null>(null);
  const [isMicLocked, setIsMicLocked] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const lastSendRef = useRef<{ text: string; time: number }>({ text: "", time: 0 });
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  // Track if we're handling voice recognition pausing/resuming
  const [recognitionPaused, setRecognitionPaused] = useState(false);
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);
  const voiceTimeoutRef = useRef<number | null>(null);
  const [streamedMap, setStreamedMap] = useState<Record<string, boolean>>({});
  const playedSnippetsRef = useRef<Set<string>>(new Set());
  const [snippetUrls, setSnippetUrls] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");



  const STREAM_BASE = "http://localhost:8000";


  const displayedMessages = messages.map(m =>
    m.snippet_url
      ? m
      : snippetUrls[m.id]
      ? { ...m, snippet_url: snippetUrls[m.id] }
      : m
  );


  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) setHasStartedChat(true)
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
    if (!isVoiceMode) return;

    for (const msg of displayedMessages) {
      if (msg.isUser) continue;

      // 1) Snippet available?
      if (msg.snippet_url && !playedSnippetsRef.current.has(msg.id)) {
        // stop the thinking spinner
        setWaitingForResponse(false);
        playedSnippetsRef.current.add(msg.id);
        const introAudio = new Audio(msg.snippet_url);
        introAudio.play().catch(console.error);
        handlePlayAudio(msg.id);
        return;
      }

      // 2) Fallback to full stream
      if (!playedSnippetsRef.current.has(msg.id) && !streamedMap[msg.id]) {
        setWaitingForResponse(false);
        playedSnippetsRef.current.add(msg.id);
        handlePlayAudio(msg.id);
        return;
      }
    }
  }, [displayedMessages, isVoiceMode]);

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`snippet-updates-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        ({ new: updated }) => {
          if (updated.snippet_url) {
            setSnippetUrls(s => ({ ...s, [updated.id]: updated.snippet_url }));
          }
        }
      )
      .subscribe();
  
    return () => supabase.removeChannel(channel);
  }, [conversationId]);

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
    setVoiceUnavailable(false);

    // kick off the timer
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
    }
    voiceTimeoutRef.current = window.setTimeout(() => {
      setWaitingForResponse(false);
      setVoiceUnavailable(true);
    }, 60_000);

    sendMessage(trimmed);
  };
  
  const handlePlayAudio = (messageId?: string | null) => {
    if (!messageId || streamedMap[messageId]) return;
  
    // if re-clicking the same clip, toggle pause/resume
    if (currentlyPlayingPath === messageId && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPaused(false);
        setIsMicLocked(true);
      } else {
        audioRef.current.pause();
        setIsPaused(true);
        setIsMicLocked(false);
      }
      return;
    }
  
    // tear down any old
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  
    setIsMicLocked(true);
    setCurrentlyPlayingPath(messageId);
    setIsPaused(false);
  
    // 1) point at your streaming endpoint
    const url = `${STREAM_BASE}/tts-stream/${messageId}`;
    const audio = new Audio();
    audio.src = url;
    audio.preload = "auto";
  
    // **NEW** force the browser to begin fetching & decoding immediately
    audio.load();
  
    // 2) verify streaming is chunked
    audio.addEventListener("progress", () => {
      console.log("⏳ buffered:", audio.buffered);
    });
    // **NEW** listen for first decode-ready event
    audio.addEventListener("canplay", () => {
      console.log("🎵 first frame decoded, starting playback");
      // only start once
      if (audioRef.current === audio) {
        audio.play().catch(console.error);
        if (voiceTimeoutRef.current) {
          clearTimeout(voiceTimeoutRef.current);
          voiceTimeoutRef.current = null;
        }
      }
    });
  
    audio.addEventListener("play", () => {
      console.log("▶️ playback started");
    });
  
    // 3) clean up on end / error
    audio.onended = () => {
      setIsMicLocked(false);
      setCurrentlyPlayingPath(null);
      setIsPaused(false);
      audioRef.current = null;
      setStreamedMap(prev => ({ ...prev, [messageId]: true }));
    };
    audio.onerror = (e) => {
      console.error("🔊 stream playback error", e);
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
        voiceTimeoutRef.current = null;
      }
      setIsMicLocked(false);
      setCurrentlyPlayingPath(null);
      setVoiceUnavailable(true);
    };
  
    // stash and kick off load+play
    audioRef.current = audio;
    // note: we no longer call play() here directly—play() will be invoked in `canplay`
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
    {editingId === message.id ? (
      /* ───────────── EDIT MODE ───────────── */
      <ChatInput
        initialValue={message.content}
        onEditMessage={async newText => {
          await invalidateFrom(message.id);           // ① drop downstream chats
          await editMessage(message.id, newText);     // ② update this turn’s text
          setEditingId(null);
        }}
        onSendMessage={handleSendMessage}
        isDisabled={isProcessing}
      />
    ) : (
      /* ─────────── NORMAL CHAT BUBBLE ─────────── */
      <>
        <ChatBubble
          message={message.content}
          isUser={message.isUser}
          timestamp={message.timestamp}
        />

        {/* ─────────── AI PLAY/PAUSE BUTTON ─────────── */}
        {!message.isUser && isVoiceMode && !streamedMap[message.id] && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handlePlayAudio(message.id)}
            disabled={isMicLocked && currentlyPlayingPath !== message.id}
          >
            {currentlyPlayingPath === message.id && !isPaused
              ? <Pause className="h-4 w-4" />
              : <Play className="h-4 w-4" />
            }
          </Button>
        )}

        {/* ─────────── USER EDIT BUTTON ─────────── */}
        {message.isUser && (
          <button
           className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1"
            onClick={() => {
              setEditingId(message.id);
              setIsVoiceMode(false);         // turn off ASR
              setRecognitionPaused(true);    // pause recognition UI
            }}
          >
            <Edit2 className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </>
    )}
  </div>
))}


            {voiceUnavailable ? (
              <div className="px-4 py-2 text-sm text-red-500">
                Voice Mode not available. Use Chat Mode or come back later.
              </div>
            ) : (isProcessing || waitingForResponse) && (
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
                setVoiceUnavailable(false);
                const next = !isVoiceMode;
                setIsVoiceMode(next);
                await setVoiceEnabled(next);
              }}
              className="rounded-full w-8 h-8"
            >
              {isVoiceMode ? <MessageSquare /> : <Mic />}
            </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {isVoiceMode ? (
              <VoiceRecorder
                onVoiceRecorded={handleVoiceRecorded}
                isDisabled={isProcessing}
                shouldPauseRecognition={Boolean(editingId) || isMicLocked || waitingForResponse}
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
