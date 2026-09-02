import React, { useState } from "react";
import { TRACKING_QUESTIONS } from "../data";
import { 
  ArrowRight, 
  Leaf, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";

export default function Tracking({ stats, onRecordActivity, onBackToHome }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Category Configuration
  const categories = [
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
      icon: "🥗", 
      bg: "bg-[#85a528]/15", 
      text: "text-[#85a528]",
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

  const handleSelectOption = (index) => {
    setSelectedOptionIndex(index);
  };

  const handleNext = () => {
    if (selectedCategory && selectedOptionIndex !== null) {
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

  const currentQuestion = selectedCategory ? TRACKING_QUESTIONS[selectedCategory] : undefined;

  if (showCelebration && selectedCategory && selectedOptionIndex !== null) {
    const option = TRACKING_QUESTIONS[selectedCategory].options[selectedOptionIndex];
    
    return (
      <div className="space-y-6 text-center py-8 animate-fade-in">
        <div className="bg-[#85a528]/20 p-6 rounded-2xl inline-block mb-4 border border-[#85a528]/40">
          <span className="text-7xl select-none animate-bounce inline-block">🎉</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#85a528]">Fantastic Choice!</h1>
          <p className="text-sm text-[#a6cd37] font-semibold">Habit successfully logged</p>
        </div>

        {/* Celebration Explanation Card */}
        <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-6 text-left space-y-4 max-w-sm mx-auto shadow-md">
          <div className="flex gap-3">
            <span className="text-3xl select-none">{option.emoji}</span>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#1F2937]">{option.label}</h3>
              <p className="text-xs text-[#556B2F] leading-relaxed">
                {option.feedback}
              </p>
            </div>
          </div>

          <div className="border-t border-[#85a528]/20 pt-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#F1F8E9] rounded-lg p-2 border border-[#85a528]/30">
              <span className="text-[11px] font-bold text-[#556B2F] block">XP Earned</span>
              <span className="text-lg font-bold text-[#85a528]">+{option.xp} XP</span>
            </div>
            {option.co2Saved > 0 && (
              <div className="bg-[#F1F8E9] rounded-lg p-2 border border-[#85a528]/30">
                <span className="text-[11px] font-bold text-[#556B2F] block">Positive Impact</span>
                <span className="text-lg font-bold text-[#85a528]">+{option.co2Saved} Green Score</span>
              </div>
            )}
            {option.waterSaved > 0 && (
              <div className="bg-[#F1F8E9] rounded-lg p-2 border border-[#85a528]/30 col-span-2">
                <span className="text-[11px] font-bold text-[#556B2F] block">Water Saved</span>
                <span className="text-lg font-bold text-[#85a528]">+{option.waterSaved} Liters</span>
              </div>
            )}
          </div>
        </div>

        <button
          id="btn-celebration-done"
          onClick={handleFinishCelebration}
          className="w-full max-w-sm bg-[#85a528] hover:bg-[#6f8c1f] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-xs uppercase tracking-wider mx-auto shadow-sm"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Category Picker */}
      {!selectedCategory ? (
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="eco-eyebrow">Eco Green / Tracking</span>
            <h1 className="text-2xl font-bold text-[#1F2937]">Track Daily Actions</h1>
            <p className="text-xs text-[#556B2F]">
              Which micro-habit describes a choice you took today? Select a category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                id={`btn-category-${category.id}`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedOptionIndex(0);
                }}
                className="bg-[#ffffff] border border-[#85a528]/30 p-3.5 rounded-xl flex items-center gap-3 text-left transition-all hover:border-[#85a528] hover:shadow-md active:scale-98 cursor-pointer shadow-sm overflow-hidden"
              >
                <div className="w-12 h-12 rounded-lg bg-[#F1F8E9] border border-[#85a528]/30 text-[#85a528] flex items-center justify-center text-2xl select-none shrink-0">
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="truncate font-bold text-[13px] text-[#1F2937]">
                      {category.label}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-[#85a528] shrink-0" />
                  </div>
                  <p className="text-xs text-[#6B7280] leading-snug break-words line-clamp-2">
                    {category.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Environmental Affirmation Box */}
          <div className="bg-[#ffffff] rounded-xl p-4 border border-[#85a528]/30 flex items-start gap-3 shadow-sm">
            <span className="text-2xl select-none pt-0.5">💡</span>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#85a528] uppercase tracking-wider">Did you know?</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                If everyone simply turned off their home appliances and device chargers from standby mode daily, we would save enough energy to nurture millions of lush new trees.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Question screen */
        <div className="space-y-6">
          <div className="flex justify-between items-center select-none">
            <button
              id="btn-back-to-categories"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedOptionIndex(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-[#85a528] bg-[#ffffff] border border-[#85a528]/30 px-3 py-1.5 rounded-md hover:border-[#85a528] active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="text-xs font-bold text-[#85a528] uppercase tracking-wider">
              Track Habit 🌱
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#85a528]">
              {selectedCategory === "transport" ? "🚗 Transportation" : ""}
              {selectedCategory === "food" ? "🥗 Food Selection" : ""}
              {selectedCategory === "energy" ? "⚡ Power Utility" : ""}
              {selectedCategory === "shopping" ? "🛍️ Local Shopping" : ""}
            </span>
            <h1 className="text-xl font-bold text-[#1F2937]">
              {currentQuestion?.question}
            </h1>
            <p className="text-xs text-[#556B2F]">
              Choose the option that best reflects your action today.
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
                  className={`border rounded-xl p-3.5 text-left transition-all relative flex items-start gap-3 overflow-hidden ${
                    isSelected
                      ? "border-[#85a528] bg-[#E8F5E9] text-[#1F2937] shadow-md"
                      : "border-[#85a528]/30 bg-[#ffffff] text-[#1F2937] hover:border-[#85a528] shadow-sm"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-xl select-none ${
                    isSelected ? "bg-[#85a528] text-white" : "bg-[#F1F8E9] border border-[#85a528]/30"
                  }`}>
                    {option.emoji}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2 truncate">
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Leaf className="w-3.5 h-3.5 text-[#85a528] shrink-0" />}
                    </h3>
                    <p className="text-xs text-[#6B7280] leading-relaxed break-words">
                      {option.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1 font-bold text-[11px] select-none">
                      <span className="text-[#85a528]">+{option.xp} XP</span>
                      {option.co2Saved > 0 && <span className="text-[#556B2F]">· +{option.co2Saved} Green Score</span>}
                      {option.waterSaved > 0 && <span className="text-[#6B7280]">· Saves {option.waterSaved}L Water</span>}
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
            className="w-full bg-[#85a528] hover:bg-[#6f8c1f] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
          >
            <span>Log Action</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
