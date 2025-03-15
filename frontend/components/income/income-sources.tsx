"use client"

import { useState } from "react"
import { ArrowUpDown, Calendar, DollarSign, EllipsisVertical, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

type IncomeSource = {
  id: string
  source: string
  amount: number
  date: string
  description?: string
}

export function IncomeSources() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    {
      id: "1",
      source: "Salary",
      amount: 3500,
      date: "2025-03-10",
      description: "Monthly salary",
    },
    {
      id: "2",
      source: "Freelance",
      amount: 500,
      date: "2025-03-07",
      description: "Website design project",
    },
    {
      id: "3",
      source: "Investments",
      amount: 120,
      date: "2025-03-03",
      description: "Dividend payment",
    },
    {
      id: "4",
      source: "Side Business",
      amount: 200,
      date: "2025-03-13",
      description: "Online store sales",
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

  const sortedIncomeSources = [...incomeSources].sort((a, b) => {
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

  const handleDelete = (id: string) => {
    setIncomeSources(incomeSources.filter((source) => source.id !== id))
    setDeleteId(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Income Sources</CardTitle>
          <CardDescription>Manage your income sources</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveTable>
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
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedIncomeSources.length > 0 ? (
                  sortedIncomeSources.map((source) => (
                    <TableRow key={source.id} className="group">
                      <TableCell className="font-medium">{source.source}</TableCell>
                      <TableCell className="font-medium text-success">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {source.amount.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(source.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {source.description || "-"}
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
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(source.id)}>
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
                    <TableCell colSpan={5} className="h-24 text-center">
                      No income sources found.
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
              This will permanently delete this income source. This action cannot be undone.
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

