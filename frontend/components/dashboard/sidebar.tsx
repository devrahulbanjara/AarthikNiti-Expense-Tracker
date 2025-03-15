"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  PieChart,
  Settings,
  User,
  BellRing,
  ChevronDown,
  PlusCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAccount } from "@/contexts/account-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Main navigation items
const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Income",
    href: "/income",
    icon: DollarSign,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Budgeting & Alerts",
    href: "/budgeting",
    icon: BellRing,
  },
]

// Bottom navigation items
const bottomNavItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { accounts, activeAccount, switchAccount, addAccount } = useAccount()
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [newAccount, setNewAccount] = useState({ name: "", email: "" })

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.email) return

    addAccount({
      name: newAccount.name,
      email: newAccount.email,
    })

    setNewAccount({ name: "", email: "" })
    setIsAddingAccount(false)
  }

  // Common sidebar content to be used in both desktop and mobile views
  const sidebarContent = (
    <>
      {/* Logo - only show in mobile view */}
      <div className="flex h-14 items-center border-b px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <PieChart className="h-6 w-6" />
          <span>SmartWise</span>
        </Link>
      </div>

      {/* Account Switcher */}
      <div className="border-b p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src="/placeholder.svg?height=20&width=20" alt="User" />
                  <AvatarFallback className="text-xs">{activeAccount?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{activeAccount?.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => switchAccount(account.id)}
                className={account.active ? "bg-muted" : ""}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="/placeholder.svg?height=20&width=20" alt="User" />
                    <AvatarFallback className="text-xs">{account.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm">{account.name}</span>
                    <span className="text-xs text-muted-foreground">{account.email}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="text-sm">Add Account</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Account</DialogTitle>
                  <DialogDescription>Create a new account to track different financial aspects.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Personal, Business, etc."
                      className="col-span-3"
                      value={newAccount.name}
                      onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="col-span-3"
                      value={newAccount.email}
                      onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddAccount}>Add Account</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "flex h-10 items-center justify-start gap-2 px-4",
                pathname === item.href && "bg-secondary",
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="border-t p-4">
        <nav className="grid gap-1">
          {bottomNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "flex h-10 items-center justify-start gap-2 px-4",
                pathname === item.href && "bg-secondary",
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-background md:block md:w-64">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <PieChart className="h-6 w-6" />
              <span>SmartWise</span>
            </Link>
          </div>
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar - This will be rendered inside the Sheet component */}
      <div className="flex h-full flex-col md:hidden">{sidebarContent}</div>
    </>
  )
}

