import React from "react";
import { UserStats, Challenge } from "../types";
import { 
  Leaf, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Droplet, 
  Zap, 
  TrendingUp, 
  Compass, 
  Trophy, 
  MessageSquare, 
  Play, 
  CheckCircle,
  Trees
} from "lucide-react";

interface DashboardProps {
  stats: UserStats;
  challenges: Challenge[];
  onQuickAction: (screen: "track" | "challenges" | "coach" | "profile") => void;
  onCompleteChallenge: (challengeId: string) => void;
}

export default function Dashboard({ stats, challenges, onQuickAction, onCompleteChallenge }: DashboardProps) {
  // Get active challenges (not completed)
  const activeChallenges = challenges.filter(c => !c.completed).slice(0, 2);

  // Growth level calculations:
  // 0 - 200 XP: Seed
  // 201 - 400 XP: Plant 
  // 401 - 700 XP: Sapling
  // 701 - 1000 XP: Mature Tree
  // 1001+ XP: Forest Guardian
  const getForestStage = (xp: number) => {
    if (xp <= 150) return { stage: "Seed 🌱", next: "Plant", target: 150, prev: 0, text: "Just planted! Every task feeds your seed." };
    if (xp <= 400) return { stage: "Plant 🌿", next: "Sapling", target: 400, prev: 150, text: "Look at those fresh leaves sprouts!" };
    if (xp <= 800) return { stage: "Sapling 🌳", next: "Mature Tree", target: 800, prev: 400, text: "Your sapling is expanding branches!" };
    return { stage: "Mature Tree 🌲", next: "Forest Master", target: 1500, prev: 800, text: "An absolute canopy of organic cleaner air!" };
  };

  const currentStage = getForestStage(stats.xp);
  const stageProgress = Math.min(
    100,
    Math.max(0, ((stats.xp - currentStage.prev) / (currentStage.target - currentStage.prev)) * 100)
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Dynamic Header & Welcome Greeting Card */}
      <div className="bg-gradient-to-br from-[#E8F5E9] to-[#FFFDF8] rounded-3xl p-6 border border-[#2E7D32]/10 relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#2E7D32]/10 text-[#2E7D32] px-3 py-1 rounded-full text-sm font-extrabold flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Streak: {stats.streak} Days
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1F2937] leading-tight">
            Good Morning, {stats.name} 🌱
          </h1>
          <p className="text-base text-[#6B7280]">
            You're doing fantastic! Every micro-choice today helps save electricity, fresh water, and protects our regional climate.
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <Leaf className="w-40 h-40 fill-current text-[#2E7D32]" />
        </div>
      </div>

      {/* Today's Combined Impact Bento Grid */}
      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-[#1F2937]">Today's Impact</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Carbon Card (Full span) */}
          <div className="col-span-2 bg-white rounded-3xl p-5 border border-[#E8F5E9] flex items-center justify-between relative overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <div className="z-10 space-y-1">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">Positive Impact</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#2E7D32]">{stats.co2Saved.toFixed(1)}</span>
                <span className="text-xl font-bold text-[#2E7D32]/70">Green Points</span>
              </div>
              <p className="text-sm text-[#6B7280]">
                Equal to avoiding single-rider drives and traveling cleanly!
              </p>
            </div>
            <div className="text-[#2E7D32]/5 font-black text-7xl select-none pr-2">
              GREEN
            </div>
          </div>

          {/* Water Saved Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8F5E9] flex flex-col justify-between shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-full bg-[#E3F2FD] flex items-center justify-center text-[#1976D2] mb-3">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#6B7280] block">Water Saved</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#1F2937]">{stats.waterSaved}</span>
                <span className="text-sm font-bold text-[#6B7280]">Liters</span>
              </div>
            </div>
          </div>

          {/* Currency Saved Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8F5E9] flex flex-col justify-between border-b-4 border-[#fed7ca] shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-full bg-[#FFEAE6] flex items-center justify-center text-[#E64A19] mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#6B7280] block">Saved Cost</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#1F2937]">₹{stats.costSaved}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Forest Growth — SVG Interactive Scene */}
      <section className="bg-white rounded-3xl p-6 border-2 border-[#E8F5E9] shadow-sm relative overflow-hidden">
        <div className="absolute right-4 top-4 bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
          <Trees className="w-3.5 h-3.5" /> Stage: {currentStage.stage}
        </div>
        
        <div className="flex flex-col items-center text-center py-2 space-y-4">
          {/* SVG Forest Scene */}
          <div className="w-full max-w-md mx-auto relative">
            <svg viewBox="0 0 400 200" className="w-full h-auto" style={{ minHeight: '160px' }}>
              {/* Sky gradient */}
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E3F2FD" />
                  <stop offset="100%" stopColor="#FFFDF8" />
                </linearGradient>
                <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8E6C9" />
                  <stop offset="100%" stopColor="#A5D6A7" />
                </linearGradient>
              </defs>
              
              {/* Sky */}
              <rect x="0" y="0" width="400" height="160" fill="url(#skyGrad)" rx="16" />
              
              {/* Sun */}
              <circle cx="350" cy="35" r="22" fill="#FFF9C4" opacity="0.8">
                <animate attributeName="r" values="22;24;22" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="350" cy="35" r="16" fill="#FFEE58" opacity="0.6" />
              
              {/* Cloud */}
              <g opacity="0.5">
                <ellipse cx="80" cy="30" rx="30" ry="12" fill="white" />
                <ellipse cx="100" cy="25" rx="25" ry="10" fill="white" />
                <ellipse cx="65" cy="28" rx="18" ry="8" fill="white" />
                <animateTransform attributeName="transform" type="translate" values="0,0;15,0;0,0" dur="20s" repeatCount="indefinite" />
              </g>
              
              {/* Ground */}
              <ellipse cx="200" cy="172" rx="210" ry="38" fill="url(#groundGrad)" />
              
              {/* Ground detail (grass patches) */}
              <ellipse cx="60" cy="165" rx="18" ry="4" fill="#81C784" opacity="0.5" />
              <ellipse cx="330" cy="168" rx="22" ry="5" fill="#81C784" opacity="0.4" />
              <ellipse cx="200" cy="162" rx="30" ry="5" fill="#66BB6A" opacity="0.3" />
              
              {/* Trees — procedurally placed based on XP */}
              {/* Seed stage: one tiny sprout */}
              {stats.xp <= 150 && (
                <g>
                  <line x1="200" y1="155" x2="200" y2="140" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="200" cy="135" rx="8" ry="10" fill="#66BB6A">
                    <animate attributeName="ry" values="10;12;10" dur="3s" repeatCount="indefinite" />
                  </ellipse>
                  <ellipse cx="195" cy="138" rx="5" ry="7" fill="#81C784" />
                </g>
              )}
              
              {/* Plant stage: 2 small plants */}
              {stats.xp > 150 && stats.xp <= 400 && (
                <g>
                  <line x1="160" y1="155" x2="160" y2="130" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="160" cy="125" r="14" fill="#4CAF50" />
                  <circle cx="152" cy="128" r="10" fill="#66BB6A" />
                  
                  <line x1="240" y1="158" x2="240" y2="138" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="240" cy="133" r="12" fill="#81C784" />
                  <circle cx="235" cy="136" r="8" fill="#A5D6A7" />
                </g>
              )}
              
              {/* Sapling stage: 3 medium trees */}
              {stats.xp > 400 && stats.xp <= 800 && (
                <g>
                  <line x1="120" y1="160" x2="120" y2="115" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="120" cy="105" r="22" fill="#2E7D32" />
                  <circle cx="108" cy="112" r="16" fill="#4CAF50" />
                  <circle cx="132" cy="112" r="16" fill="#388E3C" />
                  <circle cx="120" cy="95" r="14" fill="#66BB6A" />
                  
                  <line x1="200" y1="155" x2="200" y2="120" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="200" cy="112" r="18" fill="#4CAF50" />
                  <circle cx="192" cy="118" r="12" fill="#81C784" />
                  <circle cx="208" cy="118" r="12" fill="#66BB6A" />
                  
                  <line x1="280" y1="158" x2="280" y2="128" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="280" cy="120" r="16" fill="#81C784" />
                  <circle cx="274" cy="125" r="10" fill="#A5D6A7" />
                </g>
              )}
              
              {/* Mature tree stage: 5 trees with variety */}
              {stats.xp > 800 && (
                <g>
                  {/* Pine tree left */}
                  <line x1="60" y1="162" x2="60" y2="120" stroke="#4E342E" strokeWidth="5" strokeLinecap="round" />
                  <polygon points="60,80 85,128 35,128" fill="#1B5E20" />
                  <polygon points="60,70 80,110 40,110" fill="#2E7D32" />
                  <polygon points="60,60 72,95 48,95" fill="#388E3C" />
                  
                  {/* Broad tree */}
                  <line x1="140" y1="160" x2="140" y2="105" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="140" cy="90" r="28" fill="#1B5E20" />
                  <circle cx="120" cy="100" r="20" fill="#2E7D32" />
                  <circle cx="160" cy="100" r="20" fill="#388E3C" />
                  <circle cx="140" cy="78" r="18" fill="#4CAF50" />
                  
                  {/* Center tall tree */}
                  <line x1="220" y1="155" x2="220" y2="90" stroke="#4E342E" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="220" cy="76" r="26" fill="#2E7D32" />
                  <circle cx="204" cy="88" r="18" fill="#4CAF50" />
                  <circle cx="236" cy="88" r="18" fill="#388E3C" />
                  <circle cx="220" cy="64" r="16" fill="#66BB6A" />
                  
                  {/* Pine right */}
                  <line x1="310" y1="160" x2="310" y2="115" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
                  <polygon points="310,82 340,125 280,125" fill="#2E7D32" />
                  <polygon points="310,72 332,108 288,108" fill="#388E3C" />
                  <polygon points="310,65 322,92 298,92" fill="#4CAF50" />
                  
                  {/* Small bush */}
                  <circle cx="370" cy="155" r="12" fill="#81C784" />
                  <circle cx="365" cy="150" r="10" fill="#A5D6A7" />
                  
                  {/* Sparkles */}
                  <circle cx="170" cy="72" r="2" fill="#FFD54F" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="250" cy="58" r="1.5" fill="#FFD54F" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="100" cy="85" r="1.5" fill="#FFD54F" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </svg>
          </div>
          
          {/* Forest stats summary row */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-[#E8F5E9]/40 rounded-2xl p-3 text-center">
              <span className="text-lg font-extrabold text-[#2E7D32] block">{stats.forestTrees || Math.floor(stats.xp / 200)}</span>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase">Trees Grown</span>
            </div>
            <div className="bg-[#E8F5E9]/40 rounded-2xl p-3 text-center">
              <span className="text-lg font-extrabold text-[#2E7D32] block">{stats.xp}</span>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase">Total XP</span>
            </div>
            <div className="bg-[#E8F5E9]/40 rounded-2xl p-3 text-center">
              <span className="text-lg font-extrabold text-[#2E7D32] block">Level {stats.level}</span>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase">Growth</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#1F2937]">Your digital forest is thriving!</h3>
            <p className="text-base text-[#6B7280] max-w-sm px-2">
              {currentStage.text} Keep going to reach the <strong>{currentStage.next}</strong> stage.
            </p>
          </div>

          {/* Progress Tracker Bar */}
          <div className="w-full space-y-1 px-2">
            <div className="flex justify-between text-xs font-extrabold text-[#6B7280]">
              <span className="uppercase">{currentStage.stage}</span>
              <span className="text-[#2E7D32]">{stats.xp} / {currentStage.target} XP</span>
            </div>
            <div className="w-full h-4 bg-[#E8F5E9] rounded-full overflow-hidden shadow-inner flex items-center">
              <div 
                className="h-full bg-[#2E7D32] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stageProgress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Hub */}
      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-[#1F2937]">Quick Action Hub</h2>
        <div className="grid grid-cols-4 gap-2">
          <button 
            id="qa-track"
            onClick={() => onQuickAction("track")}
            className="bg-white border border-[#E8F5E9] p-3 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all hover:border-[#2E7D32] hover:bg-[#E8F5E9]/10 active:scale-95 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-[#1F2937]">Log Habit</span>
          </button>

          <button 
            id="qa-challenges"
            onClick={() => onQuickAction("challenges")}
            className="bg-white border border-[#E8F5E9] p-3 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all hover:border-[#2E7D32] hover:bg-[#E8F5E9]/10 active:scale-95 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E0] text-[#EF6C00] flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-[#1F2937]">View Tasks</span>
          </button>

          <button 
            id="qa-coach"
            onClick={() => onQuickAction("coach")}
            className="bg-white border border-[#E8F5E9] p-3 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all hover:border-[#2E7D32] hover:bg-[#E8F5E9]/10 active:scale-95 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E3F2FD] text-[#1565C0] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-[#1F2937]">Talk Coach</span>
          </button>

          <button 
            id="qa-profile"
            onClick={() => onQuickAction("profile")}
            className="bg-white border border-[#E8F5E9] p-3 rounded-2xl flex flex-col items-center text-center space-y-1.5 transition-all hover:border-[#2E7D32] hover:bg-[#E8F5E9]/10 active:scale-95 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center">
              <Trees className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-[#1F2937]">My Forest</span>
          </button>
        </div>
      </section>

      {/* Featured Underway Challenges */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-[#1F2937]">Your Daily Challenges</h2>
          <button 
            id="view-all-challenges-btn"
            onClick={() => onQuickAction("challenges")} 
            className="text-sm font-extrabold text-[#2E7D32] flex items-center gap-1 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {activeChallenges.map((challenge) => (
            <div 
              key={challenge.id}
              className="bg-white rounded-3xl p-5 border border-[#E8F5E9] flex items-center justify-between shadow-[0px_4px_24px_rgba(46,125,50,0.02)] transition-all hover:border-[#2E7D32]/30"
            >
              <div className="flex gap-4 items-start pr-3">
                <span className="text-4xl select-none pt-1">{challenge.emoji}</span>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#1F2937] leading-tight">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {challenge.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full text-[11px] font-bold">
                      +{challenge.rewardXP} XP
                    </span>
                    <span className="bg-[#FFFDF8] border border-[#E8F5E9] text-[#8D6E63] px-2 py-0.5 rounded-full text-[11px] font-bold">
                      {challenge.impactText}
                    </span>
                  </div>
                </div>
              </div>
              <button
                id={`btn-complete-on-dash-${challenge.id}`}
                onClick={() => onCompleteChallenge(challenge.id)}
                className="bg-[#2E7D32] hover:bg-[#25632a] text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0"
              >
                Done
              </button>
            </div>
          ))}
          {activeChallenges.length === 0 && (
            <div className="text-center py-6 bg-white border border-[#E8F5E9] rounded-3xl space-y-2">
              <p className="text-lg">🎉</p>
              <h3 className="text-base font-bold text-[#1F2937]">All daily tasks are done!</h3>
              <p className="text-sm text-[#6B7280] px-4">
                Splendid contribution. Take a stroll or check in with Coach Sprout for new customized lessons!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
