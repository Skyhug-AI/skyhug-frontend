
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionRoom from "@/components/session/SessionRoom";
import BackgroundEffects from "@/components/chat/BackgroundEffects";
import { Smile } from "lucide-react";

const SessionPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundEffects />
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center relative px-2 md:px-0">
        <div className="w-full flex flex-col items-center justify-center flex-grow">
          {/* Session container: Glassy, rounded, floating */}
          <div
            className="
              relative glass-panel
              max-w-3xl w-full mx-auto mt-10 mb-10 p-0
              bg-white/60 border border-white/40
              rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.03)]
              flex flex-col min-h-[600px] min-w-0
              overflow-hidden
              "
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
            }}
          >
            {/* Decorative floating "sky cloud" mascot (bottom right) */}
            <div className="absolute bottom-4 right-4 z-30 select-none pointer-events-none flex flex-col items-center">
              <span
                className="block bg-cloud-100 rounded-full shadow-md"
                style={{
                  width: "62px",
                  height: "40px",
                  filter: "blur(0.7px)",
                  opacity: 0.94,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Smile
                  className="text-skyhug-400 drop-shadow"
                  size={34}
                  style={{ position: "absolute", left: "14px", top: "6px" }}
                />
              </span>
              <span className="text-xs text-gray-400 mt-[-6px]">sky cloud</span>
            </div>

            <div className="bg-serenity-50 py-6 px-4 md:px-8 border-b border-border">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-center">
                  Therapy Session
                </h1>
                <p className="text-center text-muted-foreground mt-2">
                  Your dedicated time for personal growth and reflection.
                </p>
              </div>
            </div>

            <div className="flex-grow flex flex-col bg-gradient-to-b from-white to-serenity-50 relative">
              <SessionRoom />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SessionPage;
