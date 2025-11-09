"use client"

import { MessageSquare, ThumbsUp, Flame, Tag } from "lucide-react"
import { sampleQuestions } from "../page"

export default function TrendingPosts() {
  const posts = sampleQuestions

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3 text-[#20B2AA]">
          <div className="bg-[#20B2AA] p-2 rounded-md">
            <Flame className="size-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Trending Posts
          </h2>
        </div>
        <a
          href="#"
          className="text-[#20B2AA] hover:underline hover:text-[#189d97] transition-colors"
        >
          View all →
        </a>
      </div>

      {/* Post List */}
      <ul className="divide-y divide-zinc-100">
        {posts.map((post, i) => (
          <li
            key={post.id}
            className={`group relative p-6 transition-all duration-300 hover:bg-[#20B2AA]/5 ${
              i === 0
                ? "bg-gradient-to-r from-[#20B2AA]/10 via-white to-white"
                : "bg-white"
            }`}
          >
            {/* Highlight ribbon for top 3 */}
            {i < 3 && (
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#20B2AA] to-[#189d97] rounded-r-lg" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              {/* Post Main Info */}
              <div className="flex-1 min-w-0">
                <a
                  href="#"
                  className="text-base font-semibold text-zinc-900 hover:text-[#20B2AA] transition-colors line-clamp-1"
                >
                  {post.title}
                </a>

                <p className="mt-1 text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span className="font-medium text-zinc-700">
                    {post.author.name}
                  </span>
                  <span>•</span>
                  <span>{post.createdAt}</span>

                  {post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      {post.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 border border-[#20B2AA]/30 text-[#20B2AA] rounded-md px-2 py-0.5 bg-[#20B2AA]/5 hover:bg-[#20B2AA]/10 transition-colors"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Post Metrics */}
              <div className="flex items-center gap-4 shrink-0 text-xs font-medium text-zinc-500">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-[#20B2AA]" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-[#20B2AA]" />
                  {post.comments}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
