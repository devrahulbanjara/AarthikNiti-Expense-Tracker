import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { ExpensesBreakdown } from "@/components/dashboard/expenses-breakdown"
import { UpcomingBills } from "@/components/dashboard/upcoming-bills"
import { SavingsTrend } from "@/components/dashboard/savings-trend"
import { ChatbotAssistant } from "@/components/dashboard/chatbot-assistant"
import { CurrencyConverter } from "@/components/dashboard/currency-converter"
import { IncomeVsExpenses } from "@/components/dashboard/income-vs-expenses"

export const metadata: Metadata = {
  title: "Dashboard - SmartWise",
  description: "View your financial overview",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="View your financial overview and recent activity." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewStats />
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <div className="sm:col-span-1 md:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <ExpensesBreakdown />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <div>
          <UpcomingBills />
        </div>
        <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
          <SavingsTrend />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <div className="sm:col-span-1 md:col-span-1">
          <IncomeVsExpenses />
        </div>
        <div className="sm:col-span-1 md:col-span-1">
          <CurrencyConverter />
        </div>
        <div className="sm:col-span-1 md:col-span-2 lg:col-span-1">
          <ChatbotAssistant />
        </div>
      </div>
    </DashboardShell>
  )
}

