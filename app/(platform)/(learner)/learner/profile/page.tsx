"use client"

import { useState } from "react"
import { Rubik } from "next/font/google"
import {
  Trophy,
  Star,
  Book,
  Timer,
  Medal,
  Flame,
  Code2,
  GitBranch,
  LineChart,
  Award,
  Calendar,
  CheckCircle2,
  BookOpen,
  PlayCircle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import img1 from '../../../../../assets/data-science-python.png';
import img2 from '../../../../../assets/deep-learning-concept.png';
import img3 from '../../../../../assets/full-stack-development.png';
import img4 from '../../../../../assets/ui-ux-design-concept.png';



const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const user = {
    name: "Alex Thompson",
    handle: "@alexdev",
    joinedDate: "October 2023",
    avatar: "/avatars/alex.jpg",
    role: "Full Stack Developer",
    level: 42,
    xp: 8750,
    nextLevelXp: 10000,
    badges: 18,
    achievements: 24,
    streak: 45,
    bio: "Passionate about web development and machine learning. Always learning, always coding.",
    socialLinks: {
      github: "github.com/alexdev",
      linkedin: "linkedin.com/in/alexdev",
      twitter: "@alexdev",
    },
    skills: [
      { name: "JavaScript", level: 85 },
      { name: "React", level: 78 },
      { name: "Node.js", level: 72 },
      { name: "Python", level: 65 },
      { name: "TypeScript", level: 80 },
    ],
  }

  const weeklyXp = [
    { week: "W1", xp: 350 },
    { week: "W2", xp: 620 },
    { week: "W3", xp: 480 },
    { week: "W4", xp: 900 },
    { week: "W5", xp: 760 },
    { week: "W6", xp: 1040 },
  ]
  const recentActivity = [
    {
      id: 1,
      icon: <CheckCircle2 className="h-4 w-4 text-[#20B2AA]" />,
      title: 'Completed "Recursion" module',
      meta: "Algorithms • 2h ago",
    },
    {
      id: 2,
      icon: <BookOpen className="h-4 w-4 text-[#20B2AA]" />,
      title: "Started Advanced React Patterns",
      meta: "Frontend Development • 4h ago",
    },
    {
      id: 3,
      icon: <BookOpen className="h-4 w-4 text-[#20B2AA]" />,
      title: "Reviewed Dynamic Programming notes",
      meta: "Data Structures • Yesterday",
    },
  ]
  const achievements = [
    { id: 1, name: "100-Day Streak", desc: "Consistency matters", date: "Oct 5" },
    { id: 2, name: "Algorithm Ace", desc: "80%+ in Algorithms", date: "Sep 27" },
    { id: 3, name: "Bug Hunter", desc: "Fixed 50 coding tasks", date: "Sep 12" },
    { id: 4, name: "Flashcard Pro", desc: "500 reviews complete", date: "Aug 30" },
  ]
  const courses = [
    { 
      id: 1, 
      title: "Algorithms Fundamentals", 
      topic: "Algorithms", 
      chapter: "Graphs", 
      progress: 72, 
      time: "6h 20m",
      image: img1 
    },
    { 
      id: 2, 
      title: "Modern React Patterns", 
      topic: "Frontend", 
      chapter: "Hooks", 
      progress: 45, 
      time: "4h 15m",
      image: img2
    },
    { 
      id: 3, 
      title: "TypeScript Mastery", 
      topic: "TypeScript", 
      chapter: "Generics", 
      progress: 88, 
      time: "9h 05m",
      image: img3
    },
    { 
      id: 4, 
      title: "Data Structures in Depth", 
      topic: "DSA", 
      chapter: "Trees", 
      progress: 61, 
      time: "7h 40m",
      image: img4
    },
  ]

  return (
    <div className={`min-h-screen bg-zinc-50/50 dark:bg-[#0b1114] ${rubik.className}`}>
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r  from-[#20B2AA] to-[#20B2AA]/60 rounded-3xl" />

        <div className="mx-auto max-w-7xl px-4">
          <div className="relative -mt-24 pb-6">
            {/* Profile Info Card */}
            <Card className="relative border-[#20B2AA]/20 bg-white dark:bg-[#071016] p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="h-32 w-32 rounded-xl border-4 border-white dark:border-[#0b1114] shadow-lg"
                  />
                  <div className="absolute -right-2 -bottom-2 rounded-lg bg-[#20B2AA] px-2 py-1">
                    <span className="text-xs font-semibold text-white">Lv.{user.level}</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{user.name}</h1>
                      <p className="text-sm text-zinc-500">{user.handle}</p>
                    </div>
                    <button className="rounded-lg bg-[#20B2AA] px-4 py-2 text-sm font-medium text-white hover:bg-[#20B2AA]/90 transition-colors">
                      Edit Profile
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl">{user.bio}</p>

                  {/* Quick Stats */}
                  <div className="mt-6 flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-[#20B2AA]" />
                      <span className="text-sm">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">{user.achievements}</span>{" "}
                        <span className="text-zinc-500">achievements</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-[#20B2AA]" />
                      <span className="text-sm">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">{user.badges}</span>{" "}
                        <span className="text-zinc-500">badges</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-[#20B2AA]" />
                      <span className="text-sm">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">{user.streak}</span>{" "}
                        <span className="text-zinc-500">day streak</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: <Book className="h-4 w-4" />, label: "Courses", value: 12 },
                  { icon: <Medal className="h-4 w-4" />, label: "Completed", value: 7 },
                  { icon: <Timer className="h-4 w-4" />, label: "Hours Learned", value: "128h" },
                  { icon: <Code2 className="h-4 w-4" />, label: "Coding Tasks", value: 156 },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-[#20B2AA]/20 bg-white/70 dark:bg-[#071016]/60 px-3 py-2"
                  >
                    <div className="rounded-md bg-[#20B2AA]/10 p-2 text-zinc-900 dark:text-zinc-50">{s.icon}</div>
                    <div className="leading-tight">
                      <div className="text-xs text-zinc-500">{s.label}</div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* XP Progress */}
              <div className="mt-6 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Level Progress</span>
                  <span className="text-sm text-zinc-500">
                    {user.xp} / {user.nextLevelXp} XP
                  </span>
                </div>
                <Progress
                  value={(user.xp / user.nextLevelXp) * 100}
                  className="h-2 bg-zinc-100 dark:bg-zinc-800"
                  barClassName="bg-gradient-to-r from-[#20B2AA] to-[#20B2AA]/80"
                />
              </div>
            </Card>

            {/* Main Content Tabs */}
            <div className="mt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full bg-white dark:bg-[#071016] border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-lg flex space-x-2">
                  {["Overview", "Achievements", "Courses", "Statistics"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab.toLowerCase()}
                      className="flex-1 py-2.5 text-sm font-medium data-[state=active]:bg-[#20B2AA] data-[state=active]:text-white"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Skills Card */}
                    <Card className="md:col-span-2 border-[#20B2AA]/20 bg-white dark:bg-[#071016] p-6">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                        Skills & Proficiency
                      </h3>
                      <div className="space-y-4">
                        {user.skills.map((skill) => (
                          <div key={skill.name}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{skill.name}</span>
                              <span className="text-sm text-zinc-500">{skill.level}%</span>
                            </div>
                            <Progress
                              value={skill.level}
                              className="h-2 bg-zinc-100 dark:bg-zinc-800"
                              barClassName="bg-[#20B2AA]"
                            />
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-[#20B2AA]/20 bg-white dark:bg-[#071016] p-6">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Recent Activity</h3>
                      <ol className="relative space-y-4">
                        <div className="absolute left-3 top-2 bottom-2 w-px bg-[#20B2AA]/15" />
                        {recentActivity.map((a) => (
                          <li key={a.id} className="relative flex items-start gap-3 pl-4">
                            <div className="absolute left-1 top-1.5 size-2 rounded-full bg-[#20B2AA]" />
                            <div className="mt-0.5">{a.icon}</div>
                            <div>
                              <p className="text-sm text-zinc-800 dark:text-zinc-100">{a.title}</p>
                              <p className="text-xs text-zinc-500">{a.meta}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {achievements.map((a) => (
                      <div
                        key={a.id}
                        className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#071016] p-4 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#20B2AA] to-[#20B2AA]/60" />
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-[#20B2AA]/10 p-2.5 group-hover:bg-[#20B2AA]/20 transition-colors">
                            <Award className="h-5 w-5 text-[#20B2AA]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
                              {a.name}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">{a.desc}</p>
                            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-400">
                              <Calendar className="h-3 w-3" />
                              <span>Earned {a.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="courses" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((c) => (
                      <div
                        key={c.id}
                        className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#071016] hover:shadow-lg transition-all duration-300 group flex flex-col"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-36 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                          <img
                            src={c.image.src}
                            alt={c.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 justify-between p-4 space-y-3">
                          <div>
                            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                              {c.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#20B2AA]/10 px-2 py-0.5 text-[10px] font-medium text-[#20B2AA]">
                                <Book className="h-3 w-3" /> {c.topic}
                              </span>
                              <span className="text-xs text-zinc-500">Chapter: {c.chapter}</span>
                            </div>
                          </div>

                          {/* Progress Section */}
                          <div className="space-y-3">
                            <Progress
                              value={c.progress}
                              className="h-2 bg-zinc-100 dark:bg-zinc-800"
                              barClassName="bg-[#20B2AA] transition-all duration-500"
                            />
                            <div className="flex items-center justify-between text-xs text-zinc-500">
                              <span>{c.progress}% complete</span>
                              <span className="inline-flex items-center gap-1">
                                <Timer className="h-3 w-3" /> {c.time}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <button className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#20B2AA] px-3 py-2 text-xs font-medium text-white hover:bg-[#20B2AA]/90 transition-all">
                              <PlayCircle className="h-3.5 w-3.5" /> Continue Learning
                            </button>
                            <button className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                              <Book className="h-3.5 w-3.5 mr-1" /> Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="statistics" className="mt-6">
                  <Card className="border-[#20B2AA]/20 bg-white dark:bg-[#071016] p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-[#20B2AA]" />
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Weekly XP Trend</h3>
                      </div>
                      <span className="text-sm text-zinc-500">Last 6 weeks</span>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyXp} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#20B2AA" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#20B2AA" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="rgba(24,24,27,0.08)" 
                            vertical={false}
                          />
                          <XAxis 
                            dataKey="week" 
                            tickLine={false} 
                            axisLine={false} 
                            stroke="#71717a"
                            fontSize={12}
                          />
                          <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            stroke="#71717a"
                            fontSize={12}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "white",
                              border: "1px solid rgba(32,178,170,0.2)",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            }}
                            labelStyle={{ color: "#111", fontWeight: 500, marginBottom: "4px" }}
                            itemStyle={{ color: "#111", fontSize: "12px" }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="xp" 
                            stroke="#20B2AA" 
                            fill="url(#xpFill)" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
