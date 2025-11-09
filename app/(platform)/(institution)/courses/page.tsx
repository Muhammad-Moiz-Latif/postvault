"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Star, Clock, Users, Code, Brain, Palette, Database, Bell } from "lucide-react"
import react_logo from '../../../../assets/react-logo-abstract.png'
import system_design_concept from '../../../../assets/system-design-concept.png'
import data_science_python from '../../../../assets/data-science-python.png'
import deep_learning_concept from '../../../../assets/deep-learning-concept.png'
import full_stack_development from '../../../../assets/full-stack-development.png'
import machine_learning_concept from '../../../../assets/machine-learning-concept.png'
import ui_ux_design_concept from '../../../../assets/ui-ux-design-concept.png'
import typescript_logo from '../../../../assets/typescript-logo.png';
import Image from "next/image"


const categories = [
  { id: "all", name: "All Courses", icon: BookOpen },
  { id: "programming", name: "Programming", icon: Code },
  { id: "data-science", name: "Data Science", icon: Database },
  { id: "ai-ml", name: "AI & ML", icon: Brain },
  { id: "design", name: "Design", icon: Palette },
]

const courses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "Sarah Johnson",
    rating: 4.8,
    students: 15420,
    duration: "12 hours",
    level: "Advanced",
    category: "programming",
    price: "$49.99",
    thumbnail: react_logo,
    description: "Master advanced React patterns including hooks, context, and performance optimization",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Michael Chen",
    rating: 4.9,
    students: 22100,
    duration: "18 hours",
    level: "Intermediate",
    category: "ai-ml",
    price: "$59.99",
    thumbnail: machine_learning_concept,
    description: "Learn the foundations of ML including supervised and unsupervised learning",
  },
  {
    id: 3,
    title: "TypeScript Mastery",
    instructor: "Alex Rivera",
    rating: 4.8,
    students: 12500,
    duration: "10 hours",
    level: "Intermediate",
    category: "programming",
    price: "$44.99",
    thumbnail: typescript_logo,
    description: "Deep dive into TypeScript with advanced types, generics, and best practices",
  },
  {
    id: 4,
    title: "System Design Interview Prep",
    instructor: "Emma Watson",
    rating: 4.9,
    students: 8900,
    duration: "15 hours",
    level: "Advanced",
    category: "programming",
    price: "$69.99",
    thumbnail: system_design_concept,
    description: "Ace your system design interviews with real-world examples and patterns",
  },
  {
    id: 5,
    title: "Data Science with Python",
    instructor: "James Lee",
    rating: 4.7,
    students: 18300,
    duration: "20 hours",
    level: "Beginner",
    category: "data-science",
    price: "$54.99",
    thumbnail: data_science_python,
    description: "Complete guide to data analysis, visualization, and machine learning with Python",
  },
  {
    id: 6,
    title: "UI/UX Design Principles",
    instructor: "Sophie Martinez",
    rating: 4.8,
    students: 14200,
    duration: "14 hours",
    level: "Beginner",
    category: "design",
    price: "$39.99",
    thumbnail: ui_ux_design_concept,
    description: "Learn design thinking, user research, wireframing, and prototyping",
  },
  {
    id: 7,
    title: "Deep Learning Specialization",
    instructor: "Dr. Andrew Ng",
    rating: 5.0,
    students: 35600,
    duration: "25 hours",
    level: "Advanced",
    category: "ai-ml",
    price: "$79.99",
    thumbnail: deep_learning_concept,
    description: "Master neural networks, CNNs, RNNs, and transformers from scratch",
  },
  {
    id: 8,
    title: "Full Stack Web Development",
    instructor: "Chris Anderson",
    rating: 4.7,
    students: 19800,
    duration: "30 hours",
    level: "Intermediate",
    category: "programming",
    price: "$64.99",
    thumbnail: full_stack_development,
    description: "Build complete web applications with React, Node.js, and databases",
  },
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-poppins font-semibold">Lessonix</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/courses" className="text-sm font-medium text-foreground">
                Courses
              </Link>
              <Link
                href="/my-learning"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Learning
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Leaderboard
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold mb-2">Explore Courses</h1>
          <p className="text-muted-foreground">Discover your next learning adventure</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CourseCard({ course }: { course: (typeof courses)[0] }) {
  return (
    <Link href={`/courses/course/${course.id}`}>
      <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden group">
        <div className="relative overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm">{course.level}</Badge>
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="font-poppins text-lg line-clamp-2">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{course.instructor}</p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{(course.students / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-lg font-bold">{course.price}</span>
            <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground">
              View Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
