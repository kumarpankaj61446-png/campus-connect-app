
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Users, FileDown, Loader2, UserCog } from "lucide-react";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { SocialLinks } from "@/components/dashboard/SocialLinks";

const pendingFees = [
  { id: 'S001', studentName: 'Ravi Kumar', className: '10 A', amount: 2500, dueDate: '2024-07-15', reportVisible: true },
  { id: 'S002', studentName: 'Priya Sharma', className: '9 B', amount: 2200, dueDate: '2024-07-15', reportVisible: false },
  { id: 'S003', studentName: 'Amit Singh', className: '11 C', amount: 3000, dueDate: '2024-07-10', reportVisible: true },
  { id: 'S004', studentName: 'Sunita Devi', className: '10 A', amount: 2500, dueDate: '2024-07-15', reportVisible: true },
  { id: 'S005', studentName: 'Rahul Verma', className: '12 A', amount: 3200, dueDate: '2024-07-10', reportVisible: false },
];

export default function FinancialDashboardPage() {
    const [exporting, setExporting] = useState<string | null>(null);
    const { toast } = useToast();

    const handleExport = (format: 'PDF' | 'Excel') => {
        setExporting(format);
        toast({
            title: "Export Started",
            description: `Your financial report is being exported as a ${format} file.`,
        });
        setExporting(null);
    };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Overview</h2>
        <div className="flex gap-2">
            <Link href="/financial/reports">
                <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" /> 
                    View All Reports
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,52,318.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,21,450.00</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3,30,868.89</div>
            <p className="text-xs text-muted-foreground">+22% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹88,400.00</div>
            <p className="text-xs text-muted-foreground">From 125 students</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Fee Collection Analytics</CardTitle>
            <CardDescription>Monthly overview of collected vs. pending fees.</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialCharts />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Pending Fees</CardTitle>
            <CardDescription>A quick look at students with outstanding payments.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingFees.slice(0, 5).map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>
                      <div className="font-medium">{fee.studentName}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">{fee.className}</div>
                    </TableCell>
                    <TableCell className="text-right">{fee.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
             <Button asChild className="w-full" variant="outline">
                <Link href="/financial/fees">
                    <UserCog className="mr-2 h-4 w-4" />
                    Manage All Fees
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <SocialLinks />
    </div>
  );
}
