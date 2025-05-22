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
import { therapistService } from "@/services/therapist.service";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  tts_path?: string | null;
  ttsHasArrived?: boolean;
  isGreeting?: boolean;
  snippet_url?: string | null;
}

export type TherapistContextType = {
  messages: Message[];
  isProcessing: boolean;
  sendMessage: (content: string) => Promise<void>;
  sendAudioMessage: (blob: Blob) => Promise<void>;
  clearMessages: () => Promise<void>;
  triggerTTSForMessage: (tts_path: string) => Promise<void>;
  endConversation: () => Promise<void>;
  editMessage: (id: string, newContent: string) => Promise<void>;
  invalidateFrom: (id: string) => Promise<void>;
  regenerateAfter: (id: string) => Promise<void>;
  conversationId: string | null;
  setVoiceEnabled: (on: boolean) => Promise<void>;
  voiceId: string;
  currentTherapist: { id: string; name: string; avatar_url: string } | null;
  setCurrentTherapist: (
    therapist: { id: string; name: string; avatar_url: string } | null
  ) => void;
  therapists: any[];
  setTherapists: (therapists: any[]) => void;
  fetchTherapists: (
    setLoading: (loading: boolean) => void,
    identityFilter: string,
    topicsFilter: string[],
    styleFilter: string
  ) => Promise<void>;
};

const TherapistContext = createContext<TherapistContextType>({
  messages: [],
  isProcessing: false,
  sendMessage: () => {},
  sendAudioMessage: async () => {},
  clearMessages: async () => {},
  triggerTTSForMessage: async () => {},
  endConversation: async () => {},
  currentTherapist: null,
  setCurrentTherapist: () => {},
  editMessage: async () => {},
  invalidateFrom: async () => {},
  regenerateAfter: async () => {},
  conversationId: null,
  setVoiceEnabled: async () => {},
  voiceId: "FuOBXzQ4ziLb7pl9lYjZ",
  therapists: [],
  fetchTherapists: () => {},
});

export const TherapistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState<string>("FuOBXzQ4ziLb7pl9lYjZ");
  const [therapists, setTherapists] = useState<any[]>([]);
  const [currentTherapist, setCurrentTherapist] = useState<{
    id: string;
    name: string;
    avatar_url: string;
  } | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [isAudioPaused, setIsAudioPaused] = useState(false);

  console.log(currentTherapist, "currentTherapist-----");

  const fetchTherapists = async (
    setLoading: (loading: boolean) => void,
    identityFilter: string,
    topicsFilter: string[],
    styleFilter: string
  ) => {
    setLoading(true);
    try {
      const data = await therapistService.getTherapists({
        identity: identityFilter,
        topics: topicsFilter,
        style: styleFilter,
      });
      setTherapists(data);
    } catch (error) {
      console.error(error);
      toast({ title: "Error loading therapists", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (
    msg: any
  ): Message & { ttsHasArrived?: boolean; isGreeting?: boolean } => {
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
        (msg.assistant_text?.startsWith(
          `Hi there, I'm ${currentTherapist?.name ?? "Sky"}`
        ) ||
          msg.assistant_text?.startsWith("Last time we spoke")),
    };
  };

  const editMessage = async (id: string, newContent: string) => {
    if (!conversationId) return;

    setIsProcessing(true);

    // 1) Update the edited message
    await supabase
      .from("messages")
      .update({
        transcription: newContent,
        edited_at: new Date().toISOString(),
      })
      .eq("id", id);

    // 2) Invalidate every downstream message
    //    (those with created_at > the edited one)
    const { data: orig } = await supabase
      .from("messages")
      .select("created_at")
      .eq("id", id)
      .single();

    if (orig?.created_at) {
      await supabase
        .from("messages")
        .update({ invalidated: true })
        .eq("conversation_id", conversationId)
        .gt("created_at", orig.created_at);
    }

    // 3) Mark conversation to re-summarize
    await supabase
      .from("conversations")
      .update({ needs_resummarization: true })
      .eq("id", conversationId);

    // 4) Re-enqueue this message for AI reply
    //    by resetting its ai_status to “pending”
    await supabase
      .from("messages")
      .update({
        transcription: newContent,
        edited_at: new Date().toISOString(),
        ai_status: "pending",
        invalidated: false,
        ai_started: false, // ← reset here too
      })
      .eq("id", id);

    setIsProcessing(false);
  };

  /** Invalidate all messages created after the given one (so they drop out of UI) */
  const invalidateFrom = async (id: string) => {
    if (!conversationId) return;
    // 1) lookup the pivot message’s timestamp
    const { data: orig } = await supabase
      .from("messages")
      .select("created_at")
      .eq("id", id)
      .single();
    if (!orig?.created_at) return;
    // 2) mark everything after that as invalidated
    await supabase
      .from("messages")
      .update({ invalidated: true })
      .eq("conversation_id", conversationId)
      .gt("created_at", orig.created_at);
  };

  /** Reset a single message to pending so the AI will re-process it */
  const regenerateAfter = async (id: string) => {
    await supabase
      .from("messages")
      .update({ ai_status: "pending", invalidated: false })
      .eq("id", id);
  };

  const loadHistory = async (convId: string) => {
    const { data: rows, error } = await supabase
      .from("messages")
      .select("id, sender_role, transcription, assistant_text, created_at")
      .eq("conversation_id", convId)
      .eq("invalidated", false)
      .order("created_at");

    if (error) {
      console.error("Error loading conversation history:", error);
      return;
    }

    // No more ttsHasArrived check—just show every assistant row immediately
    setMessages(rows.map(formatMessage));
  };

  const createConversation = async () => {
    // 1) must be logged in
    if (!user) {
      console.warn("⏳ Waiting for user to be ready...");
      return;
    }

    // 2) Look for an open conversation
    const { data: existing, error: findError } = await supabase
      .from("conversations")
      .select("id, therapist_id")
      .eq("patient_id", user.id)
      .eq("ended", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (findError && findError.code !== "PGRST116") {
      console.error("❌ Error checking for existing conversation:", findError);
      return;
    }

    // 3) If found, resume it
    if (existing) {
      console.log("🔁 Resuming previous conversation:", existing.id);
      setConversationId(existing.id);

      const therapistId = existing.therapist_id;
      if (therapistId) {
        const { data: t, error: terr } = await supabase
          .from("therapists")
          .select("name, avatar_url, elevenlabs_voice_id")
          .eq("id", therapistId)
          .single();

        if (terr) {
          console.error("❌ Error fetching therapist metadata:", terr);
        } else if (t) {
          setCurrentTherapist({
            id: t.id,
            name: t.name,
            avatar_url: t.avatar_url,
          });
          setVoiceId(t.elevenlabs_voice_id || "FuOBXzQ4ziLb7pl9lYjZ");
        }
      }

      await loadHistory(existing.id);
      return;
    }

    // 4) Ensure the patient record exists
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

    // 5) Create a brand-new conversation
    console.log("🟡 Creating new conversation...");
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        patient_id: user.id,
        title: "Therapy Session",
        ended: false,
        therapist_id: currentTherapist.id, // Include the selected therapist
      })
      .select()
      .single();

    if (error || !data) {
      console.error("❌ Supabase error creating conversation:", error);
      return;
    }
    setConversationId(data.id);

    // 6) Optionally pull last memory
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

    if (memErr && memErr.code !== "PGRST116") {
      console.error("❌ Error fetching memory_summary:", memErr);
    }

    // 7) Build your greeting
    const personaName = currentTherapist?.name ?? "Sky";
    const greeting = prev?.memory_summary
      ? `Last time we spoke, we discussed ${prev.memory_summary}. Would you like to pick up where we left off?`
      : `Hi there, I'm ${personaName}. How are you feeling today?`;

    console.log("👋 Selected greeting:", greeting);

    // 8) Insert the assistant greeting
    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: data.id,
      sender_role: "assistant",
      assistant_text: greeting,
      ai_status: "done",
      tts_status: "pending",
    });

    if (messageError) {
      console.error("❌ Error inserting greeting message:", messageError);
    }

    // 9) Load it into state
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
      await fetch("http://localhost:8001/summarize_conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId }),
      });
      console.log("🧠 Summarization triggered for conv", conversationId);
    } catch (e) {
      console.error("❌ Failed to trigger summarization:", e);
    }
  };

  const playMessageAudio = (messageId: string) => {
    // tear down any old audio
    currentAudio?.pause();
    currentAudio && (currentAudio.currentTime = 0);

    // stream directly from your FastAPI proxy
    const streamUrl = `http://localhost:8000/tts-stream/${messageId}`;

    const audio = new Audio(streamUrl);
    audio.preload = "auto";
    audio.onplay = () => setIsAudioPaused(false);
    audio.onended = () => setIsAudioPaused(true);
    audio.onerror = (e) => {
      console.error("Stream playback error", e);
      toast({
        title: "Audio error",
        description: "Could not play stream",
        variant: "destructive",
      });
    };

    setCurrentAudio(audio);
    audio.play().catch((err) => console.error("Play() failed:", err));
  };

  const triggerTTSForMessage = async (tts_path: string) => {
    if (!conversationId) return;
    const { data, error } = await supabase
      .from("messages")
      .select("id")
      .eq("tts_path", tts_path)
      .single();
    if (error) {
      console.error("Error fetching message ID for tts_path:", error);
      return;
    }
    playMessageAudio(data.id);
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
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
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
          const n = payload.new as any;

          // 1) if this row was invalidated, drop it entirely
          if (n.invalidated) {
            setMessages((prev) => prev.filter((m) => m.id !== n.id));
            setIsProcessing(false);
            return;
          }

          // 2) only update when we actually got new text
          //    (a) user edits => payload.new.transcription
          //    (b) AI streams => payload.new.assistant_text
          if (n.transcription !== undefined || n.assistant_text !== undefined) {
            const msg = formatMessage(n);
            setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
          }

          // any other UPDATE (ai_status flip, etc.) we ignore
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
        messages,
        isProcessing,
        sendMessage,
        sendAudioMessage,
        clearMessages,
        triggerTTSForMessage,
        endConversation,
        currentTherapist,
        setCurrentTherapist,
        editMessage,
        invalidateFrom,
        regenerateAfter,
        conversationId,
        setVoiceEnabled,
        voiceId,
        therapists,
        setTherapists,
        fetchTherapists,
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
