import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Conversation = Database["public"]["Tables"]["conversations"]["Row"];

const formatMessage = (msg: any) => ({
  id: msg.id,
  content: msg.transcription ?? msg.assistant_text ?? "[No content]",
  isUser: msg.sender_role === "user",
  timestamp: new Date(msg.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  tts_path: msg.tts_path,
  ttsHasArrived: Boolean(msg.tts_path && msg.tts_status === "done"),
  isGreeting: msg.sender_role === "assistant" && (
    msg.assistant_text?.startsWith("Hi there, I'm") ||
    msg.assistant_text?.startsWith("Last time we spoke")
  ),
});

export const conversationService = {
  async loadHistory(
    activeConversationId: string,
    setMessages: (messages: any[]) => void
  ) {
    const { data: rows, error } = await supabase
      .from("messages")
      .select("id, sender_role, transcription, assistant_text, created_at")
      .eq("conversation_id", activeConversationId)
      .eq("invalidated", false)
      .order("created_at");

    if (error) {
      console.error("Error loading conversation history:", error);
      return;
    }
    setMessages(rows.map(formatMessage));
  },



  async findExistingConversation(userId: string) {
    return await supabase
      .from("conversations")
      .select("id, therapist_id")
      .eq("patient_id", userId)
      .eq("ended", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
  },

  async getTherapistMetadata(therapistId: string) {
    return await supabase
      .from("therapists")
      .select("name, avatar_url, elevenlabs_voice_id")
      .eq("id", therapistId)
      .single();
  },

  async createPatient(userId: string, fullName: string) {
    return await supabase
      .from("patients")
      .insert({ id: userId, full_name: fullName });
  },

  async createConversation(userId: string, therapistId?: string) {
    const payload: any = {
      patient_id: userId,
      title: "Therapy Session",
      ended: false,
    };
    if (therapistId) payload.therapist_id = therapistId;

    return await supabase
      .from("conversations")
      .insert(payload)
      .select()
      .single();
  },

  async getLastMemorySummary(userId: string) {
    return await supabase
      .from("conversations")
      .select("memory_summary")
      .eq("patient_id", userId)
      .eq("ended", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
  },

  async sendMessage(activeConversationId: string, content: string) {
    return await supabase.from("messages").insert({
      conversation_id: activeConversationId,
      sender_role: "user",
      transcription: content,
      transcription_status: "done",
      ai_status: "pending",
      tts_status: "pending",
    });
  },

  async sendAudioMessage(activeConversationId: string, audioPath: string) {
    return await supabase.from("messages").insert({
      conversation_id: activeConversationId,
      sender_role: "user",
      audio_path: audioPath,
      transcription_status: "pending",
      ai_status: "pending",
      tts_status: "pending",
    });
  },

  async uploadAudio(key: string, blob: Blob) {
    return await supabase.storage
      .from("raw-audio")
      .upload(key, blob, { contentType: "audio/webm" });
  },

  async setVoiceEnabled(activeConversationId: string, enabled: boolean) {
    return await supabase
      .from("conversations")
      .update({ voice_enabled: enabled })
      .eq("id", activeConversationId);
  },

  async endConversation(activeConversationId: string) {
    return await supabase
      .from("conversations")
      .update({ ended: true })
      .eq("id", activeConversationId);
  },

  async editMessage(
    activeConversationId: string,
    messageId: string,
    newContent: string
  ) {
    const updates = [];

    // Update the edited message
    updates.push(
      supabase
        .from("messages")
        .update({
          transcription: newContent,
          edited_at: new Date().toISOString(),
        })
        .eq("id", messageId)
    );

    // Get original message timestamp
    const { data: orig } = await supabase
      .from("messages")
      .select("created_at")
      .eq("id", messageId)
      .single();

    if (orig?.created_at) {
      // Invalidate downstream messages
      updates.push(
        supabase
          .from("messages")
          .update({ invalidated: true })
          .eq("conversation_id", activeConversationId)
          .gt("created_at", orig.created_at)
      );

      // Mark for re-summarization
      updates.push(
        supabase
          .from("conversations")
          .update({ needs_resummarization: true })
          .eq("id", activeConversationId)
      );

      // Reset AI status
      updates.push(
        supabase
          .from("messages")
          .update({
            transcription: newContent,
            edited_at: new Date().toISOString(),
            ai_status: "pending",
            invalidated: false,
            ai_started: false,
          })
          .eq("id", messageId)
      );
    }

    return await Promise.all(updates);
  },

  async invalidateFrom(activeConversationId: string, messageId: string) {
    const { data: orig } = await supabase
      .from("messages")
      .select("created_at")
      .eq("id", messageId)
      .single();

    if (orig?.created_at) {
      return await supabase
        .from("messages")
        .update({ invalidated: true })
        .eq("conversation_id", activeConversationId)
        .gt("created_at", orig.created_at);
    }
  },

  async regenerateAfter(messageId: string) {
    return await supabase
      .from("messages")
      .update({ ai_status: "pending", invalidated: false })
      .eq("id", messageId);
  },

  async insertGreeting(activeConversationId: string, greeting: string) {
    return await supabase.from("messages").insert({
      conversation_id: activeConversationId,
      sender_role: "assistant",
      assistant_text: greeting,
      ai_status: "done",
      tts_status: "pending",
    });
  },
};
