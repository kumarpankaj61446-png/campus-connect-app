
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, UserCheck, Settings } from "lucide-react";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { notFound } from 'next/navigation';
import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const mockSchoolData = {
  SCH001: {
    name: "Greenwood High",
    plan: "Premium",
    students: 1200,
    teachers: 50,
    parents: 1100,
    monthlyRevenue: 660000,
    studentsData: [
      { id: "STU001", name: "Anjali Sharma", class: "10 A", parent: "Sanjay Sharma", status: "Active" },
      { id: "STU002", name: "Rohan Verma", class: "9 B", parent: "Meena Verma", status: "Active" },
    ],
    finance: {
      totalRevenue: 5452318,
      totalExpenses: 1121450,
      netBalance: 4330868,
      pendingFees: 88400,
      pendingStudents: 125,
    }
  },
   SCH002: {
    name: "Oakridge International",
    plan: "Premium",
    students: 850,
    teachers: 40,
    parents: 800,
    monthlyRevenue: 467500,
    studentsData: [
      { id: "STU101", name: "Student A", class: "8 A", parent: "Parent A", status: "Active" },
      { id: "STU102", name: "Student B", class: "7 C", parent: "Parent B", status: "Active" },
    ],
     finance: {
      totalRevenue: 3452318,
      totalExpenses: 821450,
      netBalance: 2630868,
      pendingFees: 45200,
      pendingStudents: 80,
    }
  },
   SCH003: {
    name: "Delhi Public School",
    plan: "Pro",
    students: 2500,
    teachers: 100,
    parents: 2400,
    monthlyRevenue: 625000,
    studentsData: [],
     finance: {
      totalRevenue: 0,
      totalExpenses: 0,
      netBalance: 0,
      pendingFees: 0,
      pendingStudents: 0,
    }
  },
   SCH004: {
    name: "Global Edge School",
    plan: "Premium",
    students: 600,
    teachers: 30,
    parents: 550,
    monthlyRevenue: 330000,
    studentsData: [],
     finance: {
      totalRevenue: 0,
      totalExpenses: 0,
      netBalance: 0,
      pendingFees: 0,
      pendingStudents: 0,
    }
  },
};

type PageProps = {
  params: { id: keyof typeof mockSchoolData };
};

export default async function SchoolDetailsPage({ params }: PageProps) {
  const school = mockSchoolData[params.id];

  if (!school) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">{school.name}</h2>
          <p className="text-muted-foreground">School ID: {params.id}</p>
        </div>
        <div className="flex items-center gap-4">
            <Link href={`/admin/school/${params.id}/users`}>
                <Button variant="outline">
                    <Users className="mr-2 h-4 w-4"/>
                    Manage Users
                </Button>
            </Link>
            <Badge variant="secondary" className="text-lg">{school.plan} Plan</Badge>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href={`/admin/school/${params.id}/users?tab=students`}>
            <Card className="hover:bg-accent hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{school.students.toLocaleString()}</div>
            </CardContent>
            </Card>
        </Link>
        <Link href={`/admin/school/${params.id}/users?tab=teachers`}>
            <Card className="hover:bg-accent hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{school.teachers.toLocaleString()}</div>
            </CardContent>
            </Card>
        </Link>
        <Link href={`/admin/school/${params.id}/users?tab=parents`}>
            <Card className="hover:bg-accent hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Parents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{school.parents.toLocaleString()}</div>
            </CardContent>
            </Card>
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{school.monthlyRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
           <CardDescription>
            Year-to-date financial summary for {school.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-5">
           <div className="lg:col-span-3">
             <FinancialCharts />
           </div>
           <div className="lg:col-span-2 space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Total Revenue</h4>
                  <p className="text-2xl font-bold">₹{school.finance.totalRevenue.toLocaleString()}</p>
              </div>
               <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Total Expenses</h4>
                  <p className="text-2xl font-bold">₹{school.finance.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Pending Fees</h4>
                  <p className="text-2xl font-bold">₹{school.finance.pendingFees.toLocaleString()}</p>
                   <p className="text-xs text-muted-foreground">From {school.finance.pendingStudents} students</p>
              </div>
           </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Student Activity</CardTitle>
          <CardDescription>A partial list of students registered at this school.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {school.studentsData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.parent}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "Active" ? "default" : "outline"}>{student.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
