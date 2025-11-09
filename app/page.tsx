import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Code, Trophy, Users, Zap } from "lucide-react"

export default function LandingPage() {
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

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How it Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="container mx-auto px-4 lg:px-8 py-24 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-poppins font-bold mb-6 text-balance">
              The fastest way to <span className="text-primary">master</span> any subject
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto leading-relaxed">
              Transform your learning experience with AI-powered content generation, adaptive assessments, and
              interactive tools designed for modern education.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-base">
                <Link href="/register">Start Learning Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-6">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-32 border-t border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-poppins font-bold mb-4">Everything you need to excel</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to accelerate your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="AI Content Generation"
              description="Automatically extract concepts and generate personalized learning materials from any content"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Adaptive Assessments"
              description="Smart quizzes that adapt to your skill level and provide instant feedback"
            />
            <FeatureCard
              icon={<Code className="w-6 h-6" />}
              title="Integrated IDE"
              description="Practice coding directly in the browser with real-time execution and feedback"
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6" />}
              title="Gamification"
              description="Earn points, badges, and climb leaderboards as you progress through courses"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Community Forum"
              description="Connect with peers, ask questions, and share knowledge in dedicated forums"
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Personalized Paths"
              description="AI-powered recommendations tailored to your learning style and goals"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 border-t border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-poppins font-bold mb-6">Ready to transform your learning?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of learners already using Lessonix to achieve their goals
            </p>
            <Button size="lg" asChild className="text-base">
              <Link href="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-poppins font-semibold">Lessonix</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Lessonix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-poppins font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}
