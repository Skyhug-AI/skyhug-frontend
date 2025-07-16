import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  onEditMessage?: (newText: string) => void;
  initialValue?: string;
  onStartVoice?: (blob: Blob) => void;
  isVoiceEnabled?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onEditMessage,
  initialValue = "",
  onStartVoice,
  isVoiceEnabled = false,
  placeholder = "Type your message...",
  isDisabled = false,
}) => {
  const [message, setMessage] = useState<string>(initialValue);

  // Whenever initialValue changes (e.g. entering edit-mode), reset the input
  useEffect(() => {
    setMessage(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    if (onEditMessage) {
      onEditMessage(trimmed);
    } else {
      onSendMessage(trimmed);
    }
    setMessage("");
  };

  const startRecording = async () => {
    if (!onStartVoice) return;
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(media);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        onStartVoice(blob);
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 5000);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-border p-4 pb-0 mb-1 bg-white/50 backdrop-blur-sm"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={isDisabled}
        className="flex-grow p-3 pr-10 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-serenity-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {isVoiceEnabled && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={startRecording}
          disabled={isDisabled}
        >
          <Mic className="h-5 w-5 text-serenity-500" />
        </Button>
      )}

      <Button
        type="submit"
        size="icon"
        className="rounded-full bg-serenity-500 hover:bg-serenity-600"
        disabled={isDisabled || !message.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
