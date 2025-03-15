import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReportOverview } from "@/components/reports/report-overview"
import { IncomeReport } from "@/components/reports/income-report"
import { ExpenseReport } from "@/components/reports/expense-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExportButton } from "@/components/shared/export-button"

export const metadata: Metadata = {
  title: "Reports - SmartWise",
  description: "View and download your financial reports",
}

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Reports" text="View and download your financial reports.">
        <div className="flex items-center gap-2">
          <ExportButton />
        </div>
      </DashboardHeader>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ReportOverview />
        </TabsContent>
        <TabsContent value="income">
          <IncomeReport />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpenseReport />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

