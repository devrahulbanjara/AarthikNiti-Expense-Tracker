"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Recharts from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define data outside the component to avoid initialization issues
const trendData = [
  { month: "Oct", savings: 1200 },
  { month: "Nov", savings: 1800 },
  { month: "Dec", savings: 1400 },
  { month: "Jan", savings: 2000 },
  { month: "Feb", savings: 2400 },
  { month: "Mar", savings: 2200 },
]

export function SavingsTrend() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Net Savings Trend</CardTitle>
          <CardDescription>Your savings over time</CardDescription>
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
        <div className="h-[300px] w-full">
          <Recharts.ResponsiveContainer width="100%" height="100%">
            <Recharts.AreaChart
              data={trendData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis dataKey="month" />
              <Recharts.YAxis tickFormatter={(value) => `$${value}`} />
              <Recharts.Tooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, "Savings"]} />
              <Recharts.Area
                type="monotone"
                dataKey="savings"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.2}
              />
            </Recharts.AreaChart>
          </Recharts.ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

