"use client"
import { useState } from "react"
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Flame,
  Search,
  Users,
  ExternalLink,
  Award,
  Zap,
  Target,
} from "lucide-react"

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("week")
  const [searchQuery, setSearchQuery] = useState("")

  const options = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Time" },
  ]

  const leaderboardData = [
    { rank: 1, name: "Sarah Chen", avatar: "SC", xp: 12450, streak: 28, badges: 24 },
    { rank: 2, name: "Alex Kumar", avatar: "AK", xp: 11200, streak: 21, badges: 20 },
    { rank: 3, name: "Emma Wilson", avatar: "EW", xp: 10800, streak: 19, badges: 22 },
    { rank: 4, name: "You", avatar: "ME", xp: 9850, streak: 15, badges: 15, isCurrentUser: true },
    { rank: 5, name: "David Kim", avatar: "DK", xp: 8900, streak: 12, badges: 14 },
    { rank: 6, name: "Lisa Anderson", avatar: "LA", xp: 8650, streak: 11, badges: 13 },
    { rank: 7, name: "Marcus Lee", avatar: "ML", xp: 8450, streak: 10, badges: 12 },
    { rank: 8, name: "Nina Patel", avatar: "NP", xp: 8100, streak: 9, badges: 11 },
    { rank: 9, name: "Tom Rodriguez", avatar: "TR", xp: 7850, streak: 8, badges: 10 },
    { rank: 10, name: "Riya Sharma", avatar: "RS", xp: 7550, streak: 7, badges: 9 },
  ]

  const topThree = leaderboardData.slice(0, 3)
  const currentUser = leaderboardData.find((u) => u.isCurrentUser)

  return (
    <div className="min-h-screen bg-zinc-50 rounded-xl">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 rounded-t-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-xl bg-gradient-to-br from-[#20B2AA] to-[#1a9d96] flex items-center justify-center shadow-md">
                <Trophy className="size-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Class Leaderboard</h1>
                <p className="text-sm text-zinc-600">
                  Compete, learn, and climb your way to the top
                </p>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => setTimeframe(option.value)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    timeframe === option.value 
                      ? "bg-[#20B2AA] text-white" 
                      : "text-zinc-600 hover:bg-zinc-50"
                  } ${index > 0 ? "border-l border-zinc-200" : ""}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA]/20 transition-all placeholder:text-zinc-400"
              placeholder="Search for a player..."
            />
          </div>
          <button className="h-10 px-4 bg-[#20B2AA] text-white rounded-lg text-sm font-medium hover:bg-[#1a9d96] transition-all shadow-sm">
            Search
          </button>
        </div>

        {/* Top 3 Podium */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {topThree.map((user, i) => (
            <div
              key={user.rank}
              className={`relative p-5 rounded-xl border shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                i === 0
                  ? "bg-gradient-to-br from-amber-50 to-white border-amber-200"
                  : i === 1
                  ? "bg-gradient-to-br from-zinc-50 to-white border-zinc-200"
                  : "bg-gradient-to-br from-orange-50 to-white border-orange-200"
              }`}
            >
              {/* Rank Badge */}
              <div className="absolute top-3 right-3">
                {i === 0 ? (
                  <Crown className="size-8 text-amber-500" />
                ) : (
                  <Medal className={`size-8 ${i === 1 ? "text-zinc-400" : "text-orange-500"}`} />
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="size-14 rounded-full bg-gradient-to-br from-[#20B2AA] to-[#1a9d96] text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {user.avatar}
                </div>
                <div>
                  <div className={`text-2xl font-semibold ${
                    i === 0 ? "text-amber-600" : i === 1 ? "text-zinc-600" : "text-orange-600"
                  }`}>
                    #{user.rank}
                  </div>
                  <div className="text-sm font-medium text-zinc-900">{user.name}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xs text-zinc-500 mb-1">XP</div>
                  <div className="text-base font-semibold text-zinc-900">{user.xp.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-500 mb-1">Streak</div>
                  <div className="text-base font-semibold text-zinc-900">{user.streak}d</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-500 mb-1">Badges</div>
                  <div className="text-base font-semibold text-zinc-900">{user.badges}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Your Stats Panel */}
        {currentUser && (
          <section className="mb-8">
            <div className="rounded-xl bg-gradient-to-r from-[#20B2AA] to-[#1a9d96] p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Standing</h2>
                <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                  Rank #{currentUser.rank}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Total XP</p>
                  <p className="text-4xl font-bold">{currentUser.xp.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Flame className="h-5 w-5 text-orange-300" />
                    <span className="text-sm font-medium">{currentUser.streak} day streak</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Award className="h-5 w-5 text-amber-300" />
                    <span className="text-sm font-medium">{currentUser.badges} badges</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: "78%" }}
                ></div>
              </div>

              <p className="text-xs text-white/80 mt-2">
                You're just 1,350 XP away from reaching the top 3! Keep going! 🚀
              </p>
            </div>
          </section>
        )}

        {/* Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-white border border-zinc-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#20B2AA]/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-[#20B2AA]" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">Total Students</div>
                <div className="text-xl font-semibold text-zinc-900">{leaderboardData.length}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-zinc-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">Avg XP</div>
                <div className="text-xl font-semibold text-zinc-900">9,363</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-zinc-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">Avg Streak</div>
                <div className="text-xl font-semibold text-zinc-900">14 days</div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Leaderboard List */}
        <section className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 border-b border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600 uppercase tracking-wide">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Student</div>
            <div className="col-span-2 text-center">XP</div>
            <div className="col-span-2 text-center">Streak</div>
            <div className="col-span-2 text-center">Badges</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Table Rows */}
          {leaderboardData.map((user) => (
            <div
              key={user.rank}
              className={`grid grid-cols-12 px-6 py-4 items-center text-sm border-b border-zinc-100 transition-colors ${
                user.isCurrentUser
                  ? "bg-[#20B2AA]/10 font-medium"
                  : "hover:bg-zinc-50"
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center gap-2 font-semibold text-zinc-900">
                {user.rank === 1 ? (
                  <Medal className="h-5 w-5 text-amber-500" />
                ) : user.rank === 2 ? (
                  <Medal className="h-5 w-5 text-zinc-400" />
                ) : user.rank === 3 ? (
                  <Medal className="h-5 w-5 text-orange-500" />
                ) : (
                  <span className="text-zinc-600">#{user.rank}</span>
                )}
              </div>

              {/* Student */}
              <div className="col-span-4 flex items-center gap-3">
                <div className={`size-9 rounded-full font-semibold text-sm flex items-center justify-center ${
                  user.isCurrentUser
                    ? "bg-gradient-to-br from-[#20B2AA] to-[#1a9d96] text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-900"
                }`}>
                  {user.avatar}
                </div>
                <span className={`truncate ${user.isCurrentUser ? "text-zinc-900 font-semibold" : "text-zinc-700"}`}>
                  {user.name}
                </span>
              </div>

              {/* XP */}
              <div className="col-span-2 text-center font-semibold text-zinc-900">
                {user.xp.toLocaleString()}
              </div>

              {/* Streak */}
              <div className="col-span-2 text-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-medium">
                  <Flame className="h-3.5 w-3.5" />
                  {user.streak}d
                </div>
              </div>

              {/* Badges */}
              <div className="col-span-2 text-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                  <Award className="h-3.5 w-3.5" />
                  {user.badges}
                </div>
              </div>

              {/* Profile Link */}
              <div className="col-span-1 flex justify-center">
                <button className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-[#20B2AA] transition-all">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-zinc-500 mt-6 flex items-center justify-center gap-2">
          <Users className="h-4 w-4" />
          Showing {leaderboardData.length} active learners
        </div>
      </div>
    </div>
  )
}