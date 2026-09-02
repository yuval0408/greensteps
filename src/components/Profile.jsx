import React, { useState, useRef } from "react";
import { 
  Award, 
  Settings, 
  Trees, 
  Share2, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  Check, 
  FileText, 
  X, 
  RotateCcw,
  Sparkles
} from "lucide-react";

export default function Profile({ stats, badges, onResetApp, onUpdateName, onUpdateProfile }) {
  // Modal & Edit State
  const [showSettings, setShowSettings] = useState(false);
  const [editingName, setEditingName] = useState(stats.name || "");
  const [editingEmail, setEditingEmail] = useState(stats.email || "sarah@example.com");
  const [editingMobile, setEditingMobile] = useState(stats.mobile || "9876543210");
  const [bio, setBio] = useState(stats.bio || "");
  const [isBioSaving, setIsBioSaving] = useState(false);
  const [bioSavedNotification, setBioSavedNotification] = useState(false);
  
  // Settings save notifications
  const [settingsSavedNotification, setSettingsSavedNotification] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);

  // Avatar file input reference
  const fileInputRef = useRef(null);

  const unlockedBadges = badges.filter((b) => b.unlocked);

  // Fallback Initials calculation
  const getInitials = (nameStr) => {
    if (!nameStr) return "EG";
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  // Avatar upload handler (FileReader Base64 Data URL)
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Image size should be under 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        if (onUpdateProfile) {
          onUpdateProfile({ avatar: base64Data });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Bio Handler
  const handleSaveBio = (e) => {
    e.preventDefault();
    setIsBioSaving(true);
    setTimeout(() => {
      if (onUpdateProfile) {
        onUpdateProfile({ bio });
      }
      setIsBioSaving(false);
      setBioSavedNotification(true);
      setTimeout(() => setBioSavedNotification(false), 3000);
    }, 400);
  };

  // Save Settings Handler (Account Details)
  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (editingName.trim()) {
      if (onUpdateProfile) {
        onUpdateProfile({
          name: editingName.trim(),
          email: editingEmail.trim(),
          mobile: editingMobile.trim(),
        });
      } else if (onUpdateName) {
        onUpdateName(editingName.trim());
      }
      setSettingsSavedNotification(true);
      setTimeout(() => {
        setSettingsSavedNotification(false);
        setShowSettings(false);
      }, 1200);
    }
  };

  const handleShare = () => {
    setShowShareNotification(true);
    setTimeout(() => {
      setShowShareNotification(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in relative font-sans">
      
      {/* ─── Profile Header Block & Photo Upload ─────────────────────────── */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2">
        <div className="relative group">
          {/* Avatar Container */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#85a528] shadow-md bg-[#F1F8E9] flex items-center justify-center relative">
            {stats.avatar ? (
              <img 
                alt="Profile Avatar" 
                src={stats.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#85a528] text-white font-bold text-2xl flex items-center justify-center tracking-wider select-none">
                {getInitials(stats.name)}
              </div>
            )}

            {/* Hover Camera Overlay Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload / Change Profile Photo"
              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200 cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white mb-0.5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Upload</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Level Badge Pill */}
          <span className="absolute bottom-0 right-0 bg-[#85a528] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md uppercase">
            Level {stats.level}
          </span>
        </div>

        {/* Action button to Browse Photo */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[11px] font-bold text-[#85a528] hover:text-[#6f8c1f] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Browse / Change Photo</span>
        </button>

        {/* User Name & Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1F2937] leading-tight flex items-center justify-center gap-1.5">
            {stats.name} 
            <Award className="w-4 h-4 text-[#85a528] fill-current" />
          </h2>
          <p className="text-[11px] font-bold text-[#85a528] uppercase tracking-wider">
            Forest Guardian 🌳
          </p>
        </div>

        {/* Configure & Share Actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-trigger-settings"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#85a528] bg-[#ffffff] border border-[#85a528]/30 px-3 py-1.5 rounded-md hover:border-[#85a528] active:scale-95 transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85a528]"
          >
            <Settings className="w-3.5 h-3.5" /> Account & Settings
          </button>
          
          <button
            id="btn-share-impact"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#85a528] px-3 py-1.5 rounded-md hover:bg-[#6f8c1f] active:scale-95 transition-all uppercase tracking-wider shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85a528]"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Impact
          </button>
        </div>

        {showShareNotification && (
          <div className="bg-[#85a528] text-white text-xs font-bold px-4 py-2 rounded-md shadow-md text-center max-w-xs mx-auto animate-bounce uppercase tracking-wider">
            🔗 Copied Eco Green Forest URL!
          </div>
        )}
      </div>

      {/* ─── User Bio Component ──────────────────────────────────────────── */}
      <section className="bg-[#ffffff] rounded-xl p-5 border border-[#85a528]/30 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#85a528]" /> User Bio & Story
          </h3>
          <span className="text-[11px] font-bold text-[#9f9fa5]">
            {bio.length}/150 Chars
          </span>
        </div>

        <form onSubmit={handleSaveBio} className="space-y-3">
          <textarea
            id="input-user-bio"
            rows={3}
            maxLength={150}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share your sustainability story, eco goals, or green passion..."
            className="w-full text-xs p-3 border border-[#85a528]/30 bg-[#F1F8E9] rounded-lg text-[#1F2937] placeholder-[#9f9fa5] focus:border-[#85a528] outline-none transition-all resize-none focus-visible:ring-2 focus-visible:ring-[#85a528]"
          />

          <div className="flex items-center justify-between">
            {bioSavedNotification ? (
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Bio Saved!
              </span>
            ) : (
              <span className="text-[10px] text-[#9f9fa5]">
                Appears on your public guardian card.
              </span>
            )}

            <button
              id="btn-save-bio"
              type="submit"
              disabled={isBioSaving}
              className="bg-[#a6cd37] hover:bg-[#85a528] text-black font-bold text-xs px-4 py-1.5 rounded-md uppercase tracking-wider active:scale-95 transition-all shadow-sm cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85a528]"
            >
              {isBioSaving ? "Saving..." : "Save Bio"}
            </button>
          </div>
        </form>
      </section>

      {/* ─── Lifetime Cumulative Impact ─────────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[#1F2937]">Lifetime Cumulative Impact</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-4 text-center space-y-1 shadow-sm">
            <span className="text-[10px] font-bold text-[#9f9fa5] block uppercase">Green Score</span>
            <span className="text-xl font-bold text-[#85a528]">{(stats.co2Saved + 14.5).toFixed(1)} Points</span>
          </div>
          <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-4 text-center space-y-1 shadow-sm">
            <span className="text-[10px] font-bold text-[#9f9fa5] block uppercase">Water Conserved</span>
            <span className="text-xl font-bold text-[#85a528]">{stats.waterSaved + 85} L</span>
          </div>
        </div>
      </section>

      {/* ─── Custom Forest Plot Sandbox ──────────────────────────────────── */}
      <section className="bg-[#ffffff] rounded-xl p-5 border border-[#85a528]/30 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
            <Trees className="w-4 h-4 text-[#85a528]" /> Custom Forest Plot
          </h3>
          <span className="text-xs font-bold text-[#85a528]">
            Stage: {stats.xp <= 150 ? "Seed 🌱" : stats.xp <= 400 ? "Plant 🌿" : stats.xp <= 800 ? "Sapling 🌳" : "Canopy 🌲"}
          </span>
        </div>

        {/* Dynamic visual forest based on XP */}
        <div className="bg-[#F1F8E9] border border-[#85a528]/30 rounded-xl p-4 min-h-[120px] flex items-end justify-around relative overflow-hidden">
          {(() => {
            const treeCount = Math.max(1, stats.forestTrees || Math.floor(stats.xp / 200));
            const treeTypes = [
              { emoji: "🌱", label: "Seedling", size: "text-2xl" },
              { emoji: "🌿", label: "Fern", size: "text-3xl" },
              { emoji: "🌳", label: "Oak", size: "text-4xl" },
              { emoji: "🌲", label: "Pine", size: "text-4xl" },
              { emoji: "🎋", label: "Bamboo", size: "text-3xl" },
              { emoji: "🌴", label: "Palm", size: "text-4xl" },
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
                  <span className={`text-[9px] font-bold uppercase mt-1 ${i < treeCount ? "text-[#85a528]" : "text-[#9f9fa5]"}`}>
                    {i < treeCount ? type.label : "Growing..."}
                  </span>
                </div>
              );
            }

            if (trees.length < 5) {
              trees.push(
                <div key="placeholder" className="flex flex-col items-center text-center opacity-30">
                  <div className="w-8 h-8 border border-dashed border-[#9f9fa5] rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-[#9f9fa5] select-none">+</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#9f9fa5] mt-1">Next</span>
                </div>
              );
            }

            return trees;
          })()}
        </div>

        <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs border-t border-[#85a528]/20">
          <div>
            <span className="text-base font-bold text-[#85a528]">{stats.forestTrees || Math.floor(stats.xp / 200)}</span>
            <span className="text-[10px] text-[#9f9fa5] block">Grown Trees</span>
          </div>
          <div>
            <span className="text-base font-bold text-[#85a528]">{unlockedBadges.length}</span>
            <span className="text-[10px] text-[#9f9fa5] block">Eco Badges</span>
          </div>
          <div>
            <span className="text-base font-bold text-[#85a528]">{stats.completedActivityCount}</span>
            <span className="text-[10px] text-[#9f9fa5] block">Habits Logged</span>
          </div>
        </div>
      </section>

      {/* ─── Milestones Showcase ────────────────────────────────────────── */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[#1F2937]">My Milestones & Badges</h3>
        <p className="text-xs text-[#556B2F]">
          Unlock helpful badges by completing daily chores or talking to Sprout!
        </p>

        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => {
            const isUnlocked = badge.unlocked;
            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`border rounded-xl p-3.5 flex flex-col items-center text-center space-y-2 relative overflow-hidden transition-all shadow-sm ${
                  isUnlocked 
                    ? "bg-[#ffffff] border-[#85a528]" 
                    : "bg-[#F1F8E9] border-dashed border-[#85a528]/30 opacity-60"
                }`}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl select-none ${
                  isUnlocked ? "bg-[#85a528] text-white" : "bg-[#ffffff] text-[#9f9fa5] border border-[#85a528]/20"
                }`}>
                  {isUnlocked ? badge.emoji : "🔒"}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1F2937] leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-[#9f9fa5] leading-snug">
                    {badge.description}
                  </p>
                </div>
                
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                  isUnlocked ? "bg-[#E8F5E9] text-[#85a528]" : "bg-[#ffffff] text-[#9f9fa5]"
                }`}>
                  {isUnlocked ? "Unlocked" : `Rule: ${badge.requirement}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Settings Modal (Account Details / Personal Info) ───────────── */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#85a528]/30 w-full max-w-md space-y-5 shadow-2xl relative my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#85a528]/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#85a528]" /> Account Details & Settings
                </h3>
                <p className="text-xs text-[#9f9fa5]">
                  Manage personal profile credentials and settings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="text-[#9f9fa5] hover:text-[#1F2937] p-1 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Details Form */}
            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#85a528] uppercase tracking-wider">
                  Full Name
                </label>
                <div className="flex items-center border border-[#85a528]/30 rounded-lg px-3 py-2 bg-[#F1F8E9] focus-within:border-[#85a528] transition-all">
                  <span className="mr-2 text-[#9f9fa5] shrink-0">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs text-[#1F2937] placeholder-[#9f9fa5]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#85a528] uppercase tracking-wider">
                  Email Address
                </label>
                <div className="flex items-center border border-[#85a528]/30 rounded-lg px-3 py-2 bg-[#F1F8E9] focus-within:border-[#85a528] transition-all">
                  <span className="mr-2 text-[#9f9fa5] shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={editingEmail}
                    onChange={(e) => setEditingEmail(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-xs text-[#1F2937] placeholder-[#9f9fa5]"
                  />
                </div>
              </div>

              {/* Mobile Number (10 Digits) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#85a528] uppercase tracking-wider flex justify-between">
                  <span>Mobile Number (10 Digits)</span>
                  <span className="text-[10px] text-[#9f9fa5] font-normal">Standard 10-digit</span>
                </label>
                <div className="flex items-center border border-[#85a528]/30 rounded-lg px-3 py-2 bg-[#F1F8E9] focus-within:border-[#85a528] transition-all">
                  <span className="mr-2 text-[#9f9fa5] shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={editingMobile}
                    onChange={(e) => setEditingMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent border-none outline-none text-xs text-[#1F2937] placeholder-[#9f9fa5]"
                  />
                </div>
              </div>

              {/* Success Notification Alert */}
              {settingsSavedNotification && (
                <div className="bg-[#E8F5E9] border border-[#a6cd37] p-2.5 rounded-lg flex items-center justify-center gap-2 text-center text-xs text-[#85a528] font-bold shadow-sm animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#85a528]" />
                  <span>✓ Settings Updated Successfully!</span>
                </div>
              )}

              {/* Save & Cancel Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-[#ffffff] border border-[#85a528]/30 text-[#9f9fa5] hover:text-[#1F2937] py-2.5 rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#a6cd37] hover:bg-[#85a528] text-black font-bold py-2.5 rounded-lg text-xs active:scale-95 transition-all uppercase tracking-wider cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85a528]"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Reset App Option */}
            <div className="border-t border-[#85a528]/20 pt-3 text-center">
              <button
                id="btn-reset-onboarding"
                type="button"
                onClick={() => {
                  if (confirm("Reset my entire progress? This clears custom forest, level stats, and starts step-by-step onboarding fresh.")) {
                    onResetApp();
                    setShowSettings(false);
                  }
                }}
                className="text-xs font-bold text-red-500 hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Data & Retake Onboarding</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
