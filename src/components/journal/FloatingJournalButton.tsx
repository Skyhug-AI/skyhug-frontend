
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookText, Pencil, Hash } from "lucide-react";

// Tag/Feeling config
const emojiFeelings = [
  { emoji: "😔", value: "sad", label: "Sad" },
  { emoji: "😐", value: "neutral", label: "Neutral" },
  { emoji: "😕", value: "confused", label: "Confused" },
  { emoji: "😌", value: "relieved", label: "Relieved" },
  { emoji: "😄", value: "happy", label: "Happy" },
];

const starterTags = [
  { label: "Lonely", value: "lonely" },
  { label: "Sad", value: "sad" },
];

const FloatingJournalButton = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const [hashtags, setHashtags] = useState(starterTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [encouragement, setEncouragement] = useState(false);

  // Add tag logic
  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (
      trimmed.length > 1 &&
      !hashtags.some(
        (tag) => tag.label.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      const newTag = { label: trimmed, value: trimmed.toLowerCase() };
      setHashtags([...hashtags, newTag]);
      setSelectedTags([...selectedTags, newTag.value]);
      setNewTagInput("");
    }
  };

  // Tag select/deselect
  const toggleTag = (value: string) => {
    setSelectedTags((tags) =>
      tags.includes(value)
        ? tags.filter((t) => t !== value)
        : [...tags, value]
    );
  };

  // Save logic
  const handleSave = () => {
    setEncouragement(true);
    toast({
      title: "Journal saved",
      description: "Your reflection has been saved.",
      className: "animate-fade-in-up",
    });
    setTimeout(() => {
      setIsOpen(false);
      setJournalEntry("");
      setSelectedTags([]);
      setSelectedFeeling(null);
      setEncouragement(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed right-6 top-20 z-50 h-12 w-12 rounded-full shadow-lg bg-white hover:bg-skyhug-50 border-skyhug-200"
        >
          <BookText className="h-6 w-6 text-skyhug-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] bg-transparent border-0 shadow-none p-0">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-skyhug-900 mb-2">
            Add a Journal Entry
          </DialogTitle>
        </DialogHeader>

        {/* Glass panel for journal card */}
        <div className="glass-panel relative rounded-2xl px-6 py-7 mt-0 mb-2 shadow-xl border border-skyhug-100 bg-white/80">
          {/* Journal textarea */}
          <Textarea
            placeholder="What's on your mind today?"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="min-h-[110px] resize-none bg-transparent border-0 focus:ring-0 text-base font-medium text-skyhug-800 placeholder:text-skyhug-400 px-0"
            style={{
              boxShadow: "none",
            }}
          />
        </div>

        {/* Hashtag section */}
        <div className="mb-0">
          <div className="text-xs font-semibold mb-2 text-skyhug-700 uppercase tracking-widest">
            Tags
          </div>
          <div className="flex gap-2 flex-wrap">
            {hashtags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                className={`flex items-center px-2.5 py-1 rounded-full border transition-colors text-xs font-medium focus:ring-2 focus:ring-skyhug-200/40 
                  ${
                    selectedTags.includes(tag.value)
                      ? "bg-skyhug-100 border-skyhug-300 text-skyhug-800 shadow"
                      : "bg-skyhug-50 border-skyhug-100 text-skyhug-600 hover:bg-skyhug-200"
                  }
                `}
                style={{
                  boxShadow: selectedTags.includes(tag.value)
                    ? "0 1px 4px #2563eb12"
                    : undefined,
                }}
                onClick={() => toggleTag(tag.value)}
              >
                <Hash className="w-3.5 h-3.5 mr-1 text-inherit" />
                {tag.label}
              </button>
            ))}
            {/* New tag input */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag();
                }}
                placeholder="+ Tag"
                className="px-2 py-1 rounded-full border border-skyhug-100 bg-skyhug-50 text-xs w-20 focus:outline-none focus:ring-2 focus:ring-skyhug-200"
                style={{ minWidth: 70, boxShadow: "none" }}
              />
              <button
                onClick={handleAddTag}
                type="button"
                className="ml-1 text-skyhug-400 hover:text-skyhug-600"
                tabIndex={-1}
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feeling selector */}
        <div className="mt-4 mb-2">
          <div className="text-xs font-semibold mb-2 text-skyhug-700 uppercase tracking-widest">
            Mood
          </div>
          <div className="flex gap-2 items-center justify-center">
            {emojiFeelings.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`rounded-full flex flex-col items-center px-2 py-1 transition-all border-2 ${
                  selectedFeeling === f.value
                    ? "bg-skyhug-100 border-skyhug-500 scale-110 shadow"
                    : "bg-skyhug-50 border-skyhug-100 text-skyhug-600 hover:bg-skyhug-200"
                }`}
                onClick={() => setSelectedFeeling(f.value)}
                aria-label={f.label}
                style={{
                  outline: "none",
                  transition: "all 0.17s cubic-bezier(.45,.7,.4,1.3)",
                  minWidth: 48,
                }}
              >
                <span className="text-2xl leading-none block">
                  {f.emoji}
                </span>
                <span className="text-[11px] mt-1 font-semibold text-skyhug-600">
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Save/encouragement */}
        <div className="mt-4">
          {encouragement ? (
            <div className="px-2 py-3 text-center transition-all">
              <div className="font-semibold text-xl text-skyhug-600 pb-1">
                ✔️ Saved!
              </div>
              <div className="text-base text-skyhug-500">
                Your journal entry was added.
              </div>
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleSave}
              className="w-full bg-skyhug-500 hover:bg-skyhug-600 text-white py-2 mt-2 rounded-full font-semibold text-lg shadow transition-all duration-150"
              disabled={!journalEntry.trim()}
              style={{
                borderRadius: "999px",
                background: "linear-gradient(90deg, #2563eb 0%, #6379ed 100%)",
                boxShadow: "0 2px 12px #B9C6FF3b"
              }}
            >
              Save Entry
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FloatingJournalButton;
