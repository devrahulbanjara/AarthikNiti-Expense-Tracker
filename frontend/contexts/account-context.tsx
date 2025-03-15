"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Account = {
  id: number
  name: string
  email: string
  active: boolean
}

type AccountContextType = {
  accounts: Account[]
  activeAccount: Account | undefined
  switchAccount: (id: number) => void
  addAccount: (account: Omit<Account, "id" | "active">) => void
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: "Personal", email: "john@example.com", active: true },
    { id: 2, name: "Business", email: "john@company.com", active: false },
    { id: 3, name: "Travel", email: "john@travel.com", active: false },
  ])

  const activeAccount = accounts.find((account) => account.active)

  const switchAccount = (id: number) => {
    setAccounts(
      accounts.map((account) => ({
        ...account,
        active: account.id === id,
      })),
    )
  }

  const addAccount = (account: Omit<Account, "id" | "active">) => {
    const newAccount = {
      ...account,
      id: Date.now(),
      active: false,
    }
    setAccounts([...accounts, newAccount])
  }

  return (
    <AccountContext.Provider
      value={{
        accounts,
        activeAccount,
        switchAccount,
        addAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
}

