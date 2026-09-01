import React, { useState, useEffect } from "react";
import {
  Trophy,
  Search,
  MapPin,
  Flame,
  Droplet,
  Zap,
  IndianRupee,
  Trees,
  Filter,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight,
  Globe
} from "lucide-react";
import { fetchGlobalLeaderboard, searchUsersApi } from "../data";

export default function IndiaLeaderboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState("leaderboard"); // 'leaderboard' | 'search'
  const [metric, setMetric] = useState("xp");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [nationalTotals, setNationalTotals] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);

  const CITIES = [
    "Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune",
    "Ahmedabad", "Kolkata", "Jaipur", "Kochi", "Chandigarh", "Lucknow",
    "Indore", "Surat", "Coimbatore", "Nagpur", "Bhopal", "Vadodara", "Patna"
  ];

  useEffect(() => {
    loadLeaderboard();
  }, [metric]);

  useEffect(() => {
    if (activeTab === "search") {
      performSearch(1);
    }
  }, [searchQuery, selectedCity, activeTab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await fetchGlobalLeaderboard(metric, 100);
    setLeaderboardData(data.leaderboard || []);
    setNationalTotals(data.nationalTotals || null);
    setLoading(false);
  };

  const performSearch = async (page = 1) => {
    setSearchLoading(true);
    const res = await searchUsersApi({
      q: searchQuery,
      city: selectedCity,
      sortBy: "xp",
      page,
      limit: 15
    });
    setSearchResults(res.users || []);
    setTotalUsersCount(res.total || 0);
    setCurrentPage(res.page || 1);
    setTotalPages(res.totalPages || 1);
    setSearchLoading(false);
  };

  const getMetricValue = (user) => {
    switch (metric) {
      case "co2Saved":
        return `${(user.co2Saved || 0).toFixed(1)} kg CO₂`;
      case "waterSaved":
        return `${user.waterSaved || 0} L Water`;
      case "costSaved":
        return `₹${user.costSaved || 0}`;
      case "streak":
        return `${user.streak || 0} Days`;
      default:
        return `${user.xp || 0} XP`;
    }
  };

  const topThree = leaderboardData.slice(0, 3);
  const remainingList = leaderboardData.slice(3);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-[#ffffff] border border-[#85a528]/30 text-[#1F2937] rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10 text-[#85a528] select-none pointer-events-none">
          <Globe className="w-56 h-56" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F5E9] border border-[#85a528]/30 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-[#85a528]">
            <span>🇮🇳</span> National Eco Community · 100 Indian Champions
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">India Green Leaderboard</h1>
          <p className="text-[#556B2F] text-xs max-w-md">
            Recognizing citizens across India saving energy, conserving water, and creating sustainable futures.
          </p>
        </div>

        {/* National Totals Stats Bar */}
        {nationalTotals && (
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-[#85a528]/20 text-center">
            <div className="bg-[#F1F8E9] border border-[#85a528]/30 rounded-lg p-2">
              <div className="text-[10px] text-[#6B7280]">Users</div>
              <div className="text-sm font-bold text-[#1F2937]">{nationalTotals.totalUsers || 100}</div>
            </div>
            <div className="bg-[#F1F8E9] border border-[#85a528]/30 rounded-lg p-2">
              <div className="text-[10px] text-[#6B7280]">CO₂ Saved</div>
              <div className="text-sm font-bold text-[#85a528]">{(nationalTotals.totalCo2 || 0).toFixed(0)} kg</div>
            </div>
            <div className="bg-[#F1F8E9] border border-[#85a528]/30 rounded-lg p-2">
              <div className="text-[10px] text-[#6B7280]">Water Saved</div>
              <div className="text-sm font-bold text-[#85a528]">{(nationalTotals.totalWater || 0).toLocaleString()} L</div>
            </div>
            <div className="bg-[#F1F8E9] border border-[#85a528]/30 rounded-lg p-2">
              <div className="text-[10px] text-[#6B7280]">Cost Saved</div>
              <div className="text-sm font-bold text-[#1F2937]">₹{(nationalTotals.totalCost || 0).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Selection */}
      <div className="flex bg-[#ffffff] p-1 rounded-lg border border-[#85a528]/30 gap-1 shadow-sm">
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex-1 py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === "leaderboard"
              ? "bg-[#85a528] text-white shadow-sm"
              : "text-[#556B2F] hover:text-[#1F2937]"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> National Leaderboard
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === "search"
              ? "bg-[#85a528] text-white shadow-sm"
              : "text-[#556B2F] hover:text-[#1F2937]"
          }`}
        >
          <Search className="w-3.5 h-3.5" /> Search Users & Cities
        </button>
      </div>

      {/* TAB 1: NATIONAL LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className="space-y-6">
          {/* Metric Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "xp", label: "XP Rankings", icon: Trophy },
              { id: "co2Saved", label: "CO₂ Saved", icon: Zap },
              { id: "waterSaved", label: "Water Saved", icon: Droplet },
              { id: "costSaved", label: "Money Saved", icon: IndianRupee },
              { id: "streak", label: "Top Streaks", icon: Flame },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = metric === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMetric(m.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                    isSelected
                      ? "bg-[#85a528] text-white border-[#85a528]"
                      : "bg-[#ffffff] text-[#556B2F] border-[#85a528]/30 hover:border-[#85a528]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {m.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-8 text-center text-[#6B7280] space-y-3 shadow-sm">
              <div className="animate-spin w-6 h-6 border-2 border-[#85a528] border-t-transparent rounded-full mx-auto" />
              <p className="text-xs font-bold">Fetching national rankings...</p>
            </div>
          ) : (
            <>
              {/* TOP 3 PODIUM */}
              {topThree.length >= 3 && (
                <div className="grid grid-cols-3 gap-3 pt-4 items-end">
                  {/* Rank 2 - Silver */}
                  <div className="bg-[#ffffff] rounded-xl p-3 border border-[#85a528]/30 text-center space-y-2 shadow-sm relative transform translate-y-2">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F1F8E9] border border-[#85a528]/30 text-[#85a528] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      🥈 #2
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-[#F1F8E9] text-[#85a528] font-bold text-lg flex items-center justify-center mx-auto border border-[#85a528]/30">
                      {topThree[1].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1F2937] line-clamp-1">{topThree[1].name}</h4>
                      <div className="text-[10px] text-[#6B7280] flex items-center justify-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#85a528]" /> {topThree[1].city || "India"}
                      </div>
                    </div>
                    <div className="bg-[#F1F8E9] rounded-md py-1 px-2 border border-[#85a528]/30">
                      <span className="text-xs font-bold text-[#85a528] block">
                        {getMetricValue(topThree[1])}
                      </span>
                    </div>
                  </div>

                  {/* Rank 1 - Gold */}
                  <div className="bg-[#E8F5E9] rounded-xl p-4 border border-[#85a528] text-center space-y-2 shadow-md relative z-10">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#85a528] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      👑 #1 Champion
                    </div>
                    <div className="w-14 h-14 rounded-lg bg-[#85a528] text-white font-bold text-xl flex items-center justify-center mx-auto border border-[#85a528]">
                      {topThree[0].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1F2937] line-clamp-1">{topThree[0].name}</h4>
                      <div className="text-[10px] text-[#85a528] flex items-center justify-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#85a528]" /> {topThree[0].city || "India"}
                      </div>
                    </div>
                    <div className="bg-[#85a528] text-white rounded-md py-1 px-2 shadow-sm">
                      <span className="text-xs font-bold block">
                        {getMetricValue(topThree[0])}
                      </span>
                    </div>
                  </div>

                  {/* Rank 3 - Bronze */}
                  <div className="bg-[#ffffff] rounded-xl p-3 border border-[#85a528]/30 text-center space-y-2 shadow-sm relative transform translate-y-3">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F1F8E9] border border-[#85a528]/30 text-[#85a528] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      🥉 #3
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-[#F1F8E9] text-[#85a528] font-bold text-lg flex items-center justify-center mx-auto border border-[#85a528]/30">
                      {topThree[2].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1F2937] line-clamp-1">{topThree[2].name}</h4>
                      <div className="text-[10px] text-[#6B7280] flex items-center justify-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#85a528]" /> {topThree[2].city || "India"}
                      </div>
                    </div>
                    <div className="bg-[#F1F8E9] rounded-md py-1 px-2 border border-[#85a528]/30">
                      <span className="text-xs font-bold text-[#85a528] block">
                        {getMetricValue(topThree[2])}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* REST OF THE 100 USERS LIST */}
              <div className="bg-[#ffffff] rounded-xl p-3 border border-[#85a528]/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-bold text-[#6B7280] border-b border-[#85a528]/20">
                  <span>RANK & USER</span>
                  <span>STAT</span>
                </div>

                <div className="divide-y divide-[#85a528]/15">
                  {remainingList.map((user) => {
                    const isMe = currentUser && (user.id === currentUser.id || user.email === currentUser.email);
                    return (
                      <div
                        key={user.id}
                        className={`py-2.5 px-2 flex items-center justify-between rounded-lg transition-all ${
                          isMe ? "bg-[#E8F5E9] border border-[#85a528]" : "hover:bg-[#F1F8E9]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#6B7280] w-6 text-center">
                            #{user.rank}
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-[#F1F8E9] text-[#85a528] font-bold text-xs flex items-center justify-center border border-[#85a528]/30">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                              {user.name}
                              {isMe && (
                                <span className="bg-[#85a528] text-white text-[9px] px-1 rounded font-bold">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#6B7280] flex items-center gap-2">
                              {user.city && (
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5 text-[#85a528]" /> {user.city}
                                </span>
                              )}
                              <span>Lvl {user.level || 1}</span>
                              {user.streak > 0 && (
                                <span className="text-[#85a528] font-bold flex items-center gap-0.5">
                                  <Flame className="w-2.5 h-2.5 fill-current" /> {user.streak}d
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-[#85a528]">
                            {getMetricValue(user)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: SEARCH USERS & CITIES */}
      {activeTab === "search" && (
        <div className="space-y-4">
          {/* Search Inputs Bar */}
          <div className="bg-[#ffffff] p-4 rounded-xl border border-[#85a528]/30 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85a528] pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Indian name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[#ffffff] border border-[#85a528]/30 rounded-md text-xs focus:border-[#85a528] text-[#1F2937]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#85a528] shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2 px-3 bg-[#ffffff] border border-[#85a528]/30 rounded-md text-xs font-bold text-[#1F2937] focus:border-[#85a528]"
              >
                <option value="">All Cities across India</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] font-bold px-1">
            <span>Showing {searchResults.length} of {totalUsersCount} Indian Users</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {/* User Cards Grid */}
          {searchLoading ? (
            <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-6 text-center text-[#6B7280] shadow-sm">
              <div className="animate-spin w-5 h-5 border-2 border-[#85a528] border-t-transparent rounded-full mx-auto mb-2" />
              Searching dataset...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-[#ffffff] border border-[#85a528]/30 rounded-xl p-6 text-center text-[#6B7280] shadow-sm">
              No matching Indian users found for &quot;{searchQuery}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#ffffff] p-3 rounded-xl border border-[#85a528]/30 shadow-sm flex items-center justify-between hover:border-[#85a528] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F1F8E9] text-[#85a528] font-bold text-sm flex items-center justify-center border border-[#85a528]/30 shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1F2937]">{user.name}</h4>
                      <p className="text-[10px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#85a528]" /> {user.city || "India"} · Level {user.level || 1}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#6B7280] mt-1">
                        <span>🔥 {user.streak || 0}d streak</span>
                        <span>🌳 {user.forestTrees || 0} trees</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#85a528] block">{user.xp || 0}</span>
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase">XP Score</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => performSearch(currentPage - 1)}
                className="p-1.5 bg-[#ffffff] text-[#85a528] rounded-md border border-[#85a528]/30 disabled:opacity-40 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#6B7280]">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => performSearch(currentPage + 1)}
                className="p-1.5 bg-[#ffffff] text-[#85a528] rounded-md border border-[#85a528]/30 disabled:opacity-40 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
