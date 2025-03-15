import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { IncomeOverview } from "@/components/income/income-overview"
import { IncomeSources } from "@/components/income/income-sources"
import { AddIncomeButton } from "@/components/income/add-income-button"

export const metadata: Metadata = {
  title: "Income - SmartWise",
  description: "Manage your income sources",
}

export default function IncomePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Income" text="Manage your income sources and track your earnings.">
        <div className="flex items-center gap-2">
          <AddIncomeButton />
        </div>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <IncomeOverview />
      </div>
      <div className="mt-4">
        <IncomeSources />
      </div>
    </DashboardShell>
  )
}

