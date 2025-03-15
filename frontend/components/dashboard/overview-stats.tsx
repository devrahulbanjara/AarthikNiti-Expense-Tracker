"use client"

import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function OverviewStats() {
  // Calculate the spending percentage for the progress bar
  const spentPercentage = 53.5

  // Determine the color based on the percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 60) return "bg-success"
    if (percentage < 80) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <>
      <Card className="sm:col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$12,546.00</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$4,935.00</div>
          <p className="text-xs text-muted-foreground">+10.1% from last month</p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$2,640.00</div>
          <p className="text-xs text-muted-foreground">+3.2% from last month</p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{spentPercentage}%</div>
          <Progress value={spentPercentage} className="mt-2" indicatorClassName={getProgressColor(spentPercentage)} />
          <p className="mt-1 text-xs text-muted-foreground">of monthly budget</p>
          <p
            className={`text-xs mt-1 ${
              spentPercentage < 60 ? "text-success" : spentPercentage < 80 ? "text-warning" : "text-destructive"
            }`}
          >
            {spentPercentage < 60
              ? "Healthy spending"
              : spentPercentage < 80
                ? "Caution: Approaching budget limit"
                : "Warning: Budget limit exceeded"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

