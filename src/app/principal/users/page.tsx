

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, Search, UserPlus, MoreVertical, Edit, Trash2, Star, Book, ArrowDownUp, Phone, Mail, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/components/ui/upload-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label';
import { additionalStudentBillingFlow } from '@/ai/flows/additional-student-billing-flow';


const initialMockStudents = [
  { id: "STU001", name: "Anjali Sharma", class: "10 A", parent: "Sanjay Sharma", status: "Active" },
  { id: "STU002", name: "Rohan Verma", class: "9 B", parent: "Meena Verma", status: "Active" },
  { id: "STU003", name: "Priya Singh", class: "11 C", parent: "Amit Singh", status: "Inactive" },
];

const initialMockTeachers = [
  { id: "TCH001", name: "Mr. Ramesh Kumar", subject: "Mathematics", email: "ramesh.k@example.com", phone: "9876543210", joiningDate: "2022-08-01", rating: 4.8 },
  { id: "TCH002", name: "Mrs. Sunita Gupta", subject: "Science", email: "sunita.g@example.com", phone: "9876543211", joiningDate: "2021-05-15", rating: 4.6 },
  { id: "TCH003", name: "Mr. Verma", subject: "History", email: "verma.h@example.com", phone: "9876543212", joiningDate: "2023-01-20", rating: 4.3 },
  { id: "TCH004", name: "Mrs. Das", subject: "English", email: "das.e@example.com", phone: "9876543213", joiningDate: "2020-02-10", rating: 4.9 },
  { id: "TCH005", name: "Ms. Reddy", subject: "Mathematics", email: "reddy.m@example.com", phone: "9876543214", joiningDate: "2023-09-01", rating: 4.4 },
];

const initialMockParents = [
  { id: "PAR001", name: "Sanjay Sharma", student: "Anjali Sharma", email: "sanjay.s@example.com", phone: "9012345678" },
  { id: "PAR002", name: "Meena Verma", student: "Rohan Verma", email: "meena.v@example.com", phone: "9012345679" },
];

const uniqueSubjects = [...new Set(initialMockTeachers.map(t => t.subject))];


export default function UserManagementPage() {
  const schoolName = "Greenwood High"; // This would be fetched from the database
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'students';

  const [students, setStudents] = useState(initialMockStudents);
  const [teachers, setTeachers] = useState(initialMockTeachers);
  const [parents, setParents] = useState(initialMockParents);

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof initialMockTeachers[0] | 'none', direction: 'asc' | 'desc' }>({ key: 'none', direction: 'asc' });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userType, setUserType] = useState<'student' | 'teacher' | 'parent' | null>(null);

  const handleFileUpload = async (file: File) => {
    toast({
        title: "File Upload Started",
        description: `Bulk uploading users from "${file.name}".`,
    });
    
    // Simulate checking for overage and triggering the AI flow.
    // In a real app, this would be based on the actual number of users in the CSV vs. the school's plan.
    const MOCK_PAID_STUDENT_LIMIT = 100;
    const MOCK_UPLOADED_STUDENT_COUNT = 150; // Simulate uploading 150 students
    
    if (MOCK_UPLOADED_STUDENT_COUNT > MOCK_PAID_STUDENT_LIMIT) {
        toast({
            title: "AI Billing Triggered",
            description: "Student limit exceeded. AI is generating an invoice for the additional students.",
        });
        
        try {
            await additionalStudentBillingFlow({
                schoolName: "Greenwood High",
                additionalStudentCount: MOCK_UPLOADED_STUDENT_COUNT - MOCK_PAID_STUDENT_LIMIT,
                amountPerStudent: 55, // Assuming premium plan price
                principalContact: "9999999999", // Mock principal contact
                adminPhoneNumber: "9835517008",
            });
            
             toast({
                title: "AI Notifications Sent",
                description: "The Principal and Super Admin have been notified about the additional charges.",
            });

        } catch (error) {
            console.error("AI Billing Flow Error:", error);
             toast({
                variant: 'destructive',
                title: "AI Billing Error",
                description: "Could not process the automated billing for additional students.",
            });
        }
    }
  };
  
  const sortedAndFilteredTeachers = useMemo(() => {
    let filtered = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) &&
      (subjectFilter === 'all' || teacher.subject === subjectFilter)
    );

    if (sortConfig.key !== 'none') {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [teachers, search, subjectFilter, sortConfig]);
  
  const requestSort = (key: keyof typeof initialMockTeachers[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleEdit = (user: any, type: 'student' | 'teacher' | 'parent') => {
    setSelectedUser({...user});
    setUserType(type);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (userId: string, type: 'student' | 'teacher' | 'parent') => {
      let userName = '';
      if (type === 'student') {
        userName = students.find(u => u.id === userId)?.name || '';
        setStudents(prev => prev.filter(u => u.id !== userId));
    } else if (type === 'teacher') {
        userName = teachers.find(u => u.id === userId)?.name || '';
        setTeachers(prev => prev.filter(u => u.id !== userId));
    } else if (type === 'parent') {
        userName = parents.find(u => u.id === userId)?.name || '';
        setParents(prev => prev.filter(u => u.id !== userId));
    }
    toast({
        title: "User Deleted",
        description: `${userName} has been removed from the system.`,
    });
  };

  const handleSave = () => {
    if (!selectedUser || !userType) return;
    
    if (userType === 'student') {
        setStudents(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    } else if (userType === 'teacher') {
        setTeachers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    } else if (userType === 'parent') {
        setParents(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    }

    toast({
        title: "User Updated",
        description: `${selectedUser.name}'s information has been updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setUserType(null);
  }

 const UserActions = ({ user, type }: { user: any; type: 'student' | 'teacher' | 'parent' }) => (
    <TableCell className="text-right">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(user, type)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </DropdownMenuItem>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                         <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account for {user.name}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(user.id, type)}>Delete User</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    </TableCell>
);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users for {schoolName}</p>
        </div>
        <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Your School Code:</p>
            <Badge variant="secondary" className="text-lg">GHS-A1B2</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage All Users</CardTitle>
          <CardDescription>Add, edit, and manage students, teachers, and parents for your school.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue={defaultTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="students">Students</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="parents">Parents</TabsTrigger>
                </TabsList>
                <TabsContent value="students">
                    <div className="flex items-center mb-4 gap-4">
                        <div className="relative w-full max-w-sm">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search students..." className="pl-8" />
                        </div>
                        <Button><UserPlus className="mr-2 h-4 w-4" /> Add New Student</Button>
                        <UploadButton onFileSelect={handleFileUpload} variant="outline">
                          <Upload className="mr-2 h-4 w-4" /> Bulk Upload CSV
                        </UploadButton>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 flex items-start gap-2 mb-4">
                        <Bot className="h-4 w-4 mt-0.5 shrink-0" />
                        <p><span className="font-semibold">AI Feature:</span> When you add new students, our AI will automatically detect and create linked parent accounts if parent details are provided. If you exceed your plan's student limit, an invoice will be automatically generated.</p>
                    </div>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Parent</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.class}</TableCell>
                                    <TableCell>{user.parent}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === "Active" ? "default" : "outline"}>{user.status}</Badge>
                                    </TableCell>
                                    <UserActions user={user} type="student" />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                 <TabsContent value="teachers">
                    <div className="flex flex-col md:flex-row items-center mb-4 gap-4">
                        <div className="relative w-full max-w-xs">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search teachers by name..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-muted-foreground" />
                             <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects</SelectItem>
                                    {uniqueSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:ml-auto flex gap-2">
                           <Button><UserPlus className="mr-2 h-4 w-4" /> Add New Teacher</Button>
                            <UploadButton onFileSelect={handleFileUpload} variant="outline">
                            <Upload className="mr-2 h-4 w-4" /> Bulk Upload CSV
                            </UploadButton>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Teacher ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>
                                     <Button variant="ghost" onClick={() => requestSort('joiningDate')}>
                                        Joining Date
                                        <ArrowDownUp className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" onClick={() => requestSort('rating')}>
                                        Rating
                                        <ArrowDownUp className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {sortedAndFilteredTeachers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{user.subject}</Badge></TableCell>
                                    <TableCell>{user.joiningDate}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            {user.rating.toFixed(1)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <a href={`tel:${user.phone}`} className="flex items-center gap-2 hover:underline hover:text-primary">
                                            <Phone className="w-4 h-4"/>
                                            {user.phone}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <a href={`mailto:${user.email}`} className="flex items-center gap-2 hover:underline hover:text-primary">
                                            <Mail className="w-4 h-4"/>
                                            {user.email}
                                        </a>
                                    </TableCell>
                                    <UserActions user={user} type="teacher" />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                 <TabsContent value="parents">
                     <div className="flex items-center mb-4 gap-4">
                        <div className="relative w-full max-w-sm">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search parents..." className="pl-8" />
                        </div>
                        <Button><UserPlus className="mr-2 h-4 w-4" /> Add New Parent</Button>
                    </div>
                     <Table>
                        <TableHeader>
                            <TableRow>
                               <TableHead>Parent ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Registered Student</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {parents.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.student}</TableCell>
                                    <TableCell>
                                         <a href={`mailto:${user.email}`} className="flex items-center gap-2 hover:underline hover:text-primary">
                                            <Mail className="w-4 h-4"/>
                                            {user.email}
                                        </a>
                                    </TableCell>
                                     <TableCell>
                                        <a href={`tel:${user.phone}`} className="flex items-center gap-2 hover:underline hover:text-primary">
                                            <Phone className="w-4 h-4"/>
                                            {user.phone}
                                        </a>
                                    </TableCell>
                                    <UserActions user={user} type="parent" />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Update the details for this user. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
           {selectedUser && userType && (
             <div className="grid gap-4 py-4">
                {Object.keys(selectedUser).filter(key => key !== 'id').map(key => (
                  <div className="grid grid-cols-4 items-center gap-4" key={key}>
                    <Label htmlFor={key} className="text-right capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <Input
                      id={key}
                      value={selectedUser[key]}
                      onChange={(e) => setSelectedUser({ ...selectedUser, [key]: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                ))}
             </div>
           )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

}
