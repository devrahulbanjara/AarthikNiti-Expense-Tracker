"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, PieChart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/dashboard/user-nav"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useAccount } from "@/contexts/account-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const pathname = usePathname()
  const { accounts, activeAccount, switchAccount } = useAccount()

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <PieChart className="h-6 w-6" />
          <span>SmartWise</span>
        </Link>
      </div>

      {/* Mobile Account Switcher */}
      <div className="flex-1 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 justify-start gap-1 px-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src="/placeholder.svg?height=20&width=20" alt="User" />
                <AvatarFallback className="text-xs">{activeAccount?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="truncate text-xs">{activeAccount?.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-end gap-4">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}

