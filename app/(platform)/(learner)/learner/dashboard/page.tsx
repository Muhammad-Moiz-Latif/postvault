"use client"

import { Suspense } from "react"
import { StatsRow } from "@/components/learner/analytics/stats-row"
import { UserAnalytics } from "@/components/learner/analytics/user-analytics"
import { XPStreakPanel } from "@/components/learner/analytics/xp-streak"
import { ContinueLearning } from "@/components/learner/layout/continue-learning"
import { Recommendations } from "@/components/learner/layout/recommendations"

export default function LearnerDashboardPage() {
  return (
    <>
      {/* Row 1: Stats */}
      <section aria-labelledby="stats">
        <h2 id="stats" className="sr-only">
          Statistics Overview
        </h2>
        <StatsRow />
      </section>

      {/* Row 2: Analytics + XP Panel */}
      <section aria-labelledby="analytics" className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <UserAnalytics />
        </div>
        <div className="md:col-span-1">
          <XPStreakPanel />
        </div>
      </section>

      {/* Row 3: Continue Learning */}
      <section aria-labelledby="continue-learning">
        <Suspense>
          <ContinueLearning />
        </Suspense>
      </section>

      {/* Row 4: Recommendations */}
      <section aria-labelledby="recommendations">
        <Recommendations />
      </section>
    </>
  )
}
