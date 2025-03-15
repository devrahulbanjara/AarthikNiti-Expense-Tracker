"use client"

import { useState } from "react"
import { Check, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

type Account = {
  id: string
  name: string
  email: string
  active: boolean
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Account name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function AccountSwitcher() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "1", name: "Personal", email: "john@example.com", active: true },
    { id: "2", name: "Work", email: "john@company.com", active: false },
  ])
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const handleAccountSwitch = (id: string) => {
    setAccounts(
      accounts.map((account) => ({
        ...account,
        active: account.id === id,
      })),
    )
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newAccount = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      active: false,
    }

    setAccounts([...accounts, newAccount])
    setOpen(false)
    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardDescription>Manage your financial accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`flex items-center justify-between rounded-lg border p-4 ${account.active ? "bg-muted" : ""}`}
          >
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.email}</p>
              </div>
            </div>
            {account.active ? (
              <Button variant="outline" size="sm" className="gap-1" disabled>
                <Check className="h-4 w-4" />
                Active
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleAccountSwitch(account.id)}>
                Switch
              </Button>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>Create a new account to track different financial aspects.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Business, Family" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Account</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

