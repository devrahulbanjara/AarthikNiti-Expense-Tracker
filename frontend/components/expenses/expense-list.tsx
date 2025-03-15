"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, CreditCard, DollarSign, EllipsisVertical, Repeat, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Expense = {
  id: string
  category: string
  amount: number
  date: string
  description?: string
  paymentMethod: string
  recurring: boolean
}

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      category: "Food",
      amount: 25.5,
      date: "2025-03-14",
      description: "Lunch at restaurant",
      paymentMethod: "Credit Card",
      recurring: false,
    },
    {
      id: "2",
      category: "Bills",
      amount: 120,
      date: "2025-03-05",
      description: "Electricity bill",
      paymentMethod: "Bank Transfer",
      recurring: true,
    },
    {
      id: "3",
      category: "Shopping",
      amount: 89.99,
      date: "2025-03-02",
      description: "New clothes",
      paymentMethod: "Credit Card",
      recurring: false,
    },
    {
      id: "4",
      category: "Transportation",
      amount: 45,
      date: "2025-03-10",
      description: "Uber rides",
      paymentMethod: "Mobile Payment",
      recurring: false,
    },
  ])

  const [deleteId, setDeleteId] = useState<string | null>(null)
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

  const sortedExpenses = [...expenses].sort((a, b) => {
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

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
    setDeleteId(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
          <CardDescription>Manage your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTable>
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
                  <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExpenses.length > 0 ? (
                  sortedExpenses.map((expense) => (
                    <TableRow key={expense.id} className="group">
                      <TableCell className="font-medium">
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-destructive">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {expense.amount.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center text-muted-foreground">
                          <CreditCard className="h-3 w-3 mr-1" />
                          {expense.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        <div className="flex items-center">
                          {expense.description || "-"}
                          {expense.recurring && <Repeat className="h-3 w-3 ml-1 text-primary" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <EllipsisVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(expense.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No expenses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ResponsiveTable>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

