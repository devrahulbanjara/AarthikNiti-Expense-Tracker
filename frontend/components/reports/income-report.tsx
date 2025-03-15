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

type IncomeData = {
  id: string
  source: string
  amount: number
  date: string
}

const incomeData: IncomeData[] = [
  { id: "1", source: "Salary", amount: 3500, date: "2025-03-10" },
  { id: "2", source: "Freelance", amount: 500, date: "2025-03-07" },
  { id: "3", source: "Investments", amount: 120, date: "2025-03-03" },
  { id: "4", source: "Side Business", amount: 200, date: "2025-03-13" },
  { id: "5", source: "Salary", amount: 3500, date: "2025-02-10" },
  { id: "6", source: "Freelance", amount: 350, date: "2025-02-15" },
  { id: "7", source: "Investments", amount: 100, date: "2025-02-20" },
  { id: "8", source: "Side Business", amount: 180, date: "2025-02-25" },
]

const chartData = [
  { month: "Oct", salary: 3500, freelance: 400, investments: 100, other: 200 },
  { month: "Nov", salary: 3500, freelance: 800, investments: 150, other: 550 },
  { month: "Dec", salary: 3500, freelance: 600, investments: 120, other: 580 },
  { month: "Jan", salary: 3500, freelance: 700, investments: 200, other: 800 },
  { month: "Feb", salary: 3500, freelance: 350, investments: 100, other: 1550 },
  { month: "Mar", salary: 3500, freelance: 500, investments: 120, other: 880 },
]

export function IncomeReport() {
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

  const sortedIncomeData = [...incomeData].sort((a, b) => {
    const factor = sortDirection === "asc" ? 1 : -1

    switch (sortColumn) {
      case "source":
        return a.source.localeCompare(b.source) * factor
      case "amount":
        return (a.amount - b.amount) * factor
      case "date":
      default:
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * factor
    }
  })

  const handleExport = (format: string) => {
    console.log(`Exporting income report as ${format}`)
    // In a real app, this would trigger a download
  }

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Income by Source</CardTitle>
            <CardDescription>Breakdown of your income sources over time</CardDescription>
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
              <Recharts.BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="month" />
                <Recharts.YAxis tickFormatter={(value) => `$${value}`} />
                <Recharts.Tooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}`, ""]} />
                <Recharts.Legend />
                <Recharts.Bar dataKey="salary" stackId="a" fill="#8884d8" name="Salary" />
                <Recharts.Bar dataKey="freelance" stackId="a" fill="#82ca9d" name="Freelance" />
                <Recharts.Bar dataKey="investments" stackId="a" fill="#ffc658" name="Investments" />
                <Recharts.Bar dataKey="other" stackId="a" fill="#ff8042" name="Other" />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Income Transactions</CardTitle>
            <CardDescription>Detailed list of your income transactions</CardDescription>
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
                    onClick={() => handleSort("source")}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Source
                    {sortColumn === "source" && <ArrowUpDown className="h-3 w-3" />}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedIncomeData.map((income) => (
                <TableRow key={income.id}>
                  <TableCell className="font-medium">{income.source}</TableCell>
                  <TableCell>${income.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(income.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Total Income: ${incomeData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

