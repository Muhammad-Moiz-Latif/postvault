import { Eye, ThumbsUp, MessageSquare, CheckCircle2, Share2, Bookmark, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Answer = {
  id: string
  author: { name: string; initials: string; avatar?: string }
  content: string
  votes: number
  createdAt: string
  isAccepted?: boolean
}

export default function Discussion() {
  const question = {
    title: "How to implement authentication in React with TypeScript?",
    content: `I'm building a React application with TypeScript and need to implement user authentication. I want to handle login, logout, and protected routes efficiently.

I've tried using Context API but I'm running into issues with TypeScript types. What's the best approach for this? Should I use a library like React Router or build my own solution?

Any code examples would be greatly appreciated!`,
    author: { name: "Sarah Chen", initials: "SC", avatar: undefined },
    createdAt: "2 hours ago",
    votes: 24,
    views: 342,
    answers: 8,
    tags: ["react", "typescript", "authentication", "security"],
  }

  const answers: Answer[] = [
    {
      id: "1",
      author: { name: "Alex Thompson", initials: "AT" },
      content: "I recommend using React Context combined with React Router for this. Here's a basic pattern that works well with TypeScript:\n\nCreate an AuthContext that manages your authentication state, then wrap your routes with a ProtectedRoute component. This gives you type safety and clean separation of concerns.\n\nMake sure to also handle token refresh and error states properly.",
      votes: 18,
      createdAt: "1 hour ago",
      isAccepted: true,
    },
    {
      id: "2",
      author: { name: "Jordan Lee", initials: "JL" },
      content: "Another approach is to use a library like Auth0 or Firebase Authentication. They handle a lot of the complexity for you and have excellent TypeScript support.\n\nThe key is to create proper types for your user object and authentication state. This will help catch errors early.",
      votes: 12,
      createdAt: "45 minutes ago",
    },
  ]

  return (
    <div className="min-h-screen bg-white border border-zinc-300 rounded-xl dark:bg-[#0b1114]">
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Back navigation - enhanced */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#20B2AA] transition-colors mb-6"
        >
          ← Back to discussions
        </a>

        {/* Question Card - removed border, enhanced styling */}
        <div className="mb-8">
          <div className="p-6">
            {/* Question Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex flex-col items-center gap-2">
                <button 
                  className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-[#151a1e] 
                    border border-zinc-200 dark:border-[#202427] transition-all
                    hover:border-[#20B2AA] hover:text-[#20B2AA]
                    active:scale-95"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                  {question.votes}
                </span>
                <button 
                  className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-[#151a1e] 
                    border border-zinc-200 dark:border-[#202427] transition-all
                    hover:border-[#20B2AA] hover:text-[#20B2AA]
                    active:scale-95"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
                  {question.title}
                </h1>

                {/* Tags - enhanced hover effect */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#20B2AA]/5 px-4 py-1.5 text-xs font-medium 
                        text-[#20B2AA] hover:bg-[#20B2AA]/10 cursor-pointer transition-all
                        border border-[#20B2AA]/10 hover:border-[#20B2AA]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Question Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none 
                  text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mb-6">
                  {question.content}
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4
                  border-t border-dashed border-zinc-200 dark:border-[#202427]/50">
                  <div className="flex items-center gap-6 text-sm text-zinc-500">
                    <span className="flex items-center gap-2 hover:text-[#20B2AA] transition-colors cursor-pointer">
                      <Eye className="h-4 w-4" />
                      {question.views} views
                    </span>
                    <span className="flex items-center gap-2 hover:text-[#20B2AA] transition-colors cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      {question.answers} answers
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-[#20B2AA]/5 hover:text-[#20B2AA]"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-[#20B2AA]/5 hover:text-[#20B2AA]"
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mt-4 pt-4
                  border-t border-dashed border-zinc-200 dark:border-[#202427]/50">
                  <Avatar className="h-10 w-10 ring-2 ring-[#20B2AA]/20">
                    <AvatarImage src={question.author.avatar} />
                    <AvatarFallback className="bg-[#20B2AA]/10 text-[#20B2AA] font-medium">
                      {question.author.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm text-zinc-800 dark:text-zinc-200 font-medium 
                      hover:text-[#20B2AA] cursor-pointer block">
                      {question.author.name}
                    </span>
                    <span className="text-xs text-zinc-500">asked {question.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-medium text-zinc-800 dark:text-zinc-100 flex items-center gap-2 pb-4
            border-b border-dashed border-zinc-200 dark:border-[#202427]/50">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          {answers.map((answer) => (
            <div
              key={answer.id}
              className={`p-6 rounded-lg transition-colors
                ${answer.isAccepted 
                  ? "bg-[#20B2AA]/5 dark:bg-[#20B2AA]/10" 
                  : "bg-zinc-100 hover:bg-zinc-50 dark:hover:bg-[#101418]"
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <button className="p-2 rounded-md hover:bg-accent transition-colors" aria-label="Upvote answer">
                    <ChevronUp className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </button>
                  <span className="text-lg font-semibold text-foreground">{answer.votes}</span>
                  <button className="p-2 rounded-md hover:bg-accent transition-colors" aria-label="Downvote answer">
                    <ChevronDown className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </button>
                  {answer.isAccepted && (
                    <CheckCircle2 className="h-6 w-6 text-primary mt-2" aria-label="Accepted answer" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {answer.isAccepted && (
                    <div className="inline-flex items-center gap-1 mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Accepted Answer
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap mb-4">
                    {answer.content}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={answer.author.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                          {answer.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-xs">
                        <span className="text-foreground font-medium">{answer.author.name}</span>
                        <span className="text-muted-foreground"> answered {answer.createdAt}</span>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary/80">
                      <MessageSquare className="h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Answer Form */}
        <div className="mt-10 bg-zinc-50 dark:bg-[#071016] rounded-lg p-6">
          <h3 className="text-2xl font-medium text-zinc-800 dark:text-zinc-100 mb-4">
            Your Answer
          </h3>
          <textarea
            placeholder="Share your knowledge and help the community..."
            className="min-h-[200px] w-full p-3 outline-none mb-4 resize-none bg-zinc-50 dark:bg-[#0d1114] 
              border-zinc-300 border dark:border-[#202427] rounded-lg
              focus:border-[#20B2AA]"
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Be respectful and provide helpful insights
            </p>
            <Button className="bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white px-6">
              <MessageSquare className="h-4 w-4 mr-2" />
              Post Answer
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
