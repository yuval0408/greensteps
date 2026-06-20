import React, { useState } from "react";
import { UserStats, TrackQuestion } from "../types";
import { TRACKING_QUESTIONS } from "../data";
import { 
  Compass, 
  Car, 
  Utensils, 
  Lightbulb, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Trees, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";

interface TrackingProps {
  stats: UserStats;
  onRecordActivity: (impact: {
    co2Saved: number;
    waterSaved: number;
    costSaved: number;
    xpGained: number;
  }) => void;
  onBackToHome: () => void;
}

type TrackCategory = "transport" | "food" | "energy" | "shopping";

export default function Tracking({ stats, onRecordActivity, onBackToHome }: TrackingProps) {
  const [selectedCategory, setSelectedCategory] = useState<TrackCategory | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Category Configuration
  const categories: { id: TrackCategory; label: string; icon: string; bg: string; text: string; desc: string }[] = [
    { 
      id: "transport", 
      label: "Transportation", 
      icon: "🚗", 
      bg: "bg-[#E3F2FD]", 
      text: "text-[#1565C0]",
      desc: "Log daily walk, cycle, bus or car trips"
    },
    { 
      id: "food", 
      label: "Food Habits", 
      icon: "🍔", 
      bg: "bg-[#E8F5E9]", 
      text: "text-[#2E7D32]",
      desc: "Log plant-based meals structure"
    },
    { 
      id: "energy", 
      label: "Household Energy", 
      icon: "⚡", 
      bg: "bg-[#FFF3E0]", 
      text: "text-[#E65100]",
      desc: "Log off standby devices or AC configuration" 
    },
    { 
      id: "shopping", 
      label: "Eco Shopping", 
      icon: "🛒", 
      bg: "bg-[#F3E5F5]", 
      text: "text-[#7B1FA2]",
      desc: "Log reusable tote bags or organic buying"
    }
  ];

  const handleSelectOption = (index: number) => {
    setSelectedOptionIndex(index);
  };

  const handleNext = () => {
    if (selectedCategory && selectedOptionIndex !== null) {
      const option = TRACKING_QUESTIONS[selectedCategory].options[selectedOptionIndex];
      
      // Calculate gains
      const finalImpact = {
        co2Saved: option.co2Saved,
        waterSaved: option.waterSaved,
        costSaved: option.costSaved,
        xpGained: option.xp,
      };

      // Show temporary beautiful celebration UI screen 
      setShowCelebration(true);
    }
  };

  const handleFinishCelebration = () => {
    if (selectedCategory && selectedOptionIndex !== null) {
      const option = TRACKING_QUESTIONS[selectedCategory].options[selectedOptionIndex];
      onRecordActivity({
        co2Saved: option.co2Saved,
        waterSaved: option.waterSaved,
        costSaved: option.costSaved,
        xpGained: option.xp,
      });

      // Clear state
      setShowCelebration(false);
      setSelectedCategory(null);
      setSelectedOptionIndex(null);
    }
  };

  const currentQuestion: TrackQuestion | undefined = selectedCategory ? TRACKING_QUESTIONS[selectedCategory] : undefined;

  if (showCelebration && selectedCategory && selectedOptionIndex !== null) {
    const option = TRACKING_QUESTIONS[selectedCategory].options[selectedOptionIndex];
    
    return (
      <div className="space-y-6 text-center py-8 animate-fade-in">
        <div className="bg-[#E8F5E9] p-6 rounded-3xl inline-block mb-4 shadow-sm">
          <span className="text-7xl select-none animate-bounce inline-block">🎉</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#1F2937]">Fantastic Choice!</h1>
          <p className="text-lg text-[#2E7D32] font-semibold">Habit successfully logged</p>
        </div>

        {/* Celebration Explanation Card */}
        <div className="bg-white border-2 border-[#E8F5E9] rounded-3xl p-6 text-left space-y-4 max-w-sm mx-auto shadow-sm">
          <div className="flex gap-3">
            <span className="text-3xl select-none">{option.emoji}</span>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1F2937]">{option.label}</h3>
              <p className="text-base text-[#6B7280] leading-relaxed">
                {option.feedback}
              </p>
            </div>
          </div>

          <div className="border-t border-[#E8F5E9] pt-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#FFFDF8] rounded-2xl p-2 border border-[#E8F5E9]">
              <span className="text-xs font-bold text-[#6B7280] block">XP Earned</span>
              <span className="text-xl font-extrabold text-[#2E7D32]">+{option.xp} XP</span>
            </div>
            {option.co2Saved > 0 && (
              <div className="bg-[#FFFDF8] rounded-2xl p-2 border border-[#E8F5E9]">
                <span className="text-xs font-bold text-[#6B7280] block">Positive Impact</span>
                <span className="text-xl font-extrabold text-[#2E7D32]">+{option.co2Saved} Green Score</span>
              </div>
            )}
            {option.waterSaved > 0 && (
              <div className="bg-[#FFFDF8] rounded-2xl p-2 border border-[#E8F5E9] col-span-2">
                <span className="text-xs font-bold text-[#6B7280] block">Water Saved</span>
                <span className="text-xl font-extrabold text-[#1976D2]">+{option.waterSaved} Liters</span>
              </div>
            )}
          </div>
        </div>

        <button
          id="btn-celebration-done"
          onClick={handleFinishCelebration}
          className="w-full max-w-sm bg-[#2E7D32] hover:bg-[#25632a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-lg mx-auto"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Category Picker (Screen 4) */}
      {!selectedCategory ? (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-[#1F2937]">Track Daily Actions</h1>
            <p className="text-base text-[#6B7280]">
              Which warm micro-habit describes an choice you took today? Swipe or click a category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                id={`btn-category-${category.id}`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedOptionIndex(0); // auto select first option for ease
                }}
                className="bg-white border-2 border-[#E8F5E9] p-5 rounded-3xl flex items-center gap-4 text-left transition-all hover:scale-[1.02] hover:border-[#2E7D32]/20 active:scale-98 cursor-pointer shadow-[0px_4px_20px_rgba(0,0,0,0.01)]"
              >
                <div className={`w-14 h-14 rounded-2xl ${category.bg} ${category.text} flex items-center justify-center text-3xl select-none shrink-0`}>
                  {category.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-extrabold text-[#1F2937] flex items-center justify-between">
                    <span>{category.label}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-snug">
                    {category.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Environmental Affirmation Box */}
          <div className="bg-[#FFFDF8] rounded-3xl p-5 border border-[#E8F5E9] flex items-start gap-4">
            <span className="text-3xl select-none pt-0.5">💡</span>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#1F2937]">Did you know?</h4>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                If everyone simply turned off their home appliances and device chargers from standby mode daily, we would save enough energy to nurture millions of lush new trees. Every small step matters!
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Question screen (Screen 5 & Screen 6) */
        <div className="space-y-6">
          <div className="flex justify-between items-center select-none">
            <button
              id="btn-back-to-categories"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedOptionIndex(null);
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-[#6B7280] bg-white border border-[#E8F5E9] px-3 py-1.5 rounded-full hover:bg-neutral-50 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Categories
            </button>
            <div className="text-sm font-bold text-[#2E7D32]">
              Track Habit 🌱
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-extrabold uppercase tracking-wider text-[#2E7D32]">
              {selectedCategory === "transport" ? "🚗 Transportation" : ""}
              {selectedCategory === "food" ? "🥗 Food Selection" : ""}
              {selectedCategory === "energy" ? "⚡ Power Utility" : ""}
              {selectedCategory === "shopping" ? "🛍️ Local Shopping" : ""}
            </span>
            <h1 className="text-3xl font-extrabold text-[#1F2937]">
              {currentQuestion?.question}
            </h1>
            <p className="text-base text-[#6B7280]">
              Choose the one that best reflects your schedule. Select to estimate immediate impact.
            </p>
          </div>

          {/* Option Cards */}
          <div role="radiogroup" aria-label="Question options" className="grid grid-cols-1 gap-3">
            {currentQuestion?.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              return (
                <button
                  key={idx}
                  id={`btn-option-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  aria-checked={isSelected}
                  role="radio"
                  className={`border-2 rounded-3xl p-5 text-left transition-all relative flex gap-4 ${
                    isSelected
                      ? "border-[#2E7D32] bg-[#E8F5E9]/30 text-[#1F2937] shadow-sm transform scale-[1.01]"
                      : "border-[#E8F5E9] bg-white text-[#1F2937] hover:bg-neutral-50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-2xl select-none ${
                    isSelected ? "bg-[#2E7D32] text-white" : "bg-[#FFFDF8] border border-[#E8F5E9]"
                  }`}>
                    {option.emoji}
                  </div>
                  <div className="flex-1 space-y-1 pr-6">
                    <h3 className="text-lg font-extrabold text-[#1F2937] flex items-center gap-2">
                      {option.label}
                      {isSelected && <Sparkles className="w-4 h-4 text-[#2E7D32]" />}
                    </h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {option.description}
                    </p>
                    <div className="flex gap-2 pt-1 font-bold text-xs select-none">
                      <span className="text-[#2E7D32]">+{option.xp} XP</span>
                      {option.co2Saved > 0 && <span className="text-[#6B7280]">· +{option.co2Saved} Green Score</span>}
                      {option.waterSaved > 0 && <span className="text-[#1976D2]">· Saves {option.waterSaved}L Water</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <button
            id="btn-submit-track"
            onClick={handleNext}
            className="w-full bg-[#2E7D32] hover:bg-[#25632a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-lg"
          >
            <span>Log Action</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
