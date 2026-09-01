import React, { useState } from "react";
import { Trophy, CheckCircle2, RefreshCw, Flame, Clock } from "lucide-react";

const CATEGORY_CONFIG = {
  all: { label: "All", emoji: "🌍" },
  transport: { label: "Transport", emoji: "🚗" },
  food: { label: "Food", emoji: "🥗" },
  energy: { label: "Energy", emoji: "⚡" },
  shopping: { label: "Shopping", emoji: "🛒" },
  community: { label: "Community", emoji: "🤝" },
  mindfulness: { label: "Mindful", emoji: "🧘" },
};

export default function Challenges({ stats, challenges, onCompleteChallenge, onResetAllChallenges }) {
  const [activeTab, setActiveTab] = useState("todo");
  const [categoryFilter, setCategoryFilter] = useState("all");

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
          <span className="eco-eyebrow">Eco Green / Tasks</span>
          <h1 className="text-2xl font-bold text-[#1F2937]">Daily Green Steps</h1>
          <p className="text-xs text-[#556B2F]">
            Take small, comfortable daily habits toward a greener future and grow your virtual forest.
          </p>
        </div>

        {/* Dynamic Streak + Progress Card */}
        <div className="bg-[#ffffff] rounded-xl p-4 border border-[#85a528]/30 flex items-center justify-between relative overflow-hidden shadow-sm">
          <div className="space-y-2 z-10 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 bg-[#85a528]/15 text-[#85a528] border border-[#85a528]/30 px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                <Flame className="w-3.5 h-3.5 fill-current text-[#85a528]" /> {stats.streak} Days Streak
              </span>
              <span className="bg-[#F1F8E9] text-[#85a528] border border-[#85a528]/30 px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                Level {stats.level}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">Forest Protector Status</h3>
            <p className="text-xs text-[#6B7280]">
              Unlock rare seed multipliers by keeping your streak alive!
            </p>
          </div>

          {/* Mini progress ring */}
          <div className="relative w-14 h-14 shrink-0 z-10">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E8F5E9"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#85a528"
                strokeWidth="3.5"
                strokeDasharray={`${completionPct}, 100`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-[#85a528]">{completionPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {Object.keys(CATEGORY_CONFIG).map((key) => {
          const cfg = CATEGORY_CONFIG[key];
          const isActive = categoryFilter === key;
          return (
            <button
              key={key}
              id={`filter-${key}`}
              onClick={() => setCategoryFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${
                isActive
                  ? "bg-[#85a528] text-white border-[#85a528] shadow-sm"
                  : "bg-[#ffffff] text-[#556B2F] border-[#85a528]/30 hover:border-[#85a528] hover:bg-[#F1F8E9]"
              }`}
            >
              <span className="select-none">{cfg.emoji}</span>
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Tabs list switch selector */}
      <div className="bg-[#ffffff] p-1 rounded-lg border border-[#85a528]/30 flex relative max-w-sm mx-auto shadow-sm">
        <button
          id="tab-todo"
          onClick={() => setActiveTab("todo")}
          className={`flex-1 text-center py-2 rounded-md text-xs font-bold transition-all relative z-10 cursor-pointer ${
            activeTab === "todo" ? "bg-[#85a528] text-white shadow-sm" : "text-[#556B2F] hover:text-[#1F2937]"
          }`}
        >
          Active Tasks ({filteredTodo.length})
        </button>
        <button
          id="tab-done"
          onClick={() => setActiveTab("done")}
          className={`flex-1 text-center py-2 rounded-md text-xs font-bold transition-all relative z-10 cursor-pointer ${
            activeTab === "done" ? "bg-[#85a528] text-white shadow-sm" : "text-[#556B2F] hover:text-[#1F2937]"
          }`}
        >
          Completed ({filteredDone.length})
        </button>
      </div>

      {/* Task view panels */}
      {activeTab === "todo" ? (
        <div className="space-y-3">
          {filteredTodo.map((challenge) => {
            return (
              <div
                key={challenge.id}
                id={`challenge-card-${challenge.id}`}
                className="bg-[#ffffff] border border-[#85a528]/30 hover:border-[#85a528] rounded-xl p-4 flex items-center justify-between transition-all shadow-sm"
              >
                <div className="flex gap-3 items-start pr-2">
                  <div className="w-10 h-10 rounded-lg bg-[#F1F8E9] border border-[#85a528]/30 flex items-center justify-center text-xl shrink-0 select-none">
                    {challenge.emoji}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[#1F2937] leading-tight">
                        {challenge.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase select-none bg-[#F1F8E9] border border-[#85a528]/30 text-[#85a528]">
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {challenge.description}
                    </p>
                    
                    {/* Reward + time tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#E8F5E9] text-[#85a528] border border-[#85a528]/30">
                        +{challenge.rewardXP} XP
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F1F8E9] text-[#556B2F] border border-[#85a528]/20">
                        {challenge.impactText}
                      </span>
                      {challenge.timeEstimate && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 bg-[#F1F8E9] text-[#85a528] border border-[#85a528]/20">
                          <Clock className="w-3 h-3" /> {challenge.timeEstimate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-complete-task-${challenge.id}`}
                  onClick={() => onCompleteChallenge(challenge.id)}
                  className="px-4 py-2 rounded-md text-xs font-bold bg-[#85a528] hover:bg-[#6f8c1f] text-white shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer uppercase tracking-wider"
                >
                  Start
                </button>
              </div>
            );
          })}

          {filteredTodo.length === 0 && (
            <div className="bg-[#ffffff] border border-dashed border-[#85a528]/40 rounded-xl p-6 text-center space-y-3 shadow-sm">
              <span className="text-5xl select-none block">🥇</span>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-[#85a528]">
                  {categoryFilter === "all" ? "Splendid Job, Champion!" : `All ${CATEGORY_CONFIG[categoryFilter].label} tasks done!`}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {categoryFilter === "all"
                    ? "You have cleared all active challenges for today and added positive offsets."
                    : `Try switching to another category or reset all tasks to keep going!`}
                </p>
              </div>
              {categoryFilter === "all" && (
                <button
                  id="btn-re-seed-tasks"
                  onClick={onResetAllChallenges}
                  className="inline-flex items-center gap-2 bg-[#85a528] hover:bg-[#6f8c1f] text-white px-4 py-2 rounded-md text-xs font-bold transition-all uppercase tracking-wider shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-Seed Tasks
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Completed Tab */
        <div className="space-y-3">
          {filteredDone.map((challenge) => {
            return (
              <div
                key={challenge.id}
                className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex gap-3 items-start pr-2">
                  <div className="w-10 h-10 rounded-lg bg-[#F1F8E9] border border-[#85a528]/30 flex items-center justify-center text-xl shrink-0 select-none">
                    {challenge.emoji}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#1F2937] leading-tight">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      {challenge.description}
                    </p>
                    <div className="flex gap-2 pt-1 select-none">
                      <span className="text-[#85a528] font-bold text-xs">
                        +{challenge.rewardXP} XP · {challenge.timeEstimate}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#85a528] text-white shrink-0 uppercase tracking-wider">
                  DONE
                </span>
              </div>
            );
          })}

          {filteredDone.length === 0 && (
            <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-6 text-center space-y-2 shadow-sm">
              <span className="text-3xl select-none block">⌛</span>
              <h3 className="text-sm font-bold text-[#1F2937]">No steps completed yet</h3>
              <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
                Complete your active walking, water, or energy saving goals to record your progress here!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
