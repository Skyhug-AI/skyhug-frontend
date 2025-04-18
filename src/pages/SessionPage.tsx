import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import SessionIntro from "@/components/session/SessionIntro";
import SessionRoom from "@/components/session/SessionRoom";
import Header from "@/components/Header";

const SessionPage = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const { clearMessages } = useTherapist();
  const navigate = useNavigate();

  useEffect(() => {
    clearMessages();
  }, []);

  const handleStartSession = () => {
    setIsSessionStarted(true);
  };

  return (
    <div>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-sky-50">
        {!isSessionStarted ? (
          <SessionIntro onStartSession={handleStartSession} />
        ) : (
          <SessionRoom />
        )}
      </div>
    </div>
  );
};

export default SessionPage;
