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
  playMessageAudio: (tts_path: string) => Promise<void>;
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
    //           but don’t filter out NULL summaries—use maybeSingle()
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

    if (memErr && memErr.code !== "PGRST116") {
      console.error("❌ Error fetching memory_summary:", memErr);
    }

    // 5) Choose greeting based on whether we have a real summary
    const greeting = prev?.memory_summary
      ? `Last time we spoke, we discussed ${prev.memory_summary}. Would you like to pick up where we left off?`
      : "Hi there, I'm Sky. How are you feeling today?";

    // 6) Seed that into messages
    await supabase.from("messages").insert({
      conversation_id: data.id,
      sender_role: "assistant",
      assistant_text: greeting,
      ai_status: "done",
      tts_status: "pending",
    });

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
    console.log("📤 Sending message to Supabase...");
    setIsProcessing(true);

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_role: "user",
      transcription: content,
      transcription_status: "done",
      ai_status: "pending",
      tts_status: "pending",
    });

    if (error) console.error("Error sending message:", error);
    await loadHistory(conversationId);
  };

  const sendAudioMessage = async (blob: Blob) => {
    if (!conversationId || !user) return;
    setIsProcessing(true);
    const key = `${user.id}/${uuidv4()}.webm`;

    const { error: uploadError } = await supabase.storage
      .from("raw-audio")
      .upload(key, blob, { contentType: "audio/webm" });

    if (uploadError) {
      console.error("Error uploading audio:", uploadError);
      setIsProcessing(false);
      return;
    }

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
    await loadHistory(conversationId);
    setIsProcessing(false);
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

  const playMessageAudio = async (tts_path: string) => {
    if (!tts_path) {
      toast({
        title: "No audio available",
        description: "This message doesn't have audio",
        variant: "destructive",
      });
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    try {
      // Create public URL to the audio file
      const audioUrl = `${
        import.meta.env.VITE_SUPABASE_URL ||
        "https://bborzcdfxrangvewmpfo.supabase.co"
      }/storage/v1/object/public/tts-audio/${tts_path}`;

      // Create and play the audio
      const audio = new Audio(audioUrl);

      audio.onplay = () => {
        toast({
          title: "Playing audio",
          description: "Text-to-speech audio is playing",
        });
      };

      audio.onerror = (e) => {
        console.error("Audio error:", e);
        toast({
          title: "Audio error",
          description:
            "Could not play audio message. Check console for details.",
          variant: "destructive",
        });
      };

      setCurrentAudio(audio);
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        title: "Error playing audio",
        description: "Could not play the audio message",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-updates-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new;
          if (msg.sender_role === "assistant") {
            setMessages((prev) => [...prev, formatMessage(msg)]);
            setIsProcessing(false);

            // Auto-play audio if available
            if (msg.tts_path && msg.tts_status === "done") {
              setTimeout(() => {
                playMessageAudio(msg.tts_path);
              }, 500); // Small delay to ensure message is added
            }
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

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
