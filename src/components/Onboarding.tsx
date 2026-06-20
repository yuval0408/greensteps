import React, { useState } from "react";
import { UserStats } from "../types";
import { Leaf, Award, Compass, HelpCircle, Users, ArrowRight, Sparkles, Check } from "lucide-react";

interface OnboardingProps {
  onComplete: (stats: Partial<UserStats>) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [homePeople, setHomePeople] = useState<number>(1);
  const [travelMode, setTravelMode] = useState<string>("Walk/Cycle");
  const [selectedGoal, setSelectedGoal] = useState<string>("Save Energy");
  const [weeklyGoal, setWeeklyGoal] = useState<number>(300);

  const statsOptions = {
    homePeople: [1, 2, 3, 4, 5],
    travelModes: [
      { id: "Clean", label: "Walk / Bicycle", icon: "🚶" },
      { id: "Transit", label: "Bus / Train", icon: "🚌" },
      { id: "Medium", label: "Auto / Carpool", icon: "🛺" },
      { id: "Heavy", label: "Drive Solo Car", icon: "🚗" },
    ],
    goals: [
      { id: "Save Energy", label: "Save Energy", desc: "Lower electric bills & turn down standby load.", icon: "⚡" },
      { id: "Reduce Waste", label: "Reduce Waste", desc: "Compost food, recycle, and eliminate plastic.", icon: "🗑️" },
      { id: "Save Water", label: "Save Water", desc: "Take smart showers & capture rainwater.", icon: "💧" },
      { id: "Healthier Lifestyle", label: "Healthier Lifestyle", desc: "Clean food and fresh active commutes.", icon: "🍎" },
    ],
    weeklyGoals: [
      { xp: 100, label: "Sapling (100 XP)", desc: "1-2 small habits. Best for busy families.", icon: "🌱" },
      { xp: 300, label: "Oak Tree (300 XP)", desc: "Balanced daily choices. Highly popular!", icon: "🌳" },
      { xp: 500, label: "Forest Ranger (500 XP)", desc: "Ambitious green lifestyle. Eco powerhouse.", icon: "🌲" },
    ],
  };

  const currentStepPercentage = Math.round(((step + 1) / 5) * 100);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        name: name.trim() || "Sarah",
        homePeople,
        travelMode,
        sustainabilityGoals: [selectedGoal],
        weeklyGoalXP: weeklyGoal,
        level: 1,
        xp: 0,
        co2Saved: 0,
        waterSaved: 0,
        costSaved: 0,
        streak: 1,
        isOnboarded: true,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between py-12 px-6 max-w-lg mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-[#2E7D32]">
          <Leaf className="w-8 h-8 fill-current text-[#2E7D32]" />
          <span className="font-extrabold text-2xl tracking-tight text-[#1F2937]">GreenSteps</span>
        </div>
        <div className="text-sm font-bold text-[#6B7280]">
          Step {step + 1} of 5
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-[#E8F5E9] rounded-full overflow-hidden mb-8 shadow-inner">
        <div
          className="h-full bg-[#2E7D32] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${currentStepPercentage}%` }}
        />
      </div>

      {/* Screen Content Wrapper */}
      <div className="flex-1 flex flex-col justify-center my-auto">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl inline-block mb-4 animate-bounce">👋</span>
              <h1 className="text-3xl font-extrabold text-[#1F2937] leading-tight mb-3">
                Welcome to GreenSteps!
              </h1>
              <p className="text-lg text-[#6B7280]">
                Small daily steps toward a greener future. What should Sprout (your AI coach) call you?
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="name-input" className="block text-sm font-bold text-[#1F2937] ml-1">
                Your Preferred Name
              </label>
              <input
                id="name-input"
                type="text"
                placeholder="e.g. Sarah, David, Professor John"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-base px-5 py-4 border-2 border-[#E8F5E9] bg-white rounded-2xl text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2E7D32] focus:ring-0 transition-colors shadow-sm outline-none"
                style={{ fontSize: "18px" }}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl inline-block mb-4">🏠</span>
              <h1 id="home-question" className="text-3xl font-extrabold text-[#1F2937] leading-tight mb-3">
                How many people live in your home?
              </h1>
              <p className="text-lg text-[#6B7280]">
                We use this to estimate average home baseline utilities and guide custom recommendations.
              </p>
            </div>
            <div role="radiogroup" aria-labelledby="home-question" className="flex justify-between gap-2 max-w-sm mx-auto">
              {statsOptions.homePeople.map((num) => (
                <button
                  key={num}
                  id={`home-people-${num}`}
                  onClick={() => setHomePeople(num)}
                  aria-checked={homePeople === num}
                  role="radio"
                  className={`w-14 h-14 rounded-2xl font-bold text-xl flex items-center justify-center transition-all ${
                    homePeople === num
                      ? "bg-[#2E7D32] text-white shadow-md scale-105"
                      : "bg-white text-[#1F2937] border-2 border-[#E8F5E9] hover:bg-[#E8F5E9]/50"
                  }`}
                >
                  {num === 5 ? "5+" : num}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl inline-block mb-4">🚶‍♀️🚌</span>
              <h1 id="travel-question" className="text-3xl font-extrabold text-[#1F2937] leading-tight mb-3">
                How do you usually travel?
              </h1>
              <p className="text-lg text-[#6B7280]">
                Choose your primary commute style for school, jobs, or utilities.
              </p>
            </div>
            <div role="radiogroup" aria-labelledby="travel-question" className="grid grid-cols-1 gap-3">
              {statsOptions.travelModes.map((mode) => (
                <button
                  key={mode.id}
                  id={`travel-mode-${mode.id}`}
                  onClick={() => setTravelMode(mode.label)}
                  aria-checked={travelMode === mode.label}
                  role="radio"
                  className={`flex items-center gap-4 px-5 py-4 border-2 rounded-2xl transition-all text-left ${
                    travelMode === mode.label
                      ? "border-[#2E7D32] bg-[#E8F5E9]/40 text-[#2E7D32] font-semibold scale-[1.02]"
                      : "border-[#E8F5E9] bg-white text-[#1F2937] hover:bg-neutral-50"
                  }`}
                >
                  <span className="text-3xl">{mode.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-[#1F2937]">{mode.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl inline-block mb-4">🌟</span>
              <h1 id="goal-question" className="text-3xl font-extrabold text-[#1F2937] leading-tight mb-3">
                Which eco-friendly goal matters most?
              </h1>
              <p className="text-lg text-[#6B7280]">
                We'll prioritize this in your feed, but you can always do everything!
              </p>
            </div>
            <div role="radiogroup" aria-labelledby="goal-question" className="grid grid-cols-1 gap-3">
              {statsOptions.goals.map((g) => (
                <button
                  key={g.id}
                  id={`goal-${g.id}`}
                  onClick={() => setSelectedGoal(g.id)}
                  aria-checked={selectedGoal === g.id}
                  role="radio"
                  className={`flex items-start gap-4 px-5 py-4 border-2 rounded-2xl transition-all text-left ${
                    selectedGoal === g.id
                      ? "border-[#2E7D32] bg-[#E8F5E9]/40 text-[#2E7D32] font-semibold scale-[1.02]"
                      : "border-[#E8F5E9] bg-white text-[#1F2937] hover:bg-neutral-50"
                  }`}
                >
                  <span className="text-3xl mt-1">{g.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-[#1F2937]">{g.label}</div>
                    <div className="text-[#6B7280] text-sm mt-0.5 leading-relaxed">{g.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-5xl inline-block mb-4">🏆</span>
              <h1 id="weekly-goal-question" className="text-3xl font-extrabold text-[#1F2937] leading-tight mb-3">
                Choose your weekly goal
              </h1>
              <p className="text-lg text-[#6B7280]">
                Select a comfortable pace. You earn XP by checking off clean habits!
              </p>
            </div>
            <div role="radiogroup" aria-labelledby="weekly-goal-question" className="grid grid-cols-1 gap-3">
              {statsOptions.weeklyGoals.map((wg) => (
                <button
                  key={wg.xp}
                  id={`weekly-goal-${wg.xp}`}
                  onClick={() => setWeeklyGoal(wg.xp)}
                  aria-checked={weeklyGoal === wg.xp}
                  role="radio"
                  className={`flex items-start gap-4 px-5 py-4 border-2 rounded-2xl transition-all text-left ${
                    weeklyGoal === wg.xp
                      ? "border-[#2E7D32] bg-[#E8F5E9]/40 text-[#2E7D32] font-semibold scale-[1.02]"
                      : "border-[#E8F5E9] bg-white text-[#1F2937] hover:bg-neutral-50"
                  }`}
                >
                  <span className="text-3xl mt-1">{wg.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-[#1F2937]">{wg.label}</div>
                    <div className="text-[#6B7280] text-sm mt-0.5 leading-relaxed">{wg.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center gap-4 mt-8">
        {step > 0 ? (
          <button
            id="back-button"
            onClick={handleBack}
            className="flex-1 max-w-[120px] bg-white border-2 border-[#E8F5E9] text-[#6B7280] hover:bg-neutral-50 text-center py-4 rounded-2xl font-bold transition-all shadow-sm active:scale-95 text-lg"
          >
            Back
          </button>
        ) : null}
        <button
          id="next-button"
          onClick={handleNext}
          className="flex-1 bg-[#2E7D32] hover:bg-[#25632a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-95 text-lg"
        >
          {step === 4 ? "Let's Begin!" : "Continue"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
