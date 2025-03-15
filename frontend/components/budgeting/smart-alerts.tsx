"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, AlertTriangle, DollarSign, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type Alert = {
  id: string
  title: string
  description: string
  type: "warning" | "info" | "critical"
  date: Date
  read: boolean
}

export function SmartAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      title: "Budget Alert: Shopping",
      description: "You've exceeded your Shopping budget by $50.",
      type: "critical",
      date: new Date(2025, 2, 15),
      read: false,
    },
    {
      id: "2",
      title: "Unusual Activity",
      description: "We detected an unusually large transaction of $350 in Entertainment category.",
      type: "warning",
      date: new Date(2025, 2, 14),
      read: false,
    },
    {
      id: "3",
      title: "Bill Due Soon",
      description: "Your electricity bill of $120 is due in 3 days.",
      type: "info",
      date: new Date(2025, 2, 12),
      read: true,
    },
    {
      id: "4",
      title: "Spending Trend",
      description: "Your dining expenses have increased by 30% this month.",
      type: "warning",
      date: new Date(2025, 2, 10),
      read: true,
    },
  ])

  const [alertSettings, setAlertSettings] = useState({
    budgetAlerts: true,
    unusualActivity: true,
    billReminders: true,
    spendingTrends: true,
  })

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "warning":
        return <Bell className="h-5 w-5 text-warning" />
      case "info":
        return <DollarSign className="h-5 w-5 text-primary" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
            Warning
          </Badge>
        )
      case "info":
        return <Badge variant="outline">Info</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Smart Alerts</CardTitle>
          <CardDescription>Stay informed about your finances</CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Alert Settings</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <ScrollArea className="h-[300px]">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`mb-3 rounded-lg border p-3 ${!alert.read ? "bg-muted/50" : ""}`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          {!alert.read && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">{alert.date.toLocaleDateString()}</p>
                          {getAlertBadge(alert.type)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <h4 className="text-sm font-medium">Alert Settings</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="budget-alerts" className="text-sm">
                  Budget Alerts
                </label>
                <Switch
                  id="budget-alerts"
                  checked={alertSettings.budgetAlerts}
                  onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, budgetAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="unusual-activity" className="text-sm">
                  Unusual Activity
                </label>
                <Switch
                  id="unusual-activity"
                  checked={alertSettings.unusualActivity}
                  onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, unusualActivity: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="bill-reminders" className="text-sm">
                  Bill Reminders
                </label>
                <Switch
                  id="bill-reminders"
                  checked={alertSettings.billReminders}
                  onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, billReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="spending-trends" className="text-sm">
                  Spending Trends
                </label>
                <Switch
                  id="spending-trends"
                  checked={alertSettings.spendingTrends}
                  onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, spendingTrends: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

