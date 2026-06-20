import React, { useState, useEffect } from "react";
import { UserStats, Challenge, Badge, ChatMessage, FamilyStats } from "./types";
import { INITIAL_CHALLENGES, INITIAL_BADGES } from "./data";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Tracking from "./components/Tracking";
import Challenges from "./components/Challenges";
import Coach from "./components/Coach";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Family from "./components/Family";
import { Leaf } from "lucide-react";

type ScreenType = "home" | "track" | "challenges" | "coach" | "profile" | "family";

// ─── Helper: get daily challenges based on date seed ──────────────────────
function getDailyChallenges(allChallenges: Challenge[], count: number = 5): Challenge[] {
  const today = new Date().toISOString().split("T")[0];
  // Simple hash from date string for deterministic daily rotation
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed = ((seed << 5) - seed + today.charCodeAt(i)) | 0;
  }
  seed = Math.abs(seed);

  const dailyCandidates = allChallenges.filter((c) => c.isDaily !== false);
  const nonDaily = allChallenges.filter((c) => c.isDaily === false);

  // Shuffle daily candidates with seeded random
  const shuffled = [...dailyCandidates].sort((a, b) => {
    const ha = (seed * a.id.charCodeAt(1) + 7) % 100;
    const hb = (seed * b.id.charCodeAt(1) + 7) % 100;
    return ha - hb;
  });

  // Pick `count` daily + always include non-daily (weekly/long-term)
  return [...shuffled.slice(0, count), ...nonDaily];
}

export default function App() {
  // ─── Primary persistent state with localStorage + API sync ──────────
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("greensteps_user_stats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // clear corrupted
      }
    }
    return {
      name: "Sarah",
      avatar: "",
      homePeople: 2,
      travelMode: "Walk / Bicycle",
      sustainabilityGoals: ["Save Energy"],
      weeklyGoalXP: 300,
      level: 1,
      xp: 70,
      co2Saved: 1.2,
      waterSaved: 10,
      costSaved: 35,
      streak: 5,
      isOnboarded: false,
      completedActivityCount: 2,
      forestTrees: 0,
      lastActiveDate: new Date().toISOString().split("T")[0],
    };
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("greensteps_challenges");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If saved challenges don't include new ones, merge
        if (parsed.length < INITIAL_CHALLENGES.length) {
          const existingIds = new Set(parsed.map((c: Challenge) => c.id));
          const newChallenges = INITIAL_CHALLENGES.filter((c) => !existingIds.has(c.id));
          return [...parsed, ...newChallenges];
        }
        return parsed;
      } catch (e) { /* fallthrough */ }
    }
    return INITIAL_CHALLENGES;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem("greensteps_badges");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge any new badges
        if (parsed.length < INITIAL_BADGES.length) {
          const existingIds = new Set(parsed.map((b: Badge) => b.id));
          const newBadges = INITIAL_BADGES.filter((b) => !existingIds.has(b.id));
          return [...parsed, ...newBadges];
        }
        return parsed;
      } catch (e) { /* fallthrough */ }
    }
    return INITIAL_BADGES;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("greensteps_messages");
    return saved ? JSON.parse(saved) : [
      {
        id: "welcome-coach",
        role: "assistant",
        content: "Hello! I am Sprout, your friendly AI habit coach. 🌱\n\nHow can I help you customize your energy saving, water conservation, and waste reducing habits today? Let's make a lasting impact together!",
        timestamp: "10:17 AM",
      }
    ];
  });

  const [currentScreen, setScreen] = useState<ScreenType>("home");
  const [welcomeScreen, setWelcomeScreen] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [unreadCoachMessage, setUnreadCoachMessage] = useState<boolean>(false);
  const [familyData, setFamilyData] = useState<FamilyStats | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("greensteps_is_logged_in");
    return saved === "true";
  });

  // ─── Auth Handlers ──────────────────────────────────────────────────
  const handleLoginSuccess = async (enteredName: string, email?: string, password?: string) => {
    // Try server-side registration/login
    if (email && password) {
      try {
        // Try login first
        let res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (res.status === 401) {
          // Not found — try register
          res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: enteredName, email, password }),
          });
        }

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setStats((prev) => ({
              ...prev,
              ...data.user,
              name: data.user.name || enteredName,
              isOnboarded: data.user.isOnboarded || false,
            }));
            setIsLoggedIn(true);
            localStorage.setItem("greensteps_is_logged_in", "true");
            return;
          }
        }
      } catch (e) {
        console.warn("Server auth unavailable, falling back to local:", e);
      }
    }

    // Fallback: local-only login
    setStats((prev) => ({
      ...prev,
      name: enteredName,
    }));
    setIsLoggedIn(true);
    localStorage.setItem("greensteps_is_logged_in", "true");
  };

  // ─── Sync state to LocalStorage ─────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("greensteps_user_stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("greensteps_challenges", JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem("greensteps_badges", JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem("greensteps_messages", JSON.stringify(messages));
  }, [messages]);

  // ─── Sync stats to server when they change ──────────────────────────
  useEffect(() => {
    if (stats.id) {
      // Fire and forget — don't block UI
      fetch(`/api/user/${stats.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      }).catch(() => {}); // Silently fail if server unavailable
    }
  }, [stats]);

  // ─── Load family data if user belongs to a family ────────────────────
  useEffect(() => {
    if (stats.familyId) {
      fetch(`/api/family/${stats.familyId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.family) setFamilyData(data.family);
        })
        .catch(() => {});
    }
  }, [stats.familyId]);

  // ─── Badge & Milestone Checks ───────────────────────────────────────
  const checkMilestones = (updatedStats: UserStats, currentBadges: Badge[]) => {
    let changed = false;
    const newBadges = currentBadges.map((badge) => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;
      if (badge.id === "b1" && updatedStats.waterSaved >= 50) shouldUnlock = true;
      if (badge.id === "b2" && updatedStats.completedActivityCount >= 3) shouldUnlock = true;
      if (badge.id === "b3" && updatedStats.co2Saved >= 5) shouldUnlock = true;
      if (badge.id === "b4" && updatedStats.xp >= 400) shouldUnlock = true;
      // b5 (Eco Conversationalist) is handled in chat
      // b6 (Community Champion) — check community challenge completions
      // b7 (Mindful Green) — check mindfulness challenge completions
      // b8 (Family Root) — handled when joining/creating family

      if (shouldUnlock) {
        changed = true;
        return {
          ...badge,
          unlocked: true,
          unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return badge;
    });

    if (changed) {
      setBadges(newBadges);
    }
  };

  // ─── Record tracked activity ────────────────────────────────────────
  const handleRecordActivity = (impact: {
    co2Saved: number;
    waterSaved: number;
    costSaved: number;
    xpGained: number;
  }) => {
    setStats((prev) => {
      const newXp = prev.xp + impact.xpGained;
      const leveledUp = Math.floor(newXp / 300) > Math.floor(prev.xp / 300);
      const newLevel = leveledUp ? prev.level + 1 : prev.level;

      const updated: UserStats = {
        ...prev,
        xp: newXp,
        level: newLevel,
        co2Saved: prev.co2Saved + impact.co2Saved,
        waterSaved: prev.waterSaved + impact.waterSaved,
        costSaved: prev.costSaved + impact.costSaved,
        completedActivityCount: prev.completedActivityCount + 1,
        forestTrees: Math.floor(newXp / 200),
        lastActiveDate: new Date().toISOString().split("T")[0],
      };

      checkMilestones(updated, badges);

      // Sync to server
      if (prev.id) {
        fetch("/api/activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: prev.id,
            ...impact,
          }),
        }).catch(() => {});
      }

      return updated;
    });

    setScreen("home");
  };

  // ─── Complete a challenge ───────────────────────────────────────────
  const handleCompleteChallenge = (id: string) => {
    const targetChallenge = challenges.find((c) => c.id === id);
    if (!targetChallenge || targetChallenge.completed) return;

    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: true } : c))
    );

    setStats((prev) => {
      const newXp = prev.xp + targetChallenge.rewardXP;
      const leveledUp = Math.floor(newXp / 300) > Math.floor(prev.xp / 300);
      const newLevel = leveledUp ? prev.level + 1 : prev.level;

      const updated: UserStats = {
        ...prev,
        xp: newXp,
        level: newLevel,
        co2Saved: prev.co2Saved + (targetChallenge.co2Reward || 0),
        waterSaved: prev.waterSaved + (targetChallenge.waterReward || 0),
        costSaved: prev.costSaved + (targetChallenge.costReward || 0),
        completedActivityCount: prev.completedActivityCount + 1,
        forestTrees: Math.floor(newXp / 200),
        lastActiveDate: new Date().toISOString().split("T")[0],
      };

      checkMilestones(updated, badges);

      // Sync to server
      if (prev.id) {
        fetch(`/api/challenges/${id}/complete`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: prev.id,
            rewardXP: targetChallenge.rewardXP,
            co2Reward: targetChallenge.co2Reward,
            waterReward: targetChallenge.waterReward,
            costReward: targetChallenge.costReward,
          }),
        }).catch(() => {});
      }

      // Check community/mindfulness badge unlocks
      const completedCommunity = challenges.filter(
        (c) => c.category === "community" && (c.completed || c.id === id)
      ).length;
      const completedMindfulness = challenges.filter(
        (c) => c.category === "mindfulness" && (c.completed || c.id === id)
      ).length;

      setBadges((prevBadges) =>
        prevBadges.map((badge) => {
          if (badge.unlocked) return badge;
          if (badge.id === "b6" && completedCommunity >= 3) {
            return { ...badge, unlocked: true, unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          }
          if (badge.id === "b7" && completedMindfulness >= 2) {
            return { ...badge, unlocked: true, unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          }
          return badge;
        })
      );

      return updated;
    });
  };

  // ─── Re-seed challenges ─────────────────────────────────────────────
  const handleResetAllChallenges = () => {
    setChallenges(INITIAL_CHALLENGES.map((c) => ({ ...c, completed: false })));
  };

  // ─── Update profile name ────────────────────────────────────────────
  const handleUpdateName = (newName: string) => {
    setStats((prev) => ({ ...prev, name: newName }));
  };

  // ─── Chat with AI Coach ─────────────────────────────────────────────
  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          // Pass user stats for personalized AI responses
          userStats: {
            name: stats.name,
            level: stats.level,
            xp: stats.xp,
            co2Saved: stats.co2Saved,
            waterSaved: stats.waterSaved,
            costSaved: stats.costSaved,
            streak: stats.streak,
            forestTrees: stats.forestTrees,
            completedActivityCount: stats.completedActivityCount,
            sustainabilityGoals: stats.sustainabilityGoals,
            travelMode: stats.travelMode,
            homePeople: stats.homePeople,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Chat api failed");
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.reply || "Every small choice counts deeply. Let's make our world blossom! 🌱",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Unlock Eco Conversationalist badge
      setBadges((prevBadges) =>
        prevBadges.map((badge) => {
          if (badge.id === "b5" && !badge.unlocked) {
            return {
              ...badge,
              unlocked: true,
              unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return badge;
        })
      );
    } catch (e) {
      console.error("Coach API communication failure:", e);
      const botMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: "My leaves lost connection for a second, but my roots are safe! Let's clean up plastic bottles or air-dry clothes to help lower grid pressures today! 🌳",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // ─── Family Handlers ────────────────────────────────────────────────
  const handleCreateFamily = async (familyName: string) => {
    if (!stats.id) {
      // Local-only mode: create mock family
      const mockFamily: FamilyStats = {
        id: "local-family",
        name: familyName,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        members: [
          {
            id: stats.id || "local",
            name: stats.name,
            avatar: stats.avatar,
            level: stats.level,
            xp: stats.xp,
            co2Saved: stats.co2Saved,
            waterSaved: stats.waterSaved,
            streak: stats.streak,
            completedActivityCount: stats.completedActivityCount,
            role: "admin",
          },
        ],
        totalCo2Saved: stats.co2Saved,
        totalWaterSaved: stats.waterSaved,
        totalCostSaved: stats.costSaved,
        createdAt: new Date().toISOString(),
      };
      setFamilyData(mockFamily);
      setStats((prev) => ({ ...prev, familyId: mockFamily.id }));

      // Unlock Family Root badge
      setBadges((prevBadges) =>
        prevBadges.map((b) =>
          b.id === "b8" && !b.unlocked
            ? { ...b, unlocked: true, unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : b
        )
      );
      return;
    }

    try {
      const res = await fetch("/api/family/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: stats.id, familyName }),
      });
      const data = await res.json();
      if (data.family) {
        setFamilyData(data.family);
        setStats((prev) => ({ ...prev, familyId: data.family.id }));

        // Unlock Family Root badge
        setBadges((prevBadges) =>
          prevBadges.map((b) =>
            b.id === "b8" && !b.unlocked
              ? { ...b, unlocked: true, unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              : b
          )
        );
      }
    } catch (e) {
      console.error("Create family failed:", e);
    }
  };

  const handleJoinFamily = async (inviteCode: string) => {
    if (!stats.id) {
      // Local-only: just show a feedback
      return;
    }

    try {
      const res = await fetch("/api/family/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: stats.id, inviteCode }),
      });
      const data = await res.json();
      if (data.family) {
        setFamilyData(data.family);
        setStats((prev) => ({ ...prev, familyId: data.family.id }));

        // Unlock Family Root badge
        setBadges((prevBadges) =>
          prevBadges.map((b) =>
            b.id === "b8" && !b.unlocked
              ? { ...b, unlocked: true, unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              : b
          )
        );
      }
    } catch (e) {
      console.error("Join family failed:", e);
    }
  };

  // ─── Full reset ─────────────────────────────────────────────────────
  const handleResetApp = () => {
    localStorage.removeItem("greensteps_user_stats");
    localStorage.removeItem("greensteps_challenges");
    localStorage.removeItem("greensteps_badges");
    localStorage.removeItem("greensteps_messages");
    localStorage.removeItem("greensteps_is_logged_in");
    setIsLoggedIn(false);
    setFamilyData(null);
    setStats({
      name: "Sarah",
      avatar: "",
      homePeople: 2,
      travelMode: "Walk / Bicycle",
      sustainabilityGoals: ["Save Energy"],
      weeklyGoalXP: 300,
      level: 1,
      xp: 70,
      co2Saved: 1.2,
      waterSaved: 10,
      costSaved: 35,
      streak: 5,
      isOnboarded: false,
      completedActivityCount: 2,
      forestTrees: 0,
      lastActiveDate: new Date().toISOString().split("T")[0],
    });
    setChallenges(INITIAL_CHALLENGES.map((c) => ({ ...c, completed: false })));
    setBadges(INITIAL_BADGES.map((b) => ({ ...b, unlocked: false })));
    setMessages([
      {
        id: "welcome-coach",
        role: "assistant",
        content: "Hello! I am Sprout, your friendly AI habit coach. 🌱\n\nHow can I help you customize your energy saving, water conservation, and waste reducing habits today? Let's make a lasting impact together!",
        timestamp: "10:17 AM",
      }
    ]);
    setWelcomeScreen(true);
    setScreen("home");
  };

  const handleFinishOnboarding = (onboardData: Partial<UserStats>) => {
    setStats((prev) => ({
      ...prev,
      ...onboardData,
      isOnboarded: true,
      forestTrees: 0,
      lastActiveDate: new Date().toISOString().split("T")[0],
    }));
    setWelcomeScreen(false);
    setScreen("home");
  };

  // ─── View Routing ───────────────────────────────────────────────────
  const renderScreenContent = () => {
    switch (currentScreen) {
      case "home":
        return (
          <Dashboard
            stats={stats}
            challenges={challenges}
            onQuickAction={(targetScreen) => setScreen(targetScreen)}
            onCompleteChallenge={handleCompleteChallenge}
          />
        );
      case "track":
        return (
          <Tracking
            stats={stats}
            onRecordActivity={handleRecordActivity}
            onBackToHome={() => setScreen("home")}
          />
        );
      case "challenges":
        return (
          <Challenges
            stats={stats}
            challenges={challenges}
            onCompleteChallenge={handleCompleteChallenge}
            onResetAllChallenges={handleResetAllChallenges}
          />
        );
      case "coach":
        return (
          <Coach
            stats={stats}
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearHistory={() => setMessages([])}
            isAiLoading={isAiLoading}
          />
        );
      case "profile":
        return (
          <Profile
            stats={stats}
            badges={badges}
            onResetApp={handleResetApp}
            onUpdateName={handleUpdateName}
          />
        );
      case "family":
        return (
          <Family
            stats={stats}
            familyData={familyData}
            onCreateFamily={handleCreateFamily}
            onJoinFamily={handleJoinFamily}
          />
        );
      default:
        return null;
    }
  };

  /* Screen 1: Login */
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  /* Screen 2: Onboarding */
  if (!stats.isOnboarded) {
    return <Onboarding onComplete={handleFinishOnboarding} />;
  }

  // Active Main dashboard app container
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1F2937] font-sans pb-[100px] relative max-w-lg mx-auto border-x border-[#E8F5E9]/50 shadow-sm">
      {/* Top sticky app header bar */}
      <header className="sticky top-0 bg-[#FFFDF8]/95 backdrop-blur-sm z-30 flex justify-between items-center px-6 py-4 border-b border-[#E8F5E9]/40">
        <div className="flex items-center gap-2 select-none">
          <Leaf className="w-7 h-7 fill-current text-[#2E7D32]" />
          <h1 className="font-black text-2xl tracking-tight text-[#1F2937]">GreenSteps</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="header-nav-coach"
            onClick={() => setScreen("coach")}
            className="text-xs font-extrabold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1.5 rounded-full flex items-center gap-1 hover:opacity-90 active:scale-95"
          >
            <span>Ask Sprout 💬</span>
          </button>
        </div>
      </header>

      {/* Main content view */}
      <main className="px-6 pt-6">
        {renderScreenContent()}
      </main>

      {/* Bottom navigation */}
      <Navbar 
        currentScreen={currentScreen} 
        setScreen={(screen) => {
          setScreen(screen);
          if (screen === "coach") {
            setUnreadCoachMessage(false);
          }
        }} 
        unreadCoachMessage={unreadCoachMessage}
      />
    </div>
  );
}
