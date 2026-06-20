import React, { useState } from "react";
import { UserStats, FamilyStats, FamilyMember } from "../types";
import {
  Users,
  Crown,
  Copy,
  CheckCircle,
  Trophy,
  Droplet,
  Zap,
  Flame,
  Plus,
  ArrowRight,
  Sparkles,
  Trees,
  Heart,
} from "lucide-react";

interface FamilyProps {
  stats: UserStats;
  familyData: FamilyStats | null;
  onCreateFamily: (familyName: string) => void;
  onJoinFamily: (inviteCode: string) => void;
}

export default function Family({ stats, familyData, onCreateFamily, onJoinFamily }: FamilyProps) {
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = () => {
    if (familyData?.inviteCode) {
      navigator.clipboard.writeText(familyData.inviteCode).catch(() => {});
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleCreate = () => {
    if (familyName.trim().length >= 2) {
      onCreateFamily(familyName.trim());
      setShowCreate(false);
      setFamilyName("");
    }
  };

  const handleJoin = () => {
    if (inviteCode.trim().length >= 4) {
      onJoinFamily(inviteCode.trim());
      setShowJoin(false);
      setInviteCode("");
    }
  };

  // ─── No family yet — show onboarding ────────────────────────────────
  if (!familyData) {
    return (
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#1F2937]">Family Mode 👨‍👩‍👧‍👦</h1>
          <p className="text-base text-[#6B7280]">
            Team up with your household! Track combined impact, compete on the family leaderboard, and grow a shared forest together.
          </p>
        </div>

        {/* Hero illustration */}
        <div className="bg-gradient-to-br from-[#E8F5E9] via-white to-teal-50 rounded-3xl p-8 border border-[#E8F5E9] text-center relative overflow-hidden shadow-sm">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <Users className="w-32 h-32 text-[#2E7D32]" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="text-6xl select-none">🏡</div>
            <h2 className="text-2xl font-extrabold text-[#1F2937]">Grow Together</h2>
            <p className="text-sm text-[#6B7280] max-w-sm mx-auto">
              Create a family group and share an invite code, or join an existing one. Your combined eco impact will be tracked together!
            </p>

            <div className="flex flex-col gap-3 max-w-xs mx-auto pt-2">
              <button
                id="btn-create-family"
                onClick={() => { setShowCreate(true); setShowJoin(false); }}
                className="bg-[#2E7D32] hover:bg-[#25632a] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-base"
              >
                <Plus className="w-5 h-5" /> Create Family Group
              </button>

              <button
                id="btn-join-family"
                onClick={() => { setShowJoin(true); setShowCreate(false); }}
                className="bg-white border-2 border-[#E8F5E9] text-[#2E7D32] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#E8F5E9]/30 active:scale-95 text-base"
              >
                <ArrowRight className="w-5 h-5" /> Join with Invite Code
              </button>
            </div>
          </div>
        </div>

        {/* Create Family Form */}
        {showCreate && (
          <div className="bg-white rounded-3xl p-6 border-2 border-[#E8F5E9] space-y-4 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#1F2937]">Name Your Family Group</h3>
            <input
              id="input-family-name"
              type="text"
              placeholder="e.g. The Green Household"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-5 py-4 border-2 border-[#E8F5E9] bg-white rounded-2xl text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2E7D32] focus:ring-0 transition-colors outline-none text-base font-semibold"
              maxLength={30}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 bg-white border border-[#E8F5E9] text-[#6B7280] py-3 rounded-2xl text-sm font-bold active:scale-95"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-create"
                onClick={handleCreate}
                disabled={familyName.trim().length < 2}
                className="flex-1 bg-[#2E7D32] text-white py-3 rounded-2xl text-sm font-bold active:scale-95 disabled:opacity-40"
              >
                Create Group
              </button>
            </div>
          </div>
        )}

        {/* Join Family Form */}
        {showJoin && (
          <div className="bg-white rounded-3xl p-6 border-2 border-[#E8F5E9] space-y-4 shadow-sm">
            <h3 className="text-lg font-extrabold text-[#1F2937]">Enter Invite Code</h3>
            <input
              id="input-invite-code"
              type="text"
              placeholder="e.g. ABC123"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full px-5 py-4 border-2 border-[#E8F5E9] bg-white rounded-2xl text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#2E7D32] focus:ring-0 transition-colors outline-none text-base font-semibold tracking-widest text-center uppercase"
              maxLength={8}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowJoin(false)}
                className="flex-1 bg-white border border-[#E8F5E9] text-[#6B7280] py-3 rounded-2xl text-sm font-bold active:scale-95"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-join"
                onClick={handleJoin}
                disabled={inviteCode.trim().length < 4}
                className="flex-1 bg-[#2E7D32] text-white py-3 rounded-2xl text-sm font-bold active:scale-95 disabled:opacity-40"
              >
                Join Family
              </button>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-[#1F2937]">Why Go Together?</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { emoji: "📊", title: "Combined Impact", desc: "See your household's total CO₂ offset, water saved, and cost reduction." },
              { emoji: "🏆", title: "Family Leaderboard", desc: "Friendly competition on who completed the most green habits this week." },
              { emoji: "🌳", title: "Shared Forest", desc: "Watch your family forest grow as everyone contributes." },
              { emoji: "💪", title: "Team Challenges", desc: "Unlock special family-only challenges and collective badges." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-[#E8F5E9] rounded-3xl p-4 flex items-start gap-3">
                <span className="text-2xl select-none shrink-0">{item.emoji}</span>
                <div>
                  <h4 className="text-sm font-extrabold text-[#1F2937]">{item.title}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Family Dashboard (has family data) ─────────────────────────────
  const sortedMembers = [...familyData.members].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return (
    <div className="space-y-6 pb-6">
      {/* Family Header */}
      <div className="bg-gradient-to-br from-[#E8F5E9] to-teal-50 rounded-3xl p-6 border border-[#E8F5E9] relative overflow-hidden shadow-sm">
        <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
          <Heart className="w-28 h-28 fill-current text-[#2E7D32]" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/80 text-[#2E7D32] px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm">
              <Users className="w-3.5 h-3.5" /> {familyData.members.length} Members
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1F2937] leading-tight">
            {familyData.name} 🏡
          </h1>
          <p className="text-sm text-[#6B7280]">Growing greener, together.</p>
        </div>
      </div>

      {/* Invite Code Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-dashed border-[#E8F5E9] flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">Invite Code</span>
          <span className="text-2xl font-extrabold text-[#2E7D32] tracking-[0.3em] select-all">
            {familyData.inviteCode}
          </span>
        </div>
        <button
          id="btn-copy-invite"
          onClick={handleCopyCode}
          className={`p-3 rounded-2xl transition-all active:scale-90 ${
            codeCopied
              ? "bg-[#2E7D32] text-white"
              : "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#2E7D32]/10"
          }`}
        >
          {codeCopied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      {/* Combined Impact */}
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold text-[#1F2937]">Combined Household Impact</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#E8F5E9]/40 border border-[#E8F5E9] rounded-3xl p-4 text-center space-y-1">
            <Zap className="w-5 h-5 text-[#2E7D32] mx-auto" />
            <span className="text-xl font-extrabold text-[#2E7D32] block">
              {(familyData.totalCo2Saved || 0).toFixed(1)}
            </span>
            <span className="text-[10px] font-bold text-[#6B7280] block">Green Points</span>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-4 text-center space-y-1">
            <Droplet className="w-5 h-5 text-[#1976D2] mx-auto" />
            <span className="text-xl font-extrabold text-[#1976D2] block">
              {familyData.totalWaterSaved || 0}L
            </span>
            <span className="text-[10px] font-bold text-[#6B7280] block">Water Saved</span>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-4 text-center space-y-1">
            <Trees className="w-5 h-5 text-[#E65100] mx-auto" />
            <span className="text-xl font-extrabold text-[#E65100] block">
              ₹{familyData.totalCostSaved || 0}
            </span>
            <span className="text-[10px] font-bold text-[#6B7280] block">Cost Saved</span>
          </div>
        </div>
      </section>

      {/* Family Leaderboard */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#1F2937] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#EF6C00]" /> Leaderboard
          </h2>
          <span className="text-xs font-bold text-[#6B7280]">This Week</span>
        </div>

        <div className="space-y-2">
          {sortedMembers.map((member, idx) => {
            const isCurrentUser = member.id === (stats.id || "local");
            const rankEmojis = ["🥇", "🥈", "🥉"];

            return (
              <div
                key={member.id}
                id={`leaderboard-${member.id}`}
                className={`bg-white rounded-3xl p-4 border flex items-center justify-between transition-all ${
                  isCurrentUser
                    ? "border-[#2E7D32] bg-[#E8F5E9]/20 shadow-sm"
                    : "border-[#E8F5E9]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl select-none w-8 text-center">
                    {idx < 3 ? rankEmojis[idx] : `#${idx + 1}`}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8F5E9] to-teal-100 flex items-center justify-center text-lg select-none border border-[#2E7D32]/10">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#1F2937] flex items-center gap-1.5">
                      {member.name}
                      {isCurrentUser && (
                        <span className="text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-1.5 py-0.5 rounded-full">You</span>
                      )}
                      {member.role === "admin" && (
                        <Crown className="w-3.5 h-3.5 text-[#FFB300]" />
                      )}
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      Level {member.level || 1} · {member.streak || 0} day streak
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-[#2E7D32]">{member.xp || 0}</span>
                  <span className="text-xs font-bold text-[#6B7280] block">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shared Forest Preview */}
      <section className="bg-white rounded-3xl p-6 border-2 border-[#E8F5E9] shadow-sm space-y-3">
        <h3 className="text-lg font-extrabold text-[#1F2937] flex items-center gap-2">
          <Trees className="w-5 h-5 text-[#2E7D32]" /> Family Forest
        </h3>
        <div className="bg-gradient-to-b from-sky-50 to-emerald-50/50 border border-[#E8F5E9] rounded-3xl p-5 min-h-[120px] flex items-end justify-around relative overflow-hidden">
          <span className="absolute top-2 left-4 text-sm animate-pulse select-none text-blue-500/30">☁️</span>
          <span className="absolute top-4 right-10 text-xl animate-pulse select-none text-yellow-500/20">☀️</span>

          {/* Generate trees based on total member XP */}
          {sortedMembers.map((member, idx) => {
            const treeCount = Math.max(1, Math.floor((member.xp || 0) / 200));
            const trees = ["🌱", "🌿", "🌳", "🌲", "🌲"];
            const treeEmoji = trees[Math.min(treeCount, trees.length - 1)];
            const sizes = ["text-2xl", "text-3xl", "text-4xl", "text-5xl"];
            const treeSize = sizes[Math.min(treeCount, sizes.length - 1)];

            return (
              <div key={member.id} className="flex flex-col items-center text-center">
                <span
                  className={`${treeSize} select-none animate-bounce`}
                  style={{ animationDuration: `${2.5 + idx * 0.5}s` }}
                >
                  {treeEmoji}
                </span>
                <span className="text-[9px] font-extrabold text-[#8D6E63] uppercase mt-1">
                  {member.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-center pt-2">
          <p className="text-xs text-[#6B7280]">
            Each member grows their own tree in the family forest. Complete more habits to make yours flourish!
          </p>
        </div>
      </section>
    </div>
  );
}
