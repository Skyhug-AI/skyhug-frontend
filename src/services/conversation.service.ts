import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Conversation = Database["public"]["Tables"]["conversations"]["Row"];

export const conversationService = {
  async loadHistory(conversationId: string) {
    return await supabase
      .from("messages")
      .select("id, sender_role, transcription, assistant_text, created_at")
      .eq("conversation_id", conversationId)
      .eq("invalidated", false)
      .order("created_at");
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

  async createConversation(userId: string, therapistId: string) {
    return await supabase
      .from("conversations")
      .insert({
        patient_id: userId,
        title: "Therapy Session",
        ended: false,
        therapist_id: therapistId,
      })
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

  async sendMessage(conversationId: string, content: string) {
    return await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_role: "user",
      transcription: content,
      transcription_status: "done",
      ai_status: "pending",
      tts_status: "pending",
    });
  },

  async sendAudioMessage(conversationId: string, audioPath: string) {
    return await supabase.from("messages").insert({
      conversation_id: conversationId,
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

  async setVoiceEnabled(conversationId: string, enabled: boolean) {
    return await supabase
      .from("conversations")
      .update({ voice_enabled: enabled })
      .eq("id", conversationId);
  },

  async endConversation(conversationId: string) {
    return await supabase
      .from("conversations")
      .update({ ended: true })
      .eq("id", conversationId);
  },

  async editMessage(conversationId: string, messageId: string, newContent: string) {
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
          .eq("conversation_id", conversationId)
          .gt("created_at", orig.created_at)
      );

      // Mark for re-summarization
      updates.push(
        supabase
          .from("conversations")
          .update({ needs_resummarization: true })
          .eq("id", conversationId)
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

  async invalidateFrom(conversationId: string, messageId: string) {
    const { data: orig } = await supabase
      .from("messages")
      .select("created_at")
      .eq("id", messageId)
      .single();

    if (orig?.created_at) {
      return await supabase
        .from("messages")
        .update({ invalidated: true })
        .eq("conversation_id", conversationId)
        .gt("created_at", orig.created_at);
    }
  },

  async regenerateAfter(messageId: string) {
    return await supabase
      .from("messages")
      .update({ ai_status: "pending", invalidated: false })
      .eq("id", messageId);
  },

  async insertGreeting(conversationId: string, greeting: string) {
    return await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_role: "assistant",
      assistant_text: greeting,
      ai_status: "done",
      tts_status: "pending",
    });
  }
};
