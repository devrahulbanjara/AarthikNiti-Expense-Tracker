"use client"

import { useState } from "react"
import { Bell, CalendarClock, Check, EllipsisVertical } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

type Bill = {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
  reminderEnabled: boolean
}

// Define initial bills outside the component to avoid initialization issues
const initialBills: Bill[] = [
  {
    id: "1",
    name: "Rent",
    amount: 1200,
    dueDate: "2025-03-31",
    category: "Housing",
    reminderEnabled: true,
  },
  {
    id: "2",
    name: "Internet",
    amount: 79.99,
    dueDate: "2025-03-25",
    category: "Bills",
    reminderEnabled: true,
  },
  {
    id: "3",
    name: "Phone",
    amount: 45,
    dueDate: "2025-03-18",
    category: "Bills",
    reminderEnabled: false,
  },
  {
    id: "4",
    name: "Gym Membership",
    amount: 29.99,
    dueDate: "2025-03-20",
    category: "Health",
    reminderEnabled: false,
  },
]

export function UpcomingBills() {
  const [bills, setBills] = useState<Bill[]>(initialBills)

  const toggleReminder = (id: string) => {
    setBills(bills.map((bill) => (bill.id === id ? { ...bill, reminderEnabled: !bill.reminderEnabled } : bill)))
  }

  const markAsPaid = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id))
  }

  // Sort bills by due date (closest first)
  const sortedBills = [...bills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
        <CardDescription>Bills due in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedBills.length > 0 ? (
            sortedBills.map((bill) => {
              // Calculate days until due
              const today = new Date()
              const dueDate = new Date(bill.dueDate)
              const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

              // Determine urgency
              let urgencyColor = "bg-muted"
              if (daysUntilDue <= 3) urgencyColor = "bg-destructive"
              else if (daysUntilDue <= 7) urgencyColor = "bg-warning"

              return (
                <div key={bill.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`h-2 w-2 rounded-full ${urgencyColor}`} />
                    <div>
                      <p className="text-sm font-medium leading-none">{bill.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {bill.category}
                        </Badge>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <CalendarClock className="mr-1 h-3 w-3" />
                          {daysUntilDue === 0
                            ? "Due today"
                            : daysUntilDue === 1
                              ? "Due tomorrow"
                              : `Due in ${daysUntilDue} days`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">${bill.amount.toFixed(2)}</p>
                    <Switch
                      checked={bill.reminderEnabled}
                      onCheckedChange={() => toggleReminder(bill.id)}
                      size="sm"
                      aria-label="Toggle reminder"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <EllipsisVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => markAsPaid(bill.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Mark as paid
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Set reminder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-muted-foreground">No upcoming bills</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

