"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Recharts from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const pieData = [
  { name: "Food", value: 400, color: "#8884d8" },
  { name: "Bills", value: 300, color: "#82ca9d" },
  { name: "Shopping", value: 300, color: "#ffc658" },
  { name: "Travel", value: 200, color: "#ff8042" },
  { name: "Other", value: 100, color: "#0088fe" },
]

const barData7Days = [
  { day: "Mon", expense: 50 },
  { day: "Tue", expense: 120 },
  { day: "Wed", expense: 30 },
  { day: "Thu", expense: 80 },
  { day: "Fri", expense: 25 },
  { day: "Sat", expense: 150 },
  { day: "Sun", expense: 90 },
]

const barData15Days = [
  { day: "Mar 1", expense: 50 },
  { day: "Mar 3", expense: 120 },
  { day: "Mar 5", expense: 30 },
  { day: "Mar 7", expense: 80 },
  { day: "Mar 9", expense: 25 },
  { day: "Mar 11", expense: 150 },
  { day: "Mar 13", expense: 90 },
  { day: "Mar 15", expense: 60 },
]

const barData30Days = [
  { day: "Feb 15", expense: 50 },
  { day: "Feb 20", expense: 120 },
  { day: "Feb 25", expense: 30 },
  { day: "Mar 1", expense: 80 },
  { day: "Mar 5", expense: 25 },
  { day: "Mar 10", expense: 150 },
  { day: "Mar 15", expense: 90 },
]

export function ExpenseOverview() {
  const [timeRange, setTimeRange] = useState("7days")

  const getDataByRange = () => {
    switch (timeRange) {
      case "7days":
        return barData7Days
      case "15days":
        return barData15Days
      case "30days":
        return barData30Days
      default:
        return barData7Days
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Expense Overview</CardTitle>
          <CardDescription>Your spending patterns</CardDescription>
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
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Daily Expenses</TabsTrigger>
            <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="h-[300px] w-full">
              <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.BarChart
                  data={getDataByRange()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Recharts.XAxis dataKey="day" />
                  <Recharts.YAxis tickFormatter={(value) => `$${value}`} />
                  <Recharts.Tooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, "Expense"]} />
                  <Recharts.Bar dataKey="expense" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
                </Recharts.BarChart>
              </Recharts.ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="breakdown">
            <div className="h-[300px] w-full">
              <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.PieChart>
                  <Recharts.Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Recharts.Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Recharts.Pie>
                  <Recharts.Tooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, "Amount"]} />
                  <Recharts.Legend />
                </Recharts.PieChart>
              </Recharts.ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

