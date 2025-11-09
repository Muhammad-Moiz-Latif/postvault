import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import './globals.css';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lessonix - AI-Powered Interactive Learning Platform",
  description:
    "Transform your learning experience with AI-powered content, adaptive assessments, and interactive tools",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${poppins.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
