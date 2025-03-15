"use client"

import * as React from "react"
import * as Recharts from "recharts"
import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

// Create a responsive wrapper for Recharts
export const ResponsiveChartContainer = ({
  children,
  height = 300,
  ...props
}: React.ComponentProps<typeof Recharts.ResponsiveContainer> & { height?: number }) => (
  <div className="h-[300px] w-full">
    <Recharts.ResponsiveContainer width="100%" height="100%" {...props}>
      {children}
    </Recharts.ResponsiveContainer>
  </div>
)

// Re-export all the components from Recharts
export const Area = Recharts.Area
export const AreaChart = Recharts.AreaChart
export const Bar = Recharts.Bar
export const BarChart = Recharts.BarChart
export const CartesianGrid = Recharts.CartesianGrid
export const Cell = Recharts.Cell
export const ComposedChart = Recharts.ComposedChart
export const Legend = Recharts.Legend
export const Line = Recharts.Line
export const Pie = Recharts.Pie
export const PieChart = Recharts.PieChart
export const ResponsiveContainer = Recharts.ResponsiveContainer
export const Tooltip = Recharts.Tooltip
export const XAxis = Recharts.XAxis
export const YAxis = Recharts.YAxis

// Add a custom tooltip component
export const ChartTooltip = ({ active, payload, label, formatter, labelFormatter, contentStyle, ...props }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm" style={contentStyle} {...props}>
        {label && <div className="font-medium">{labelFormatter ? labelFormatter(label) : label}</div>}
        <div className="flex flex-col gap-0.5">
          {payload.map((item: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <div className="text-sm font-medium">
                {formatter ? formatter(item.value, item.name, item, index) : item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

// Simplified chart container
export function ChartContainer({
  children,
  className,
  config,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { config?: ChartConfig }) {
  const contextValue = React.useMemo<ChartContextProps>(
    () => ({
      config: config || {},
    }),
    [config],
  )

  return (
    <ChartContext.Provider value={contextValue}>
      <div className={cn("w-full h-full", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

export const ChartTooltipContent = ChartTooltip
export const ChartLegend = Legend
export const ChartLegendContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ChartStyle = ({ children }: { children?: React.ReactNode }) => <>{children}</>

