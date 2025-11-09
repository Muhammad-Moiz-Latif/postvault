// /app/(learner)/playground/page.tsx
"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Rubik } from "next/font/google"
import Editor from "@monaco-editor/react"
import {
  Play,
  Send,
  Trash2,
  SunMedium,
  Moon,
  ChevronDown,
  RotateCcw,
  Code2,
  Terminal,
  CheckCircle2,
  XCircle,
} from "lucide-react"

const rubik = Rubik({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] })

type Lang = "javascript" | "typescript" | "python" | "cpp" | "java"

const LANG_LABELS: Record<Lang, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
}

const DEFAULT_SNIPPETS: Record<Lang, string> = {
  javascript: `// LRUCache (JS) - stub\nclass LRUCache {\n  constructor(capacity) {\n    // TODO\n  }\n  get(key) {\n    return -1\n  }\n  put(key, value) {}\n}\n\n// Example usage\nconsole.log("ready")`,
  typescript: `class LRUCache {\n  constructor(public capacity: number) {}\n  get(key: number): number { return -1 }\n  put(key: number, value: number): void {}\n}\nconsole.log("ready")`,
  python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass\n\nprint("ready")`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\nclass LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};\nint main(){ cout<<\"ready\"<<\"\\n\"; return 0; }`,
  java: `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n    public static void main(String[] args){ System.out.println(\"ready\"); }\n}`,
}

export default function CodingPlaygroundPage() {
  // theme: page-wide (affects body / document element)
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // layout state: left width percent, bottom height percent (for editor/console split)
  const [leftPct, setLeftPct] = useState<number>(36)
  const [bottomPct, setBottomPct] = useState<number>(35) // percent of right column height for editor (rest console)
  const [rightSplitPct, setRightSplitPct] = useState<number>(60) // vertical split for code/console
  const [mainSplitPct, setMainSplitPct] = useState<number>(40) // horizontal split for description/workspace
  const containerRef = useRef<HTMLDivElement | null>(null)
  const leftResizerRef = useRef<HTMLDivElement | null>(null)
  const bottomResizerRef = useRef<HTMLDivElement | null>(null)
  const horizontalResizerRef = useRef<HTMLDivElement | null>(null)
  const verticalResizerRef = useRef<HTMLDivElement | null>(null)

  // editor / code state
  const [language, setLanguage] = useState<Lang>("javascript")
  const [code, setCode] = useState<string>(DEFAULT_SNIPPETS.javascript)
  const [fontSize, setFontSize] = useState<number>(14)
  const [running, setRunning] = useState(false)
  const [consoleLines, setConsoleLines] = useState<Array<{ type: "info" | "error" | "out"; text: string }>>([])

  // UI
  const [showLangDropdown, setShowLangDropdown] = useState(false)

  // set code when language changes
  useEffect(() => {
    setCode(DEFAULT_SNIPPETS[language])
  }, [language])

  // page-wide theme applying
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
  }, [theme])

  // resizer logic: left-right
  useEffect(() => {
    const el = leftResizerRef.current
    const container = containerRef.current
    if (!el || !container) return
    let dragging = false
    let startX = 0
    let startLeft = leftPct
    function onDown(e: MouseEvent) {
      dragging = true
      startX = e.clientX
      startLeft = leftPct
      document.body.style.userSelect = "none"
    }
    function onMove(e: MouseEvent) {
      if (!dragging) return
      const rect = container?.getBoundingClientRect()
      if (!rect?.width) return
      const delta = ((e.clientX - startX) / rect.width) * 100
      const next = Math.min(72, Math.max(16, startLeft + delta))
      setLeftPct(next)
    }
    function onUp() {
      dragging = false
      document.body.style.userSelect = "auto"
    }
    el.addEventListener("mousedown", onDown)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      el.removeEventListener("mousedown", onDown)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [leftPct])

  // resizer logic: editor/console vertical split
  useEffect(() => {
    const el = bottomResizerRef.current
    const container = containerRef.current
    if (!el || !container) return
    let dragging = false
    let startY = 0
    let startBottom = bottomPct
    function onDown(e: MouseEvent) {
      dragging = true
      startY = e.clientY
      startBottom = bottomPct
      document.body.style.userSelect = "none"
    }
    function onMove(e: MouseEvent) {
      if (!dragging) return
      const rect = container?.getBoundingClientRect()
      if (!rect?.height) return
      const delta = ((startY - e.clientY) / rect.height) * 100
      const next = Math.min(82, Math.max(12, startBottom + delta))
      setBottomPct(next)
    }
    function onUp() {
      dragging = false
      document.body.style.userSelect = "auto"
    }
    el.addEventListener("mousedown", onDown)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      el.removeEventListener("mousedown", onDown)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [bottomPct])

  // resizer logic: horizontal split (main content)
  useEffect(() => {
    const el = horizontalResizerRef.current
    if (!el) return
    
    let dragging = false
    let startX = 0
    let startPct = mainSplitPct

    const onDown = (e: MouseEvent) => {
      dragging = true
      startX = e.clientX
      startPct = mainSplitPct
      document.body.style.cursor = 'col-resize'
    }

    const onMove = (e: MouseEvent) => {
      if (!dragging) return
      const delta = e.clientX - startX
      const containerWidth = window.innerWidth
      const deltaPct = (delta / containerWidth) * 100
      const newPct = Math.min(70, Math.max(20, startPct + deltaPct))
      setMainSplitPct(newPct)
    }

    const onUp = () => {
      dragging = false
      document.body.style.cursor = ''
    }

    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      el.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [mainSplitPct])

  // resizer logic: vertical split (code/console)
  useEffect(() => {
    const el = verticalResizerRef.current
    if (!el) return
    
    let dragging = false
    let startY = 0
    let startPct = rightSplitPct

    const onDown = (e: MouseEvent) => {
      dragging = true
      startY = e.clientY
      startPct = rightSplitPct
      document.body.style.cursor = 'row-resize'
    }

    const onMove = (e: MouseEvent) => {
      if (!dragging) return
      const delta = e.clientY - startY
      const containerHeight = window.innerHeight
      const deltaPct = (delta / containerHeight) * 100
      const newPct = Math.min(85, Math.max(15, startPct - deltaPct))
      setRightSplitPct(newPct)
    }

    const onUp = () => {
      dragging = false
      document.body.style.cursor = ''
    }

    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      el.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [rightSplitPct])

  // run simulation (mock) — replace with real runner later
  const runCode = useCallback(() => {
    setConsoleLines([])
    setRunning(true)
    setTimeout(() => {
      setConsoleLines((s) => [...s, { type: "info", text: "Compiling..." }])
      setTimeout(() => {
        setConsoleLines((s) => [...s, { type: "info", text: "Running tests..." }])
        setTimeout(() => {
          // fake success vs error pick
          if (code.includes("return -1") && language === "javascript") {
            setConsoleLines((s) => [...s, { type: "out", text: "All tests passed ✓" }])
          } else {
            setConsoleLines((s) => [
              ...s,
              { type: "error", text: "Test failed: expected [1], got [-1]" },
              { type: "out", text: "1/3 tests passed" },
            ])
          }
          setRunning(false)
        }, 700)
      }, 500)
    }, 300)
  }, [code, language])

  const submitSolution = useCallback(() => {
    setConsoleLines((s) => [...s, { type: "info", text: "Submitting solution..." }])
    setTimeout(() => {
      setConsoleLines((s) => [...s, { type: "out", text: "Submission received — queued for judge" }])
    }, 600)
  }, [])

  const resetCode = useCallback(() => {
    setCode(DEFAULT_SNIPPETS[language])
    setConsoleLines([])
  }, [language])

  // small helpers for styling
  const accent = "bg-[#20B2AA]"
  const accentText = "text-[#20B2AA]"

  return (
    <div
      ref={containerRef}
      className={`${rubik.className} min-h-screen bg-zinc-50 border border-zinc-300 dark:bg-[#0b1114] rounded-xl`}
    >
      {/* Top navbar - redesigned */}
      <div className="h-14 border-b border-zinc-200 rounded-t-xl dark:border-[#202427] px-4 flex items-center bg-white dark:bg-[#071016]">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-[#20B2AA]" />
            Coding Playground
          </h1>
          
          {/* Language selector moved to navbar */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown((s) => !s)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-50 dark:bg-[#0d1114] border border-zinc-200 dark:border-[#202427] text-sm font-medium hover:border-[#20B2AA] transition-colors"
            >
              {LANG_LABELS[language]} <ChevronDown className="h-4 w-4 opacity-60" />
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#0b1114] border border-zinc-200 dark:border-[#202427] rounded-md shadow-lg z-50">
                {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l)
                      setShowLangDropdown(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-[#0f1417] ${
                      language === l ? "text-[#20B2AA] font-semibold" : "text-zinc-700 dark:text-zinc-200"
                    }`}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Controls cluster - redesigned */}
        <div className="flex items-center gap-4">
          {/* Font size controls */}
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-[#0d1114] border border-zinc-200 dark:border-[#202427] rounded-md">
            <button 
              onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className="px-2 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-[#151a1e] rounded-l-md"
            >
              A-
            </button>
            <div className="px-2 py-1.5 text-xs border-x border-zinc-200 dark:border-[#202427]">
              {fontSize}px
            </div>
            <button 
              onClick={() => setFontSize(Math.min(20, fontSize + 1))}
              className="px-2 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-[#151a1e] rounded-r-md"
            >
              A+
            </button>
          </div>

          {/* Run/Submit buttons - enhanced */}
          <div className="flex items-center gap-2">
            <button
              onClick={runCode}
              disabled={running}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                ${running 
                  ? "bg-[#20B2AA]/70 text-white cursor-not-allowed" 
                  : "bg-[#20B2AA] text-white hover:bg-[#1a9d96] shadow-sm"}`}
            >
              <Play className="h-4 w-4" strokeWidth={2.5} />
              {running ? "Running..." : "Run Code"}
            </button>

            <button 
              onClick={submitSolution}
              className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium
                bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
            >
              <Send className="h-4 w-4" strokeWidth={2.5} />
              Submit
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 px-1 py-1 bg-zinc-50 dark:bg-[#0d1114] rounded-md border border-zinc-200 dark:border-[#202427]">
            <button 
              onClick={resetCode}
              title="Reset code"
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#151a1e] text-zinc-600 dark:text-zinc-400"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              title="Toggle theme"
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-[#151a1e]"
            >
              {theme === "dark" 
                ? <SunMedium className="h-4 w-4 text-[#20B2AA]" />
                : <Moon className="h-4 w-4 text-zinc-600" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - adjusted spacing */}
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left section - Problem description */}
        <div 
          className="h-full bg-white dark:bg-[#071016] border-r border-zinc-300 dark:border-[#202427] overflow-auto rounded-b-xl"
          style={{ width: `${mainSplitPct}%` }}
        >
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-[#15191c]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">146. LRU Cache</h2>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Medium • Design • Hash Table</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">Medium</div>
              </div>
            </div>
          </div>

          <div className="p-4 overflow-y-auto text-sm text-zinc-700 dark:text-zinc-200 space-y-4">
            <p>Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.</p>

            <div className="rounded-lg bg-zinc-50 dark:bg-[#071012] border border-zinc-100 dark:border-[#0f1417] p-3">
              <pre className="text-xs font-mono whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">{`Input:
["LRUCache","put","put","get","put","get"]
[[2],[1,1],[2,2],[1],[3,3],[2]]

Output:
[null,null,null,1,null,-1]`}</pre>
            </div>

            <div>
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Constraints</h4>
              <ul className="list-disc pl-5 text-xs text-zinc-600 dark:text-zinc-300 space-y-1 mt-2">
                <li>1 ≤ capacity ≤ 3000</li>
                <li>0 ≤ key ≤ 10⁴, 0 ≤ value ≤ 10⁵</li>
                <li>At most 2 * 10⁵ calls to get/put</li>
              </ul>
            </div>

            <div className="mt-2">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Tips</h4>
              <ul className="list-disc pl-5 text-xs text-zinc-600 dark:text-zinc-300 mt-2 space-y-1">
                <li>Use a doubly-linked list + hashmap for O(1) operations.</li>
                <li>Keep recently used items at the front.</li>
              </ul>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-zinc-100 dark:border-[#15191c] flex items-center justify-between">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Problem source: Interview collection</div>
            <div className="flex items-center gap-2">
              <button className="text-xs px-3 py-1 rounded-md bg-white dark:bg-[#071014] border border-zinc-200 dark:border-[#202427]">Prev</button>
              <button className="text-xs px-3 py-1 rounded-md bg-white dark:bg-[#071014] border border-zinc-200 dark:border-[#202427]">Next</button>
            </div>
          </div>
        </div>

        {/* Horizontal resizer */}
        <div
          ref={horizontalResizerRef}
          className="w-1 hover:w-2 bg-zinc-100 dark:bg-[#101418] cursor-col-resize hover:bg-[#20B2AA]/20 transition-all"
        />

        {/* Right section - Code editor and console */}
        <div 
          className="flex flex-col rounded-xl"
          style={{ width: `${100 - mainSplitPct}%` }}
        >
          {/* Editor area */}
          <div 
            className="border-b border-zinc-300 dark:border-[#202427] rounded-xl"
            style={{ height: `${rightSplitPct}%` }}
          >
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize,
                lineNumbers: "on",
                folding: true,
                glyphMargin: false,
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Vertical resizer */}
          <div
            ref={verticalResizerRef}
            className="h-1 hover:h-2 bg-zinc-100 dark:bg-[#101418] cursor-row-resize hover:bg-[#20B2AA]/20 transition-all"
          />

          {/* Console/Test cases area */}
          <div 
            className="bg-[#0b0b0b] dark:bg-[#060708] overflow-auto rounded-xl"
            style={{ height: `${100 - rightSplitPct}%` }}
          >
            {/* Console output */}
            <div className="h-full p-3 text-xs font-mono text-zinc-200">
              {consoleLines.length === 0 ? (
                <div className="text-zinc-400 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  <span>No output — run your code to see results</span>
                </div>
              ) : (
                consoleLines.map((l, i) => (
                  <div key={i} className={`mb-1 ${l.type === "error" ? "text-red-400" : "text-zinc-200"}`}>
                    {l.type === "error" ? <XCircle className="inline h-4 w-4 mr-1 text-red-400" /> : null}
                    {l.type === "info" ? <CheckCircle2 className="inline h-4 w-4 mr-1 text-blue-400" /> : null}
                    <span>{l.text}</span>
                  </div>
                )))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
