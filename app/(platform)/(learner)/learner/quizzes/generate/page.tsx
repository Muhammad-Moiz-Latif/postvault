"use client"

import { useState } from "react"
import { Upload, FileText, Youtube, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function GenerateQuizPage() {
  const [step, setStep] = useState<"upload" | "processing" | "generated">("upload")

  return (
    <section className="min-h-screen bg-zinc-50 p-6 md:p-10 rounded-xl">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-zinc-900 mb-2 tracking-tight">
          Generate a Quiz from Your Lecture
        </h1>
        <p className="text-zinc-600 tracking-tight text-sm">
          Upload a PDF or paste a YouTube link — our AI will summarize content, extract insights, and create adaptive quizzes.
        </p>
      </div>

      {/* STEP 1: UPLOAD */}
      {step === "upload" && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white rounded-2xl border border-zinc-200 p-8 text-center"
        >
          <div className="flex justify-center gap-6 mb-8">
            <button className="flex flex-col items-center justify-center border-2 border-dashed border-[#20B2AA]/40 bg-[#20B2AA]/5 hover:bg-[#20B2AA]/10 transition-all rounded-xl p-8 w-1/2"
              onClick={() => setStep("processing")}
            >
              <Youtube className="h-10 w-10 text-[#20B2AA]" />
              <span className="mt-3 text-sm font-medium text-zinc-700">Paste YouTube Link</span>
            </button>

            <button className="flex flex-col items-center justify-center border-2 border-dashed border-[#20B2AA]/40 bg-[#20B2AA]/5 hover:bg-[#20B2AA]/10 transition-all rounded-xl p-8 w-1/2"
              onClick={() => setStep("processing")}
            >
              <FileText className="h-10 w-10 text-[#20B2AA]" />
              <span className="mt-3 text-sm font-medium text-zinc-700">Upload PDF File</span>
            </button>
          </div>

          <p className="text-xs text-zinc-500">
            Supported: PDF, YouTube lectures, or text transcripts
          </p>
        </motion.div>
      )}

      {/* STEP 2: PROCESSING */}
      {step === "processing" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto text-center mt-20"
        >
          <Loader2 className="h-10 w-10 text-[#20B2AA] mx-auto animate-spin" />
          <h3 className="mt-4 text-lg font-medium text-zinc-800">Analyzing your content...</h3>
          <p className="text-sm text-zinc-600 mt-2">
            Extracting transcript, generating key insights, and creating quiz sets.
          </p>
        </motion.div>
      )}

      {/* STEP 3: GENERATED DASHBOARD */}
      {step === "generated" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto"
        >
          {/* Reuse your improved ContentTabs or the upcoming AI dashboard layout */}
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-4">
              Your AI-Generated Learning Dashboard
            </h2>
            <p className="text-sm text-zinc-600 mb-6">
              Review your transcript, explore notes, and start your adaptive quizzes below.
            </p>
            {/* <ContentTabs {...dataFromAI} /> */}
          </div>
        </motion.div>
      )}
    </section>
  )
}
