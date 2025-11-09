"use client"

import { useState } from "react"
import { CourseHero } from "@/components/learner/course/course-hero"
import { VideoPlayer } from "@/components/learner/course/video-player"
import { ContentTabs } from "@/components/learner/course/content-tabs"
import { ProgressPanel } from "@/components/learner/course/progress-panel"
import { QuestionCard, type Question } from "@/components/learner/community/question-card"
import { AskQuestionModal } from "@/components/learner/community/ask-question-modal"
import { MessageCircle, Plus } from "lucide-react"

export default function CoursePage() {
  const [openModal, setOpenModal] = useState(false)

  const course: {
    title: string
    category: string
    description: string
    progress: number
    duration: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    goalDate?: string
    lastActive?: string
    heroImage: string
  } = {
    title: "Mastering Data Structures & Algorithms",
    category: "Computer Science",
    description:
      "This course dives deep into the foundations of data structures and algorithms, helping you build efficient solutions and sharpen your problem-solving skills for real-world applications and interviews.",
    progress: 62,
    duration: "18h 24m",
    difficulty: "Intermediate",
    goalDate: "Nov 15, 2025",
    lastActive: "2 days ago",
    heroImage: "/course-intro-video-player-screenshot-black-and-whi.jpg",
  }


  // 🧠 AI-generated course data
  const summary =
    "This course introduces the core principles of Data Structures and Algorithms through interactive explanations and real-world examples. Designed for learners who want to improve their problem-solving skills and prepare for technical interviews."

  const transcript = [
    "Welcome to the course on mastering Data Structures and Algorithms.",
    "We’ll explore how data structures shape the efficiency of software systems.",
    "You’ll understand how time complexity affects algorithm design.",
  ]

  const keyPoints = [
    "Master time and space complexity fundamentals",
    "Implement arrays, stacks, queues, trees, and graphs",
    "Develop problem-solving intuition through examples",
    "Apply DSA concepts in real projects and interviews",
  ]

  const resources = [
    { id: "r1", title: "Algorithm Cheatsheet (PDF)", type: "PDF", href: "#" },
    { id: "r2", title: "Practice Problems Set #1", type: "Exercise", href: "#" },
    { id: "r3", title: "Complexity Reference Table", type: "Guide", href: "#" },
  ]

  // 💬 Community discussions related to this course
  const discussions: Question[] = [
    {
      id: "q1",
      title: "What’s the best way to visualize recursion in tree algorithms?",
      excerpt:
        "I struggle to understand how recursive functions actually move through stack frames. Any visualization or technique that helps?",
      tags: ["recursion", "trees", "visualization"],
      votes: 14,
      answers: 4,
      views: 680,
      answered: true,
      author: { name: "Aisha Khan", initials: "AK" },
      createdAt: "2h ago",
      likes: 23,
      comments: 12,
    },
    {
      id: "q2",
      title: "How does space complexity differ between BFS and DFS?",
      excerpt:
        "While both BFS and DFS traverse the same graph, I’m unsure how their memory usage differs in real-world implementations.",
      tags: ["graphs", "algorithms", "complexity"],
      votes: 9,
      answers: 3,
      views: 420,
      answered: false,
      author: { name: "Omar Ali", initials: "OA" },
      createdAt: "5h ago",
      likes: 23,
      comments: 12,
    },
  ];
  const tasks: {
    id: string
    title: string
    type: "quiz" | "reading" | "coding"
    duration: string
    description: string
  }[] = [
    {
      id: "t1",
      title: "Introduction to DSA",
      type: "reading",
      duration: "10m",
      description: "Understand what Data Structures and Algorithms are, why they matter, and how they impact problem-solving.",
    },
    {
      id: "t2",
      title: "Arrays and Strings",
      type: "coding",
      duration: "30m",
      description: "Implement array manipulation and string processing problems using Python or JavaScript.",
    },
    {
      id: "t3",
      title: "Stacks and Queues",
      type: "reading",
      duration: "20m",
      description: "Learn the underlying concepts and practical applications of stacks and queues.",
    },
    {
      id: "t4",
      title: "Linked Lists Deep Dive",
      type: "coding",
      duration: "40m",
      description: "Practice implementing singly and doubly linked lists, reversing lists, and detecting cycles.",
    },
    {
      id: "t5",
      title: "Searching & Sorting Algorithms",
      type: "quiz",
      duration: "15m",
      description: "Test your knowledge of binary search, merge sort, quick sort, and their time complexities.",
    },
    {
      id: "t6",
      title: "Trees and Binary Search Trees",
      type: "reading",
      duration: "25m",
      description: "Learn about hierarchical data structures, traversal techniques, and balanced tree concepts.",
    },
    {
      id: "t7",
      title: "Graphs and Traversals",
      type: "coding",
      duration: "35m",
      description: "Implement graph representations and algorithms like BFS, DFS, and Dijkstra’s shortest path.",
    },
    {
      id: "t8",
      title: "Recursion and Backtracking",
      type: "reading",
      duration: "20m",
      description: "Understand recursive problem-solving, base cases, and optimization through backtracking.",
    },
    {
      id: "t9",
      title: "Dynamic Programming Basics",
      type: "coding",
      duration: "45m",
      description: "Solve problems using memoization and tabulation. Practice with Fibonacci, Knapsack, and Subsequence problems.",
    },
    {
      id: "t10",
      title: "Final Assessment",
      type: "quiz",
      duration: "20m",
      description: "Evaluate your understanding through scenario-based DSA questions.",
    },
  ]


  return (
    <section className="mx-auto max-w-7xl w-full space-y-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN — Main course content */}
        <section className="lg:col-span-8 space-y-8">
          <CourseHero
            title={course.title}
            category={course.category}
            description={course.description}
            progress={course.progress}
            duration={course.duration}
            difficulty={course.difficulty}
            goalDate={course.goalDate}
            lastActive={course.lastActive}
          />

          <VideoPlayer />

          <ContentTabs
            summary={summary}
            transcript={transcript}
            keyPoints={keyPoints}
            resources={resources}
            tasks={tasks}
          />

          {/* 💬 Course-specific Community Section */}
          <div className="mt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-zinc-900">
                <MessageCircle className="h-5 w-5 text-zinc-700" />
                Community Discussions
              </h2>
              <button
                onClick={() => setOpenModal(true)}
                className="inline-flex items-center gap-2 rounded-md bg-zinc-900 text-white px-4 py-2 text-sm font-medium transition hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4" /> Ask a Question
              </button>
            </div>

            {/* Discussion list */}
            <div className="space-y-4">
              {discussions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>

            {/* “See all discussions” link */}
            <div className="text-center mt-6">
              <a
                href="/community/discussions"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:underline"
              >
                View all related discussions →
              </a>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN — Progress tracking */}
        <aside className="lg:col-span-4 space-y-4">
          <ProgressPanel
            progress={course.progress}
            lessons={[
              { id: "1", completed: true },
              { id: "2", completed: false },
              { id: "3", completed: false },
            ]}
          />
        </aside>
      </div>

      {/* 🧠 Ask Question Modal */}
      <AskQuestionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={(payload) => console.log("New question:", payload)}
      />
    </section>
  )
}
