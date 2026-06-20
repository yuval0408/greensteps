export interface UserStats {
  id?: string;
  name: string;
  avatar: string;
  homePeople: number;
  travelMode: string;
  sustainabilityGoals: string[];
  weeklyGoalXP: number;
  level: number;
  xp: number;
  co2Saved: number; // in kg
  waterSaved: number; // in Liters
  costSaved: number; // in ₹
  streak: number;
  isOnboarded: boolean;
  completedActivityCount: number;
  forestTrees: number; // number of trees grown in the virtual forest
  lastActiveDate: string; // ISO date string for streak tracking
  familyId?: string; // optional family group membership
}

export interface Challenge {
  id: string;
  title: string;
  category: "transport" | "food" | "energy" | "shopping" | "community" | "mindfulness";
  description: string;
  rewardXP: number;
  difficulty: "Easy" | "Medium" | "Hard";
  impactText: string;
  completed: boolean;
  emoji: string;
  co2Reward: number; // kg saved
  waterReward: number; // liters saved
  costReward: number; // rupee saved
  timeEstimate?: string; // e.g. "5 min", "30 min"
  isDaily?: boolean; // daily-rotating challenge flag
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  iconName: string;
  colorClass: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface TrackQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    description: string;
    emoji: string;
    co2Saved: number;
    waterSaved: number;
    costSaved: number;
    xp: number;
    feedback: string;
  }[];
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  co2Saved: number;
  waterSaved: number;
  streak: number;
  completedActivityCount: number;
  role: "admin" | "member";
}

export interface FamilyStats {
  id: string;
  name: string;
  inviteCode: string;
  members: FamilyMember[];
  totalCo2Saved: number;
  totalWaterSaved: number;
  totalCostSaved: number;
  createdAt: string;
}
