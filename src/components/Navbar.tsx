import React from "react";
import { Home, Compass, Trophy, MessageSquare, User, Users, LucideIcon } from "lucide-react";

type ScreenType = "home" | "track" | "challenges" | "coach" | "profile" | "family";

interface NavbarProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  unreadCoachMessage?: boolean;
}

interface NavItem {
  type: ScreenType;
  label: string;
  icon: LucideIcon;
}

export default function Navbar({ currentScreen, setScreen, unreadCoachMessage = false }: NavbarProps) {
  const items: NavItem[] = [
    { type: "home", label: "Home", icon: Home },
    { type: "track", label: "Track", icon: Compass },
    { type: "challenges", label: "Tasks", icon: Trophy },
    { type: "family", label: "Family", icon: Users },
    { type: "coach", label: "Coach", icon: MessageSquare },
    { type: "profile", label: "Me", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8F5E9] shadow-[0px_-8px_24px_rgba(46,125,50,0.03)] pb-safe h-[86px] flex items-center justify-around px-1 max-w-lg mx-auto">
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
            {/* Soft circle behind active link */}
            <div
              className={`absolute inset-0 m-auto w-11 h-11 rounded-full -z-10 transition-all duration-300 ${
                isActive
                  ? "bg-[#E8F5E9] scale-110 opacity-100"
                  : "bg-transparent scale-50 opacity-0 group-hover:bg-[#E8F5E9]/30 group-hover:scale-100 group-hover:opacity-100"
              }`}
            />

            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? "text-[#2E7D32] stroke-[2.5]" : "text-[#6B7280]"
                }`}
              />
              {item.type === "coach" && unreadCoachMessage && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>

            <span
              className={`text-[10px] font-bold mt-0.5 transition-all duration-200 ${
                isActive ? "text-[#1F2937] scale-105" : "text-[#6B7280]"
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
