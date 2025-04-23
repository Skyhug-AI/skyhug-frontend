import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

// Utility for timing operations
const timeOperation = async <T,>(operation: () => Promise<T>, name: string): Promise<T> => {
  const start = performance.now();
  try {
    const result = await operation();
    const duration = (performance.now() - start).toFixed(2);
    console.log(`⏱️ ${name} took ${duration}ms`);
    return result;
  } catch (error) {
    const duration = (performance.now() - start).toFixed(2);
    console.error(`❌ ${name} failed after ${duration}ms:`, error);
    throw error;
  }
};

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  tts_path?: string | null;
}

interface TherapistContextType {
  conversationId: string | null;
  messages: Message[];
  isProcessing: boolean;
  sendMessage: (message: string) => Promise<void>;
  sendAudioMessage: (blob: Blob) => Promise<void>;
  clearMessages: () => Promise<void>;
  setVoiceEnabled: (on: boolean) => Promise<void>;
  endConversation: () => Promise<void>;
  playMessageAudio: (tts_path: string, isAutoPlay?: boolean) => Promise<void>;
}

const TherapistContext = createContext<TherapistContextType | undefined>(
  undefined
);

export const TherapistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [isAudioPaused, setIsAudioPaused] = useState(false);

  const playMessageAudio = async (tts_path: string, isAutoPlay = false) => {
    if (!tts_path) return;
    const startTime = performance.now();
    console.log(`${isAutoPlay ? "🔄" : "▶️"} Attempting to play audio:`, tts_path);

    // If the same audio is already playing → pause it
    if (currentAudio?.src.includes(tts_path)) {
      if (!currentAudio.paused) {
        currentAudio.pause();
        setIsAudioPaused(true);
        console.log("⏸️ Audio paused");
        return;
      } else {
        setIsAudioPaused(false);
        console.log("▶️ Resuming paused audio");
        try {
          await currentAudio.play();
          return;
        } catch (err) {
          console.error("Error resuming audio:", err);
        }
      }
    }

    if (currentAudio) {
      console.log("⏹️ Stopping previous audio");
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    try {
      console.log("🔑 Getting signed URL for audio...");
      const { data, error } = await timeOperation(
        () => supabase.storage.from("tts-audio").createSignedUrl(tts_path, 60),
        "Signed URL generation"
      );

      if (error || !data?.signedUrl) {
        console.error("❌ Signed URL error:", error);
        if (!isAutoPlay) {
          toast({
            title: "Could not play audio",
            description: "Unable to generate signed URL",
            variant: "destructive",
          });
        }
        return;
      }
      console.log("✅ Got signed URL");

      console.log("🎵 Creating audio element...");
      const audio = new Audio(data.signedUrl);
      audio.preload = "auto";

      console.log("⏳ Waiting for audio to be ready...");
      const audioLoadStart = performance.now();
      const audioReady = new Promise((resolve, reject) => {
        let timeoutId: NodeJS.Timeout;

        const cleanup = () => {
          clearTimeout(timeoutId);
          audio.removeEventListener("canplaythrough", handleCanPlay);
          audio.removeEventListener("error", handleError);
        };

        const handleCanPlay = () => {
          const loadTime = (performance.now() - audioLoadStart).toFixed(2);
          console.log(`✅ Audio is ready to play (took ${loadTime}ms)`);
          cleanup();
          resolve(true);
        };

        const handleError = (e: Event) => {
          const loadTime = (performance.now() - audioLoadStart).toFixed(2);
          console.error(`❌ Audio loading error after ${loadTime}ms:`, e);
          cleanup();
          reject(e);
        };

        timeoutId = setTimeout(() => {
          const loadTime = (performance.now() - audioLoadStart).toFixed(2);
          console.error(`⏰ Audio loading timed out after ${loadTime}ms`);
          cleanup();
          reject(new Error("Audio loading timed out"));
        }, 5000);

        audio.addEventListener("canplaythrough", handleCanPlay);
        audio.addEventListener("error", handleError);
      });

      await audioReady;

      audio.onloadeddata = () => {
        console.log("📥 Audio data loaded");
      };

      audio.onplay = () => {
        const totalPrepTime = (performance.now() - startTime).toFixed(2);
        console.log(`▶️ Audio started playing (total prep time: ${totalPrepTime}ms)`);
        setIsAudioPaused(false);
        if (!isAutoPlay) {
          toast({
            title: "🎧 Playing audio",
            description: "Sky's response is playing now",
          });
        }
      };

      audio.onended = () => {
        const totalPlayTime = (performance.now() - startTime).toFixed(2);
        console.log(`⏹️ Audio finished playing (total time: ${totalPlayTime}ms)`);
        setIsAudioPaused(true);
      };

      audio.onerror = (e) => {
        console.error("❌ Audio playback error:", e);
        if (!isAutoPlay) {
          toast({
            title: "Audio error",
            description: "Could not play the audio",
            variant: "destructive",
          });
        }
      };

      setCurrentAudio(audio);
      setIsAudioPaused(false);
      console.log("▶️ Starting audio playback...");
      await audio.play();
    } catch (err) {
      const errorTime = (performance.now() - startTime).toFixed(2);
      console.error(`❌ TTS playback exception after ${errorTime}ms:`, err);
      if (!isAutoPlay) {
        toast({
          title: "Playback error",
          description: "An error occurred while playing audio",
          variant: "destructive",
        });
      }
    }
  };

  const formatMessage = (msg: any): Message => ({
    id: msg.id,
    content: msg.transcription ?? msg.assistant_text ?? "[No content]",
    isUser: msg.sender_role === "user",
    timestamp: new Date(msg.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    tts_path: msg.tts_path,
  });

  const loadHistory = async (convId: string) => {
    const { data: rows, error } = await supabase
      .from("messages")
      .select(
        "id, sender_role, transcription, assistant_text, created_at, tts_path"
      )
      .eq("conversation_id", convId)
      .order("created_at");

    if (error) {
      console.error("Error loading conversation history:", error);
      return;
    }

    setMessages(rows.map(formatMessage));
  };

  const createConversation = async () => {
    if (!user) {
      console.warn("⏳ Waiting for user to be ready...");
      return;
    }

    // 1) Resume any open session
    const { data: existing, error: findError } = await supabase
      .from("conversations")
      .select("id")
      .eq("patient_id", user.id)
      .eq("ended", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (findError && findError.code !== "PGRST116") {
      console.error("❌ Error checking for existing conversation:", findError);
      return;
    }
    if (existing) {
      console.log("🔁 Resuming previous conversation:", existing.id);
      setConversationId(existing.id);
      await loadHistory(existing.id);
      return;
    }

    // 2) Ensure patient row exists
    const { data: patientExists, error: checkError } = await supabase
      .from("patients")
      .select("id")
      .eq("id", user.id)
      .single();
    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ Error checking patient:", checkError);
      return;
    }
    if (!patientExists) {
      const { error: insertError } = await supabase
        .from("patients")
        .insert({ id: user.id, full_name: user.name });
      if (insertError) {
        console.error("❌ Error inserting patient:", insertError);
        return;
      }
    }

    // 3) Create a brand‑new conversation
    console.log("🟡 Creating new conversation...");
    const { data, error } = await supabase
      .from("conversations")
      .insert({ patient_id: user.id, title: "Therapy Session", ended: false })
      .select()
      .single();
    if (error || !data) {
      console.error("❌ Supabase error creating conversation:", error);
      return;
    }
    setConversationId(data.id);

    // 4) PRO‑TIP: fetch the *most recently ended* conv by created_at,
    //           but don't filter out NULL summaries—use maybeSingle()
    const {
      data: prev,
      error: memErr,
    }: { data: { memory_summary: string } | null; error: any } = await supabase
      .from("conversations")
      .select("memory_summary")
      .eq("patient_id", user.id)
      .eq("ended", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(); // <— returns null if no row, instead of an error

    console.log("🔍 Previous conversation summary check:", {
      found: !!prev,
      summary: prev?.memory_summary,
      error: memErr,
    });

    if (memErr && memErr.code !== "PGRST116") {
      console.error("❌ Error fetching memory_summary:", memErr);
    }

    // 5) Choose greeting based on whether we have a real summary
    const greeting = prev?.memory_summary
      ? `Last time we spoke, we discussed ${prev.memory_summary}. Would you like to pick up where we left off?`
      : "Hi there, I'm Sky. How are you feeling today?";

    console.log("👋 Selected greeting:", greeting);

    // 6) Seed that into messages
    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: data.id,
        sender_role: "assistant",
        assistant_text: greeting,
        ai_status: "done",
        tts_status: "pending",
      })
      .select()
      .single();

    if (messageError) {
      console.error("❌ Error inserting greeting message:", messageError);
    } else {
      console.log("✅ Greeting message inserted:", messageData);
    }

    // 7) Reflect into UI immediately
    setMessages([
      {
        id: crypto.randomUUID(),
        content: greeting,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    // 8) Load any actual history (should be just that first message)
    await loadHistory(data.id);
  };

  const clearMessages = createConversation;

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;
    console.log("📝 User sending text message:", content.slice(0, 50) + "...");
    const startTime = performance.now();
    setIsProcessing(true);

    await timeOperation(async () => {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_role: "user",
        transcription: content,
        transcription_status: "done",
        ai_status: "pending",
        tts_status: "pending",
      });
      if (error) console.error("Error sending message:", error);
    }, "Message insertion");

    await timeOperation(() => loadHistory(conversationId), "History reload");
    console.log(`⏱️ Total message send operation took ${(performance.now() - startTime).toFixed(2)}ms`);
  };

  const sendAudioMessage = async (blob: Blob) => {
    if (!conversationId || !user) return;
    console.log("🎤 User sending audio message...");
    const startTime = performance.now();
    setIsProcessing(true);
    const key = `${user.id}/${uuidv4()}.webm`;

    console.log("⬆️ Uploading audio to storage...");
    await timeOperation(async () => {
      const { error: uploadError } = await supabase.storage
        .from("raw-audio")
        .upload(key, blob, { contentType: "audio/webm" });

      if (uploadError) {
        console.error("Error uploading audio:", uploadError);
        setIsProcessing(false);
        return;
      }
    }, "Audio upload");
    console.log("✅ Audio uploaded successfully");

    console.log("📝 Creating message record...");
    await timeOperation(async () => {
      const { error: insertError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_role: "user",
        audio_path: key,
        transcription_status: "pending",
        ai_status: "pending",
        tts_status: "pending",
      });

      if (insertError)
        console.error("Error inserting audio message:", insertError);
    }, "Audio message record creation");

    await timeOperation(() => loadHistory(conversationId), "History reload after audio");
    setIsProcessing(false);
    console.log(`⏱️ Total audio message operation took ${(performance.now() - startTime).toFixed(2)}ms`);
  };

  const setVoiceEnabled = async (on: boolean) => {
    if (!conversationId) return;
    const { error } = await supabase
      .from("conversations")
      .update({ voice_enabled: on })
      .eq("id", conversationId);
    if (error) console.error("Error updating voice_enabled:", error);
  };

  const endConversation = async () => {
    console.log("📕 Attempting to end conversation:", conversationId);
    if (!conversationId) {
      console.warn("⚠️ No conversationId set; cannot end.");
      return;
    }

    // 1) mark ended in Supabase
    const { error } = await supabase
      .from("conversations")
      .update({ ended: true })
      .eq("id", conversationId);

    if (error) {
      console.error("❌ Supabase error ending conversation:", error);
      return;
    }
    console.log("✅ Conversation ended successfully.");

    // 2) immediately call your FastAPI summarizer
    try {
      await fetch("http://localhost:8000/summarize_conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId }),
      });
      console.log("🧠 Summarization triggered for conv", conversationId);
    } catch (e) {
      console.error("❌ Failed to trigger summarization:", e);
    }
  };

  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const updatedMessage = payload.new as any;
          console.log("🔄 Message updated:", updatedMessage);

          if (updatedMessage.tts_status === "done") {
            const { data, error } = await supabase
              .from("messages")
              .select("*")
              .eq("id", updatedMessage.id)
              .single();

            if (error) {
              console.error("Error fetching updated message:", error);
              return;
            }

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === data.id ? formatMessage(data) : msg
              )
            );

            if (data.tts_path) {
              await playMessageAudio(data.tts_path);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <TherapistContext.Provider
      value={{
        conversationId,
        messages,
        isProcessing,
        sendMessage,
        sendAudioMessage,
        clearMessages,
        setVoiceEnabled,
        endConversation,
        playMessageAudio,
      }}
    >
      {children}
    </TherapistContext.Provider>
  );
};

export const useTherapist = (): TherapistContextType => {
  const context = useContext(TherapistContext);
  if (!context) {
    throw new Error("useTherapist must be used within a TherapistProvider");
  }
  return context;
};
