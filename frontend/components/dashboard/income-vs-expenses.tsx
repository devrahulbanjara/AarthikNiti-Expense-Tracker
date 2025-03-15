"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Recharts from "recharts"
import { ChartTooltipContent, ResponsiveChartContainer } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Define data outside the component to avoid initialization issues
const data = [
  { month: "Jan", income: 5200, expenses: 3200 },
  { month: "Feb", income: 5500, expenses: 3100 },
  { month: "Mar", income: 5000, expenses: 2800 },
  { month: "Apr", income: 5300, expenses: 3000 },
  { month: "May", income: 5400, expenses: 3300 },
  { month: "Jun", income: 5600, expenses: 3400 },
]

export function IncomeVsExpenses() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Compare your income and expenses</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveChartContainer>
          <Recharts.BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Recharts.CartesianGrid strokeDasharray="3 3" />
            <Recharts.XAxis dataKey="month" />
            <Recharts.YAxis tickFormatter={(value) => `$${value}`} />
            <Recharts.Tooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, ""]} />
            <Recharts.Legend />
            <Recharts.Bar dataKey="income" fill="var(--success)" name="Income" />
            <Recharts.Bar dataKey="expenses" fill="var(--destructive)" name="Expenses" />
          </Recharts.BarChart>
        </ResponsiveChartContainer>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p className="text-xl font-bold text-success">32%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Average Monthly Savings</p>
            <p className="text-xl font-bold">$2,100</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

