"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Recharts from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"

// Define data outside the component to avoid initialization issues
const pieData = [
  { name: "Food", value: 400, color: "#8884d8" },
  { name: "Bills", value: 300, color: "#82ca9d" },
  { name: "Shopping", value: 300, color: "#ffc658" },
  { name: "Travel", value: 200, color: "#ff8042" },
  { name: "Other", value: 100, color: "#0088fe" },
]

export function ExpensesBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses Breakdown</CardTitle>
        <CardDescription>Your spending by category</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}

