"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, RefreshCw } from "lucide-react"

// Currency exchange rates (static for demo)
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.82,
  CAD: 1.36,
  AUD: 1.52,
  CNY: 7.21,
  INR: 83.12,
}

type CurrencyCode = keyof typeof exchangeRates

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100")
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD")
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("EUR")
  const [isLoading, setIsLoading] = useState(false)

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call to refresh rates
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const convertCurrency = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
    const amountInUSD = amount / exchangeRates[from]
    return amountInUSD * exchangeRates[to]
  }

  const convertedAmount = convertCurrency(Number.parseFloat(amount) || 0, fromCurrency, toCurrency)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>Convert between currencies</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh rates</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value as CurrencyCode)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(exchangeRates).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={handleSwap}>
              <ArrowLeftRight className="h-4 w-4" />
              <span className="sr-only">Swap currencies</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Converted Amount</label>
              <Input type="text" value={convertedAmount.toFixed(2)} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select value={toCurrency} onValueChange={(value) => setToCurrency(value as CurrencyCode)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(exchangeRates).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Exchange Rate: 1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)}{" "}
              {toCurrency}
            </p>
            <p className="text-xs mt-1">Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

