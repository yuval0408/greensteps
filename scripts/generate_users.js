import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const firstNamesMale = [
  "Aarav", "Rohan", "Vikram", "Siddharth", "Aditya", "Arjun", "Dev", "Vivaan", "Kabir", "Rajesh",
  "Suresh", "Aniket", "Rahul", "Ishan", "Parth", "Yash", "Pranav", "Alok", "Nikhil", "Varun",
  "Kunal", "Amit", "Sachin", "Dhruv", "Manav", "Utkarsh", "Tushar", "Akash", "Kartik", "Gourav",
  "Chirag", "Tarun", "Samar", "Madhav", "Mayank", "Harsh", "Gautam", "Deepak", "Chetan", "Sameer",
  "Ritesh", "Abhinav", "Vishal", "Rishi", "Omkar", "Harish", "Vinay", "Mohit", "Karan", "Sujay"
];

const firstNamesFemale = [
  "Ananya", "Priya", "Kavya", "Meera", "Ishita", "Sneha", "Riya", "Diya", "Aditi", "Pooja",
  "Shruti", "Divya", "Tanvi", "Shreya", "Neha", "Sakshi", "Deepika", "Swati", "Priyanka", "Rashmi",
  "Aarti", "Anjali", "Sanjana", "Simran", "Archana", "Vidya", "Bhavna", "Ritika", "Sunita", "Chetna",
  "Mansi", "Sunaina", "Shalini", "Preeti", "Richa", "Namrata", "Sonali", "Charu", "Kriti", "Sonam",
  "Revathi", "Lakshmi", "Nitya", "Akshara", "Vandana", "Pallavi", "Pragya", "Niharika", "Leela", "Komal"
];

const lastNames = [
  "Sharma", "Patel", "Verma", "Iyer", "Reddy", "Gupta", "Singh", "Kumar", "Nair", "Deshmukh",
  "Joshi", "Rao", "Mehta", "Das", "Chatterjee", "Banerjee", "Mukherjee", "Agarwal", "Kulkarni", "Shah",
  "Bhat", "Chaudhary", "Gill", "Malviya", "Thakur", "Srivastava", "Saxena", "Mishra", "Tripathi", "Menon",
  "Pillai", "Hegde", "Gowda", "Shetty", "Sengupta", "Bose", "Choudhury", "Jain", "Mahajan", "Trivedi",
  "Nambiar", "Kapoor", "Varma", "Somani", "Rastogi", "Solanki", "Dutta", "Pandey", "Ghosh", "Kashyap"
];

const cities = [
  "Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Kolkata", "Jaipur", "Kochi",
  "Chandigarh", "Lucknow", "Indore", "Surat", "Coimbatore", "Nagpur", "Bhopal", "Vadodara", "Visakhapatnam", "Patna",
  "Bhubaneswar", "Dehradun", "Mysore", "Guwahati", "Ludhiana"
];

const travelModes = [
  "Walk / Bicycle", "Public Transport (Bus/Metro)", "EV / Hybrid Vehicle", "Carpooling", "Electric Scooter"
];

const sustainabilityGoalsList = [
  ["Save Energy", "Reduce Plastic"],
  ["Save Water", "Composting"],
  ["Zero Waste", "Plant Trees"],
  ["Public Transport", "Save Energy"],
  ["Save Water", "Plant-based Diet"],
  ["Reduce Plastic", "Save Energy", "Save Water"]
];

const users = [];

// User #1: Keep default demo user Yuval Sanjay Patel
users.push({
  id: "mtect41ipt7352",
  name: "Yuval Sanjay Patel",
  email: "yuvalpatel04@gmail.com",
  password: "yuval@123",
  avatar: "",
  city: "Mumbai",
  homePeople: 3,
  travelMode: "Walk / Bicycle",
  sustainabilityGoals: ["Save Energy", "Save Water"],
  weeklyGoalXP: 300,
  level: 5,
  xp: 1250,
  co2Saved: 142.5,
  waterSaved: 850,
  costSaved: 3200,
  streak: 12,
  isOnboarded: true,
  completedActivityCount: 28,
  forestTrees: 6,
  lastActiveDate: new Date().toISOString().split("T")[0],
  createdAt: "2026-08-20T10:00:00.000Z"
});

// Generate 99 more Indian users
for (let i = 2; i <= 100; i++) {
  const isMale = i % 2 === 0;
  const firstName = isMale 
    ? firstNamesMale[(i / 2 - 1) % firstNamesMale.length]
    : firstNamesFemale[Math.floor(i / 2) % firstNamesFemale.length];
  const lastName = lastNames[(i * 7) % lastNames.length];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;
  const city = cities[i % cities.length];
  const level = Math.floor(Math.random() * 14) + 1; // Level 1 to 15
  const xp = level * 300 + Math.floor(Math.random() * 250);
  const co2Saved = parseFloat((xp * 0.12 + Math.random() * 20).toFixed(1));
  const waterSaved = Math.floor(xp * 0.85 + Math.random() * 150);
  const costSaved = Math.floor(xp * 2.8 + Math.random() * 500);
  const streak = Math.floor(Math.random() * 30) + 1;
  const completedActivityCount = Math.floor(xp / 40);
  const forestTrees = Math.floor(xp / 200);
  const goals = sustainabilityGoalsList[i % sustainabilityGoalsList.length];
  const travelMode = travelModes[i % travelModes.length];
  
  users.push({
    id: `user_in_${i}_${Date.now().toString(36)}`,
    name,
    email,
    password: "password123",
    avatar: "",
    city,
    homePeople: (i % 4) + 1,
    travelMode,
    sustainabilityGoals: goals,
    weeklyGoalXP: 300,
    level,
    xp,
    co2Saved,
    waterSaved,
    costSaved,
    streak,
    isOnboarded: true,
    completedActivityCount,
    forestTrees,
    lastActiveDate: new Date().toISOString().split("T")[0],
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  });
}

// Sort users by XP descending so top performers are first
users.sort((a, b) => b.xp - a.xp);

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2));
console.log(`Successfully generated ${users.length} Indian users in data/users.json`);
