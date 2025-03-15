"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Edit, Plus, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Budget = {
  id: string
  category: string
  amount: number
  spent: number
  remaining: number
  period: "monthly" | "quarterly" | "yearly"
}

export function CategoryBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: "1",
      category: "Food",
      amount: 500,
      spent: 420,
      remaining: 80,
      period: "monthly",
    },
    {
      id: "2",
      category: "Housing",
      amount: 1200,
      spent: 1200,
      remaining: 0,
      period: "monthly",
    },
    {
      id: "3",
      category: "Transportation",
      amount: 300,
      spent: 250,
      remaining: 50,
      period: "monthly",
    },
    {
      id: "4",
      category: "Entertainment",
      amount: 200,
      spent: 180,
      remaining: 20,
      period: "monthly",
    },
    {
      id: "5",
      category: "Shopping",
      amount: 300,
      spent: 350,
      remaining: -50,
      period: "monthly",
    },
    {
      id: "6",
      category: "Utilities",
      amount: 250,
      spent: 230,
      remaining: 20,
      period: "monthly",
    },
  ])

  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    period: "monthly",
  })

  const handleAddBudget = () => {
    if (!newBudget.category || !newBudget.amount) return

    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      amount: Number.parseFloat(newBudget.amount),
      spent: 0,
      remaining: Number.parseFloat(newBudget.amount),
      period: newBudget.period as "monthly" | "quarterly" | "yearly",
    }

    setBudgets([...budgets, budget])
    setNewBudget({ category: "", amount: "", period: "monthly" })
    setIsAddBudgetOpen(false)
  }

  // Get progress color based on percentage
  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100
    if (percentage < 70) return "bg-success"
    if (percentage < 90) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Category Budgets</CardTitle>
          <CardDescription>Manage your category-wise budgets</CardDescription>
        </div>
        <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
              <DialogDescription>Create a new budget for a specific category</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newBudget.category}
                  onValueChange={(value) => setNewBudget({ ...newBudget, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <div className="col-span-3 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="period" className="text-right">
                  Period
                </Label>
                <Select
                  value={newBudget.period}
                  onValueChange={(value) => setNewBudget({ ...newBudget, period: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBudget}>Add Budget</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">{budget.category}</TableCell>
                <TableCell>${budget.amount.toFixed(2)}</TableCell>
                <TableCell>${budget.spent.toFixed(2)}</TableCell>
                <TableCell className={budget.remaining < 0 ? "text-destructive" : ""}>
                  ${budget.remaining.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="w-full max-w-xs">
                    <Progress
                      value={(budget.spent / budget.amount) * 100}
                      className="h-2"
                      indicatorClassName={getProgressColor(budget.spent, budget.amount)}
                    />
                  </div>
                </TableCell>
                <TableCell className="capitalize">{budget.period}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

