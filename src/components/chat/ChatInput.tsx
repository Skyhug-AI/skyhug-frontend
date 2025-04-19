
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  onStartVoice?: (blob: Blob) => void;
  isVoiceEnabled?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStartVoice,
  isVoiceEnabled = false,
  placeholder = "Type your message...",
  isDisabled = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // Voice recording logic
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
      // Stop after 5 seconds (or you could tie this to a UI button)
      setTimeout(() => recorder.stop(), 5000);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-border p-4 bg-white/50 backdrop-blur-sm"
    >
      <div className="relative flex-grow">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          className="w-full p-3 pr-10 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-serenity-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

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
