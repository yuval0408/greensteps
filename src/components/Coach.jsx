import React, { useState, useRef, useEffect, useMemo } from "react";
import { RefreshCw, Droplet, Zap, Flame, TrendingUp, Send } from "lucide-react";

// Simple markdown-like renderer for Sprout's messages
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  
  lines.forEach((line, idx) => {
    let processed = line;
    
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
          <span className="text-[#85a528] mt-0.5 shrink-0">•</span>
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

export default function Coach({ stats, messages, onSendMessage, onClearHistory, isAiLoading = false }) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isAiLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSuggestionClick = (suggestionText) => {
    if (isAiLoading) return;
    onSendMessage(suggestionText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] max-w-lg mx-auto font-sans relative">
      {/* Bot Profile Header Banner */}
      <div className="bg-[#ffffff] border border-[#85a528]/30 text-[#1F2937] p-4 rounded-xl flex items-center justify-between shadow-sm shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F1F8E9] border border-[#85a528]/30 rounded-lg flex items-center justify-center text-2xl select-none shrink-0">
            🌳
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-1.5 leading-tight text-[#1F2937]">
              Sprout <span className="bg-[#E8F5E9] text-[#85a528] border border-[#85a528]/30 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">AI GUIDE</span>
            </h2>
            <p className="text-xs text-[#556B2F]">
              Personalized to your habits & goals
            </p>
          </div>
        </div>

        {onClearHistory && messages.length > 1 && (
          <button
            id="btn-clear-chat"
            onClick={onClearHistory}
            title="Reset Conversation"
            className="p-2 hover:bg-[#F1F8E9] rounded-md transition-colors active:scale-90 text-[#85a528]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Stats Context Banner */}
      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1 shrink-0">
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shrink-0 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#85a528]" />
            <span className="text-[11px] font-bold text-[#1F2937]">{stats.streak}d Streak</span>
          </div>
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shrink-0 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-[#85a528]" />
            <span className="text-[11px] font-bold text-[#1F2937]">Lvl {stats.level}</span>
          </div>
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shrink-0 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#85a528]" />
            <span className="text-[11px] font-bold text-[#1F2937]">{stats.co2Saved.toFixed(1)} GP</span>
          </div>
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shrink-0 shadow-sm">
            <Droplet className="w-3.5 h-3.5 text-[#85a528]" />
            <span className="text-[11px] font-bold text-[#1F2937]">{stats.waterSaved}L</span>
          </div>
        </div>
      )}

      {/* Message Chat Feed Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 hide-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-6 max-w-sm mx-auto">
            <span className="text-5xl inline-block animate-bounce">🌱</span>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#85a528]">Hello, {stats.name}!</h3>
              <p className="text-xs text-[#556B2F] leading-relaxed">
                I am Sprout, your personal green habit companion. I know your stats and goals — ask me anything about saving energy, water, reducing waste, or building healthy habits!
              </p>
            </div>
            
            <div className="space-y-2 text-left">
              <span className="text-[11px] font-bold text-[#85a528] uppercase tracking-wider block ml-1">Suggested for you:</span>
              <div className="grid grid-cols-1 gap-2">
                {dynamicSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    id={`btn-suggestion-${idx}`}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="bg-[#ffffff] border border-[#85a528]/30 hover:border-[#85a528] px-4 py-3 rounded-lg text-left text-xs font-bold text-[#1F2937] flex items-center gap-3 transition-all active:scale-98 shadow-sm"
                  >
                    <span className="text-lg shrink-0 select-none">{suggestion.emoji}</span>
                    <div className="flex-1">
                      <span className="block">{suggestion.text}</span>
                      <span className="text-[10px] text-[#85a528] uppercase">{suggestion.label}</span>
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
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center select-none text-sm shrink-0 border ${
                isBot ? "bg-[#F1F8E9] border-[#85a528]/30" : "bg-[#E8F5E9] border-[#85a528]/30"
              }`}>
                {isBot ? "🌳" : "🙋"}
              </div>

              {/* Chat Bubble card */}
              <div className={`rounded-xl p-3.5 text-xs leading-relaxed ${
                isBot 
                  ? "bg-[#ffffff] border border-[#85a528]/30 text-[#1F2937] shadow-sm" 
                  : "bg-[#85a528] text-white font-bold shadow-sm"
              }`}>
                <div className={isBot ? "space-y-1" : "whitespace-pre-wrap"}>
                  {isBot ? renderMarkdown(msg.content) : msg.content}
                </div>
                <span className={`block text-[10px] mt-2 ${isBot ? "text-[#6B7280]" : "text-white/80"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isAiLoading && (
          <div className="flex gap-3 max-w-[85%] self-start text-left">
            <div className="w-8 h-8 rounded-lg bg-[#F1F8E9] border border-[#85a528]/30 flex items-center justify-center text-sm select-none shrink-0 animate-pulse">
              🌳
            </div>
            <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-3.5 shadow-sm flex items-center gap-2">
              <span className="text-xs font-bold text-[#85a528]">Sprout is thinking</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#85a528] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[#85a528] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#85a528] rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestion chips */}
      {messages.length > 0 && messages.length < 10 && !isAiLoading && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
          {dynamicSuggestions.slice(0, 3).map((s, idx) => (
            <button
              key={idx}
              id={`btn-quick-chip-${idx}`}
              onClick={() => handleSuggestionClick(s.text)}
              className="bg-[#ffffff] border border-[#85a528]/30 hover:border-[#85a528] px-3 py-1.5 rounded-md text-xs font-bold text-[#85a528] whitespace-nowrap transition-all shrink-0 active:scale-95 shadow-sm"
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Send Message Input Form */}
      <form onSubmit={handleSubmit} className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-1.5 flex items-center gap-2 shrink-0 shadow-sm relative z-10">
        <input
          id="coach-input-text"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Sprout about eco impact, energy..."
          disabled={isAiLoading}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none focus-visible:outline-none focus:bg-transparent px-3 text-xs placeholder-[#9f9fa5] disabled:opacity-50 text-[#1F2937] font-normal"
        />
        <button
          id="btn-send-message"
          type="submit"
          disabled={!inputText.trim() || isAiLoading}
          className="bg-[#85a528] text-white p-2.5 rounded-lg hover:bg-[#6f8c1f] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
}
