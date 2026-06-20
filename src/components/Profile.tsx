import React, { useState } from "react";
import { UserStats, Badge } from "../types";
import { 
  Award, 
  Settings, 
  User, 
  Trees, 
  Flame, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Compass, 
  Share2, 
  Sparkles,
  HelpCircle
} from "lucide-react";

interface ProfileProps {
  stats: UserStats;
  badges: Badge[];
  onResetApp: () => void;
  onUpdateName: (newName: string) => void;
}

export default function Profile({ stats, badges, onResetApp, onUpdateName }: ProfileProps) {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>(stats.name);
  const [showShareNotification, setShowShareNotification] = useState<boolean>(false);

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      onUpdateName(editingName.trim());
      setShowSettings(false);
    }
  };

  const handleShare = () => {
    setShowShareNotification(true);
    setTimeout(() => {
      setShowShareNotification(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in relative">
      {/* Profile Header Block */}
      <div className="flex flex-col items-center text-center space-y-3 pt-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#2E7D32]/15 shadow-md bg-white">
            <img 
              alt="Default Avatar" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkUC5CHRA3PIKFtJkZi-RNc-ZUZOApZsaN1w7DG3v2xDqq2jHybf-4F8K3DCE-gXI8pj6gT03fk4FWYb3JsWHZpho2cz0CIicJJtrVoIZfVIVtzEpOgubklZBXc47WGvbZMGiD1EScjkgP1n2n7KnAXaDiI-zlPnV4MX2HP-_T-ekdcfx9ukC2YmrBQ9dthUVEWLotlN6XFsbI39OXc2E5jA6y9SiqwS6O1nuJwv7pbiiRMYhMvvtnq41WzaYUee75CgTktgcnycdn"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-1 right-1 bg-[#2E7D32] text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
            Level {stats.level}
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-[#1F2937] leading-tight flex items-center justify-center gap-1.5">
            {stats.name} 
            <Award className="w-5 h-5 text-[#2E7D32] fill-current" />
          </h2>
          <p className="text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
            Forest Guardian 🌳
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-trigger-settings"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] bg-white border border-[#E8F5E9] px-3 py-1.5 rounded-full hover:text-black hover:border-gray-400 active:scale-95 transition-all"
          >
            <Settings className="w-3.5 h-3.5" /> Configure Profile
          </button>
          
          <button
            id="btn-share-impact"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] bg-[#E8F5E9]/50 border border-[#E8F5E9] px-3 py-1.5 rounded-full hover:bg-[#E8F5E9] active:scale-95 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Impact
          </button>
        </div>

        {showShareNotification && (
          <div className="bg-[#2E7D32] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md text-center max-w-xs mx-auto animate-bounce">
            🔗 Copied your GreenSteps Forest URL to Clipboard!
          </div>
        )}
      </div>

      {/* Lifetime Cumulative Impact */}
      <section className="space-y-3">
        <h3 className="text-lg font-extrabold text-[#1F2937]">Lifetime Cumulative Positive Impact</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#E8F5E9]/40 border border-[#E8F5E9] rounded-3xl p-5 text-center space-y-1">
            <span className="text-xs font-bold text-[#6B7280] block">Green Score</span>
            <span className="text-3xl font-extrabold text-[#2E7D32]">{(stats.co2Saved + 14.5).toFixed(1)} Points</span>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 text-center space-y-1">
            <span className="text-xs font-bold text-[#6B7280] block">Water Conserved</span>
            <span className="text-3xl font-extrabold text-[#1976D2]">{stats.waterSaved + 85} L</span>
          </div>
        </div>
      </section>

      {/* Forest Evolution Sandbox Section */}
      <section className="bg-white rounded-3xl p-6 border-2 border-[#E8F5E9] shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-extrabold text-[#1F2937] flex items-center gap-2">
            <Trees className="w-5 h-5 text-[#2E7D32]" /> Custom Forest Plot
          </h3>
          <span className="text-xs font-bold text-[#6B7280]">
            Stage: {stats.xp <= 150 ? "Seed 🌱" : stats.xp <= 400 ? "Plant 🌿" : stats.xp <= 800 ? "Sapling 🌳" : "Canopy 🌲"}
          </span>
        </div>

        {/* Dynamic visual forest based on XP */}
        <div className="bg-gradient-to-b from-sky-50 to-emerald-50/50 border border-[#E8F5E9] rounded-3xl p-5 min-h-[140px] flex items-end justify-around relative overflow-hidden">
          {/* Environmental sky elements */}
          <span className="absolute top-2 left-4 text-sm animate-pulse select-none text-blue-500/30">☁️</span>
          <span className="absolute top-4 right-10 text-xl animate-pulse select-none text-yellow-500/20">☀️</span>

          {/* Procedurally generated trees based on XP milestones */}
          {(() => {
            const treeCount = Math.max(1, stats.forestTrees || Math.floor(stats.xp / 200));
            const treeTypes = [
              { emoji: "🌱", label: "Seedling", size: "text-3xl" },
              { emoji: "🌿", label: "Fern", size: "text-4xl" },
              { emoji: "🌳", label: "Oak", size: "text-5xl" },
              { emoji: "🌲", label: "Pine", size: "text-5xl" },
              { emoji: "🎋", label: "Bamboo", size: "text-4xl" },
              { emoji: "🌴", label: "Palm", size: "text-5xl" },
            ];

            const trees = [];
            for (let i = 0; i < Math.min(treeCount + 1, 5); i++) {
              const type = treeTypes[Math.min(i, treeTypes.length - 1)];
              trees.push(
                <div key={i} className="flex flex-col items-center text-center">
                  <span
                    className={`${type.size} ${i < treeCount ? "animate-bounce" : "opacity-30"} select-none`}
                    style={{ animationDuration: `${2.5 + i * 0.4}s` }}
                  >
                    {i < treeCount ? type.emoji : "🌱"}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase mt-1 ${i < treeCount ? "text-[#8D6E63]" : "text-gray-400"}`}>
                    {i < treeCount ? type.label : "Growing..."}
                  </span>
                </div>
              );
            }

            // Add a "plant more" slot if there's room
            if (trees.length < 5) {
              trees.push(
                <div key="placeholder" className="flex flex-col items-center text-center opacity-30">
                  <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-500 select-none">+</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 mt-1">Next</span>
                </div>
              );
            }

            return trees;
          })()}
        </div>

        <div className="pt-2 grid grid-cols-3 gap-2 text-center text-sm border-t border-[#E8F5E9]">
          <div>
            <span className="text-lg font-extrabold text-[#2E7D32]">{stats.forestTrees || Math.floor(stats.xp / 200)}</span>
            <span className="text-xs text-[#6B7280] block">Grown Trees</span>
          </div>
          <div>
            <span className="text-lg font-extrabold text-[#2E7D32]">{unlockedBadges.length}</span>
            <span className="text-xs text-[#6B7280] block">Eco Badges</span>
          </div>
          <div>
            <span className="text-lg font-extrabold text-[#2E7D32]">{stats.completedActivityCount}</span>
            <span className="text-xs text-[#6B7280] block">Habits Logged</span>
          </div>
        </div>
      </section>

      {/* Achievement Milestones Showcase Screen 10 */}
      <section className="space-y-3">
        <h3 className="text-lg font-extrabold text-[#1F2937]">My Milestones & Badges</h3>
        <p className="text-sm text-[#6B7280]">
          Unlock helpful badges by completing daily chores or talking to Sprout!
        </p>

        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => {
            const isUnlocked = badge.unlocked;
            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`border rounded-3xl p-4 flex flex-col items-center text-center space-y-2 relative overflow-hidden transition-all ${
                  isUnlocked 
                    ? "bg-white border-[#E8F5E9] shadow-sm transform hover:scale-105" 
                    : "bg-[#FFFDF8] border-dashed border-gray-200 opacity-60"
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl select-none ${
                  isUnlocked ? `bg-gradient-to-br ${badge.colorClass} text-white shadow-sm` : "bg-gray-100 text-gray-400"
                }`}>
                  {isUnlocked ? badge.emoji : "🔒"}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-base font-extrabold text-[#1F2937] leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] leading-snug">
                    {badge.description}
                  </p>
                </div>
                
                {/* Visual lock status tag */}
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isUnlocked ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-gray-100 text-gray-500"
                }`}>
                  {isUnlocked ? "Unlocked" : `Rule: ${badge.requirement}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings Panel & Account reset option */}
      {showSettings && (
        <div className="fixed inset-0 bg-[#1F2937]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E8F5E9] w-full max-w-sm space-y-6 shadow-xl animate-scale-in">
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#1F2937]">Profile Settings</h3>
              <p className="text-sm text-[#6B7280]">
                Configure names or start from scratch.
              </p>
            </div>

            <form onSubmit={handleSaveName} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1F2937] ml-0.5">Rename Profile Name</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full text-base px-4 py-3 border border-[#E8F5E9] bg-white rounded-2xl text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2E7D32] focus:ring-0 shadow-sm outline-none"
                  style={{ fontSize: "16px" }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-white border border-[#E8F5E9] text-[#6B7280] py-3 rounded-2xl text-sm font-bold active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2E7D32] text-white py-3 rounded-2xl text-sm font-bold active:scale-95 transition-all"
                >
                  Save Change
                </button>
              </div>
            </form>

            <div className="border-t border-[#E8F5E9] pt-4 text-center">
              <button
                id="btn-reset-onboarding"
                onClick={() => {
                  if (confirm("Reset my entire progress? This clears custom forest, level stats, and starts step-by-step onboarding fresh.")) {
                    onResetApp();
                    setShowSettings(false);
                  }
                }}
                className="text-xs font-extrabold text-red-600 hover:underline cursor-pointer"
              >
                ⚠️ Reset All Progress Data & Retake Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
