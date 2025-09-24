
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const mockUsers = [
  { id: "STU001", name: "Anjali Sharma", school: "Greenwood High", role: "Student", status: "Active" },
  { id: "TCH001", name: "Mr. Ramesh Kumar", school: "Greenwood High", role: "Teacher", status: "Active" },
  { id: "PAR001", name: "Sanjay Sharma", school: "Greenwood High", role: "Parent", status: "Active" },
  { id: "STU101", name: "Rohan Verma", school: "Oakridge International", role: "Student", status: "Active" },
  { id: "PRI002", name: "Mrs. Davis", school: "Oakridge International", role: "Principal", status: "Active" },
  { id: "STU003", name: "Priya Singh", school: "Delhi Public School", role: "Student", status: "Inactive" },
];

const mockSchools = [
    { id: "all", name: "All Schools" },
    { id: "SCH001", name: "Greenwood High" },
    { id: "SCH002", name: "Oakridge International" },
    { id: "SCH003", name: "Delhi Public School" },
];

export default function AdminUserManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Global User Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage All Users</CardTitle>
          <CardDescription>View, filter, and manage all users across all schools in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, email, or ID..." className="pl-8" />
                </div>
                <Select defaultValue="all">
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Filter by school" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockSchools.map(school => (
                             <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.school}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.status === "Active" ? "default" : "outline"}>{user.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Role/School
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete User
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
