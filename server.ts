import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// ─── JSON File Store Helpers ────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON(filename: string): any {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
  } catch {
    return null;
  }
}

function writeJSON(filename: string, data: any) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─── Default Data Factories ─────────────────────────────────────────────────
function createDefaultUser(name: string, email: string, password: string) {
  return {
    id: generateId(),
    name,
    email,
    password, // Simple demo — no hashing for local app
    avatar: "",
    homePeople: 2,
    travelMode: "Walk / Bicycle",
    sustainabilityGoals: ["Save Energy"],
    weeklyGoalXP: 300,
    level: 1,
    xp: 0,
    co2Saved: 0,
    waterSaved: 0,
    costSaved: 0,
    streak: 1,
    isOnboarded: false,
    completedActivityCount: 0,
    forestTrees: 0,
    lastActiveDate: new Date().toISOString().split("T")[0],
    familyId: undefined,
    createdAt: new Date().toISOString(),
  };
}

// ─── Server Setup ───────────────────────────────────────────────────────────
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  ensureDataDir();

  // Initialize data files if they don't exist
  if (!readJSON("users.json")) writeJSON("users.json", []);
  if (!readJSON("families.json")) writeJSON("families.json", []);

  // ─── Initializing Google Gen AI Client ──────────────────────────────────
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // ════════════════════════════════════════════════════════════════════════
  // AUTH ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════

  // Register a new user
  app.post("/api/register", (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
      }

      const users = readJSON("users.json") || [];
      const existing = users.find((u: any) => u.email === email);
      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists. Try logging in." });
      }

      const newUser = createDefaultUser(name.trim(), email.toLowerCase().trim(), password);
      users.push(newUser);
      writeJSON("users.json", users);

      const { password: _, ...safeUser } = newUser;
      res.json({ user: safeUser });
    } catch (error: any) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Registration failed." });
    }
  });

  // Login an existing user
  app.post("/api/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const users = readJSON("users.json") || [];
      const user = users.find(
        (u: any) => u.email === email.toLowerCase().trim() && u.password === password
      );

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Update streak based on last active date
      const today = new Date().toISOString().split("T")[0];
      const lastActive = user.lastActiveDate;
      if (lastActive) {
        const daysDiff = Math.floor(
          (new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff === 1) {
          user.streak = (user.streak || 0) + 1;
        } else if (daysDiff > 1) {
          user.streak = 1; // Reset streak
        }
        // daysDiff === 0 means same day, keep streak
      }
      user.lastActiveDate = today;
      writeJSON("users.json", users);

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed." });
    }
  });

  // ════════════════════════════════════════════════════════════════════════
  // USER ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════

  // Get user by ID
  app.get("/api/user/:id", (req, res) => {
    try {
      const users = readJSON("users.json") || [];
      const user = users.find((u: any) => u.id === req.params.id);
      if (!user) return res.status(404).json({ error: "User not found." });

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to fetch user." });
    }
  });

  // Update user stats
  app.put("/api/user/:id", (req, res) => {
    try {
      const users = readJSON("users.json") || [];
      const idx = users.findIndex((u: any) => u.id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "User not found." });

      const updates = req.body;
      // Merge updates into user, preserving password and id
      const protectedFields = ["id", "email", "password", "createdAt"];
      for (const key of Object.keys(updates)) {
        if (!protectedFields.includes(key)) {
          users[idx][key] = updates[key];
        }
      }
      users[idx].lastActiveDate = new Date().toISOString().split("T")[0];
      writeJSON("users.json", users);

      const { password: _, ...safeUser } = users[idx];
      res.json({ user: safeUser });
    } catch (error: any) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user." });
    }
  });

  // ════════════════════════════════════════════════════════════════════════
  // CHALLENGES ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════

  // Complete a challenge
  app.put("/api/challenges/:challengeId/complete", (req, res) => {
    try {
      const { userId, rewardXP, co2Reward, waterReward, costReward } = req.body;
      if (!userId) return res.status(400).json({ error: "userId is required." });

      const users = readJSON("users.json") || [];
      const userIdx = users.findIndex((u: any) => u.id === userId);
      if (userIdx === -1) return res.status(404).json({ error: "User not found." });

      const user = users[userIdx];
      const newXp = (user.xp || 0) + (rewardXP || 0);
      const leveledUp = Math.floor(newXp / 300) > Math.floor((user.xp || 0) / 300);

      user.xp = newXp;
      user.level = leveledUp ? (user.level || 1) + 1 : user.level || 1;
      user.co2Saved = (user.co2Saved || 0) + (co2Reward || 0);
      user.waterSaved = (user.waterSaved || 0) + (waterReward || 0);
      user.costSaved = (user.costSaved || 0) + (costReward || 0);
      user.completedActivityCount = (user.completedActivityCount || 0) + 1;

      // Forest tree growth: add a tree every 200 XP
      user.forestTrees = Math.floor(newXp / 200);

      user.lastActiveDate = new Date().toISOString().split("T")[0];
      writeJSON("users.json", users);

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser, challengeId: req.params.challengeId });
    } catch (error: any) {
      console.error("Complete challenge error:", error);
      res.status(500).json({ error: "Failed to complete challenge." });
    }
  });

  // ════════════════════════════════════════════════════════════════════════
  // ACTIVITY TRACKING ENDPOINT
  // ════════════════════════════════════════════════════════════════════════

  app.post("/api/activity", (req, res) => {
    try {
      const { userId, co2Saved, waterSaved, costSaved, xpGained } = req.body;
      if (!userId) return res.status(400).json({ error: "userId is required." });

      const users = readJSON("users.json") || [];
      const userIdx = users.findIndex((u: any) => u.id === userId);
      if (userIdx === -1) return res.status(404).json({ error: "User not found." });

      const user = users[userIdx];
      const newXp = (user.xp || 0) + (xpGained || 0);
      const leveledUp = Math.floor(newXp / 300) > Math.floor((user.xp || 0) / 300);

      user.xp = newXp;
      user.level = leveledUp ? (user.level || 1) + 1 : user.level || 1;
      user.co2Saved = (user.co2Saved || 0) + (co2Saved || 0);
      user.waterSaved = (user.waterSaved || 0) + (waterSaved || 0);
      user.costSaved = (user.costSaved || 0) + (costSaved || 0);
      user.completedActivityCount = (user.completedActivityCount || 0) + 1;
      user.forestTrees = Math.floor(newXp / 200);
      user.lastActiveDate = new Date().toISOString().split("T")[0];

      writeJSON("users.json", users);

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error: any) {
      console.error("Activity error:", error);
      res.status(500).json({ error: "Failed to record activity." });
    }
  });

  // ════════════════════════════════════════════════════════════════════════
  // FAMILY ENDPOINTS
  // ════════════════════════════════════════════════════════════════════════

  // Create a family group
  app.post("/api/family/create", (req, res) => {
    try {
      const { userId, familyName } = req.body;
      if (!userId || !familyName) {
        return res.status(400).json({ error: "userId and familyName are required." });
      }

      const users = readJSON("users.json") || [];
      const families = readJSON("families.json") || [];
      const userIdx = users.findIndex((u: any) => u.id === userId);
      if (userIdx === -1) return res.status(404).json({ error: "User not found." });

      const user = users[userIdx];
      const family = {
        id: generateId(),
        name: familyName,
        inviteCode: generateInviteCode(),
        members: [
          {
            id: user.id,
            name: user.name,
            avatar: user.avatar || "",
            level: user.level || 1,
            xp: user.xp || 0,
            co2Saved: user.co2Saved || 0,
            waterSaved: user.waterSaved || 0,
            streak: user.streak || 0,
            completedActivityCount: user.completedActivityCount || 0,
            role: "admin",
          },
        ],
        totalCo2Saved: user.co2Saved || 0,
        totalWaterSaved: user.waterSaved || 0,
        totalCostSaved: user.costSaved || 0,
        createdAt: new Date().toISOString(),
      };

      families.push(family);
      writeJSON("families.json", families);

      // Update user with familyId
      users[userIdx].familyId = family.id;
      writeJSON("users.json", users);

      res.json({ family });
    } catch (error: any) {
      console.error("Create family error:", error);
      res.status(500).json({ error: "Failed to create family." });
    }
  });

  // Join a family via invite code
  app.post("/api/family/join", (req, res) => {
    try {
      const { userId, inviteCode } = req.body;
      if (!userId || !inviteCode) {
        return res.status(400).json({ error: "userId and inviteCode are required." });
      }

      const users = readJSON("users.json") || [];
      const families = readJSON("families.json") || [];
      const userIdx = users.findIndex((u: any) => u.id === userId);
      if (userIdx === -1) return res.status(404).json({ error: "User not found." });

      const familyIdx = families.findIndex(
        (f: any) => f.inviteCode === inviteCode.toUpperCase()
      );
      if (familyIdx === -1) return res.status(404).json({ error: "Invalid invite code." });

      const user = users[userIdx];
      const family = families[familyIdx];

      // Check if already a member
      if (family.members.some((m: any) => m.id === userId)) {
        return res.status(409).json({ error: "You are already a member of this family." });
      }

      family.members.push({
        id: user.id,
        name: user.name,
        avatar: user.avatar || "",
        level: user.level || 1,
        xp: user.xp || 0,
        co2Saved: user.co2Saved || 0,
        waterSaved: user.waterSaved || 0,
        streak: user.streak || 0,
        completedActivityCount: user.completedActivityCount || 0,
        role: "member",
      });

      // Recalculate totals
      family.totalCo2Saved = family.members.reduce((sum: number, m: any) => sum + (m.co2Saved || 0), 0);
      family.totalWaterSaved = family.members.reduce((sum: number, m: any) => sum + (m.waterSaved || 0), 0);

      writeJSON("families.json", families);

      users[userIdx].familyId = family.id;
      writeJSON("users.json", users);

      res.json({ family });
    } catch (error: any) {
      console.error("Join family error:", error);
      res.status(500).json({ error: "Failed to join family." });
    }
  });

  // Get family details
  app.get("/api/family/:id", (req, res) => {
    try {
      const families = readJSON("families.json") || [];
      const family = families.find((f: any) => f.id === req.params.id);
      if (!family) return res.status(404).json({ error: "Family not found." });

      // Refresh member stats from users.json
      const users = readJSON("users.json") || [];
      family.members = family.members.map((m: any) => {
        const currentUser = users.find((u: any) => u.id === m.id);
        if (currentUser) {
          return {
            ...m,
            name: currentUser.name,
            level: currentUser.level || 1,
            xp: currentUser.xp || 0,
            co2Saved: currentUser.co2Saved || 0,
            waterSaved: currentUser.waterSaved || 0,
            streak: currentUser.streak || 0,
            completedActivityCount: currentUser.completedActivityCount || 0,
          };
        }
        return m;
      });

      family.totalCo2Saved = family.members.reduce((sum: number, m: any) => sum + (m.co2Saved || 0), 0);
      family.totalWaterSaved = family.members.reduce((sum: number, m: any) => sum + (m.waterSaved || 0), 0);
      family.totalCostSaved = family.members.reduce((sum: number, m: any) => sum + (m.costSaved || 0), 0);

      res.json({ family });
    } catch (error: any) {
      console.error("Get family error:", error);
      res.status(500).json({ error: "Failed to fetch family." });
    }
  });

  // Get family leaderboard
  app.get("/api/family/:id/leaderboard", (req, res) => {
    try {
      const families = readJSON("families.json") || [];
      const family = families.find((f: any) => f.id === req.params.id);
      if (!family) return res.status(404).json({ error: "Family not found." });

      // Refresh and sort by XP
      const users = readJSON("users.json") || [];
      const leaderboard = family.members
        .map((m: any) => {
          const currentUser = users.find((u: any) => u.id === m.id);
          return currentUser
            ? {
                id: m.id,
                name: currentUser.name,
                level: currentUser.level || 1,
                xp: currentUser.xp || 0,
                co2Saved: currentUser.co2Saved || 0,
                waterSaved: currentUser.waterSaved || 0,
                streak: currentUser.streak || 0,
                completedActivityCount: currentUser.completedActivityCount || 0,
                role: m.role,
              }
            : m;
        })
        .sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0));

      res.json({ leaderboard, familyName: family.name });
    } catch (error: any) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard." });
    }
  });

  // ════════════════════════════════════════════════════════════════════════
  // AI COACH ENDPOINT (Enhanced with user stats context)
  // ════════════════════════════════════════════════════════════════════════

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, userStats } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      // Build personalized system instruction with user context
      let statsContext = "";
      if (userStats) {
        statsContext = `
CURRENT USER CONTEXT:
- Name: ${userStats.name || "Friend"}
- Level: ${userStats.level || 1} | XP: ${userStats.xp || 0}
- Streak: ${userStats.streak || 0} days
- CO₂ Offset: ${(userStats.co2Saved || 0).toFixed(1)} kg
- Water Saved: ${userStats.waterSaved || 0} liters
- Cost Saved: ₹${userStats.costSaved || 0}
- Trees Grown: ${userStats.forestTrees || 0}
- Activities Completed: ${userStats.completedActivityCount || 0}
- Primary Goal: ${(userStats.sustainabilityGoals || ["Save Energy"]).join(", ")}
- Travel Style: ${userStats.travelMode || "Walk / Bicycle"}
- Household Size: ${userStats.homePeople || 1} people

Use this context to personalize your responses. Celebrate their achievements, reference their streak, and suggest habits aligned with their goals.`;
      }

      const systemInstruction = `You are "Sprout", the warm and joyful AI Coach for the GreenSteps app.
Your tone is encouraging, clear, and positive—resembling a friendly companion from Duolingo or Headspace.
Your primary audience includes older adults, parents, students, teachers, and everyday citizens who want to build green habits, save water, save energy, reduce waste, and grow their virtual forest.
Keep answers incredibly positive, inspiring, and accessible. Do not focus on complex carbon equations or intimidating terms. Use simple analogies instead (e.g., "that's equivalent to fully charging your phone 15 times!").
Format with short paragraphs, clear spacing, lists with emojis, and bold tags for emphasis. Key thoughts must be highly readable and actionable. Match query length but try to be efficient (under 3 short paragraphs). Give 1-2 small habits they can try today in every response!
${statsContext}`;

      // Map incoming chat message formats to Gemini parts structure
      const contents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const model = "gemini-3.5-flash";
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyContent = response.text || "Every action counts, just like a seed turning into a grand oak! How can I help you today? 🌱";
      res.json({ reply: replyContent });
    } catch (error: any) {
      console.error("Error in AI Coach endpoint API handler:", error);
      res.json({
        reply: "I lost my connection for a quick second, but my roots are strong! Let's talk about simple ways we can save energy or reduce food waste today. 🌳",
      });
    }
  });

  // ════════════════════════════════════════════════════════════════════════
  // VITE DEV MIDDLEWARE
  // ════════════════════════════════════════════════════════════════════════

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GreenSteps Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
