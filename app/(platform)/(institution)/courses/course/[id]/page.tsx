"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Star,
  Clock,
  Users,
  PlayCircle,
  CheckCircle2,
  Award,
  Globe,
  Download,
  Share2,
  Heart,
  Bell,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock course data - in production this would come from an API
const courseData = {
  id: 1,
  title: "Advanced React Patterns",
  subtitle: "Master modern React development with advanced patterns and best practices",
  instructor: {
    name: "Sarah Johnson",
    title: "Senior Software Engineer at Meta",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.9,
    students: 45000,
    courses: 12,
  },
  rating: 4.8,
  totalRatings: 3420,
  students: 15420,
  duration: "12 hours",
  level: "Advanced",
  language: "English",
  lastUpdated: "January 2025",
  price: 49.99,
  thumbnail: "/react-logo-abstract.png",
  description:
    "Take your React skills to the next level with this comprehensive course on advanced patterns. Learn how to build scalable, maintainable applications using modern React features including hooks, context, performance optimization, and more.",
  whatYouWillLearn: [
    "Master advanced React hooks including useReducer, useContext, and custom hooks",
    "Implement performance optimization techniques with React.memo and useMemo",
    "Build complex state management solutions without external libraries",
    "Create reusable component patterns and compound components",
    "Understand React internals and the virtual DOM",
    "Apply best practices for testing React applications",
  ],
  requirements: [
    "Solid understanding of JavaScript ES6+",
    "Basic knowledge of React fundamentals",
    "Familiarity with npm and modern development tools",
  ],
  curriculum: [
    {
      section: "Introduction to Advanced Patterns",
      duration: "45 min",
      lessons: [
        { title: "Course Overview", duration: "5 min", type: "video", isPreview: true },
        { title: "Setting Up Your Environment", duration: "10 min", type: "video", isPreview: true },
        { title: "Review of React Fundamentals", duration: "15 min", type: "video", isPreview: false },
        { title: "What Are Design Patterns?", duration: "15 min", type: "video", isPreview: false },
      ],
    },
    {
      section: "Advanced Hooks",
      duration: "2h 30min",
      lessons: [
        { title: "Deep Dive into useReducer", duration: "25 min", type: "video", isPreview: false },
        { title: "Context API Best Practices", duration: "30 min", type: "video", isPreview: false },
        { title: "Building Custom Hooks", duration: "35 min", type: "video", isPreview: false },
        { title: "Hook Composition Patterns", duration: "30 min", type: "video", isPreview: false },
        { title: "Hands-on Exercise: Custom Hooks", duration: "30 min", type: "exercise", isPreview: false },
      ],
    },
    {
      section: "Performance Optimization",
      duration: "2h 15min",
      lessons: [
        { title: "Understanding React Rendering", duration: "20 min", type: "video", isPreview: false },
        { title: "React.memo and useMemo", duration: "25 min", type: "video", isPreview: false },
        { title: "useCallback for Function Optimization", duration: "20 min", type: "video", isPreview: false },
        { title: "Code Splitting and Lazy Loading", duration: "30 min", type: "video", isPreview: false },
        { title: "Performance Profiling Tools", duration: "25 min", type: "video", isPreview: false },
        { title: "Project: Optimize a Slow App", duration: "35 min", type: "exercise", isPreview: false },
      ],
    },
    {
      section: "Component Patterns",
      duration: "3h",
      lessons: [
        { title: "Compound Components Pattern", duration: "30 min", type: "video", isPreview: false },
        { title: "Render Props Pattern", duration: "25 min", type: "video", isPreview: false },
        { title: "Higher-Order Components", duration: "30 min", type: "video", isPreview: false },
        { title: "Controlled vs Uncontrolled Components", duration: "25 min", type: "video", isPreview: false },
        { title: "Building a Reusable Form System", duration: "50 min", type: "video", isPreview: false },
        { title: "Final Project: Component Library", duration: "60 min", type: "exercise", isPreview: false },
      ],
    },
  ],
  reviews: [
    {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent course! Sarah explains complex concepts in a very clear and practical way. The projects really helped solidify my understanding.",
    },
    {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "1 month ago",
      comment:
        "This course took my React skills to the next level. The performance optimization section alone was worth the price.",
    },
    {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "1 month ago",
      comment: "Great content overall. Would have liked more real-world examples, but still highly recommend.",
    },
  ],
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isEnrolling, setIsEnrolling] = useState(false)

  const handleEnroll = () => {
    setIsEnrolling(true)
    // Mock enrollment - in production this would call an API
    setTimeout(() => {
      setIsEnrolling(false)
      router.push("/dashboard")
    }, 1500)
  }

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
              <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Hero Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Link href="/courses" className="text-sm text-primary hover:underline">
                  ← Back to Courses
                </Link>
              </div>

              <Badge className="mb-4">{courseData.level}</Badge>

              <h1 className="text-4xl font-poppins font-bold mb-4">{courseData.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{courseData.subtitle}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{courseData.rating}</span>
                  <span className="text-muted-foreground">({courseData.totalRatings.toLocaleString()} ratings)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{courseData.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={courseData.instructor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{courseData.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{courseData.instructor.title}</p>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card>
                <div className="relative">
                  <img
                    src={courseData.thumbnail || "/placeholder.svg"}
                    alt={courseData.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
                  >
                    <PlayCircle className="w-8 h-8" />
                  </Button>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${courseData.price}</span>
                    <span className="text-muted-foreground line-through">$99.99</span>
                    <Badge variant="secondary">50% OFF</Badge>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleEnroll} disabled={isEnrolling}>
                    {isEnrolling ? "Enrolling..." : "Enroll Now"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">30-day money-back guarantee</p>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <h4 className="font-semibold text-sm">This course includes:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-muted-foreground" />
                        <span>12 hours on-demand video</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span>Downloadable resources</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>Lifetime access</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-poppins">About this course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{courseData.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-poppins">What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {courseData.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-poppins">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {courseData.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-poppins">Course Curriculum</CardTitle>
                    <CardDescription>
                      {courseData.curriculum.length} sections • {courseData.duration} total length
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {courseData.curriculum.map((section, index) => (
                        <AccordionItem key={index} value={`section-${index}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="font-semibold text-left">{section.section}</span>
                              <span className="text-sm text-muted-foreground">{section.duration}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pt-2">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lessonIndex}
                                  className="flex items-center justify-between p-3 rounded hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <PlayCircle className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{lesson.title}</span>
                                    {lesson.isPreview && (
                                      <Badge variant="outline" className="text-xs">
                                        Preview
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-6 mb-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={courseData.instructor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-2xl font-poppins font-bold mb-1">{courseData.instructor.name}</h3>
                        <p className="text-muted-foreground mb-4">{courseData.instructor.title}</p>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-semibold">{courseData.instructor.rating}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Instructor Rating</p>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">{courseData.instructor.students.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Students</p>
                          </div>
                          <div>
                            <div className="font-semibold mb-1">{courseData.instructor.courses}</div>
                            <p className="text-xs text-muted-foreground">Courses</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      Sarah is a Senior Software Engineer at Meta with over 10 years of experience in web development.
                      She specializes in React and has contributed to several open-source projects. Sarah is passionate
                      about teaching and has helped thousands of developers advance their careers through her courses.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-poppins">Student Reviews</CardTitle>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2">{courseData.rating}</div>
                        <div className="flex items-center gap-1 justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">Course Rating</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2">
                            <div className="flex items-center gap-1 w-20">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              <span className="text-sm">{stars}</span>
                            </div>
                            <Progress value={stars === 5 ? 85 : stars === 4 ? 12 : 3} className="h-2" />
                            <span className="text-sm text-muted-foreground w-12">
                              {stars === 5 ? "85%" : stars === 4 ? "12%" : "3%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {courseData.reviews.map((review, index) => (
                      <div key={index} className="border-b border-border pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{review.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.name}</h4>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </div>
  )
}
