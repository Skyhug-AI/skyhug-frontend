import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronLeft, Calendar, Clock, X } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useTherapist } from "@/context/TherapistContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface TherapistCardProps {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  avatarSrc: string;
  bgColor: string;
  onClick: () => void;
  isSelected: boolean;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  id,
  name,
  description,
  specialties,
  avatarSrc,
  bgColor,
  onClick,
  isSelected,
}) => {
  return (
    <Card
      className={`overflow-hidden flex flex-col items-center p-6 h-[280px] w-[220px] rounded-2xl bg-white hover:scale-[1.03] hover:shadow-lg transition-all duration-300 cursor-pointer relative group ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`${bgColor} w-32 h-32 rounded-full flex items-center justify-center mb-4`}
      >
        <Avatar className="w-28 h-28 border-4 border-white">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </div>

      <CardContent className="text-center p-0 w-full">
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-3">{description}</p>

        <div className="flex flex-wrap justify-center gap-1 mt-2">
          {specialties.map((specialty, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`${bgColor} bg-opacity-15 text-xs`}
            >
              {specialty}
            </Badge>
          ))}
        </div>

        <button className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-gray-400 hover:text-pink-500" />
        </button>
      </CardContent>
    </Card>
  );
};

const TherapistSelectionPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { conversationId, setCurrentTherapist } = useTherapist();

  // Filter states
  const [identityFilter, setIdentityFilter] = useState<string>("");
  const [topicsFilter, setTopicsFilter] = useState<string>("");
  const [styleFilter, setStyleFilter] = useState<string>("");

  // Selected therapist states
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(
    null
  );
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const [therapists, setTherapists] = useState<TherapistCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const selectedTherapist = therapists.find(
    (t) => t.id === selectedTherapistId
  );

  useEffect(() => {
    setLoading(true);

    let query = supabase.from("therapists").select("*");

    // apply identity filter if set
    if (identityFilter) {
      query = query.eq("identity->>gender", identityFilter);
    }

    // apply topics filter
    if (topicsFilter) {
      query = query.contains("specialties", [topicsFilter]);
    }

    // apply style filter
    if (styleFilter) {
      query = query.contains("styles", [styleFilter]);
    }

    query
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching therapists:", error);
          toast({ title: "Error loading therapists", variant: "destructive" });
        } else {
          setTherapists(data || []);
        }
      })
      .finally(() => setLoading(false));
  }, [identityFilter, topicsFilter, styleFilter]);

  const handleTherapistSelect = (therapistId: string) => {
    // Set the selected therapist
    setSelectedTherapistId(therapistId);
    // Open the sidebar
    setShowSidebar(true);
  };

  const handleConfirmTherapist = async () => {
    if (!selectedTherapistId) return;

    if (!user) {
      toast({ title: "You must be logged in", variant: "destructive" });
      return;
    }
    // if (!conversationId) {
    //   toast({ title: "No active session found", variant: "destructive" });
    //   return;
    // }

    // // 1) Link the therapist to that conversation row
    // const { error } = await supabase
    //   .from("conversations")
    //   .update({ therapist_id: selectedTherapistId })
    //   .eq("id", conversationId);

    // if (error) {
    //   console.error("Error setting therapist:", error);
    //   toast({ title: "Could not start session", variant: "destructive" });
    //   return;
    // }

    // Set the therapist in context
    setCurrentTherapist(selectedTherapistId);

    toast({
      title: "Therapist selected",
      description: `Starting session with ${selectedTherapist?.name}`,
    });

    // Navigate to session page where conversation will be created
    navigate("/session");
  };

  const handleMatchClick = () => {
    // In a real app, this would use an algorithm to match based on preferences
    const randomIndex = Math.floor(Math.random() * therapists.length);
    const randomTherapist = therapists[randomIndex];
    toast({
      title: "We found a match for you!",
      description: `${randomTherapist.name} might be a good fit based on your needs`,
    });

    // Set the selected therapist
    setSelectedTherapistId(randomTherapist.id);
    setShowSidebar(true);
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading therapists…
      </div>
    );
  }

  if (!loading && therapists.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No therapists match your filters.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        <div className="max-w-5xl w-full text-center mb-0 animate-fade-in">
          {/* Title section with back button on the same level */}
          <div className="flex items-center justify-center mb-2 relative">
            <Button
              variant="ghost"
              className="absolute left-0 flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleBackClick}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
              Select a Therapist
            </h1>
          </div>

          <p className="text-md sm:text-xl text-gray-500 mb-4">
            Choose an AI therapist to talk to
          </p>

          {/* Match button - centered above filters */}
          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={handleMatchClick}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-400 text-xs">
                ?
              </div>
              Let us match you
            </Button>
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Select value={identityFilter} onValueChange={setIdentityFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Identity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="nonbinary">Non-binary</SelectItem>
                <SelectItem value="lgbtq">LGBTQ+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={topicsFilter} onValueChange={setTopicsFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anxiety">Anxiety</SelectItem>
                <SelectItem value="depression">Depression</SelectItem>
                <SelectItem value="relationships">Relationships</SelectItem>
                <SelectItem value="stress">Stress Management</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="grief">Grief</SelectItem>
                <SelectItem value="trauma">Trauma</SelectItem>
              </SelectContent>
            </Select>

            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Therapy Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supportive">Supportive</SelectItem>
                <SelectItem value="motivational">Motivational</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="reflective">Reflective</SelectItem>
                <SelectItem value="goal-oriented">Goal-oriented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl justify-items-center">
          {therapists.map((therapist, index) => (
            <div
              key={therapist.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <TherapistCard
                id={therapist.id}
                name={therapist.name}
                description={therapist.description}
                specialties={therapist.specialties}
                avatarSrc={therapist.avatarSrc}
                bgColor={therapist.bgColor}
                onClick={() => handleTherapistSelect(therapist.id)}
                isSelected={selectedTherapistId === therapist.id}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Therapist Details Sidebar - Made wider */}
      <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
        <SheetContent className="w-[500px] sm:max-w-lg overflow-y-auto">
          {selectedTherapist && (
            <div className="h-full flex flex-col">
              <SheetHeader className="text-left">
                <div className="flex items-start gap-4">
                  <div
                    className={`${selectedTherapist.bgColor} w-20 h-20 rounded-full flex items-center justify-center shrink-0`}
                  >
                    <Avatar className="w-16 h-16 border-4 border-white">
                      <AvatarImage
                        src={selectedTherapist.avatarSrc}
                        alt={selectedTherapist.name}
                      />
                      <AvatarFallback>
                        {selectedTherapist.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <SheetTitle className="text-2xl mb-1">
                      {selectedTherapist.name}
                    </SheetTitle>
                    <SheetDescription className="text-base">
                      {selectedTherapist.description}
                    </SheetDescription>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTherapist.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="outline"
                          className={`${selectedTherapist.bgColor} bg-opacity-15 text-xs`}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 mt-6 flex-grow overflow-auto pr-2">
                <div>
                  <h3 className="font-medium text-lg mb-2">About me</h3>
                  <p className="text-gray-700">{selectedTherapist.bio}</p>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">My Approach</h3>
                  <p className="text-gray-700">{selectedTherapist.approach}</p>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">
                    Session Structure
                  </h3>
                  <p className="text-gray-700">
                    {selectedTherapist.session_structure}
                  </p>
                </div>
              </div>

              {/* Start Session Button - Fixed at bottom */}
              <div className="mt-6 pt-4 border-t sticky bottom-0 bg-background">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleConfirmTherapist}
                  size="lg"
                >
                  <Calendar className="h-5 w-5" />
                  Start Session with {selectedTherapist.name}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TherapistSelectionPage;
