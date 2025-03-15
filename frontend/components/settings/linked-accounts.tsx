"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, BanknoteIcon as Bank, Wallet, Plus, Trash2, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

type LinkedAccount = {
  id: string
  name: string
  type: "bank" | "card" | "wallet"
  lastFour: string
  balance?: number
  lastSync: Date
}

export function LinkedAccounts() {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([
    {
      id: "1",
      name: "Chase Bank",
      type: "bank",
      lastFour: "4567",
      balance: 5432.1,
      lastSync: new Date(2025, 2, 15),
    },
    {
      id: "2",
      name: "Visa Credit Card",
      type: "card",
      lastFour: "8901",
      balance: -1250.75,
      lastSync: new Date(2025, 2, 15),
    },
    {
      id: "3",
      name: "PayPal",
      type: "wallet",
      lastFour: "3456",
      balance: 750.25,
      lastSync: new Date(2025, 2, 14),
    },
  ])

  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "bank",
    accountNumber: "",
  })
  const [syncingAccount, setSyncingAccount] = useState<string | null>(null)

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.accountNumber) return

    const account: LinkedAccount = {
      id: Date.now().toString(),
      name: newAccount.name,
      type: newAccount.type as "bank" | "card" | "wallet",
      lastFour: newAccount.accountNumber.slice(-4),
      balance: 0,
      lastSync: new Date(),
    }

    setAccounts([...accounts, account])
    setNewAccount({ name: "", type: "bank", accountNumber: "" })
    setIsAddingAccount(false)
  }

  const handleRemoveAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id))
  }

  const handleSyncAccount = (id: string) => {
    setSyncingAccount(id)
    // Simulate syncing
    setTimeout(() => {
      setAccounts(accounts.map((account) => (account.id === id ? { ...account, lastSync: new Date() } : account)))
      setSyncingAccount(null)
    }, 2000)
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Bank className="h-5 w-5" />
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "wallet":
        return <Wallet className="h-5 w-5" />
      default:
        return <Bank className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Linked Accounts</CardTitle>
          <CardDescription>Manage your linked bank accounts, credit cards, and digital wallets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">{getAccountIcon(account.type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{account.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {account.type === "bank" ? "Bank" : account.type === "card" ? "Card" : "Wallet"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">•••• {account.lastFour}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last synced: {account.lastSync.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {account.balance !== undefined && (
                  <p className={`font-medium ${account.balance < 0 ? "text-destructive" : ""}`}>
                    {account.balance < 0 ? "-" : ""}${Math.abs(account.balance).toFixed(2)}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncAccount(account.id)}
                    disabled={syncingAccount === account.id}
                  >
                    {syncingAccount === account.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Sync</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRemoveAccount(account.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Link New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link New Account</DialogTitle>
                <DialogDescription>
                  Connect your bank account, credit card, or digital wallet to track your finances.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Chase Bank"
                    className="col-span-3"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newAccount.type}
                    onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="card">Credit Card</SelectItem>
                      <SelectItem value="wallet">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-number" className="text-right">
                    Account Number
                  </Label>
                  <Input
                    id="account-number"
                    placeholder="•••• •••• •••• 1234"
                    className="col-span-3"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddAccount}>Link Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Synchronization</CardTitle>
          <CardDescription>Manage how your accounts sync with SmartWise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              Your accounts are automatically synchronized every 24 hours. You can manually sync your accounts at any
              time by clicking the Sync button.
            </p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Auto-Categorization</p>
              <p className="text-sm text-muted-foreground">
                Automatically categorize transactions from your linked accounts
              </p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Transaction Rules</p>
              <p className="text-sm text-muted-foreground">Create rules for how transactions are categorized</p>
            </div>
            <Button variant="outline">Manage Rules</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

