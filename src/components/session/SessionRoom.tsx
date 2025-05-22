import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Mic,
  MessageSquare,
  Loader,
  Play,
  Pause,
  X,
  Edit2,
} from "lucide-react";
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
    currentTherapist,
    regenerateAfter,
  } = useTherapist();
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [currentlyPlayingPath, setCurrentlyPlayingPath] = useState<
    string | null
  >(null);
  const [isMicLocked, setIsMicLocked] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const lastSendRef = useRef<{ text: string; time: number }>({
    text: "",
    time: 0,
  });
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  // Track if we're handling voice recognition pausing/resuming
  const [recognitionPaused, setRecognitionPaused] = useState(false);
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);
  const voiceTimeoutRef = useRef<number | null>(null);
  const [streamedMap, setStreamedMap] = useState<Record<string, boolean>>({});
  const snippetCountMap = useRef<Record<string, number>>({});
  const playedSnippetsRef = useRef<Set<string>>(new Set());
  const [snippetUrls, setSnippetUrls] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const initialAssistantCount = useRef(0);
  const initialHistoryConsumed = useRef(false);
  const [voiceActive, setVoiceActive] = useState(true);
  const greetingIdRef = useRef<string | null>(null);
  const greetingPlayedRef = useRef(false);

  const STREAM_BASE = "http://localhost:8000";

  const displayedMessages = messages.map((m) =>
    m.snippet_url
      ? m
      : snippetUrls[m.id]
      ? { ...m, snippet_url: snippetUrls[m.id] }
      : m
  );

  useEffect(() => {
    initialAssistantCount.current = displayedMessages.filter(
      (m) => !m.isUser
    ).length;

    // helper to pause & clear our single Audio instance
    const stopAudio = () => {
      if (!audioRef.current) return;
      const audio = audioRef.current;
      audio.pause();
      // only set currentTime if duration is a valid finite number
      if (!Number.isNaN(audio.duration) && Number.isFinite(audio.duration)) {
        audio.currentTime = audio.duration;
      }
      audioRef.current = null;
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
    if (
      isVoiceMode &&
      !voiceActive &&
      displayedMessages.length > (displayedMessages[0]?.isGreeting ? 1 : 0)
    ) {
      setVoiceActive(true);
      setVoiceEnabled(true);
    }
  }, [displayedMessages, isVoiceMode, voiceActive]);

  useEffect(() => {
    // for every new assistant message, figure out how many snippets it needs
    displayedMessages.forEach((msg) => {
      if (!msg.isUser && snippetCountMap.current[msg.id] == null) {
        const sentences = msg.content.split(/(?<=[.!?])\s+/);
        snippetCountMap.current[msg.id] = sentences.length;

        // seed the very first snippet URL so your UI sees it immediately
        setSnippetUrls((prev) => ({
          ...prev,
          [msg.id]: `${STREAM_BASE}/tts-stream/${msg.id}?snippet=0`,
        }));
      }
    });
  }, [displayedMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) setHasStartedChat(true);
    scrollToBottom();
  }, [messages]);

  // This effect unlocks the mic when playback stops
  useEffect(() => {
    if (!currentlyPlayingPath) {
      setIsMicLocked(false);
    }
  }, [currentlyPlayingPath]);

  useEffect(() => {
    if (!isVoiceMode) return;

    // grab just the assistant messages
    const assistants = displayedMessages.filter((m) => !m.isUser);

    // ────────────────────────────────────────────────────────────────────────────
    // 1) First time ever: silently "play" only _history_, but skip the greeting
    if (!initialHistoryConsumed.current) {
      // history = everything except the greeting
      const historyAssistants = assistants.filter((m) => !m.isGreeting);
      historyAssistants.forEach((m) => {
        playedSnippetsRef.current.add(m.id);
        setStreamedMap((prev) => ({ ...prev, [m.id]: true }));
      });
      // record how many we consumed so we start _after_ them
      initialAssistantCount.current = historyAssistants.length;
      initialHistoryConsumed.current = true;
      return;
    }
    // ────────────────────────────────────────────────────────────────────────────

    // 2) Now for real: autoplay only the messages beyond that snapshot
    for (let i = initialAssistantCount.current; i < assistants.length; i++) {
      const msg = assistants[i];

      if (msg.snippet_url && !playedSnippetsRef.current.has(msg.id)) {
        setWaitingForResponse(false);
        playedSnippetsRef.current.add(msg.id);
        //new Audio(msg.snippet_url).play().catch(console.error);
        handlePlayAudio(msg.id);
        return;
      }

      if (!playedSnippetsRef.current.has(msg.id) && !streamedMap[msg.id]) {
        setWaitingForResponse(false);
        playedSnippetsRef.current.add(msg.id);
        handlePlayAudio(msg.id);
        return;
      }
    }
  }, [displayedMessages, isVoiceMode]);

  useEffect(() => {
    // only in voice mode, only on first load, only when the greeting is the sole message:
    if (
      isVoiceMode &&
      displayedMessages.length === 1 &&
      displayedMessages[0].isGreeting &&
      !greetingPlayedRef.current
    ) {
      const id = displayedMessages[0].id;
      greetingPlayedRef.current = true;
      greetingIdRef.current = id;
      handlePlayAudio(id);
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
          filter: `conversation_id=eq.${conversationId}`,
        },
        ({ new: updated }) => {
          if (updated.snippet_url) {
            setSnippetUrls((s) => ({
              ...s,
              [updated.id]: updated.snippet_url,
            }));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [conversationId]);

  // HIDE PLAY BUTTON FOR EARLIER MESSAGES
  // 1) compute last assistant ID
  const assistantMessages = useMemo(
    () => displayedMessages.filter((m) => !m.isUser),
    [displayedMessages]
  );
  const lastAssistantId = assistantMessages.length
    ? assistantMessages[assistantMessages.length - 1].id
    : null;

  // 2) on first load of history, mark every existing assistant as “already played”
  useEffect(() => {
    if (initialHistoryConsumed.current) return;
    if (assistantMessages.length === 0) return;
    assistantMessages.forEach((m) => {
      playedSnippetsRef.current.add(m.id);
      setStreamedMap((prev) => ({ ...prev, [m.id]: true }));
    });
    initialHistoryConsumed.current = true;
  }, [assistantMessages]);

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
    // ①  Drop any ASR interim results while TTS is playing
    if (!voiceActive || currentlyPlayingPath) return;

    console.log("🎤 ASR returned:", transcript);
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

  const handlePlayAudio = (messageId?: string | null, snippetIndex = 0) => {
    if (!messageId || streamedMap[messageId]) return;

    // LOCK the mic immediately (this will flip shouldPauseRecognition=true)
    setIsMicLocked(true);
    setCurrentlyPlayingPath(messageId);

    const streamUrl = `${STREAM_BASE}/tts-stream/${messageId}?snippet=${snippetIndex}`;
    console.log(`▶️  play snippet ${snippetIndex} of ${messageId}:`, streamUrl);

    // if re-clicking the same clip, toggle pause/resume
    if (currentlyPlayingPath === messageId && audioRef.current) {
      if (audioRef.current.paused) {
        // going from PAUSED -> PLAYING:
        audioRef.current.play();
        setIsPaused(false);
        setIsMicLocked(true);
        // keep ASR paused
        handleRecognitionPaused();
      } else {
        // going from PLAYING -> PAUSED:
        audioRef.current.pause();
        setIsPaused(true);
        setIsMicLocked(false);
        // let ASR pick back up
        handleRecognitionResumed();
      }
      return;
    }

    // tear down any old
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // **PAUSE RECOGNITION NOW**
    handleRecognitionPaused();
    setIsMicLocked(true);
    setCurrentlyPlayingPath(messageId);
    setIsPaused(false);

    // 1) point at your streaming endpoint
    const url = `${STREAM_BASE}/tts-stream/${messageId}?snippet=${snippetIndex}`;
    const audio = new Audio();
    audio.src = url;
    audio.preload = "auto";

    // **NEW** force the browser to begin fetching & decoding immediately
    audio.load();

    // double-safety: whenever the audio actually begins playing, re-pause ASR
    audio.addEventListener("play", () => {
      handleRecognitionPaused();
    });

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
        // ensure ASR is paused once we really start
        handleRecognitionPaused();
      }
    });

    audio.addEventListener("play", () => {
      console.log("▶️ playback started");
    });

    // 3) clean up on end / error
    audio.onended = () => {
      const total = snippetCountMap.current[messageId] || 0;
      if (snippetIndex + 1 < total) {
        return handlePlayAudio(messageId, snippetIndex + 1);
      }

      // final snippet has finished — gate everything behind a delay
      setStreamedMap((prev) => ({ ...prev, [messageId]: true }));

      // wait a bit for the browser’s audio stack to fully tear down
      setTimeout(() => {
        setIsMicLocked(false); // unlock mic
        setIsPaused(false);
        audioRef.current = null; // drop your ref
        setCurrentlyPlayingPath(null); // now clear “playing” flag
        handleRecognitionResumed(); // and finally let ASR resume
        if (messageId === greetingIdRef.current) {
          setVoiceActive(true); // now show the VoiceRecorder
          setVoiceEnabled(true); // update your TherapistContext
        }
      }, 1);
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
    // if there’s still audio playing, ignore this resume
    // if (currentlyPlayingPath) {
    //   console.log("Ignoring premature resume; audio still playing");
    //   return;
    // }
    setRecognitionPaused(false);
  };

  const interruptPlayback = () => {
    // If there’s a clip still loaded, stop & skip it
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      if (!Number.isNaN(audio.duration) && Number.isFinite(audio.duration)) {
        audio.currentTime = audio.duration;
      }
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
          <span
            className={recognitionPaused ? "text-red-500" : "text-gray-600"}
          >
            {recognitionPaused
              ? "Sky is not listening..."
              : "Sky is listening..."}
          </span>
        </div>
      )}

      {/* Updated: Full-width scroll container */}
      <div
        className="flex-grow overflow-y-auto py-6 scroll-smooth w-full"
        ref={chatContainerRef}
        style={{ maxHeight: "calc(100vh - 12rem)" }}
      >
        {/* Inner container to keep messages centered */}
        <div className="max-w-3xl mx-auto px-4 space-y-6 flex flex-col min-h-full">
          <div className="flex-grow" />
          {displayedMessages.map((message) => (
            <div key={message.id} className="relative group">
              {editingId === message.id ? (
                /* ───────────── EDIT MODE ───────────── */
                <ChatInput
                  initialValue={message.content}
                  onEditMessage={async (newText) => {
                    await invalidateFrom(message.id); // ① drop downstream chats
                    await editMessage(message.id, newText); // ② update this turn's text
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
                  />

                  {message.isUser && (
                    <div
                      className="
                        mt-1
                        flex items-center justify-end gap-1
                        text-xs text-gray-500
                        opacity-0 group-hover:opacity-100
                        transition-opacity
                        pr-4
                      "
                    >
                      <button
                        className="p-1"
                        onClick={() => {
                          setEditingId(message.id);
                          interruptPlayback();
                          // setIsVoiceMode(false);
                          setRecognitionPaused(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </button>
                      <span>{message.timestamp}</span>
                    </div>
                  )}

                  {/* ─────────── AI PLAY/PAUSE BUTTON ─────────── */}
                  {!message.isUser &&
                    isVoiceMode &&
                    message.id === lastAssistantId &&
                    !streamedMap[message.id] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handlePlayAudio(message.id)}
                        disabled={
                          isMicLocked && currentlyPlayingPath !== message.id
                        }
                      >
                        {currentlyPlayingPath === message.id && !isPaused ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                </>
              )}
            </div>
          ))}

          {voiceUnavailable ? (
            <div className="px-4 py-2 text-sm text-red-500">
              Voice Mode not available. Use Chat Mode or come back later.
            </div>
          ) : (
            (isProcessing || waitingForResponse) && (
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
            )
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
          <div className="flex justify-center items-center gap-4 mb-4 w-full max-w-lg mx-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-900 flex-1"
            >
              I don't like your answer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-900 flex-1"
            >
              Be more caring
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-900 flex-1"
            >
              Be more challenging
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
            {isVoiceMode && voiceActive ? (
              <VoiceRecorder
                onVoiceRecorded={handleVoiceRecorded}
                isDisabled={isProcessing}
                shouldPauseRecognition={
                  Boolean(editingId) ||
                  isMicLocked ||
                  waitingForResponse ||
                  Boolean(currentlyPlayingPath)
                }
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
