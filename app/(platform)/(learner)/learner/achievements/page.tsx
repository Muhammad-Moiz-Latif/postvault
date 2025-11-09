import { Trophy, Zap, Target, TrendingUp, Award, Star, Flame, Crown } from "lucide-react"
import { StatsCard } from "@/components/learner/achievements/stats-card"
import { AchievementCard } from "@/components/learner/achievements/achievementcard"
import { QuizCard } from "@/components/learner/achievements/quiz-card"
import { LeaderboardPreview } from "@/components/learner/achievements/leaderboard-preview"
import { XPProgress } from "@/components/learner/achievements/xp-progress"
import { ActivityFeed } from "@/components/learner/achievements/activity-feed"
import { Rubik } from 'next/font/google';

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "300"],
});


export default function AchievementsPage() {
  const userStats = {
    totalXP: 8450,
    level: 12,
    xpToNextLevel: 1550,
    rank: 7,
    totalStudents: 156,
    coursesCompleted: 8,
    streak: 15,
  }

  const achievements = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first course",
      icon: Star,
      unlocked: true,
      unlockedAt: "2 days ago",
      rarity: "common" as const,
    },
    {
      id: "2",
      title: "Speed Runner",
      description: "Complete 5 quizzes in one day",
      icon: Zap,
      unlocked: true,
      unlockedAt: "1 week ago",
      rarity: "rare" as const,
    },
    {
      id: "3",
      title: "Knowledge Seeker",
      description: "Earn 10,000 XP",
      icon: Target,
      unlocked: false,
      progress: 84.5,
      rarity: "epic" as const,
    },
    {
      id: "4",
      title: "Perfect Score",
      description: "Get 100% on 3 assignments",
      icon: Trophy,
      unlocked: true,
      unlockedAt: "3 days ago",
      rarity: "rare" as const,
    },
    {
      id: "5",
      title: "Consistency King",
      description: "Maintain a 30-day streak",
      icon: Flame,
      unlocked: false,
      progress: 50,
      rarity: "epic" as const,
    },
    {
      id: "6",
      title: "Top of the Class",
      description: "Reach #1 on any leaderboard",
      icon: Crown,
      unlocked: false,
      progress: 0,
      rarity: "legendary" as const,
    },
  ]

  const recentQuizzes = [
    {
      id: "q1",
      title: "Data Structures Fundamentals",
      course: "DSA Mastery",
      score: 92,
      maxScore: 100,
      xpEarned: 250,
      completedAt: "2 hours ago",
    },
    {
      id: "q2",
      title: "Algorithm Complexity Analysis",
      course: "DSA Mastery",
      score: 88,
      maxScore: 100,
      xpEarned: 220,
      completedAt: "1 day ago",
    },
    {
      id: "q3",
      title: "React Hooks Deep Dive",
      course: "Advanced React",
      score: 95,
      maxScore: 100,
      xpEarned: 280,
      completedAt: "2 days ago",
    },
  ]

  const leaderboardData = [
    { rank: 1, name: "Sarah Chen", avatar: "SC", xp: 12450, streak: 28 },
    { rank: 2, name: "Alex Kumar", avatar: "AK", xp: 11200, streak: 21 },
    { rank: 3, name: "Emma Wilson", avatar: "EW", xp: 10800, streak: 19 },
    { rank: 7, name: "You", avatar: "ME", xp: 8450, streak: 15, isCurrentUser: true },
  ]

  return (
    <div className={`min-h-screen ${rubik.className}`}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-black mb-2 tracking-tight">Your Achievements</h1>
          <p className="text-zinc-600 text-sm tracking-tight">Track your progress and celebrate your victories</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <XPProgress
              currentXP={userStats.totalXP}
              level={userStats.level}
              xpToNextLevel={userStats.xpToNextLevel}
              streak={userStats.streak}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <StatsCard
                icon={Trophy}
                label="Total XP"
                value={userStats.totalXP.toLocaleString()}
                trend="+450 this week"
              />
              <StatsCard
                icon={TrendingUp}
                label="Class Rank"
                value={`#${userStats.rank}`}
                trend={`Top ${Math.round((userStats.rank / userStats.totalStudents) * 100)}%`}
              />
              <StatsCard
                icon={Award}
                label="Completed"
                value={userStats.coursesCompleted}
                trend="8 courses"
              />
              <StatsCard
                icon={Flame}
                label="Streak"
                value={`${userStats.streak} days`}
                trend="Keep it up!"
              />
            </div>

            <section className="bg-zinc-50 rounded-xl p-6 border border-zinc-300">
              <div className="flex items-center justify-between mb-4 ">
                <h2 className="text-3xl tracking-tight font-medium text-black">Awards</h2>
                <span className="text-sm text-zinc-700 tracking-tight">
                  {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(achievement => (
                  <AchievementCard key={achievement.id} {...achievement} />
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-[41px]">
            <LeaderboardPreview data={leaderboardData} totalStudents={userStats.totalStudents} />
            <ActivityFeed />
          </aside>
        </div>
      </div>
    </div>
  )
}
