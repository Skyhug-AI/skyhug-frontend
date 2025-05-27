import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];
type TherapistRow = Tables["therapists"]["Row"];

export interface TherapistFilters {
  identity?: string;
  topics?: string;
  style?: string;
}

export interface Therapist {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  avatarSrc: string;
  bgColor: string;
  bio: string;
  approach: string;
  sessionStructure: string;
  elevenLabsVoiceId: string;
}

export const mapTherapist = (
  dbTherapist: Tables["therapists"]["Row"]
): Therapist => ({
  id: dbTherapist.id,
  name: dbTherapist.name,
  description: dbTherapist.description,
  specialties: dbTherapist.specialties,
  avatarSrc: dbTherapist.avatar_url,
  bgColor: dbTherapist.bg_color,
  bio: dbTherapist.bio,
  approach: dbTherapist.approach,
  sessionStructure: dbTherapist.session_structure,
  elevenLabsVoiceId: dbTherapist.elevenlabs_voice_id,
});

export const therapistService = {
  async getTherapists(filters: TherapistFilters = {}): Promise<Therapist[]> {
    let query = supabase
      .from("therapists")
      .select<"therapists", Tables["therapists"]["Row"]>();

    // Apply identity filter
    if (filters.identity) {
      query = query.eq("identity->>gender", filters.identity);
    }

    // Apply topics filter
    if (filters.topics) {
      query = query.contains("specialties", [filters.topics]);
    }

    // Apply style filter
    if (filters.style) {
      query = query.contains("styles", [filters.style]);
    }

    const { data, error } = await query.order("name", { ascending: true });

    if (error) {
      throw new Error(`Error fetching therapists: ${error.message}`);
    }

    return (data || []).map(mapTherapist);
  },

  async getTherapistById(id: string): Promise<Therapist | null> {
    const { data, error } = await supabase
      .from("therapists")
      .select<"therapists", Tables["therapists"]["Row"]>()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching therapist: ${error.message}`);
    }

    return data ? mapTherapist(data) : null;
  },
};
