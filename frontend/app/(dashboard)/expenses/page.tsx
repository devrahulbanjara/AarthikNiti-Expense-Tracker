import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ExpenseOverview } from "@/components/expenses/expense-overview"
import { ExpenseList } from "@/components/expenses/expense-list"
import { AddExpenseButton } from "@/components/expenses/add-expense-button"

export const metadata: Metadata = {
  title: "Expenses - SmartWise",
  description: "Manage your expenses",
}

export default function ExpensesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Expenses" text="Manage your expenses and track your spending.">
        <div className="flex items-center gap-2">
          <AddExpenseButton />
        </div>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <ExpenseOverview />
      </div>
      <div className="mt-4">
        <ExpenseList />
      </div>
    </DashboardShell>
  )
}

