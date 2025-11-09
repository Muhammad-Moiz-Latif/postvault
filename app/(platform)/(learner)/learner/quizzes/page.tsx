/* eslint-disable @next/next/no-img-element */
"use client"

import { Card, CardContent } from "@/components/ui/card"
import bulb from '../../../../../assets/light-bulb.png';
import certificate from '../../../../../assets/certificate.png';
import {
  Brain,
  BarChart3,
  Clock,
  ListChecks,
  AlignLeft,
  Code2,
  BookOpen,
  Tag,
} from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { cn } from "@/lib/utils"
import { Rubik } from "next/font/google"
import Link from "next/link";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "300"],
})

export default function QuizzesPage() {
  const stats = [
    { label: "Quizzes Taken", value: 24, icon: ListChecks },
    { label: "Average Score", value: "82%", icon: BarChart3 },
    { label: "Current Streak", value: "6 days", icon: Clock },
    { label: "AI Mastery", value: "76%", icon: Brain },
  ]

  type QuizType = "MCQ" | "Descriptive" | "Coding"

  const recs: Array<{
    id: string
    title: string
    estMins: number
    difficulty: "Easy" | "Medium" | "Hard"
    type: QuizType
    course: string
    topic: string
    chapter: string
    progress?: number
  }> = [
      {
        id: "q1",
        title: "Sorting Basics",
        estMins: 6,
        difficulty: "Easy",
        type: "MCQ",
        course: "DSA 101",
        topic: "Algorithms",
        chapter: "1.2 Sorting",
        progress: 40,
      },
      {
        id: "q2",
        title: "Graph Traversal",
        estMins: 9,
        difficulty: "Medium",
        type: "Descriptive",
        course: "DSA 101",
        topic: "Graphs",
        chapter: "3.1 BFS vs DFS",
        progress: 60,
      },
      {
        id: "q3",
        title: "Dynamic Programming Intro",
        estMins: 12,
        difficulty: "Hard",
        type: "Coding",
        course: "DSA 201",
        topic: "DP",
        chapter: "1.1 Overlapping Subproblems",
        progress: 20,
      },
    ]

  const perfData = [
    { week: "Mon", score: 68 },
    { week: "Tue", score: 75 },
    { week: "Wed", score: 78 },
    { week: "Thu", score: 85 },
    { week: "Fri", score: 82 },
    { week: "Sat", score: 90 },
  ]

  function TypeIcon({ type }: { type: QuizType }) {
    if (type === "MCQ") return <ListChecks className="h-3.5 w-3.5 text-[#20B2AA]" />
    if (type === "Descriptive") return <AlignLeft className="h-3.5 w-3.5 text-[#20B2AA]" />
    return <Code2 className="h-3.5 w-3.5 text-[#20B2AA]" />
  }

  return (
    <section className={`w-full ${rubik.className} space-y-10`}>
      {/* HERO / HEADER */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex gap-2 items-center">
          <div className="bg-zinc-100 p-1.5 rounded-md">
            <img src={bulb.src} className="size-8" />
          </div>
          <h1 className="text-balance text-3xl tracking-tight font-semibold text-black">
            Test Your Knowledge
          </h1>
        </div>
        <p className="mt-1 text-sm text-zinc-600">
          Sharpen your skills with adaptive, AI-personalized quizzes designed to strengthen your weak areas.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <Card
                key={s.label}
                className="rounded-lg border border-[#20B2AA]/30 bg-zinc-50 hover:bg-[#20B2AA]/10 hover:shadow-md transition"
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="tracking-tight text-zinc-800">{s.label}</p>
                    <span className="inline-flex size-9 items-center justify-center rounded-full border border-[#20B2AA]/30 bg-white">
                      <Icon className="size-4 text-[#20B2AA]" />
                    </span>
                  </div>
                  <p className="mt-2 text-4xl font-semibold tracking-tighter text-zinc-900">
                    {s.value}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* AI RECOMMENDED QUIZZES */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex gap-2 items-center mb-5">
          <div className="bg-zinc-100 p-1.5 rounded-md">
            <img src={certificate.src} className="size-8" />
          </div>
          <h1 className="text-balance text-3xl tracking-tight font-semibold text-black">
            Recommended for you
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recs.map((r) => (
            <Card
              key={r.id}
              className="group rounded-xl border border-[#20B2AA]/30 bg-zinc-50 hover:bg-[#20B2AA]/10 hover:shadow-lg transition"
            >
              <div className="px-4 pt-3">
                <h1 className="font-medium text-xl tracking-tight text-zinc-900 group-hover:text-[#20B2AA] transition">
                  {r.title}
                </h1>
              </div>

              <CardContent>
                {/* Meta line: type, difficulty, time */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#20B2AA]/30 bg-white px-2 py-1">
                    <TypeIcon type={r.type} />
                    <span>{r.type}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#20B2AA]/30 bg-white px-2 py-1">
                    <Tag className="h-3.5 w-3.5 text-[#20B2AA]" />
                    <span>{r.difficulty}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#20B2AA]/30 bg-white px-2 py-1">
                    <Clock className="h-3.5 w-3.5 text-[#20B2AA]" />
                    <span>{r.estMins} mins</span>
                  </span>
                </div>

                {/* Course / Topic / Chapter */}
                <div className="mt-3 grid gap-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-[#20B2AA]" />
                    <span className="text-zinc-600">Course:</span>
                    <span className="font-medium text-zinc-800">{r.course}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-[#20B2AA]" />
                    <span className="text-zinc-600">Topic:</span>
                    <span className="font-medium text-zinc-800">{r.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-[#20B2AA]" />
                    <span className="text-zinc-600">Chapter:</span>
                    <span className="font-medium text-zinc-800">{r.chapter}</span>
                  </div>
                </div>

                {/* Progress bar */}
                {typeof r.progress === "number" && (
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-600">
                      <span>Progress</span>
                      <span>{r.progress}%</span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={r.progress}
                      className="h-[10px] w-full rounded-full bg-white border border-[#20B2AA]/30"
                    >
                      <div
                        className="h-2 rounded-full bg-[#20B2AA]"
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    AI-tailored to your recent performance
                  </span>
                  <button className="bg-[#20B2AA] text-white tracking-tight px-4 py-1.5 rounded-md hover:bg-[#20B2AA]/80 text-sm">
                    {r.progress && r.progress > 0 ? "Resume" : "Start"}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* PERFORMANCE OVERVIEW */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center tracking-tight gap-2 mb-3 text-3xl font-semibold text-black">
           <div className="bg-zinc-100 p-2 rounded-md">
             <BarChart3 className="h-7 w-7 text-[#20B2AA]" />
           </div>
            Performance Overview
          </h2>
          <span className="text-sm text-zinc-500 tracking-tight">
            Last 7 sessions overview
          </span>
        </div>

        {/* Performance Chart */}
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={[
            { week: "Mon", score: 68, accuracy: 80 },
            { week: "Tue", score: 75, accuracy: 82 },
            { week: "Wed", score: 78, accuracy: 84 },
            { week: "Thu", score: 85, accuracy: 89 },
            { week: "Fri", score: 82, accuracy: 88 },
            { week: "Sat", score: 90, accuracy: 92 },
            { week: "Sun", score: 87, accuracy: 90 },
          ]}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#20B2AA" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#20B2AA" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" stroke="#a1a1aa" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#20B2AA"
              strokeWidth={3}
              fill="url(#colorScore)"
              dot={{ r: 4, fill: "#20B2AA" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#00ffff"
              strokeWidth={2}
              fill="url(#colorAccuracy)"
              dot={{ r: 3, fill: "#00ffff" }}
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center gap-4 justify-end text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="h-2 w-4 rounded bg-[#20B2AA]" />
            Score
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-4 rounded bg-[#00ffff]" />
            Accuracy
          </div>
        </div>
      </section>

      {/* AI INSIGHT PANEL */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="flex items-center tracking-tight gap-2 text-lg font-medium text-black">
          <div className="bg-zinc-100 p-2 rounded-md">
            <Brain className="size-5 text-[#20B2AA]" /></div> AI Insight
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          You’re strongest in <b className="text-[#20B2AA]">Sorting</b> and{" "}
          <b className="text-[#20B2AA]">Graphs</b>. AI recommends revisiting{" "}
          <b className="text-[#20B2AA]">Dynamic Programming</b> for improved mastery before
          attempting advanced challenges.
        </p>
        <button className="mt-3 rounded-md px-4 py-1.5 text-white bg-[#20B2AA] text-sm tracking-tight hover:bg-[#20B2AA]/80">
          <Link href="quizzes/generate">Generate Adaptive Quiz</Link>
        </button>
      </div>
    </section>
  )
}
