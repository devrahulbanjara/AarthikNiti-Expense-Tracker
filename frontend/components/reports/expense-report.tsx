"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, FileDown, FileText, Printer } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import * as Recharts from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type ExpenseData = {
  id: string
  category: string
  amount: number
  date: string
  paymentMethod: string
}

const expenseData: ExpenseData[] = [
  { id: "1", category: "Food", amount: 25.5, date: "2025-03-14", paymentMethod: "Credit Card" },
  { id: "2", category: "Bills", amount: 120, date: "2025-03-05", paymentMethod: "Bank Transfer" },
  { id: "3", category: "Shopping", amount: 89.99, date: "2025-03-02", paymentMethod: "Credit Card" },
  { id: "4", category: "Transportation", amount: 45, date: "2025-03-10", paymentMethod: "Mobile Payment" },
  { id: "5", category: "Food", amount: 32.75, date: "2025-02-28", paymentMethod: "Credit Card" },
  { id: "6", category: "Bills", amount: 85, date: "2025-02-20", paymentMethod: "Bank Transfer" },
  { id: "7", category: "Shopping", amount: 120.5, date: "2025-02-15", paymentMethod: "Credit Card" },
  { id: "8", category: "Transportation", amount: 60, date: "2025-02-10", paymentMethod: "Mobile Payment" },
]

const pieData = [
  { name: "Food", value: 400, color: "#8884d8" },
  { name: "Bills", value: 300, color: "#82ca9d" },
  { name: "Shopping", value: 300, color: "#ffc658" },
  { name: "Travel", value: 200, color: "#ff8042" },
  { name: "Other", value: 100, color: "#0088fe" },
]

export function ExpenseReport() {
  const [timeRange, setTimeRange] = useState("6months")
  const [sortColumn, setSortColumn] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedExpenseData = [...expenseData].sort((a, b) => {
    const factor = sortDirection === "asc" ? 1 : -1

    switch (sortColumn) {
      case "category":
        return a.category.localeCompare(b.category) * factor
      case "amount":
        return (a.amount - b.amount) * factor
      case "date":
      default:
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * factor
    }
  })

  const handleExport = (format: string) => {
    console.log(`Exporting expense report as ${format}`)
    // In a real app, this would trigger a download
  }

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Breakdown of your expenses by category</CardDescription>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Expense Transactions</CardTitle>
            <CardDescription>Detailed list of your expense transactions</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("print")}>
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("category")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Category
                    {sortColumn === "category" && <ArrowUpDown className="h-3 w-3" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Amount
                    {sortColumn === "amount" && <ArrowUpDown className="h-3 w-3" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Date
                    {sortColumn === "date" && <ArrowUpDown className="h-3 w-3" />}
                  </Button>
                </TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenseData.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-destructive">${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{expense.paymentMethod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Total Expenses: ${expenseData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

