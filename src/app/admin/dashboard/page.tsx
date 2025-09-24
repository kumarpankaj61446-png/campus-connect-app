
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, Building, Users, Bell, Palette, AppWindow, Tags, Lock, LayoutDashboard, Folder, Bot, BarChart2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const mockSchools = [
  { id: "SCH001", name: "Greenwood High", plan: "Premium", students: 1200, revenue: 660000 },
  { id: "SCH002", name: "Oakridge International", plan: "Premium", students: 850, revenue: 467500 },
  { id: "SCH003", name: "Delhi Public School", plan: "Pro", students: 2500, revenue: 625000 },
  { id: "SCH004", name: "Global Edge School", plan: "Premium", students: 600, revenue: 330000 },
];

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const totalRevenue = mockSchools.reduce((sum, school) => sum + school.revenue, 0);
  const totalSchools = mockSchools.length;
  const totalStudents = mockSchools.reduce((sum, school) => sum + school.students, 0);

  const handleRunReminders = async () => {
    setLoading(true);
    // In a real app, this would be an API call. For demo, we just show a toast.
    toast({
      title: "Success",
      description: "Reminder process initiated successfully.",
    });
    setLoading(false);
  };


  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Super Admin Overview</h2>
        <Button onClick={handleRunReminders} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bell className="mr-2 h-4 w-4" />
          )}
          Run Reminders Now
        </Button>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchools}</div>
            <p className="text-xs text-muted-foreground">Subscribed institutions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>School Management</CardTitle>
            <CardDescription>Overview of all subscribed schools.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Subscription Plan</TableHead>
                  <TableHead>Student Count</TableHead>
                  <TableHead className="text-right">MRR (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/school/${school.id}`} className="hover:underline text-primary">
                        {school.name}
                      </Link>
                    </TableCell>
                    <TableCell>{school.plan}</TableCell>
                    <TableCell>{school.students.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{school.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Application Management</CardTitle>
            <CardDescription>Control global settings for the application.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <Link href="/admin/pricing" className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-accent">
                <Tags className="h-8 w-8 text-primary"/>
                <span className="font-medium">Manage Pricing</span>
            </Link>
             <Link href="/admin/features" className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-accent">
                <AppWindow className="h-8 w-8 text-primary"/>
                <span className="font-medium">Control Features</span>
            </Link>
             <Link href="/admin/design" className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-accent">
                <Palette className="h-8 w-8 text-primary"/>
                <span className="font-medium">Customize Design</span>
            </Link>
             <Link href="/admin/users" className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-accent">
                <Lock className="h-8 w-8 text-primary"/>
                <span className="font-medium">User Access</span>
            </Link>
            <Link href="/admin/dashboards" className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-accent">
                <LayoutDashboard className="h-8 w-8 text-primary"/>
                <span className="font-medium">Manage Dashboards</span>
            </Link>
            <Link href="/admin/file-manager" className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-accent">
                <Folder className="h-8 w-8 text-primary"/>
                <span className="font-medium">File Manager</span>
            </Link>
             <Link href="/admin/feature-analytics" className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-accent">
                <BarChart2 className="h-8 w-8 text-primary"/>
                <span className="font-medium">Feature Analytics</span>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
