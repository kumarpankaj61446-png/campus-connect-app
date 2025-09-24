
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Home, Calendar as CalendarIcon, Utensils, Edit, FileDown, Loader2, UserCog } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

const initialHostelStudents = [
    { id: 'STU001', name: 'Anjali Sharma', class: '10 A', room: '201A', mealPlan: 'Veg', mealServed: true },
    { id: 'STU002', name: 'Rohan Verma', class: '9 B', room: '305B', mealPlan: 'Non-Veg', mealServed: false },
    { id: 'STU003', name: 'Priya Singh', class: '11 C', room: '102A', mealPlan: 'Veg', mealServed: true },
    { id: 'STU004', name: 'Rahul Kumar', class: '10 A', room: '201B', mealPlan: 'Veg', mealServed: false },
    { id: 'STU005', name: 'Sunita Devi', class: '12 A', room: '401A', mealPlan: 'Non-Veg', mealServed: true },
];

export default function HostelManagementPage() {
    const [students, setStudents] = useState(initialHostelStudents);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [visibilityFilter, setVisibilityFilter] = useState('hostel-only');
    const [isExporting, setIsExporting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const { toast } = useToast();

    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, students]);

    const handleExport = () => {
        setIsExporting(true);
        try {
            const headers = ["ID", "Name", "Class", "Room", "Meal Plan", "Meal Served"];
            const csvContent = [
                headers.join(','),
                ...filteredStudents.map(s => [s.id, s.name, s.class, s.room, s.mealPlan, s.mealServed].join(','))
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'hostel_students.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: 'Export Successful', description: 'Hostel student data has been downloaded.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Export Failed' });
        } finally {
            setIsExporting(false);
        }
    };
    
    const handleEditClick = (student: any) => {
        setSelectedStudent({...student});
        setIsEditDialogOpen(true);
    }
    
    const handleSaveEdit = () => {
        if (!selectedStudent) return;
        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? selectedStudent : s));
        toast({ title: 'Success', description: `${selectedStudent.name}'s information updated.` });
        setIsEditDialogOpen(false);
        setSelectedStudent(null);
    }
    
    const handleMealServedChange = (studentId: string, checked: boolean | 'indeterminate') => {
        if (typeof checked === 'boolean') {
            setStudents(prev => prev.map(s => s.id === studentId ? {...s, mealServed: checked} : s));
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"><Home /> Hostel Management</CardTitle>
                            <CardDescription>Oversee all aspects of hostel operations, from student records to daily schedules.</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Parent Visibility</Label>
                                <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                                    <SelectTrigger className="w-full md:w-[280px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hostel-only">Show updates to hostel parents only</SelectItem>
                                        <SelectItem value="all">Show updates to all parents</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1 self-end">
                                 <Button asChild variant="outline">
                                    <Link href="/principal/special-access">
                                        <UserCog className="mr-2 h-4 w-4" />
                                        Special Access to Hostel Staff
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Hostel Student Records</CardTitle>
                    <CardDescription>View and manage the students currently residing in the hostel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center mb-4 gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by student name..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full md:w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <div className="ml-auto">
                            <Button onClick={handleExport} disabled={isExporting}>
                                {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                                Export CSV
                            </Button>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Room No.</TableHead>
                                <TableHead>Meal Plan</TableHead>
                                <TableHead>Meal Served</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={`https://avatar.vercel.sh/${student.name}.png`} />
                                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{student.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>{student.room}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.mealPlan === 'Veg' ? 'default' : 'secondary'}>{student.mealPlan}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox 
                                            checked={student.mealServed}
                                            onCheckedChange={(checked) => handleMealServedChange(student.id, checked)}
                                            aria-label="Meal served"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(student)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Hostel Details: {selectedStudent?.name}</DialogTitle>
                        <DialogDescription>
                            Update the room and meal plan for this student.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="room-no" className="text-right">Room No.</Label>
                                <Input 
                                    id="room-no" 
                                    value={selectedStudent.room} 
                                    onChange={(e) => setSelectedStudent({...selectedStudent, room: e.target.value})}
                                    className="col-span-3" 
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Meal Plan</Label>
                                <Select 
                                    value={selectedStudent.mealPlan}
                                    onValueChange={(value) => setSelectedStudent({...selectedStudent, mealPlan: value})}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Veg">Veg</SelectItem>
                                        <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
