"use client"

import { useState } from "react"
import { Sidebar } from "@/components/learner/layout/sidebar"
import { TopNav } from "@/components/learner/layout/top-nav"
import { Rubik } from "next/font/google"
import { cn } from "@/lib/utils"

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "300"],
})

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={cn("w-full min-h-screen bg-zinc-100", rubik.className)}>
      <Sidebar onToggle={setSidebarOpen} />
      <div
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <TopNav onToggle={sidebarOpen} />
        <main className="p-5 flex flex-col gap-6 mt-14">{children}</main>
      </div>
    </div>
  )
}
