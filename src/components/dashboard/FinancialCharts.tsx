"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", collected: 186000, pending: 80000 },
  { month: "February", collected: 305000, pending: 20000 },
  { month: "March", collected: 237000, pending: 12000 },
  { month: "April", collected: 273000, pending: 19000 },
  { month: "May", collected: 209000, pending: 13000 },
  { month: "June", collected: 214000, pending: 14000 },
]

const chartConfig = {
  collected: {
    label: "Collected",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function FinancialCharts() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="collected" fill="var(--color-collected)" radius={4} />
        <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
