import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChatMessage, UserStats } from "../types";
import { Sparkles, Send, Bot, User, ArrowRight, HelpCircle, RefreshCw, Droplet, Zap, Flame, TrendingUp } from "lucide-react";

interface CoachProps {
  stats: UserStats;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearHistory?: () => void;
  isAiLoading?: boolean;
}

// Simple markdown-like renderer for Sprout's messages
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, idx) => {
    let processed: React.ReactNode = line;
    
    // Bold: **text**
    if (line.includes("**")) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      processed = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="font-extrabold">{part}</strong> : part
      );
    }
    
    // List items: - text or * text
    if (/^\s*[-*]\s/.test(line)) {
      const content = line.replace(/^\s*[-*]\s/, "");
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-1">
          <span className="text-[#2E7D32] mt-0.5 shrink-0">•</span>
          <span>{content}</span>
        </div>
      );
      return;
    }
    
    // Empty line → spacing
    if (line.trim() === "") {
      elements.push(<div key={idx} className="h-2" />);
      return;
    }
    
    elements.push(<p key={idx} className="leading-relaxed">{processed}</p>);
  });
  
  return elements;
}

export default function Coach({ stats, messages, onSendMessage, onClearHistory, isAiLoading = false }: CoachProps) {
  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Dynamic contextual suggestions based on user stats
  const dynamicSuggestions = useMemo(() => {
    const suggestions = [];
    
    // Always include a general tip
    suggestions.push({ text: "Give me today's green tip!", emoji: "🌿", label: "Daily Tip" });

    // Contextual suggestions based on stats
    if (stats.waterSaved < 30) {
      suggestions.push({ text: "How can I save more water at home?", emoji: "💧", label: "Water Focus" });
    }
    if (stats.co2Saved < 5) {
      suggestions.push({ text: "What transport choices reduce CO₂ the most?", emoji: "🚲", label: "Low Carbon" });
    }
    if (stats.streak >= 5) {
      suggestions.push({ text: "I've kept my streak going! What's my next milestone?", emoji: "🔥", label: "Streak Chat" });
    }
    if (stats.completedActivityCount < 5) {
      suggestions.push({ text: "What are easy eco-friendly habits for beginners?", emoji: "🌱", label: "Get Started" });
    }
    if (stats.level >= 3) {
      suggestions.push({ text: "I'm Level " + stats.level + "! What advanced habits should I try?", emoji: "⭐", label: "Level Up" });
    }
    
    // Ensure we always have at least 4
    const fallbacks = [
      { text: "How can my family reduce food waste?", emoji: "🍲", label: "Food Waste" },
      { text: "How can I cut my household electric bills?", emoji: "💡", label: "Energy Tips" },
      { text: "Why does eating organic veggies help the planet?", emoji: "🥦", label: "Organic Food" },
      { text: "Tell me about my progress so far!", emoji: "📊", label: "My Progress" },
    ];
    
    while (suggestions.length < 4) {
      const fallback = fallbacks[suggestions.length - 1];
      if (fallback && !suggestions.find(s => s.text === fallback.text)) {
        suggestions.push(fallback);
      } else {
        break;
      }
    }
    
    return suggestions.slice(0, 4);
  }, [stats.waterSaved, stats.co2Saved, stats.streak, stats.completedActivityCount, stats.level]);

  // Auto scroll to message feed bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSuggestionClick = (suggestionText: string) => {
    if (isAiLoading) return;
    onSendMessage(suggestionText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] max-w-lg mx-auto font-sans relative">
      {/* Bot Profile Header Banner */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white p-4 rounded-3xl flex items-center justify-between shadow-sm shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl select-none shadow-inner border-2 border-emerald-100">
            🌳
          </div>
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-1.5 leading-tight">
              Sprout <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">AI Guide</span>
            </h2>
            <p className="text-xs text-emerald-100 font-medium">
              Personalized to your habits & goals
            </p>
          </div>
        </div>

        {onClearHistory && messages.length > 1 && (
          <button
            id="btn-clear-chat"
            onClick={onClearHistory}
            title="Reset Conversation"
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
          >
            <RefreshCw className="w-4 h-4 text-emerald-50 text-white" />
          </button>
        )}
      </div>

      {/* Quick Stats Context Banner (only when chat has messages) */}
      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1 shrink-0">
          <div className="bg-[#E8F5E9]/50 border border-[#E8F5E9] rounded-2xl px-3 py-2 flex items-center gap-1.5 shrink-0">
            <Flame className="w-3.5 h-3.5 text-[#EF6C00]" />
            <span className="text-[11px] font-extrabold text-[#1F2937]">{stats.streak}d Streak</span>
          </div>
          <div className="bg-[#E8F5E9]/50 border border-[#E8F5E9] rounded-2xl px-3 py-2 flex items-center gap-1.5 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span className="text-[11px] font-extrabold text-[#1F2937]">Lvl {stats.level}</span>
          </div>
          <div className="bg-[#E8F5E9]/50 border border-[#E8F5E9] rounded-2xl px-3 py-2 flex items-center gap-1.5 shrink-0">
            <Zap className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span className="text-[11px] font-extrabold text-[#1F2937]">{stats.co2Saved.toFixed(1)} GP</span>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl px-3 py-2 flex items-center gap-1.5 shrink-0">
            <Droplet className="w-3.5 h-3.5 text-[#1976D2]" />
            <span className="text-[11px] font-extrabold text-[#1F2937]">{stats.waterSaved}L</span>
          </div>
        </div>
      )}

      {/* Message Chat Feed Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 hide-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-6 max-w-sm mx-auto">
            <span className="text-6xl inline-block animate-bounce">🌱</span>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#1F2937]">Hello, {stats.name}!</h3>
              <p className="text-base text-[#6B7280] leading-relaxed">
                I am Sprout, your personal green habit companion. I know your stats and goals — ask me anything about saving energy, water, reducing waste, or building healthy habits!
              </p>
            </div>
            
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block ml-1">Suggested for you:</span>
              <div className="grid grid-cols-1 gap-2">
                {dynamicSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    id={`btn-suggestion-${idx}`}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="bg-white border-2 border-[#E8F5E9] hover:border-[#2E7D32]/30 px-4 py-3 rounded-2xl text-left text-sm font-bold text-[#1F2937] flex items-center gap-3 transition-all hover:scale-[1.01] active:scale-98"
                  >
                    <span className="text-xl shrink-0 select-none">{suggestion.emoji}</span>
                    <div className="flex-1">
                      <span className="block">{suggestion.text}</span>
                      <span className="text-[10px] text-[#2E7D32] font-extrabold uppercase">{suggestion.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isBot = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] ${isBot ? "self-start text-left" : "ml-auto flex-row-reverse text-right"}`}
            >
              {/* Avatar circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center select-none text-base shrink-0 border shadow-sm ${
                isBot ? "bg-[#E8F5E9] border-[#2E7D32]/20" : "bg-[#FFEAE6] border-[#EF6C00]/20"
              }`}>
                {isBot ? "🌳" : "🙋"}
              </div>

              {/* Chat Bubble card */}
              <div className={`rounded-3xl p-4 text-base leading-relaxed ${
                isBot 
                  ? "bg-white border border-[#E8F5E9] text-[#1F2937] shadow-[0px_2px_8px_rgba(0,0,0,0.01)]" 
                  : "bg-[#2E7D32] text-white font-medium"
              }`}>
                {/* Render bot messages with markdown formatting, user messages as-is */}
                <div className={isBot ? "space-y-1" : "whitespace-pre-wrap"}>
                  {isBot ? renderMarkdown(msg.content) : msg.content}
                </div>
                <span className={`block text-[10px] mt-2 ${isBot ? "text-gray-400" : "text-emerald-100"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isAiLoading && (
          <div className="flex gap-3 max-w-[85%] self-start text-left">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] border border-[#2E7D32]/20 flex items-center justify-center text-sm select-none shrink-0 animate-pulse">
              🌳
            </div>
            <div className="bg-white border border-[#E8F5E9] rounded-3xl p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.01)] flex items-center gap-2">
              <span className="text-sm font-semibold text-[#2E7D32]">Sprout is thinking</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#2E7D32] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-[#2E7D32] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-[#2E7D32] rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestion chips (when conversation is active) */}
      {messages.length > 0 && messages.length < 10 && !isAiLoading && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
          {dynamicSuggestions.slice(0, 3).map((s, idx) => (
            <button
              key={idx}
              id={`btn-quick-chip-${idx}`}
              onClick={() => handleSuggestionClick(s.text)}
              className="bg-[#E8F5E9]/50 border border-[#E8F5E9] hover:bg-[#E8F5E9] px-3 py-1.5 rounded-full text-xs font-bold text-[#2E7D32] whitespace-nowrap transition-all shrink-0 active:scale-95"
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Send Message Input Form bottom anchor */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E8F5E9] rounded-3xl p-2 flex items-center gap-2 shrink-0 shadow-sm relative z-10">
        <input
          id="coach-input-text"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Sprout about eco impact, compost, bags..."
          disabled={isAiLoading}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none px-4 text-base placeholder-[#9CA3AF] disabled:opacity-50 text-[#1F2937]"
          style={{ fontSize: "16px" }}
        />
        <button
          id="btn-send-message"
          type="submit"
          disabled={!inputText.trim() || isAiLoading}
          className="bg-[#2E7D32] text-white p-3.5 rounded-2xl hover:bg-[#25632a] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all cursor-pointer"
        >
          <Send className="w-5 h-5 fill-current" />
        </button>
      </form>
    </div>
  );
}
