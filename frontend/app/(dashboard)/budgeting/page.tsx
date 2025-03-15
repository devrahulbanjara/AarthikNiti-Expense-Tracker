import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BudgetOverview } from "@/components/budgeting/budget-overview"
import { CategoryBudgets } from "@/components/budgeting/category-budgets"
import { SmartAlerts } from "@/components/budgeting/smart-alerts"
import { AIInsights } from "@/components/budgeting/ai-insights"

export const metadata: Metadata = {
  title: "Budgeting & Alerts - SmartWise",
  description: "Manage your budgets and alerts",
}

export default function BudgetingPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Budgeting & Alerts"
        text="Set budgets, receive alerts, and get AI-powered financial recommendations."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetOverview />
        </div>
        <div>
          <SmartAlerts />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 mt-4">
        <CategoryBudgets />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 mt-4">
        <AIInsights />
      </div>
    </DashboardShell>
  )
}

