"use client"

import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart } from "lucide-react"
import { Rubik } from "next/font/google"

import img1 from "../../../../../../assets/data-science-python.png"
import img2 from "../../../../../../assets/deep-learning-concept.png"
import img3 from "../../../../../../assets/full-stack-development.png"
import img4 from "../../../../../../assets/ui-ux-design-concept.png"

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "300"],
})

type Course = {
  id: string
  title: string
  description: string
  category: string
  level: string
  progress: number
  duration: string
  thumb: StaticImageData
  tags?: string[]
}

const courses: Course[] = [
  {
    id: "algo-mastery",
    title: "Algorithms Mastery",
    description: "Deep dive into problem-solving strategies and algorithmic thinking...",
    category: "Computer Science",
    level: "Intermediate",
    progress: 77,
    duration: "12h 30m",
    thumb: img1,
    tags: ["DSA", "Logic", "Coding"],
  },
  {
    id: "data-structures",
    title: "Data Structures Essentials",
    description: "Learn to organize and manage data efficiently with real-world examples...",
    category: "Programming",
    level: "Beginner",
    progress: 45,
    duration: "9h 20m",
    thumb: img2,
    tags: ["Python", "Arrays", "Linked Lists"],
  },
  {
    id: "ml-basics",
    title: "Machine Learning Basics",
    description: "Understand the core ideas of AI, models, and predictive analytics...",
    category: "AI & ML",
    level: "Advanced",
    progress: 10,
    duration: "14h 10m",
    thumb: img3,
    tags: ["AI", "Neural Nets", "Python"],
  },
  {
    id: "web-dev",
    title: "Modern Web Development",
    description: "Master frontend frameworks and responsive design with hands-on projects...",
    category: "Frontend",
    level: "Intermediate",
    progress: 90,
    duration: "20h 15m",
    thumb: img4,
    tags: ["React", "CSS", "JavaScript"],
  },
]

export default function AllCoursesPage() {
  return (
    <div className={`space-y-8 p-5 ${rubik.className} bg-white border border-zinc-300 rounded-xl`}>
      {/* Page Heading */}
      <div>
        <h1 className="text-4xl text-zinc-900 tracking-tight font-[500]">Active Courses</h1>
        <p className="text-sm text-zinc-600 tracking-tight mt-1">
          Continue you learning journey - pick up where you left of.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 hover:shadow-lg transition-all duration-300 group flex flex-col">
      {/* ─── Thumbnail ───────────────────────────── */}
      <div className="relative h-36 w-full overflow-hidden">
        <Image
          src={course.thumb}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* ─── Content ─────────────────────────────── */}
      <CardContent className="flex flex-col flex-1 justify-between p-4 space-y-3">
        <div>
          {/* Title + Description */}
          <h3 className="text-base font-semibold text-zinc-900 line-clamp-1">
            {course.title}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2">{course.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {course.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#20B2AA]/10 text-[#20B2AA]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-zinc-500 mt-2">
          <div className="flex items-center gap-1">
            <BarChart className="h-3.5 w-3.5" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-zinc-600 mb-1">
            <span>Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#20B2AA] transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-2">
          <Button
            asChild
            size="sm"
            className="w-full bg-[#20B2AA] text-white hover:bg-[#20B2AA]/80 transition-all duration-200"
          >
            <Link href={`/learner/courses/${course.id}`}>Continue</Link>
          </Button>
        </div>
      </CardContent>
    </div>
  )
}
