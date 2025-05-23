export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      therapists: {
        Row: {
          id: string;
          name: string;
          description: string;
          specialties: string[];
          avatar_url: string;
          bg_color: string;
          bio: string;
          approach: string;
          session_structure: string;
          identity: { gender: string };
          styles: string[];
          elevenlabs_voice_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          specialties: string[];
          avatar_url: string;
          bg_color: string;
          bio: string;
          approach: string;
          session_structure: string;
          identity: { gender: string };
          styles: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          specialties?: string[];
          avatar_url?: string;
          bg_color?: string;
          bio?: string;
          approach?: string;
          session_structure?: string;
          identity?: { gender: string };
          styles?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          ended: boolean;
          patient_id: string;
          title: string;
          voice_enabled: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          ended?: boolean;
          patient_id: string;
          title: string;
          voice_enabled?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          ended?: boolean;
          patient_id?: string;
          title?: string;
          voice_enabled?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_patient_id_fkey";
            columns: ["patient_id"];
            referencedRelation: "patients";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          conversation_id: string;
          sender_role: "system" | "user" | "assistant";
          assistant_text: string;
          transcription: string;
          transcription_status: string;
          ai_status: string;
          audio_path: string;
          tts_path: string;
          tts_status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          conversation_id: string;
          sender_role: "system" | "user" | "assistant";
          assistant_text?: string;
          transcription?: string;
          transcription_status?: string;
          ai_status?: string;
          audio_path?: string;
          tts_path?: string;
          tts_status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          conversation_id?: string;
          sender_role?: "system" | "user" | "assistant";
          assistant_text?: string;
          transcription?: string;
          transcription_status?: string;
          ai_status?: string;
          audio_path?: string;
          tts_path?: string;
          tts_status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          }
        ];
      };
      patients: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          dob: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          dob: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          dob?: string;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
