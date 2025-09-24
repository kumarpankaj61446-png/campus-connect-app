
'use client';

import { useSearchParams, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, Search, MoreVertical, Edit, Trash2, FileDown, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/components/ui/upload-button";

const mockStudents = [
  { id: "STU001", name: "Anjali Sharma", class: "10 A", email: "anjali.s@example.com", phone: "9876543210", parent: "Sanjay Sharma", status: "Active" },
  { id: "STU002", name: "Rohan Verma", class: "9 B", email: "rohan.v@example.com", phone: "9876543211", parent: "Meena Verma", status: "Active" },
  { id: "STU003", name: "Priya Singh", class: "11 C", email: "priya.s@example.com", phone: "9876543212", parent: "Amit Singh", status: "Inactive" },
];

const mockTeachers = [
  { id: "TCH001", name: "Mr. Ramesh Kumar", subject: "Mathematics", email: "ramesh.k@example.com", phone: "9123456780" },
  { id: "TCH002", name: "Mrs. Sunita Gupta", subject: "Science", email: "sunita.g@example.com", phone: "9123456781" },
];

const mockParents = [
  { id: "PAR001", name: "Sanjay Sharma", student: "Anjali Sharma", email: "sanjay.s@example.com", phone: "9012345678" },
  { id: "PAR002", name: "Meena Verma", student: "Rohan Verma", email: "meena.v@example.com", phone: "9012345679" },
];

const dataMap = {
    students: { data: mockStudents, headers: ["Student ID", "Name", "Class", "Email", "Phone", "Parent", "Status"] },
    teachers: { data: mockTeachers, headers: ["Teacher ID", "Name", "Primary Subject", "Email", "Phone"] },
    parents: { data: mockParents, headers: ["Parent ID", "Name", "Registered Student", "Email", "Phone"] }
};

const UserTable = ({ users, headers, renderRow, onExport, onUpload, exportLoading }: { users: any[], headers: string[], renderRow: (user: any) => React.ReactNode; onExport: () => void; onUpload: (file: File) => void; exportLoading: boolean; }) => (
    <>
        <div className="flex items-center mb-4 gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, or ID..." className="pl-8" />
            </div>
            <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={onExport} disabled={exportLoading}>
                    {exportLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
                    Export CSV
                </Button>
                <UploadButton onFileSelect={onUpload} variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Bulk Upload
                </UploadButton>
            </div>
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(renderRow)}
            </TableBody>
        </Table>
    </>
);

const UserActions = () => (
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
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </TableCell>
);


export default function SchoolUserManagementPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const { toast } = useToast();
  const [loadingExport, setLoadingExport] = useState(false);

  const tab = searchParams.get('tab') || 'students';
  const schoolId = Array.isArray(params.id) ? params.id[0] : params.id;
  const schoolName = `School ${schoolId}`; // In a real app, you'd fetch the school name

  const handleExport = (userType: 'students' | 'teachers' | 'parents') => {
    setLoadingExport(true);
    try {
        const { data, headers } = dataMap[userType];
        
        const csvContent = [
            headers.join(','),
            ...data.map(user => Object.values(user).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `${userType}_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({ title: "Export Successful", description: `The ${userType} list has been exported.` });

    } catch (e) {
        toast({ variant: "destructive", title: "Export Failed", description: "An error occurred during the export." });
    } finally {
        setLoadingExport(false);
    }
  };
  
  const handleFileUpload = (file: File) => {
    toast({
        title: "File Upload Started",
        description: `Bulk uploading user data from "${file.name}".`,
    });
    // In a real app, process the CSV file here
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management for {schoolName}</h2>
        <p className="text-muted-foreground">View, search, and manage all users for this specific school.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
            <Tabs defaultValue={tab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="parents">Parents</TabsTrigger>
                </TabsList>
                <TabsContent value="students">
                    <UserTable
                        users={mockStudents}
                        headers={dataMap.students.headers}
                        onExport={() => handleExport('students')}
                        onUpload={handleFileUpload}
                        exportLoading={loadingExport}
                        renderRow={(user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.class}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.parent}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === "Active" ? "default" : "outline"}>{user.status}</Badge>
                                </TableCell>
                                <UserActions />
                            </TableRow>
                        )}
                    />
                </TabsContent>
                 <TabsContent value="teachers">
                    <UserTable
                        users={mockTeachers}
                        headers={dataMap.teachers.headers}
                        onExport={() => handleExport('teachers')}
                        onUpload={handleFileUpload}
                        exportLoading={loadingExport}
                        renderRow={(user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.subject}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <UserActions />
                            </TableRow>
                        )}
                    />
                </TabsContent>
                 <TabsContent value="parents">
                     <UserTable
                        users={mockParents}
                        headers={dataMap.parents.headers}
                        onExport={() => handleExport('parents')}
                        onUpload={handleFileUpload}
                        exportLoading={loadingExport}
                        renderRow={(user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.student}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <UserActions />
                            </TableRow>
                        )}
                    />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
