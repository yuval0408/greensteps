import React, { useState } from "react";
import { UserStats, Challenge } from "../types";
import { Trophy, Sparkles, CheckCircle2, RefreshCw, Flame, Clock } from "lucide-react";

interface ChallengesProps {
  stats: UserStats;
  challenges: Challenge[];
  onCompleteChallenge: (challengeId: string) => void;
  onResetAllChallenges: () => void;
}

type CategoryFilter = "all" | "transport" | "food" | "energy" | "shopping" | "community" | "mindfulness";

const CATEGORY_CONFIG: Record<CategoryFilter, { label: string; emoji: string }> = {
  all: { label: "All", emoji: "🌍" },
  transport: { label: "Transport", emoji: "🚗" },
  food: { label: "Food", emoji: "🥗" },
  energy: { label: "Energy", emoji: "⚡" },
  shopping: { label: "Shopping", emoji: "🛒" },
  community: { label: "Community", emoji: "🤝" },
  mindfulness: { label: "Mindful", emoji: "🧘" },
};

export default function Challenges({ stats, challenges, onCompleteChallenge, onResetAllChallenges }: ChallengesProps) {
  const [activeTab, setActiveTab] = useState<"todo" | "done">("todo");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const todoList = challenges.filter((c) => !c.completed);
  const completedList = challenges.filter((c) => c.completed);

  const filteredTodo =
    categoryFilter === "all" ? todoList : todoList.filter((c) => c.category === categoryFilter);
  const filteredDone =
    categoryFilter === "all" ? completedList : completedList.filter((c) => c.category === categoryFilter);

  // Completion percentage for today
  const totalCount = challenges.length;
  const doneCount = completedList.length;
  const completionPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Header section with streak + progress */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1F2937]">Daily Green Steps</h1>
          <p className="text-base text-[#6B7280]">
            Take small, comfortable daily habits toward a greener future and grow your virtual forest.
          </p>
        </div>

        {/* Dynamic Streak + Progress Card */}
        <div className="bg-gradient-to-r from-[#FFFDF8] via-white to-[#E8F5E9] rounded-3xl p-5 border-2 border-[#E8F5E9] flex items-center justify-between relative overflow-hidden shadow-sm">
          <div className="space-y-2 z-10 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 bg-[#FFF9C4] text-[#F57F17] px-3 py-1 rounded-full text-xs font-extrabold shadow-sm animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-current" /> {stats.streak} Days Streak
              </span>
              <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-xs font-extrabold">
                Level {stats.level}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-[#1F2937]">Forest Protector Status</h3>
            <p className="text-xs text-[#6B7280]">
              Unlock rare seed multipliers by keeping your streak alive!
            </p>
          </div>

          {/* Mini progress ring */}
          <div className="relative w-16 h-16 shrink-0 z-10">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E8F5E9"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#2E7D32"
                strokeWidth="3"
                strokeDasharray={`${completionPct}, 100`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-extrabold text-[#2E7D32]">{completionPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {(Object.keys(CATEGORY_CONFIG) as CategoryFilter[]).map((key) => {
          const cfg = CATEGORY_CONFIG[key];
          const isActive = categoryFilter === key;
          return (
            <button
              key={key}
              id={`filter-${key}`}
              onClick={() => setCategoryFilter(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "bg-[#2E7D32] text-white shadow-sm"
                  : "bg-white text-[#6B7280] border border-[#E8F5E9] hover:bg-[#E8F5E9]/30"
              }`}
            >
              <span className="select-none">{cfg.emoji}</span>
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Tabs list switch selector */}
      <div className="bg-neutral-100 p-1.5 rounded-2xl flex relative max-w-sm mx-auto">
        <button
          id="tab-todo"
          onClick={() => setActiveTab("todo")}
          className={`flex-1 text-center py-3 rounded-xl text-sm font-extrabold transition-all relative z-10 cursor-pointer ${
            activeTab === "todo" ? "bg-white text-[#2E7D32] shadow-sm" : "text-[#6B7280] hover:text-[#1F2937]"
          }`}
        >
          Active Tasks ({filteredTodo.length})
        </button>
        <button
          id="tab-done"
          onClick={() => setActiveTab("done")}
          className={`flex-1 text-center py-3 rounded-xl text-sm font-extrabold transition-all relative z-10 cursor-pointer ${
            activeTab === "done" ? "bg-white text-[#2E7D32] shadow-sm" : "text-[#6B7280] hover:text-[#1F2937]"
          }`}
        >
          Completed ({filteredDone.length})
        </button>
      </div>

      {/* Task view panels */}
      {activeTab === "todo" ? (
        <div className="space-y-4">
          {filteredTodo.map((challenge) => (
            <div
              key={challenge.id}
              id={`challenge-card-${challenge.id}`}
              className="bg-white border-2 border-[#E8F5E9] rounded-3xl p-5 flex items-center justify-between shadow-[0px_4px_24px_rgba(46,125,50,0.01)] transition-all hover:border-[#2E7D32]/20"
            >
              <div className="flex gap-4 items-start pr-3">
                <span className="text-4xl select-none pt-1" role="img" aria-label={challenge.title}>{challenge.emoji}</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-[#1F2937] leading-tight">
                      {challenge.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase select-none ${
                      challenge.difficulty === "Easy" ? "bg-emerald-100 text-[#2E7D32]" :
                      challenge.difficulty === "Medium" ? "bg-amber-100 text-amber-800" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {challenge.description}
                  </p>
                  
                  {/* Reward + time tags */}
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <span className="bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full text-xs font-extrabold">
                      +{challenge.rewardXP} XP
                    </span>
                    <span className="bg-[#FFFDF8] border border-[#E8F5E9] text-[#8D6E63] px-2.5 py-1 rounded-full text-xs font-extrabold">
                      {challenge.impactText}
                    </span>
                    {challenge.timeEstimate && (
                      <span className="bg-blue-50 text-[#1565C0] px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {challenge.timeEstimate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                id={`btn-complete-task-${challenge.id}`}
                onClick={() => onCompleteChallenge(challenge.id)}
                className="bg-[#2E7D32] hover:bg-[#25632a] text-white px-5 py-3 rounded-full text-sm font-bold shadow-sm transition-all active:scale-95 shrink-0"
              >
                Start
              </button>
            </div>
          ))}

          {filteredTodo.length === 0 && (
            <div className="bg-white border-2 border-dashed border-[#E8F5E9] rounded-3xl p-8 text-center space-y-4">
              <span className="text-6xl select-none block">🥇</span>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-lg font-extrabold text-[#1F2937]">
                  {categoryFilter === "all" ? "Splendid Job, Champion!" : `All ${CATEGORY_CONFIG[categoryFilter].label} tasks done!`}
                </h3>
                <p className="text-base text-[#6B7280] leading-relaxed">
                  {categoryFilter === "all"
                    ? "You have cleared all active challenges for today and added magnificent water, cost and energy offsets for your neighborhood."
                    : `Try switching to another category or reset all tasks to keep going!`}
                </p>
              </div>
              {categoryFilter === "all" && (
                <button
                  id="btn-re-seed-tasks"
                  onClick={onResetAllChallenges}
                  className="inline-flex items-center gap-2 bg-[#E8F5E9] hover:bg-[#E8F5E9]/80 text-[#2E7D32] px-5 py-2.5 rounded-full text-xs font-extrabold transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-Seed Tasks
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Completed Tab */
        <div className="space-y-4">
          {filteredDone.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-[#E8F5E9]/20 border border-[#E8F5E9] rounded-3xl p-5 flex items-center justify-between opacity-85"
            >
              <div className="flex gap-4 items-start">
                <span className="text-4xl select-none grayscale-0">{challenge.emoji}</span>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#1F2937] leading-tight line-through opacity-80">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Checked off safely today! Great environmental contribution.
                  </p>
                  <div className="flex gap-2 pt-1 select-none">
                    <span className="bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> +{challenge.rewardXP} XP Earned
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[#2E7D32] shrink-0">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </span>
            </div>
          ))}

          {filteredDone.length === 0 && (
            <div className="bg-white border-2 border-[#E8F5E9] rounded-3xl p-8 text-center space-y-2">
              <span className="text-4xl select-none block">⌛</span>
              <h3 className="text-base font-bold text-[#1F2937]">No steps completed yet</h3>
              <p className="text-sm text-[#6B7280] max-w-xs mx-auto">
                Complete your active walking, water, or energy saving goals to record your progress here!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
