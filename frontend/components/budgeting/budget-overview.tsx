"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Recharts from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Define data outside the component to avoid initialization issues
const data = [
  { name: "Food", budget: 500, spent: 420, percentage: 84 },
  { name: "Housing", budget: 1200, spent: 1200, percentage: 100 },
  { name: "Transportation", budget: 300, spent: 250, percentage: 83 },
  { name: "Entertainment", budget: 200, spent: 180, percentage: 90 },
  { name: "Shopping", budget: 300, spent: 350, percentage: 117 },
  { name: "Utilities", budget: 250, spent: 230, percentage: 92 },
]

export function BudgetOverview() {
  const [timeRange, setTimeRange] = useState("month")

  // Calculate total budget and spent
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0)
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0)
  const overallPercentage = Math.round((totalSpent / totalBudget) * 100)

  // Get progress color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return "bg-success"
    if (percentage < 90) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Track your spending against your budget</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Overall Budget</span>
              <span className="text-sm font-medium">
                ${totalSpent} / ${totalBudget}
              </span>
            </div>
            <Progress
              value={overallPercentage}
              className="h-2"
              indicatorClassName={getProgressColor(overallPercentage)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{overallPercentage}% spent</span>
              <span>{100 - overallPercentage}% remaining</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                layout="vertical"
              >
                <Recharts.CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <Recharts.XAxis type="number" tickFormatter={(value) => `$${value}`} />
                <Recharts.YAxis type="category" dataKey="name" width={100} />
                <Recharts.Tooltip content={<ChartTooltipContent />} formatter={(value) => [`${value}`, ""]} />
                <Recharts.Legend />
                <Recharts.Bar dataKey="budget" fill="var(--primary)" name="Budget" />
                <Recharts.Bar dataKey="spent" fill="var(--destructive)" name="Spent" />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

