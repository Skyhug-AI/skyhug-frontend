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
import { mapTherapist, therapistService } from "@/services/therapist.service";
import { TherapistContextType, Message } from "./types";

const TherapistContext = createContext<TherapistContextType>({
  messages: [],
  isProcessing: false,
  isLoadingSession: true,
  sendMessage: async (_content: string) => {},
  sendAudioMessage: async () => {},
  createOrStartActiveSession: async () => {},
  triggerTTSForMessage: async () => {},
  endConversation: async () => {},
  currentTherapist: null,
  setCurrentTherapist: () => {},
  editMessage: async () => {},
  invalidateFrom: async () => {},
  regenerateAfter: async () => {},
  activeConversationId: null,
  setVoiceEnabled: async () => {},
  therapists: [],
  setTherapists: () => {},
  fetchTherapists: async (
    _setLoading: (l: boolean) => void,
    _identityFilter: string,
    _topicsFilter: string[],
    _styleFilter: string
  ) => {},
  getActiveSessionIdAndTherapist: async () => {},
  isPlayingAudio: false,
  playMessageAudio: async () => {},
});

export const TherapistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [currentTherapist, setCurrentTherapist] = useState<{
    id: string;
    name: string;
    avatar_url: string;
    elevenLabsVoiceId: string;
  } | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
 
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
    if (!activeConversationId) return;

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
        .eq("conversation_id", activeConversationId)
        .gt("created_at", orig.created_at);
    }

    // 3) Mark conversation to re-summarize
    await supabase
      .from("conversations")
      .update({ needs_resummarization: true })
      .eq("id", activeConversationId);

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
    if (!activeConversationId) return;
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
      .eq("conversation_id", activeConversationId)
      .gt("created_at", orig.created_at);
  };

  /** Reset a single message to pending so the AI will re-process it */
  const regenerateAfter = async (id: string) => {
    await supabase
      .from("messages")
      .update({ ai_status: "pending", invalidated: false })
      .eq("id", id);
  };

  // TODO: CREATE ENDPOINT --> LOAD CHAT HISTORY
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

  const getActiveSessionIdAndTherapist = async () => {
    setIsLoadingSession(true);
    try {
      const { data: patient } = await supabase
        .from("patients")
        .select("active_conversation_id")
        .eq("id", user.id)
        .single();

      const activeId = patient?.active_conversation_id ?? null;
      setActiveConversationId(activeId);

      const { data: therapistId } = await supabase
        .from("conversations")
        .select("therapist_id")
        .eq("id", activeId)
        .single();

      const therapistData = await therapistService.getTherapistById(
        therapistId.therapist_id
      );

      setCurrentTherapist(therapistData);
    } catch (error) {
      console.error("Error fetching active session:", error);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const createOrStartActiveSession = async () => {
    if (!user) return;

    if (activeConversationId) {
      console.log(activeConversationId, "activeConversationId***");
      await resumeSession();
    } else {
      await createNewSession();
    }
  };

  const resumeSession = async () => {
    console.log(
      "🔁 Resuming previous conversation active conversation id:",
      activeConversationId
    );
    // const { error, data: existing } = await supabase
    //   .from("conversations")
    //   .update({ therapist_id: currentTherapist.id })
    //   .eq("id", activeConversationId);

    await loadHistory(activeConversationId);
  };

  const createNewSession = async () => {
    // 4) Ensure the patient record exists
    // TO DO: ENDPOINT - get_or_create_patient (upon profile creation?)
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

    // ENDPOINT - COMBINE
    // 5) Create a brand-new conversation
    console.log("🟡 Creating new conversation...");

    const convoPayload: Record<string, any> = {
      patient_id: user.id,
      title: "Therapy Session",
    };

    // only include therapist_id when someone’s explicitly picked one
    if (currentTherapist?.id) {
      convoPayload.therapist_id = currentTherapist.id;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert(convoPayload)
      .select()
      .single();

    if (error || !data) {
      console.error("❌ Supabase error creating conversation:", error);
      return;
    }
    // MARK SESSION AS ACTIVE UNDER PATIENT
    // TODO: DELETE ended = True / False in DB? Unnecessary. And throughout code
    await supabase
      .from("patients")
      .update({ active_conversation_id: data.id })
      .eq("id", user.id);

    setActiveConversationId(data.id);

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

// 7) Build your greeting with optional profile-based variation
    const personaName = currentTherapist?.name ?? "Sky";
    let greeting: string;

    if (prev?.memory_summary) {
      greeting = `Last time we spoke, we discussed ${prev.memory_summary}. Would you like to pick up where we left off?`;
    } else {
      let usedProfileGreeting = false;
      try {
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("topics_on_mind")
          .eq("user_id", user.id)
          .single();

        if (profileData?.topics_on_mind?.length && Math.random() < 0.33) {
          const topics = profileData.topics_on_mind;
          const oneTopic = topics[Math.floor(Math.random() * topics.length)];
          greeting = `Hi there, I'm ${personaName}. I know you’ve been thinking a lot about ${oneTopic} recently. Would you like to start there?`;
          usedProfileGreeting = true;
        }
      } catch {
        // ignore errors and fallback
      }

      if (!usedProfileGreeting) {
        greeting = `Hi there, I'm ${personaName}. How are you feeling today?`;
      }
    }

    console.log("👋 Selected greeting:", greeting);


    // // 8) Insert the assistant greeting
    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: data.id,
      sender_role: "assistant",
      assistant_text: greeting,
      ai_status: "done",
      tts_status: "pending",
    });

    // ─── DEBUG: surface user profile immediately to makes sure injection actually happens 
    // try {
    //   const { data: profileData } = await supabase
    //     .from("user_profiles")
    //     .select("age, gender, career, self_diagnosed_issues, topics_on_mind")
    //     .eq("user_id", user.id)
    //     .single();

    //   if (profileData) {
    //     const lines: string[] = [];
    //     for (const [key, val] of Object.entries(profileData)) {
    //       if (val) {
    //         const prettyKey = key.replace(/_/g, " ");
    //         const prettyVal = Array.isArray(val) ? val.join(", ") : val;
    //         lines.push(`${prettyKey}: ${prettyVal}`);
    //       }
    //     }

    //     await supabase.from("messages").insert({
    //       conversation_id: data.id,
    //       sender_role: "assistant",
    //       assistant_text: `PROFILE CONTEXT:\n${lines.join("\n")}`,
    //       ai_status: "done",
    //       tts_status: "pending",
    //     });
    //   }
    // } catch {
    //   // ignore any errors
    // }

    // 9) Insert the assistant greeting
    // const { error: messageError } = await supabase.from("messages").insert({
    //   conversation_id: data.id,
    //   sender_role: "assistant",
    //   assistant_text: greeting,
    //   ai_status: "done",
    //   tts_status: "pending",
    // });


    if (messageError) {
      console.error("❌ Error inserting greeting message:", messageError);
    }

    // 9) Load it into state
    await loadHistory(data.id);
  };

  const sendMessage = async (content: string) => {
    if (!activeConversationId || !content.trim()) return;
    console.log("📤 Sending message to Supabase...");
    setIsProcessing(true);

    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConversationId,
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
    if (!activeConversationId || !user) return;
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
      conversation_id: activeConversationId,
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
    if (!activeConversationId) return;
    const { error } = await supabase
      .from("conversations")
      .update({ voice_enabled: on })
      .eq("id", activeConversationId);
    if (error) console.error("Error updating voice_enabled:", error);
  };

  const endConversation = async () => {
    console.log("📕 Attempting to end conversation:", activeConversationId);
    if (!activeConversationId) {
      console.warn("⚠️ No conversationId set; cannot end.");
      return;
    }

    const { data: endedConvo, error: endError } = await supabase
      .from("conversations")
      .update({ ended: true })
      .eq("id", activeConversationId)
      .select()
      .single();    // grab the row back if you need it

    if (endError) {
      console.error("❌ Failed to mark conversation ended:", endError);
      return;
    }

    // now clear out the patient’s active pointer
    const { error: patientError } = await supabase
      .from("patients")
      .update({ active_conversation_id: null })
      .eq("id", user.id);

    if (patientError) {
      console.error("❌ Supabase error clearing patient active session:", patientError);
      return;
    }

    setActiveConversationId(null);
    console.log("✅ Conversation truly ended.");

    try {
      await fetch("http://localhost:8001/summarize_conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: activeConversationId }),
      });
      console.log("🧠 Summarization triggered for conv", activeConversationId);
    } catch (e) {
      console.error("❌ Failed to trigger summarization:", e);
    }
  };

  const playMessageAudio = async (messageId?: string | null, snippetIndex: number = 0): Promise<void> => {
    if (!messageId) return;
    
    // 1) tear down any old audio
    currentAudio?.pause();
    if (currentAudio) currentAudio.currentTime = 0;

    // 2) create a new <audio> streaming from your TTS endpoint
    const streamUrl = `http://localhost:8000/tts-stream/${messageId}?snippet=${snippetIndex}`;
    const audio = new Audio(streamUrl);
    audio.preload = "auto";
    audio.onerror = (e) => {
      console.error("Stream playback error", e);
      toast({
        title: "Audio error",
        description: "Could not play stream",
        variant: "destructive",
      });
    };

    // 3) set up the onended so we know when playback finishes
    audio.onended = () => {
      // clear the “playing” flag
      setIsPlayingAudio(false);
      // optional: drop reference to the old audio element
      setCurrentAudio(null);
    };

    // 4) hold onto this audio element in state
    setCurrentAudio(audio);

    // 5) start playback and flip the “playing” flag
    audio.play()
      .then(() => {
        setIsPlayingAudio(true);
      })
      .catch(err => console.error("Play() failed:", err));
  };


  const triggerTTSForMessage = async (tts_path: string) => {
    if (!activeConversationId) return;
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
    if (!activeConversationId) return;
    const channel = supabase
      .channel(`messages-updates-${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
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
          filter: `conversation_id=eq.${activeConversationId}`,
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
  }, [activeConversationId]);

  return (
    <TherapistContext.Provider
      value={{
        messages,
        isProcessing,
        isLoadingSession,
        sendMessage,
        sendAudioMessage,
        createOrStartActiveSession,
        triggerTTSForMessage,
        endConversation,
        playMessageAudio,
        currentTherapist,
        setCurrentTherapist,
        editMessage,
        invalidateFrom,
        regenerateAfter,
        activeConversationId,
        setVoiceEnabled,
        therapists,
        setTherapists,
        fetchTherapists,
        getActiveSessionIdAndTherapist,
        isPlayingAudio,
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
