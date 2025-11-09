"use client"

import { useState } from "react"
import { Rubik } from "next/font/google"
import { Card } from "@/components/ui/card"
import {
  Brain,
  Clock,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react"
import Link from "next/link"

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

type Question = {
  id: number
  text: string
  explanation?: string
  timeGuide?: string
  points: number
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes

  const quiz = {
    title: "Graph Traversal",
    description: "Test your understanding of graph traversal algorithms including BFS and DFS.",
    totalQuestions: 5,
    totalPoints: 100,
    timeLimit: "60 minutes",
    difficulty: "Medium",
    questions: [
      {
        id: 1,
        text: "Explain the key differences between Breadth-First Search (BFS) and Depth-First Search (DFS) traversal algorithms. Include their use cases and time complexity analysis.",
        explanation: "Focus on: traversal order, implementation approach, space complexity, and practical applications.",
        timeGuide: "8-10 minutes",
        points: 20,
      },
      // ... more questions
    ] as Question[],
  }

  return (
    <div className={`min-h-screen rounded-xl bg-white dark:bg-[#0b1114] ${rubik.className}`}>
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 rounded-xl bg-white/80 dark:bg-[#071016]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/quizzes"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#20B2AA] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quizzes
              </Link>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {quiz.title}
              </h1>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-[#20B2AA]" />
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Question Card */}
            <Card className="overflow-hidden border-[#20B2AA]/30 bg-zinc-50 dark:bg-[#071016]">
              <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#0d1114] px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Question {currentQuestion + 1} of {quiz.totalQuestions}
                  </span>
                  <span className="rounded-full bg-[#20B2AA]/10 px-3 py-1 text-xs font-medium text-[#20B2AA]">
                    {quiz.questions[currentQuestion].points} points
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-base text-zinc-900 dark:text-zinc-100 leading-relaxed">
                  {quiz.questions[currentQuestion].text}
                </p>
                
                {quiz.questions[currentQuestion].explanation && (
                  <div className="flex gap-2 rounded-lg border border-[#20B2AA]/30 bg-[#20B2AA]/5 p-3 text-sm">
                    <AlertCircle className="h-5 w-5 text-[#20B2AA]" />
                    <p className="text-zinc-700 dark:text-zinc-300">
                      {quiz.questions[currentQuestion].explanation}
                    </p>
                  </div>
                )}

                <textarea 
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => setAnswers(a => ({ ...a, [currentQuestion]: e.target.value }))}
                  placeholder="Type your answer here..."
                  className="min-h-[200px] w-full rounded-lg border border-zinc-200 dark:border-zinc-800 
                    bg-white dark:bg-[#0d1114] p-4 text-sm text-zinc-900 dark:text-zinc-100
                    focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 outline-none resize-y"
                />
              </div>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
                disabled={currentQuestion === 0}
                className="text-sm text-zinc-500 hover:text-[#20B2AA] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Question
              </button>
              
              {currentQuestion < quiz.totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(q => Math.min(quiz.totalQuestions - 1, q + 1))}
                  className="inline-flex items-center gap-1 rounded-md bg-[#20B2AA] px-4 py-2 text-sm 
                    font-medium text-white hover:bg-[#20B2AA]/90 transition-colors"
                >
                  Next Question
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setSubmitting(true)}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 
                    text-sm font-medium text-white hover:bg-green-700 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Submit Quiz
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Info */}
            <Card className="border-[#20B2AA]/30 bg-white dark:bg-[#071016] p-5">
              <h3 className="flex items-center gap-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                <Brain className="h-5 w-5 text-[#20B2AA]" />
                Quiz Overview
              </h3>
              
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Difficulty</span>
                  <span className="font-medium text-[#20B2AA]">{quiz.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Questions</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {quiz.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Points</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {quiz.totalPoints}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Time Limit</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {quiz.timeLimit}
                  </span>
                </div>
              </div>
            </Card>

            {/* Question Navigator */}
            <Card className="border-[#20B2AA]/30 bg-white dark:bg-[#071016] p-5">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                Question Navigator
              </h3>
              
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: quiz.totalQuestions }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`h-8 w-8 rounded-md text-sm font-medium transition-colors
                      ${i === currentQuestion
                        ? "bg-[#20B2AA] text-white"
                        : answers[i]
                        ? "bg-[#20B2AA]/10 text-[#20B2AA]"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}