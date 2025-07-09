
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, MessageSquare, MessageSquareOff, Calendar, Play, ArrowLeft, Music2 } from 'lucide-react';
import ChatBubble from '@/components/chat/ChatBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { useToast } from '@/hooks/use-toast';
import ChatInput from '@/components/chat/ChatInput';
import { useNavigate } from 'react-router-dom';
import VoiceRecorder from '@/components/voice/VoiceRecorder';
import CloudBackground from '@/components/CloudBackground';
import { useTherapist } from '@/context/TherapistContext';
import { supabase } from "@/integrations/supabase/client";

interface VoiceCallUIProps {
  messages: Array<{
    id: string;             
    text: string;
    isUser: boolean;
    tts_path?: string | null;
    }>;
  isProcessing: boolean;
  onVoiceRecorded: (transcript: string) => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleTranscript: () => void;
  isMuted: boolean;
  showTranscript: boolean;
}

const VoiceCallUI: React.FC<VoiceCallUIProps> = ({
  messages,
  isProcessing,
  onVoiceRecorded,
  onEndCall,
  onToggleMute,
  onToggleTranscript,
  isMuted,
  showTranscript
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { editMessage } = useTherapist();
  const [showReminder, setShowReminder] = useState(false);
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const reminderTimeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentlyPlayingPath, setCurrentlyPlayingPath] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { isPlayingAudio } = useTherapist();
  const [streamedMap, setStreamedMap] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);


  useEffect(() => {
    scrollToBottom();
    
    // Set up reminder for inactivity
    if (messages.length > 0 && !isProcessing) {
      if (reminderTimeoutRef.current) {
        window.clearTimeout(reminderTimeoutRef.current);
      }
      
      reminderTimeoutRef.current = window.setTimeout(() => {
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 5000); // Hide after 5 seconds
      }, 10000); // Show after 10 seconds of inactivity
    }
    
    return () => {
      if (reminderTimeoutRef.current) {
        window.clearTimeout(reminderTimeoutRef.current);
      }
    };
  }, [messages, isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScheduleSession = () => {
    onEndCall();
    navigate('/schedule');
  };
  

const handlePlayAudio = (messageId?: string | null) => {
  if (!messageId || streamedMap[messageId]) return;

  const STREAM_BASE = "http://localhost:8000";


  // If already playing this clip, toggle pause/resume
  if (currentlyPlayingPath === messageId && audioRef.current) {
    if (!isPaused) {
      audioRef.current.pause();
      setIsPaused(true);
    } else {
      audioRef.current.play();
      setIsPaused(false);
    }
    return;
  }

  // Tear down any previous player
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  // 1) Create a streaming <audio>
  const streamUrl = `http://localhost:8000/tts-stream/${messageId}`; 
  // ↪️ adjust host/origin for production

  const audio = new Audio(streamUrl);
  audio.crossOrigin = "anonymous"; 
  audio.src         = `${STREAM_BASE}/tts-stream/${messageId}`;
  audio.preload = 'auto';  // start buffering immediately
  audioRef.current = audio;
  setCurrentlyPlayingPath(messageId);
  setIsPaused(false);

  // 2) when it ends…
  audio.onended = () => {
    setCurrentlyPlayingPath(null);
    setIsPaused(false);
    setStreamedMap(prev => ({ ...prev, [messageId]: true }));
  };
  audio.onerror = () => {
    console.error("Audio playback error");
    // optionally toast an error
  };

  audio.addEventListener("error", (e) => {
    console.error("🔊 <audio> error:", {
      networkState:   audio.networkState,
      readyState:     audio.readyState,
      currentSrc:     audio.currentSrc,
      event:          e,
    });
  });
  audio.addEventListener("stalled", () => {
    console.warn("🔊 <audio> stalled (no data arriving).");
  });

    // 3) kick it off
    audio.play().catch(err => {
      console.error("Play() failed:", err, "— falling back to fetch+blob");
      // fallback: download the entire stream as a Blob
      fetch(`${STREAM_BASE}/tts-stream/${messageId}`, { mode: "cors" })
        .then(res => {
          if (!res.ok) throw new Error(`status ${res.status}`);
          return res.blob();
        })
        .then(blob => {
          const objectUrl = URL.createObjectURL(blob);
          const fallbackAudio = new Audio(objectUrl);
          fallbackAudio.play().catch(e => console.error("Fallback play failed:", e));
        })
        .catch(e => console.error("Fallback fetch+blob error:", e));
    });
  
};
  
  const handleAmbientSound = (sound: string) => {
    if (ambientSound === sound) {
      setAmbientSound(null);
      toast({
        title: "Ambient sounds disabled",
        duration: 2000,
      });
    } else {
      setAmbientSound(sound);
      toast({
        title: `Playing ${sound} sounds`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <CloudBackground />
      
      <div className="relative z-10 py-8 px-4 md:px-8 border-b border-serenity-100">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-serenity-600 to-serenity-400 bg-clip-text text-transparent">
            You're in session with Serenity 🌸
          </h1>
          <p className="text-serenity-700 mt-2 max-w-md mx-auto">
            Take a deep breath, and speak when you're ready.
          </p>
          <div className="mt-3">
            <p className="text-sm text-serenity-500 italic">
              "You're doing great. Showing up matters."
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col relative z-10">
        <div className="max-w-3xl mx-auto flex-grow flex flex-col p-4">
          <div className="space-y-4 flex-grow overflow-y-auto">
          {messages.map(msg => (
          <div key={msg.id} className="relative group mb-4">
            {editingId === msg.id ? (
              /* ─── EDIT MODE ─── */
              <ChatInput
                initialValue={msg.text}
                onEditMessage={async newText => {
                  await invalidateFrom(message.id);           // ① drop downstream chats
                  await editMessage(message.id, newText);     // ② update this turn’s text
                  await regenerateAfter(message.id);          // ③ re-queue it for AI
                  setEditingId(null);
                }}
                onSendMessage={sendMessage}
                isDisabled={isProcessing}
              />
            ) : (
              /* ─── NORMAL BUBBLE & CONTROLS ─── */
              <>
                <ChatBubble
                  message={msg.text}
                  isUser={msg.isUser}
                  editedAt={msg.edited_at}
                />

                {/* AI Play/Pause */}
                {!msg.isUser && msg.id && (
                  <button
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                    onClick={() => handlePlayAudio(msg.id)}
                  >
                    {currentlyPlayingPath === msg.id && !isPaused
                      ? <VolumeX className="h-5 w-5"/>
                      : <Play className="h-5 w-5"/>
                    }
                  </button>
                )}

                {/* AI “Regenerate from here” */}
                {!msg.isUser && (
                  <button
                    className="text-sm text-skyhug-500 ml-12 mt-1"
                    onClick={async () => {
                      await invalidateFrom(msg.id);
                      await regenerateAfter(msg.id);
                    }}
                  >
                    Regenerate from here
                  </button>
                )}

                {/* User Edit */}
                {msg.isUser && (
                  <button
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                    onClick={() => setEditingId(msg.id)}
                  >
                    <Edit2 className="h-5 w-5 text-gray-500"/>
                  </button>
                )}
              </>
            )}
          </div>
        ))}

            {isProcessing && <TypingIndicator />}
            {showReminder && (
              <div className="flex justify-center my-6 animate-fade-in">
                <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-serenity-100">
                  <p className="text-serenity-700">Serenity is listening, take your time.</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

           <VoiceRecorder
            onVoiceRecorded={onVoiceRecorded}
            isDisabled={isProcessing}
            shouldPauseRecognition={Boolean(editingId) || isPlayingAudio}
            onRecognitionPaused={() => console.log("mic paused")}
            onRecognitionResumed={() => console.log("mic resumed")}
          />
        </div>
      </main>

      <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-serenity-100 relative z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onToggleMute}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onToggleTranscript}
            >
              {showTranscript ? <MessageSquare className="h-5 w-5" /> : <MessageSquareOff className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              onClick={() => {
                toast({
                  title: "Ambient Sound Options",
                  description: "Choose ambient sounds to enhance your session",
                  duration: 3000,
                });
              }}
            >
              <Music2 className="h-5 w-5" />
              {ambientSound && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-serenity-500 rounded-full"></span>
              )}
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleScheduleSession}
              variant="outline"
              className="rounded-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-serenity-200 hover:bg-serenity-50"
              onClick={onEndCall}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Finish Session
            </Button>
          </div>
        </div>
      </div>
      
      {/* Ambient sounds menu (just visual, not functional in this implementation) */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-serenity-100 p-2 hidden">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${ambientSound === 'rain' ? 'bg-serenity-100' : ''}`}
            onClick={() => handleAmbientSound('rain')}
          >
            Rain
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${ambientSound === 'ocean' ? 'bg-serenity-100' : ''}`}
            onClick={() => handleAmbientSound('ocean')}
          >
            Ocean
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full ${ambientSound === 'chimes' ? 'bg-serenity-100' : ''}`}
            onClick={() => handleAmbientSound('chimes')}
          >
            Wind Chimes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallUI;
