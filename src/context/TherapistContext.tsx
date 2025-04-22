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
  isAudioReady?: boolean;
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
  playMessageAudio: (tts_path: string, shouldPause?: boolean) => Promise<void>;
  prepareDefaultAudio: () => void;
}

const TherapistContext = createContext<TherapistContextType | undefined>(
  undefined
);

const DEFAULT_GREETING_AUDIO_URL = "https://bborzcdfxrangvewmpfo.supabase.co/storage/v1/object/sign/tts-audio/867abb59-f20b-4a53-a716-f166758917b9/0350861c-124f-4d86-9150-8a8f8ef62f2e.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzcxODA5ZWE4LTlmOGItNGE0OS1iNWU0LWI2NzVlNDYxMDIxNCJ9.eyJ1cmwiOiJ0dHMtYXVkaW8vODY3YWJiNTktZjIwYi00YTUzLWE3MTYtZjE2Njc1ODkxN2I5LzAzNTA4NjFjLTEyNGYtNGQ4Ni05MTUwLThhOGY4ZWY2MmYyZS5tcDMiLCJpYXQiOjE3NDUzMDQ1NjAsImV4cCI6MTc0NTMwNDYyMH0.u7PYcq6z7QCiuYEYU7Br2mKQS5yGwGuF1o9FeiBZ9zo";

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
  const [defaultGreetingAudio, setDefaultGreetingAudio] = useState<HTMLAudioElement | null>(null);

  const formatMessage = (msg: any): Message => ({
    id: msg.id,
    content: msg.transcription ?? msg.assistant_text ?? "[No content]",
    isUser: msg.sender_role === "user",
    timestamp: new Date(msg.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    tts_path: msg.tts_path,
    isAudioReady: msg.sender_role === "user" ? true : false,
  });

  const prepareDefaultAudio = () => {
    try {
      const audio = new Audio(DEFAULT_GREETING_AUDIO_URL);
      audio.preload = "auto";
      setDefaultGreetingAudio(audio);
      console.log("Default greeting audio pre-loaded");
    } catch (err) {
      console.error("Failed to pre-load default greeting audio:", err);
    }
  };

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
    
    const formattedMessages = rows.map(formatMessage);
    
    setMessages(formattedMessages.filter(msg => msg.isUser));
    
    const firstAssistantMessage = formattedMessages.find(msg => !msg.isUser);
    if (firstAssistantMessage && firstAssistantMessage.content.includes("Hi there, I'm Sky")) {
      firstAssistantMessage.isAudioReady = true;
      if (!firstAssistantMessage.tts_path) {
        firstAssistantMessage.tts_path = "default_greeting";
      }
      setMessages(prev => [...prev, firstAssistantMessage]);
    }
    
    for (const msg of formattedMessages) {
      if (!msg.isUser && msg.tts_path && !msg.isAudioReady) {
        prepareAudioForMessage(msg);
      }
    }
  };

  const prepareAudioForMessage = async (message: Message) => {
    if (!message.tts_path || message.isUser) return;
    
    if (message.tts_path === "default_greeting" || 
        message.content.includes("Hi there, I'm Sky")) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, isAudioReady: true, tts_path: "default_greeting" } : msg
        )
      );
      return;
    }
    
    try {
      const { data, error } = await supabase.storage
        .from("tts-audio")
        .createSignedUrl(message.tts_path, 60);
  
      if (error || !data?.signedUrl) {
        console.error("Signed URL error:", error);
        
        setMessages(prev => {
          const msgExists = prev.some(m => m.id === message.id);
          
          if (msgExists) {
            return prev.map(msg => 
              msg.id === message.id ? { ...msg, isAudioReady: true } : msg
            );
          } else {
            return [...prev, { ...message, isAudioReady: true }];
          }
        });
        return;
      }
  
      const audio = new Audio(data.signedUrl);
      audio.preload = "auto";
  
      const timeoutId = setTimeout(() => {
        console.log(`⏱️ Audio load timeout for message ${message.id}, showing anyway`);
        setMessages(prev => {
          const msgExists = prev.some(m => m.id === message.id);
          
          if (msgExists) {
            return prev.map(msg => 
              msg.id === message.id ? { ...msg, isAudioReady: true } : msg
            );
          } else {
            return [...prev, { ...message, isAudioReady: true }];
          }
        });
      }, 3000);
  
      audio.onloadeddata = () => {
        clearTimeout(timeoutId);
        console.log(`✅ Audio loaded for message ${message.id}`);
        
        setMessages(prev => {
          const msgExists = prev.some(m => m.id === message.id);
          
          if (msgExists) {
            return prev.map(msg => 
              msg.id === message.id ? { ...msg, isAudioReady: true } : msg
            );
          } else {
            return [...prev, { ...message, isAudioReady: true }];
          }
        });
      };
      
      audio.onerror = (e) => {
        clearTimeout(timeoutId);
        console.error(`Audio loading error for message ${message.id}:`, e);
        
        setMessages(prev => {
          const msgExists = prev.some(m => m.id === message.id);
          
          if (msgExists) {
            return prev.map(msg => 
              msg.id === message.id ? { ...msg, isAudioReady: true } : msg
            );
          } else {
            return [...prev, { ...message, isAudioReady: true }];
          }
        });
      };
    } catch (err) {
      console.error("Audio preparation exception:", err);
      
      setMessages(prev => {
        const msgExists = prev.some(m => m.id === message.id);
        
        if (msgExists) {
          return prev.map(msg => 
            msg.id === message.id ? { ...msg, isAudioReady: true } : msg
          );
        } else {
          return [...prev, { ...message, isAudioReady: true }];
        }
      });
    }
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

    console.log("���� Creating new conversation...");
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

    if (memErr && memErr.code !== "PGRST116") {
      console.error("❌ Error fetching memory_summary:", memErr);
    }

    const greeting = prev?.memory_summary
      ? `Last time we spoke, we discussed ${prev.memory_summary}. Would you like to pick up where we left off?`
      : "Hi there, I'm Sky. How are you feeling today?";

    await supabase.from("messages").insert({
      conversation_id: data.id,
      sender_role: "assistant",
      assistant_text: greeting,
      ai_status: "done",
      tts_status: "pending",
    });

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

  const playMessageAudio = async (tts_path: string, shouldPause: boolean = false) => {
    if (!tts_path) return;
    
    if (tts_path === "default_greeting") {
      if (defaultGreetingAudio) {
        if (shouldPause) {
          defaultGreetingAudio.pause();
          console.log("⏸️ Default greeting audio paused");
          return;
        } else if (defaultGreetingAudio.paused) {
          defaultGreetingAudio.play();
          console.log("▶️ Default greeting audio resumed");
          return;
        } else {
          return;
        }
      } else {
        try {
          const audio = new Audio(DEFAULT_GREETING_AUDIO_URL);
          audio.play();
          setDefaultGreetingAudio(audio);
          return;
        } catch (err) {
          console.error("Error playing default greeting:", err);
          return;
        }
      }
    }
  
    if (currentAudio?.src.includes(tts_path)) {
      if (shouldPause) {
        currentAudio.pause();
        console.log("⏸️ Audio paused");
        return;
      } else if (currentAudio.paused) {
        currentAudio.play();
        console.log("▶️ Audio resumed");
        return;
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
        toast({
          title: "🎧 Playing audio",
          description: "Serenity's response is playing now",
        });
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
      await audio.play();
  
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
          const msg = payload.new;
          if (msg.sender_role === "assistant") {
            const formattedMsg = formatMessage(msg);
            
            if (formattedMsg.isUser) {
              setMessages((prev) => [...prev, { ...formattedMsg, isAudioReady: true }]);
              setIsProcessing(false);
              return;
            }
            
            if (formattedMsg.content.includes("Hi there, I'm Sky")) {
              setMessages((prev) => [...prev, { 
                ...formattedMsg, 
                isAudioReady: true,
                tts_path: "default_greeting"
              }]);
              setIsProcessing(false);
              return;
            }
            
            if (formattedMsg.tts_path) {
              prepareAudioForMessage(formattedMsg);
            } else {
              setMessages((prev) => [...prev, { ...formattedMsg, isAudioReady: true }]);
            }
            
            setIsProcessing(false);
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
        prepareDefaultAudio,
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
