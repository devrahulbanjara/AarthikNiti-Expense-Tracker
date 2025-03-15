"use client"

import { useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CarIcon as CaretSortIcon,
  EllipsisVertical,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog"

type Transaction = {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  date: string
  description: string
}

// Define initial transactions outside the component to avoid initialization issues
const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "expense",
    category: "Food",
    amount: 25.5,
    date: "2025-03-14",
    description: "Lunch at restaurant",
  },
  {
    id: "2",
    type: "income",
    category: "Salary",
    amount: 3500,
    date: "2025-03-10",
    description: "Monthly salary",
  },
  {
    id: "3",
    type: "expense",
    category: "Bills",
    amount: 120,
    date: "2025-03-05",
    description: "Electricity bill",
  },
  {
    id: "4",
    type: "expense",
    category: "Shopping",
    amount: 89.99,
    date: "2025-03-02",
    description: "New clothes",
  },
  {
    id: "5",
    type: "income",
    category: "Freelance",
    amount: 250,
    date: "2025-03-01",
    description: "Website design project",
  },
]

export function RecentTransactions() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions] = useState<Transaction[]>(initialTransactions)

  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      transaction.category.toLowerCase().includes(query) ||
      transaction.description.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query) ||
      transaction.date.includes(query)
    )
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent financial activity</CardDescription>
        </div>
        <Button size="sm" className="h-8" onClick={() => setIsAddTransactionOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 pb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <span>Filter</span>
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      transaction.type === "income" ? "bg-success/20" : "bg-destructive/20"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpIcon className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowDownIcon className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{transaction.description}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-medium ${
                      transaction.type === "income" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EllipsisVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">No transactions found</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Transactions
        </Button>
      </CardFooter>
      <AddTransactionDialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen} />
    </Card>
  )
}

