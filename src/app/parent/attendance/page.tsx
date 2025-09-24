
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Loader2 } from "lucide-react";
import { getWeek, format } from 'date-fns';
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockAttendance = [
  { date: "2024-07-29", status: "Present", arrival: "08:30 AM", departure: "03:30 PM" },
  { date: "2024-07-28", status: "Holiday", arrival: "-", departure: "-", reason: "Sunday" },
  { date: "2024-07-27", status: "Present", arrival: "08:25 AM", departure: "03:35 PM" },
  { date: "2024-07-26", status: "Absent", arrival: "-", departure: "-", reason: "Sick leave" },
  { date: "2024-07-25", status: "Present", arrival: "08:32 AM", departure: "03:30 PM" },
  { date: "2024-07-24", status: "Present", arrival: "08:28 AM", departure: "03:28 PM" },
  { date: "2024-07-23", status: "Holiday", arrival: "-", departure: "-", reason: "School Event" },
  { date: "2024-07-22", status: "Present", arrival: "08:30 AM", departure: "03:30 PM" },
  { date: "2024-07-15", status: "Present", arrival: "08:30 AM", departure: "03:30 PM" },
  { date: "2024-07-16", status: "Present", arrival: "08:30 AM", departure: "03:30 PM" },
  { date: "2024-07-17", status: "Present", arrival: "08:30 AM", departure: "03:30 PM" },
];

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "Present":
            return "default";
        case "Absent":
            return "destructive";
        case "Holiday":
            return "secondary";
        default:
            return "outline";
    }
}

const chartConfig = {
  days: {
    label: "Days",
  },
  present: {
    label: "Present",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--destructive))",
  },
  holiday: {
    label: "Holiday",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const processWeeklyData = () => {
    const weeklyData: { [key: string]: { present: number; absent: number; holiday: number; week: string } } = {};

    mockAttendance.forEach(record => {
        const weekNumber = getWeek(new Date(record.date));
        const weekKey = `Week ${weekNumber}`;

        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { week: weekKey, present: 0, absent: 0, holiday: 0 };
        }

        if (record.status === 'Present') {
            weeklyData[weekKey].present++;
        } else if (record.status === 'Absent') {
            weeklyData[weekKey].absent++;
        } else if (record.status === 'Holiday') {
            weeklyData[weekKey].holiday++;
        }
    });

    return Object.values(weeklyData);
};


export default function AttendancePage() {
  const childName = "Anjali Sharma"; // This would come from a data source
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    setIsDownloading(true);
    try {
        const headers = ["Date", "Day", "Status", "Arrival Time", "Departure Time", "Notes"];
        const csvContent = [
            headers.join(','),
            ...mockAttendance.map(record => [
                format(new Date(record.date), 'dd MMM yyyy'),
                format(new Date(record.date), 'EEEE'),
                record.status,
                record.arrival,
                record.departure,
                `"${(record.reason || '-').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'attendance_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
            title: "Download Started",
            description: "Your attendance report has been downloaded.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "Could not generate the attendance report.",
        });
    } finally {
        setIsDownloading(false);
    }
  };
  
  const monthlyChartData = [
    {
      month: "July",
      present: mockAttendance.filter(d => d.status === 'Present').length,
      absent: mockAttendance.filter(d => d.status === 'Absent').length,
      holiday: mockAttendance.filter(d => d.status === 'Holiday').length,
    }
  ];

  const weeklyChartData = processWeeklyData();

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>A visual summary of {childName}'s attendance.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="monthly">
                 <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                </TabsList>
                <TabsContent value="monthly">
                    <ChartContainer config={chartConfig} className="min-h-[250px] w-full mt-4">
                    <BarChart accessibilityLayer data={monthlyChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Legend align="right" verticalAlign="top" />
                        <Bar dataKey="present" stackId="a" fill="var(--color-present)" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="absent" stackId="a" fill="var(--color-absent)" />
                        <Bar dataKey="holiday" stackId="a" fill="var(--color-holiday)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ChartContainer>
                </TabsContent>
                <TabsContent value="weekly">
                     <ChartContainer config={chartConfig} className="min-h-[250px] w-full mt-4">
                    <BarChart accessibilityLayer data={weeklyChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Legend align="right" verticalAlign="top" />
                        <Bar dataKey="present" stackId="a" fill="var(--color-present)" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="absent" stackId="a" fill="var(--color-absent)" />
                        <Bar dataKey="holiday" stackId="a" fill="var(--color-holiday)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ChartContainer>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle>Detailed Attendance</CardTitle>
                <CardDescription>
                    Showing attendance record for {childName}.
                </CardDescription>
            </div>
            <Button onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <FileDown className="mr-2 h-4 w-4" />
                )}
                Download CSV
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Departure Time</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendance.map((record) => (
                <TableRow key={record.date}>
                  <TableCell className="font-medium">{format(new Date(record.date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{format(new Date(record.date), 'EEEE')}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.arrival}</TableCell>
                  <TableCell>{record.departure}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{record.reason || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
