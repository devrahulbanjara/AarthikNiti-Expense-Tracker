"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Recharts from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const data7Days = [
  { day: "Mon", income: 120 },
  { day: "Tue", income: 0 },
  { day: "Wed", income: 500 },
  { day: "Thu", income: 0 },
  { day: "Fri", income: 3500 },
  { day: "Sat", income: 200 },
  { day: "Sun", income: 0 },
]

const data15Days = [
  { day: "Mar 1", income: 0 },
  { day: "Mar 3", income: 120 },
  { day: "Mar 5", income: 0 },
  { day: "Mar 7", income: 500 },
  { day: "Mar 9", income: 0 },
  { day: "Mar 11", income: 3500 },
  { day: "Mar 13", income: 200 },
  { day: "Mar 15", income: 0 },
]

const data30Days = [
  { day: "Feb 15", income: 3500 },
  { day: "Feb 20", income: 0 },
  { day: "Feb 25", income: 120 },
  { day: "Mar 1", income: 0 },
  { day: "Mar 5", income: 500 },
  { day: "Mar 10", income: 3500 },
  { day: "Mar 15", income: 200 },
]

export function IncomeOverview() {
  const [timeRange, setTimeRange] = useState("7days")

  const getDataByRange = () => {
    switch (timeRange) {
      case "7days":
        return data7Days
      case "15days":
        return data15Days
      case "30days":
        return data30Days
      default:
        return data7Days
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Income Overview</CardTitle>
          <CardDescription>Your income trends over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="15days">Last 15 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Recharts.ResponsiveContainer width="100%" height="100%">
            <Recharts.BarChart
              data={getDataByRange()}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Recharts.XAxis dataKey="day" />
              <Recharts.YAxis tickFormatter={(value) => `$${value}`} />
              <Recharts.Tooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, "Income"]} />
              <Recharts.Bar dataKey="income" fill="var(--success)" radius={[4, 4, 0, 0]} />
            </Recharts.BarChart>
          </Recharts.ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

