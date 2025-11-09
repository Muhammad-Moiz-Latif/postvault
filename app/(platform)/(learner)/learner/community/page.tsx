"use client"

import { useMemo, useState } from "react"
import { ChevronRight, MessageSquare } from "lucide-react"
import { ForumFilters } from "@/components/learner/community/forum-filters"
import { QuestionCard, type Question } from "@/components/learner/community/question-card"
import { CourseAside } from "@/components/learner/community/course-aside"
import { AskQuestionModal } from "@/components/learner/community/ask-question-modal"
import { Pagination } from "@/components/learner/community/pagination"
import { Rubik } from "next/font/google"

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "300"],
})

export const sampleQuestions: Question[] = [
  {
    id: "q-1",
    title: "How do I optimize Dijkstra’s algorithm for dense graphs?",
    excerpt:
      "I implemented Dijkstra with a binary heap, but on dense graphs it seems slower than expected. Should I switch to a Fibonacci heap or use adjacency matrices?",
    tags: ["algorithms", "graphs", "dijkstra", "performance"],
    votes: 18,
    answers: 3,
    views: 1240,
    answered: true,
    author: { name: "Ayesha", initials: "AY" },
    createdAt: "2h ago",
    likes: 23,
    comments: 12,
  },
  {
    id: "q-2",
    title: "What’s the time complexity for building a Trie from N strings?",
    excerpt:
      "Considering average string length L, is the complexity always O(N·L)? Also, how does memory usage scale with larger alphabets?",
    tags: ["data-structures", "trie", "complexity"],
    votes: 9,
    answers: 0,
    views: 347,
    answered: false,
    author: { name: "Moiz", initials: "MZ" },
    createdAt: "5h ago",
    likes: 23,
    comments: 12,
  },
  {
    id: "q-3",
    title: "Is there a canonical way to debounce state updates in React without extra renders?",
    excerpt:
      "I’m using a custom hook to debounce input state, but it still causes extra re-renders. Is useDeferredValue a better choice here?",
    tags: ["react", "performance", "hooks"],
    votes: 12,
    answers: 2,
    views: 860,
    answered: false,
    author: { name: "Lee", initials: "LE" },
    createdAt: "1d ago",
    likes: 23,
    comments: 12,
  },
]

export default function ForumPage() {
  const [course, setCourse] = useState("Algorithms 101")
  const [openAsk, setOpenAsk] = useState(false)

  const questions = useMemo(() => sampleQuestions, [])

  return (
    <main className={`mx-auto w-full max-w-7xl px-5 py-6 ${rubik.className}`}>
      {/* ─── Breadcrumb + Header ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <nav
            className="flex items-center text-sm text-zinc-500 tracking-tight"
            aria-label="Breadcrumb"
          >
            <span>Community</span>
            <ChevronRight className="mx-2 h-4 w-4 opacity-60" />
            <span>Forum</span>
            <ChevronRight className="mx-2 h-4 w-4 opacity-60" />
            <span className="font-semibold text-[#20B2AA]">{course}</span>
          </nav>

          <h1 className="mt-2 text-xl md:text-3xl font-semibold text-zinc-900">
            Course Forum:{" "}
            <span className="text-[#20B2AA]">{course}</span>
          </h1>
          <p className="text-sm text-zinc-600 tracking-tight">
            Ask questions, share insights, and learn with peers.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Course Selector */}
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="rounded-md border border-[#20B2AA]/40 bg-white px-3 py-2 text-sm text-zinc-700 tracking-tight outline-none focus:ring-2 focus:ring-[#20B2AA]/40 transition"
            aria-label="Select course forum"
          >
            <option>Algorithms 101</option>
            <option>Data Structures</option>
            <option>Frontend Engineering</option>
          </select>

          {/* Ask Question Button */}
          <button
            onClick={() => setOpenAsk(true)}
            className="inline-flex items-center gap-2 tracking-tight rounded-md border border-[#20B2AA] bg-[#20B2AA] text-white px-3 py-2 text-sm hover:bg-[#20B2AA]/90 transition"
          >
            <MessageSquare className="h-4 w-4" />
            Ask Question
          </button>
        </div>
      </div>

      {/* ─── Filters Section ───────────────────────────────────────────── */}
      <div className="py-4">
        <ForumFilters />
      </div>

      {/* ─── Main Content Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Questions List */}
        <section className="lg:col-span-8">
          <ul className="space-y-3">
            {questions.map((q) => (
              <li key={q.id}>
                <QuestionCard question={q} />
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination currentPage={1} totalPages={5} />
          </div>
        </section>

        {/* Course Info Aside */}
        <aside className="lg:col-span-4">
          <CourseAside
            courseTitle={course}
            description="Share questions and insights related to this course. Be clear, show what you've tried, and tag appropriately."
            stats={[
              { label: "Members", value: "2,340" },
              { label: "Questions", value: "1,128" },
              { label: "Answered", value: "76%" },
            ]}
            topTags={["algorithms", "graphs", "complexity", "react", "performance"]}
            rules={[
              "Search before asking to avoid duplicates.",
              "Show your work (code, error, or approach).",
              "Be respectful and constructive.",
            ]}
          />
        </aside>
      </div>

      {/* ─── Ask Question Modal ───────────────────────────────────────────── */}
      <AskQuestionModal
        open={openAsk}
        onClose={() => setOpenAsk(false)}
        onSubmit={(payload) => {
          console.log("[v0] AskQuestion submit:", payload)
          setOpenAsk(false)
        }}
      />
    </main>
  )
}
