"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, TrendingDown, DollarSign, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AIInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>Smart recommendations to improve your finances</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="savings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
          </TabsList>
          <TabsContent value="savings" className="space-y-4 pt-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Increase Your Savings</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your income and spending patterns, you could save an additional $350 per month by reducing
                    non-essential expenses.
                  </p>
                  <Button variant="link" size="sm" className="px-0 mt-2">
                    View Detailed Plan <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Optimize Your Emergency Fund</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your emergency fund is currently at $3,500. We recommend increasing it to $6,000 (3 months of
                    expenses) for better financial security.
                  </p>
                  <Button variant="link" size="sm" className="px-0 mt-2">
                    Learn More <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="spending" className="space-y-4 pt-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="bg-warning/10 p-2 rounded-full">
                  <TrendingDown className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-medium">Reduce Dining Expenses</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've spent $420 on dining this month, which is 30% higher than your average. Consider cooking at
                    home more often to save money.
                  </p>
                  <Button variant="link" size="sm" className="px-0 mt-2">
                    See Spending Breakdown <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="bg-warning/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-medium">Unused Subscriptions</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We've identified 3 subscription services totaling $35/month that you haven't used in the last 60
                    days. Consider canceling them.
                  </p>
                  <Button variant="link" size="sm" className="px-0 mt-2">
                    Review Subscriptions <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="budgeting" className="space-y-4 pt-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Optimize Your Budget Allocation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on your spending patterns, we recommend adjusting your budget: decrease Shopping by $50 and
                    increase Savings by $50.
                  </p>
                  <Button variant="link" size="sm" className="px-0 mt-2">
                    Apply Recommendations <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">50/30/20 Rule Analysis</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your current budget allocation is 60% needs, 30% wants, and 10% savings. We recommend adjusting to
                    the 50/30/20 rule for better financial health.
                  </p>
                  <Button variant="link" size="sm" className="px-0 mt-2">
                    Learn About 50/30/20 <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

