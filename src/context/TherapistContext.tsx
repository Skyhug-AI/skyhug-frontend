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
  ttsHasArrived?: boolean;
  isGreeting?: boolean;
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
  playMessageAudio: (tts_path: string) => Promise<HTMLAudioElement | null | void>;
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

  const formatMessage = (msg: any): Message & { ttsHasArrived?: boolean, isGreeting?: boolean } => {
    return {
      id: msg.id,
      content: msg.transcription ?? msg.assistant_text ?? "[No content]",
      isUser: msg.sender_role === "user",
      timestamp: new Date(msg.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      tts_path: msg.tts_path,
      ttsHasArrived: Boolean(msg.tts_path && msg.tts_status === "done"),
      isGreeting:
        msg.sender_role === "assistant" &&
        (msg.assistant_text?.startsWith("Hi there, I'm Sky") ||
         msg.assistant_text?.startsWith("Last time we spoke"))
    };
  };

  const loadHistory = async (convId: string) => {
    const { data: rows, error } = await supabase
      .from("messages")
      .select(
        "id, sender_role, transcription, assistant_text, created_at, tts_path, tts_status"
      )
      .eq("conversation_id", convId)
      .order("created_at");
    if (error) {
      console.error("Error loading conversation history:", error);
      return;
    }
    setMessages(
      rows
        .map(formatMessage)
        .filter(msg =>
                msg.isUser ||
                msg.isGreeting ||               
                (msg.ttsHasArrived && !msg.isUser)
              )
    );
  };

  const createConversation = async () => {
    if (!user) {
      console.warn("⏳ Waiting for user to be ready...");
      return;
    }

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
      .maybeSingle();

    console.log("🔍 Previous conversation summary check:", { 
      found: !!prev, 
      summary: prev?.memory_summary,
      error: memErr 
    });

    if (memErr && memErr.code !== "PGRST116") {
      console.error("❌ Error fetching memory_summary:", memErr);
    }

    const greeting = prev?.memory_summary
    ? `Last time we spoke, we discussed ${prev.memory_summary}. Would you like to pick up where we left off?`
    : "Hi there, I'm Sky. How are you feeling today?";
  

    console.log("👋 Selected greeting:", greeting);

    const { data: messageData, error: messageError } = await supabase.from("messages").insert({
      conversation_id: data.id,
      sender_role: "assistant",
      assistant_text: greeting,
      ai_status: "done",
      tts_status: "pending",
    }).select().single();

    if (messageError) {
      console.error("❌ Error inserting greeting message:", messageError);
    } else {
      console.log("✅ Greeting message inserted:", messageData);
    }


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

    if (error) {
      console.error("Error sending message:", error);
      setIsProcessing(false);
    }
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

    const { error } = await supabase
      .from("conversations")
      .update({ ended: true })
      .eq("id", conversationId);

    if (error) {
      console.error("❌ Supabase error ending conversation:", error);
      return;
    }
    console.log("✅ Conversation ended successfully.");

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

  const playMessageAudio = async (tts_path: string): Promise<HTMLAudioElement | null | void> => {
    if (!tts_path) return;
  
    if (currentAudio?.src.includes(tts_path)) {
      if (!currentAudio.paused) {
        currentAudio.pause();
        setIsAudioPaused(true);
        console.log("⏸️ Audio paused");
        return;
      } else {
        setIsAudioPaused(false);
        try {
          await currentAudio.play();
          return;
        } catch (err) {
          console.error("Error resuming audio:", err);
        }
      }
    }
  
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  
    try {
      const { data, error } = await supabase.storage
        .from("tts-audio")
        .createSignedUrl(tts_path, 60);
  
      if (error || !data?.signedUrl) {
        toast({
          title: "Could not play audio",
          description: "Unable to generate signed URL",
          variant: "destructive",
        });
        console.error("Signed URL error:", error);
        return;
      }
  
      const audio = new Audio(data.signedUrl);
      audio.preload = "auto";
  
      audio.onloadeddata = () => {
        console.log("✅ Audio loaded successfully");
      };
      audio.onplay = () => {
        setIsAudioPaused(false);
        toast({
          title: "🎧 Playing audio",
          description: "Serenity's response is playing now",
        });
      };
      audio.onended = () => {
        setIsAudioPaused(true);
      };
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        toast({
          title: "Audio error",
          description: "Could not play the audio",
          variant: "destructive",
        });
      };
  
      setCurrentAudio(audio);
      setIsAudioPaused(false);
      await audio.play();
      return audio;
  
    } catch (err) {
      console.error("TTS playback exception:", err);
      toast({
        title: "Playback error",
        description: "An error occurred while playing audio",
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
          const msg = formatMessage(payload.new);
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg]; 
          });
          setIsProcessing(false);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = formatMessage(payload.new);
          setMessages(prev =>
            prev.map(m => m.id === updated.id ? updated : m)
          );
          setIsProcessing(false);
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
