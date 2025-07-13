export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      assessment_questions: {
        Row: {
          answer_options: Json
          assessment_id: string | null
          created_at: string | null
          id: string
          question_number: number
          question_text: string
          ui_prompt: string | null
        }
        Insert: {
          answer_options: Json
          assessment_id?: string | null
          created_at?: string | null
          id?: string
          question_number: number
          question_text: string
          ui_prompt?: string | null
        }
        Update: {
          answer_options?: Json
          assessment_id?: string | null
          created_at?: string | null
          id?: string
          question_number?: number
          question_text?: string
          ui_prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          version: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          version?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          version?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          ended: boolean | null
          id: string
          memory_summary: string | null
          needs_resummarization: boolean
          patient_id: string
          therapist_id: string | null
          title: string | null
          updated_at: string
          voice_enabled: boolean
        }
        Insert: {
          created_at?: string
          ended?: boolean | null
          id?: string
          memory_summary?: string | null
          needs_resummarization?: boolean
          patient_id: string
          therapist_id?: string | null
          title?: string | null
          updated_at?: string
          voice_enabled?: boolean
        }
        Update: {
          created_at?: string
          ended?: boolean | null
          id?: string
          memory_summary?: string | null
          needs_resummarization?: boolean
          patient_id?: string
          therapist_id?: string | null
          title?: string | null
          updated_at?: string
          voice_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "conversations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_started: boolean
          ai_status: string
          assistant_text: string | null
          audio_path: string | null
          conversation_id: string
          created_at: string
          edited_at: string | null
          id: string
          invalidated: boolean
          sender_role: Database["public"]["Enums"]["message_role"]
          snippet_url: string | null
          transcription: string | null
          transcription_status: string
          tts_local_ready: boolean
          tts_path: string | null
          tts_status: string
          updated_at: string
        }
        Insert: {
          ai_started?: boolean
          ai_status?: string
          assistant_text?: string | null
          audio_path?: string | null
          conversation_id: string
          created_at?: string
          edited_at?: string | null
          id?: string
          invalidated?: boolean
          sender_role: Database["public"]["Enums"]["message_role"]
          snippet_url?: string | null
          transcription?: string | null
          transcription_status?: string
          tts_local_ready?: boolean
          tts_path?: string | null
          tts_status?: string
          updated_at?: string
        }
        Update: {
          ai_started?: boolean
          ai_status?: string
          assistant_text?: string | null
          audio_path?: string | null
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          invalidated?: boolean
          sender_role?: Database["public"]["Enums"]["message_role"]
          snippet_url?: string | null
          transcription?: string | null
          transcription_status?: string
          tts_local_ready?: boolean
          tts_path?: string | null
          tts_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_favorite_therapists: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          therapist_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          therapist_id: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_favorite_therapists_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_favorite_therapists_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          active_conversation_id: string | null
          created_at: string
          dob: string | null
          full_name: string
          id: string
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          active_conversation_id?: string | null
          created_at?: string
          dob?: string | null
          full_name: string
          id: string
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          active_conversation_id?: string | null
          created_at?: string
          dob?: string | null
          full_name?: string
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_active_conversation_id_fkey"
            columns: ["active_conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          approach: string
          avatar_url: string
          bg_color: string
          bio: string
          created_at: string
          description: string
          elevenlabs_voice_id: string | null
          id: string
          identity: Json
          key: string
          name: string
          session_structure: string
          specialties: string[]
          styles: string[]
          system_prompt: string
          updated_at: string
        }
        Insert: {
          approach: string
          avatar_url: string
          bg_color: string
          bio: string
          created_at?: string
          description: string
          elevenlabs_voice_id?: string | null
          id?: string
          identity?: Json
          key: string
          name: string
          session_structure: string
          specialties?: string[]
          styles?: string[]
          system_prompt: string
          updated_at?: string
        }
        Update: {
          approach?: string
          avatar_url?: string
          bg_color?: string
          bio?: string
          created_at?: string
          description?: string
          elevenlabs_voice_id?: string | null
          id?: string
          identity?: Json
          key?: string
          name?: string
          session_structure?: string
          specialties?: string[]
          styles?: string[]
          system_prompt?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          additional_info: string | null
          age: number | null
          agreeable_slider: number
          agreeable_slider_updated_at: string | null
          career: string | null
          gender: string | null
          self_diagnosed_issues: string | null
          sexual_preferences: string | null
          topics_on_mind: string[] | null
          user_id: string
        }
        Insert: {
          additional_info?: string | null
          age?: number | null
          agreeable_slider?: number
          agreeable_slider_updated_at?: string | null
          career?: string | null
          gender?: string | null
          self_diagnosed_issues?: string | null
          sexual_preferences?: string | null
          topics_on_mind?: string[] | null
          user_id: string
        }
        Update: {
          additional_info?: string | null
          age?: number | null
          agreeable_slider?: number
          agreeable_slider_updated_at?: string | null
          career?: string | null
          gender?: string | null
          self_diagnosed_issues?: string | null
          sexual_preferences?: string | null
          topics_on_mind?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      message_role: "system" | "user" | "assistant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      message_role: ["system", "user", "assistant"],
    },
  },
} as const
