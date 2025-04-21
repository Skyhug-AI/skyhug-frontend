
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookText, Pencil, Hash, Smile, Frown, Meh } from "lucide-react";

const emojiFeelings = [
  { emoji: "😔", value: "sad" },
  { emoji: "😐", value: "neutral" },
  { emoji: "😕", value: "confused" },
  { emoji: "😌", value: "relieved" },
  { emoji: "😄", value: "happy" },
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
    if (newTagInput.trim() && !hashtags.some(tag => tag.label.toLowerCase() === newTagInput.trim().toLowerCase())) {
      setHashtags([...hashtags, { label: newTagInput.trim(), value: newTagInput.trim().toLowerCase() }]);
      setSelectedTags([...selectedTags, newTagInput.trim().toLowerCase()]);
      setNewTagInput("");
    }
  };

  // Tag select/deselect
  const toggleTag = (value: string) => {
    if (selectedTags.includes(value)) {
      setSelectedTags(selectedTags.filter((v) => v !== value));
    } else {
      setSelectedTags([...selectedTags, value]);
    }
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
      <DialogContent
        className="sm:max-w-[420px] bg-transparent shadow-none backdrop-blur-none"
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-base font-medium text-gray-700 pb-0 mb-1">How was your day?</DialogTitle>
        </DialogHeader>

        {/* Notepad card mock - with wavy top and peach bg */}
        <div
          className="relative rounded-2xl px-5 py-6 mt-1 mb-4"
          style={{
            background: "#FDE1D3",
            boxShadow: "0 4px 32px #e8d5b645",
            borderRadius: "28px",
          }}
        >
          {/* Spiral/wave effect (top border) */}
          <div className="absolute left-0 right-0 -top-4 flex justify-between px-6 z-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: "#ede0c7",
                  border: "1.5px solid #e8dbc7",
                }}
              ></div>
            ))}
          </div>
          {/* Journal input on notepad */}
          <Textarea
            placeholder="There was darkness everywhere..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="min-h-[110px] resize-none bg-transparent border-0 focus:ring-0 text-[1.03rem] font-medium placeholder:font-medium placeholder:text-gray-400 text-[#564742] px-0"
            style={{
              color: "#564742",
              fontWeight: 500,
              background: "transparent",
              boxShadow: "none",
            }}
          />
        </div>

        {/* Hashtag section */}
        <div className="mb-1">
          <div className="text-[14px] font-medium mb-2 text-gray-700">Hashtag</div>
          <div className="flex gap-2 flex-wrap">
            {hashtags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                className={`flex items-center px-3 py-1 rounded-lg border transition-colors text-xs font-medium
                  ${
                    selectedTags.includes(tag.value)
                      ? "bg-[#E5DEFF] border-[#dad3f6] text-[#4d3bb5]"
                      : "bg-[#F1F0FB] border-[#eceaf6] text-gray-700"
                  }
                `}
                style={{
                  boxShadow: "none",
                }}
                onClick={() => toggleTag(tag.value)}
              >
                <Hash className="w-3.5 h-3.5 mr-1.5 text-[inherit]" />
                {tag.label}
              </button>
            ))}
            {/* New tag input */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddTag(); }}
                placeholder="+ New tag"
                className="px-2 py-1 rounded-lg border border-[#f1f0fb] bg-[#f6f4fb] text-xs w-20 focus:outline-none"
                style={{ minWidth: 70, boxShadow: "none" }}
              />
              <button
                onClick={handleAddTag}
                type="button"
                className="ml-1 text-gray-400"
                tabIndex={-1}
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {/* Feeling selector */}
        <div>
          <div className="text-[14px] font-medium mb-2 text-gray-700">Feeling</div>
          <div className="flex gap-3 items-center pb-1">
            {emojiFeelings.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`rounded-full p-0.5 transition-all
                  ${selectedFeeling === f.value ? "scale-110 bg-[#eee5de] shadow border border-[#c7baa9]" : "bg-transparent"}
                `}
                onClick={() => setSelectedFeeling(f.value)}
                aria-label={f.value}
                style={{ outline: "none" }}
              >
                <span className="text-3xl leading-none block">{f.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save button & encouragement */}
        {encouragement ? (
          <div className="px-2 py-3 text-center transition-all">
            <div className="font-semibold text-[18px] text-[#8A6940] pb-2">✔️ Saved!</div>
            <div className="text-sm text-skyhug-600">Your journal entry was added.</div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleSave}
            className="w-full bg-[#7C6046] hover:bg-[#66452d] text-white py-2 mt-1 rounded-2xl font-semibold text-lg tracking-wide shadow"
            disabled={!journalEntry.trim()}
            style={{
              borderRadius: "18px",
              background: "#7C6046",
              color: "#fff",
              boxShadow: "0 2px 8px #e3d5c5c0"
            }}
          >
            Save
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FloatingJournalButton;

