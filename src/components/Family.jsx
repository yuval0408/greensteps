import React, { useState } from "react";
import {
  Users,
  Crown,
  Copy,
  CheckCircle,
  Trophy,
  Droplet,
  Zap,
  Plus,
  ArrowRight,
  Trees,
  Heart,
} from "lucide-react";

export default function Family({ stats, familyData, onCreateFamily, onJoinFamily, onLeaveFamily }) {
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

  // No family yet — show onboarding
  if (!familyData) {
    return (
      <div className="space-y-6 pb-6">
        {/* Header */}
        <div className="space-y-1">
          <span className="eco-eyebrow">Eco Green / Household</span>
          <h1 className="text-2xl font-bold text-[#1F2937]">Family Mode 👨‍👩‍👧‍👦</h1>
          <p className="text-xs text-[#556B2F]">
            Team up with your household! Track combined impact, compete on the family leaderboard, and grow a shared forest together.
          </p>
        </div>

        {/* Hero illustration */}
        <div className="bg-[#ffffff] rounded-xl p-6 border border-[#85a528]/30 text-center relative overflow-hidden shadow-sm">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <Users className="w-32 h-32 text-[#85a528]" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="text-5xl select-none">🏡</div>
            <h2 className="text-lg font-bold text-[#1F2937]">Grow Together</h2>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Create a family group and share an invite code, or join an existing one. Your combined eco impact will be tracked together!
            </p>

            <div className="flex flex-col gap-3 max-w-xs mx-auto pt-2">
              <button
                id="btn-create-family"
                onClick={() => { setShowCreate(true); setShowJoin(false); }}
                className="bg-[#85a528] hover:bg-[#6f8c1f] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 text-xs uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" /> Create Family Group
              </button>

              <button
                id="btn-join-family"
                onClick={() => { setShowJoin(true); setShowCreate(false); }}
                className="bg-[#ffffff] border border-[#85a528]/40 text-[#85a528] py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:border-[#85a528] active:scale-95 text-xs uppercase tracking-wider shadow-sm"
              >
                <ArrowRight className="w-4 h-4" /> Join with Invite Code
              </button>
            </div>
          </div>
        </div>

        {/* Create Family Form */}
        {showCreate && (
          <div className="bg-[#ffffff] rounded-xl p-5 border border-[#85a528]/30 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-[#1F2937]">Name Your Family Group</h3>
            <input
              id="input-family-name"
              type="text"
              placeholder="e.g. The Green Household"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#85a528]/30 bg-[#ffffff] rounded-md text-[#1F2937] placeholder-[#9f9fa5] focus:border-[#85a528] outline-none text-xs"
              maxLength={30}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 bg-[#ffffff] border border-[#85a528]/30 text-[#6B7280] py-2 rounded-md text-xs font-bold active:scale-95"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-create"
                onClick={handleCreate}
                disabled={familyName.trim().length < 2}
                className="flex-1 bg-[#85a528] text-white py-2 rounded-md text-xs font-bold active:scale-95 disabled:opacity-40 uppercase tracking-wider"
              >
                Create Group
              </button>
            </div>
          </div>
        )}

        {/* Join Family Form */}
        {showJoin && (
          <div className="bg-[#ffffff] rounded-xl p-5 border border-[#85a528]/30 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-[#1F2937]">Enter Invite Code</h3>
            <input
              id="input-invite-code"
              type="text"
              placeholder="e.g. ABC123"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 border border-[#85a528]/30 bg-[#ffffff] rounded-md text-[#1F2937] placeholder-[#9f9fa5] focus:border-[#85a528] outline-none text-xs tracking-widest text-center uppercase"
              maxLength={8}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowJoin(false)}
                className="flex-1 bg-[#ffffff] border border-[#85a528]/30 text-[#6B7280] py-2 rounded-md text-xs font-bold active:scale-95"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-join"
                onClick={handleJoin}
                disabled={inviteCode.trim().length < 4}
                className="flex-1 bg-[#85a528] text-white py-2 rounded-md text-xs font-bold active:scale-95 disabled:opacity-40 uppercase tracking-wider"
              >
                Join Family
              </button>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#1F2937]">Why Go Together?</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { emoji: "📊", title: "Combined Impact", desc: "See your household's total CO₂ offset, water saved, and cost reduction." },
              { emoji: "🏆", title: "Family Leaderboard", desc: "Friendly competition on who completed the most green habits this week." },
              { emoji: "🌳", title: "Shared Forest", desc: "Watch your family forest grow as everyone contributes." },
              { emoji: "💪", title: "Team Challenges", desc: "Unlock special family-only challenges and collective badges." },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-3.5 flex items-start gap-3 shadow-sm">
                <span className="text-2xl select-none shrink-0">{item.emoji}</span>
                <div>
                  <h4 className="text-xs font-bold text-[#1F2937]">{item.title}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Family Dashboard
  const sortedMembers = [...familyData.members].sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return (
    <div className="space-y-6 pb-6">
      {/* Family Header */}
      <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-5 relative overflow-hidden shadow-sm">
        <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
          <Heart className="w-28 h-28 fill-current text-[#85a528]" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#E8F5E9] border border-[#85a528]/30 text-[#85a528] px-2.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {familyData.members.length} Members
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#1F2937] leading-tight">
            {familyData.name} 🏡
          </h1>
          <p className="text-xs text-[#556B2F]">Growing greener, together.</p>
        </div>
      </div>

      {/* Invite Code Card */}
      <div className="bg-[#ffffff] rounded-xl p-4 border border-dashed border-[#85a528]/40 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Invite Code</span>
          <span className="text-xl font-bold text-[#85a528] tracking-[0.3em] select-all">
            {familyData.inviteCode}
          </span>
        </div>
        <button
          id="btn-copy-invite"
          onClick={handleCopyCode}
          className={`p-2.5 rounded-lg transition-all active:scale-90 ${
            codeCopied
              ? "bg-[#85a528] text-white"
              : "bg-[#F1F8E9] border border-[#85a528]/30 text-[#85a528] hover:border-[#85a528]"
          }`}
        >
          {codeCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Combined Impact */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#1F2937]">Combined Household Impact</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-3 text-center space-y-1 shadow-sm">
            <Zap className="w-4 h-4 text-[#85a528] mx-auto" />
            <span className="text-base font-bold text-[#85a528] block">
              {(familyData.totalCo2Saved || 0).toFixed(1)}
            </span>
            <span className="text-[10px] font-bold text-[#6B7280] block">Green Points</span>
          </div>
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-3 text-center space-y-1 shadow-sm">
            <Droplet className="w-4 h-4 text-[#85a528] mx-auto" />
            <span className="text-base font-bold text-[#85a528] block">
              {familyData.totalWaterSaved || 0}L
            </span>
            <span className="text-[10px] font-bold text-[#6B7280] block">Water Saved</span>
          </div>
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-3 text-center space-y-1 shadow-sm">
            <Trees className="w-4 h-4 text-[#85a528] mx-auto" />
            <span className="text-base font-bold text-[#1F2937] block">
              ₹{familyData.totalCostSaved || 0}
            </span>
            <span className="text-[10px] font-bold text-[#6B7280] block">Cost Saved</span>
          </div>
        </div>
      </section>

      {/* Family Leaderboard */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#85a528]" /> Leaderboard
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
                className={`bg-[#ffffff] rounded-xl p-3.5 border flex items-center justify-between transition-all shadow-sm ${
                  isCurrentUser
                    ? "border-[#85a528] bg-[#E8F5E9]"
                    : "border-[#85a528]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg select-none w-6 text-center">
                    {idx < 3 ? rankEmojis[idx] : `#${idx + 1}`}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-[#F1F8E9] border border-[#85a528]/30 text-[#85a528] flex items-center justify-center text-sm font-bold select-none">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                      {member.name}
                      {isCurrentUser && (
                        <span className="text-[9px] font-bold text-white bg-[#85a528] px-1 rounded">You</span>
                      )}
                      {member.role === "admin" && (
                        <Crown className="w-3 h-3 text-[#85a528]" />
                      )}
                    </h4>
                    <p className="text-[10px] text-[#6B7280]">
                      Level {member.level || 1} · {member.streak || 0} day streak
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#85a528]">{member.xp || 0}</span>
                  <span className="text-[10px] font-bold text-[#6B7280] block">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shared Forest Preview */}
      <section className="bg-[#ffffff] rounded-xl p-5 border border-[#85a528]/30 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
          <Trees className="w-4 h-4 text-[#85a528]" /> Family Forest
        </h3>
        <div className="bg-[#F1F8E9] border border-[#85a528]/30 rounded-xl p-4 min-h-[110px] flex items-end justify-around relative overflow-hidden">
          {sortedMembers.map((member, idx) => {
            const treeCount = Math.max(1, Math.floor((member.xp || 0) / 200));
            const trees = ["🌱", "🌿", "🌳", "🌲", "🌲"];
            const treeEmoji = trees[Math.min(treeCount, trees.length - 1)];
            const sizes = ["text-xl", "text-2xl", "text-3xl", "text-4xl"];
            const treeSize = sizes[Math.min(treeCount, sizes.length - 1)];

            return (
              <div key={member.id} className="flex flex-col items-center text-center">
                <span
                  className={`${treeSize} select-none animate-bounce`}
                  style={{ animationDuration: `${2.5 + idx * 0.5}s` }}
                >
                  {treeEmoji}
                </span>
                <span className="text-[9px] font-bold text-[#85a528] uppercase mt-1">
                  {member.name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-center pt-1">
          <p className="text-[11px] text-[#6B7280]">
            Each member grows their own tree in the family forest. Complete more habits to make yours flourish!
          </p>
        </div>
      </section>

      {/* Leave / Reset Family Button */}
      {onLeaveFamily && (
        <div className="pt-2 text-center">
          <button
            id="btn-leave-family"
            onClick={() => {
              if (confirm("Are you sure you want to leave this family group?")) {
                onLeaveFamily();
              }
            }}
            className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
          >
            Leave Family Group
          </button>
        </div>
      )}
    </div>
  );
}
