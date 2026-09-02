import React from "react";
import { Home, Compass, Trophy, MessageSquare, User, Users, Globe } from "lucide-react";

export default function Navbar({ currentScreen, setScreen, unreadCoachMessage = false }) {
  const items = [
    { type: "home", label: "Home", icon: Home },
    { type: "track", label: "Track", icon: Compass },
    { type: "challenges", label: "Tasks", icon: Trophy },
    { type: "leaderboard", label: "India 🇮🇳", icon: Globe },
    { type: "family", label: "Family", icon: Users },
    { type: "coach", label: "Coach", icon: MessageSquare },
    { type: "profile", label: "Me", icon: User },
  ];

  return (
    <nav aria-label="Main navigation" className="eco-nav fixed bottom-0 left-0 right-0 z-50 bg-[#ffffff]/98 backdrop-blur-md border-t border-[#85a528]/25 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-safe h-[82px] flex items-center justify-around px-1 max-w-lg mx-auto">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.type;

        return (
          <button
            key={item.type}
            id={`nav-${item.type}`}
            onClick={() => setScreen(item.type)}
            className="flex-1 flex flex-col items-center justify-center p-1 relative transition-colors group cursor-pointer"
          >
            {/* Soft background pill behind active link */}
            <div
              className={`absolute inset-0 m-auto w-10 h-10 rounded-lg -z-10 transition-all duration-300 ${
                isActive
                  ? "bg-[#85a528]/15 scale-110 opacity-100 border border-[#85a528]/30"
                  : "bg-transparent scale-50 opacity-0 group-hover:bg-[#85a528]/10 group-hover:scale-100 group-hover:opacity-100"
              }`}
            />

            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? "text-[#85a528] stroke-[2.5]" : "text-[#6b7280]"
                }`}
              />
              {item.type === "coach" && unreadCoachMessage && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
              )}
            </div>

            <span
              className={`text-[11px] font-bold mt-1 transition-all duration-200 ${
                isActive ? "text-[#85a528]" : "text-[#6b7280]"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
