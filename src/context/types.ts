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
  createOrStartActiveSession: () => Promise<void>;
  triggerTTSForMessage: (tts_path: string) => Promise<void>;
  endConversation: () => Promise<void>;
  editMessage: (id: string, newContent: string) => Promise<void>;
  invalidateFrom: (id: string) => Promise<void>;
  regenerateAfter: (id: string) => Promise<void>;
  activeConversationId: string | null;
  setVoiceEnabled: (on: boolean) => Promise<void>;
  currentTherapist: {
    id: string;
    name: string;
    avatar_url: string;
    elevenLabsVoiceId: string;
  } | null;
  setCurrentTherapist: (
    therapist: {
      id: string;
      name: string;
      avatar_url: string;
      elevenLabsVoiceId: string;
    } | null
  ) => void;
  therapists: any[];
  setTherapists: (therapists: any[]) => void;
  fetchTherapists: (
    setLoading: (loading: boolean) => void,
    identityFilter: string,
    topicsFilter: string[],
    styleFilter: string
  ) => Promise<void>;
  getActiveSessionIdAndTherapist: () => Promise<void>;
};
