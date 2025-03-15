"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Recharts from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const data = [
  { month: "Oct", income: 4200, expenses: 3000, savings: 1200 },
  { month: "Nov", income: 5000, expenses: 3200, savings: 1800 },
  { month: "Dec", income: 4800, expenses: 3400, savings: 1400 },
  { month: "Jan", income: 5200, expenses: 3200, savings: 2000 },
  { month: "Feb", income: 5500, expenses: 3100, savings: 2400 },
  { month: "Mar", income: 5000, expenses: 2800, savings: 2200 },
]

export function ReportOverview() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Your income, expenses, and savings over time</CardDescription>
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
        <div className="h-[400px] w-full">
          <Recharts.ResponsiveContainer width="100%" height="100%">
            <Recharts.ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis dataKey="month" />
              <Recharts.YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value}`} />
              <Recharts.YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value}`} />
              <Recharts.Tooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, ""]} />
              <Recharts.Legend />
              <Recharts.Bar yAxisId="left" dataKey="income" fill="var(--success)" name="Income" barSize={20} />
              <Recharts.Bar yAxisId="left" dataKey="expenses" fill="var(--destructive)" name="Expenses" barSize={20} />
              <Recharts.Line
                yAxisId="right"
                type="monotone"
                dataKey="savings"
                stroke="var(--primary)"
                name="Savings"
                strokeWidth={2}
              />
            </Recharts.ComposedChart>
          </Recharts.ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

