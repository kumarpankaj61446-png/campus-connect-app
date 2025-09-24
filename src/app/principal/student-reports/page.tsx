

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, User, FileDown, GraduationCap, Percent, BarChart, CalendarCheck, Loader2, BookOpen, Calendar as CalendarIcon, Filter } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { classes, type StudentReport, type AttendanceRecord } from '@/lib/mock-data/report-data';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { DateRange } from "react-day-picker";
import { Switch } from '@/components/ui/switch';


const getStatusVariant = (status: string) => {
    switch (status) {
        case "Submitted":
        case "Graded":
            return "default";
        case "Pending":
            return "secondary";
        case "Overdue":
            return "destructive";
        default:
            return "outline";
    }
}

const getAttendanceStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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


function AttendanceDialog({ student }: { student: StudentReport }) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 29),
        to: new Date(),
    });
    const [showOnlyAbsences, setShowOnlyAbsences] = useState(false);


    const filteredAttendance = useMemo(() => {
        let records = student.attendanceDetails;

        if (dateRange?.from) {
            const toDate = dateRange.to || dateRange.from;
            records = records.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate >= dateRange.from! && recordDate <= toDate;
            });
        }
        
        if (showOnlyAbsences) {
            records = records.filter(record => record.status === 'Absent');
        }

        return records;
    }, [student.attendanceDetails, dateRange, showOnlyAbsences]);


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
                    <CardHeader className="p-0 pb-2 flex-row items-center gap-2">
                       <CalendarCheck className="w-5 h-5 text-muted-foreground"/> <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                    </CardHeader>
                    <p className="text-2xl font-bold">{student.attendance}%</p>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Attendance Details for {student.name}</DialogTitle>
                    <DialogDescription>
                        Showing attendance records for the selected date range. The full record spans one year.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-full md:w-[300px] justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                    <div className="flex items-center space-x-2">
                        <Switch id="absent-filter" checked={showOnlyAbsences} onCheckedChange={setShowOnlyAbsences}/>
                        <Label htmlFor="absent-filter" className="flex items-center gap-2">
                            <Filter className="w-4 h-4"/>
                            Show only absences
                        </Label>
                    </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Day</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAttendance.length > 0 ? filteredAttendance.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{format(new Date(record.date), 'dd MMM yyyy')}</TableCell>
                                    <TableCell>{format(new Date(record.date), 'EEEE')}</TableCell>
                                    <TableCell>
                                        <Badge variant={getAttendanceStatusVariant(record.status)}>
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">{record.reason || '-'}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No records found for the selected filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ReportCard({ student }: { student: StudentReport }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [filterDate, setFilterDate] = useState<Date | undefined>();
    const { toast } = useToast();

    const handleDownload = () => {
        setIsDownloading(true);
        try {
            const headers = [
                "Student Name", "Roll Number", "Class", "Overall Grade", "Overall Score", "Rank", "Attendance (%)",
                "Subject", "Marks Obtained", "Total Marks", "Grade", "Remarks"
            ];

            const subjectRows = student.subjects.map(subject => [
                student.name, student.rollNumber, student.class, student.overallGrade, student.overallScore, student.rank, student.attendance,
                subject.name, subject.marks, 100, subject.grade, `"${subject.remarks.replace(/"/g, '""')}"`
            ].join(','));

            const csvContent = [
                headers.join(','),
                ...subjectRows
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `report-card-${student.name.replace(/\s+/g, '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
                title: "Download Started",
                description: `Report card for ${student.name} is being downloaded as a CSV file.`
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Download Failed',
                description: 'Could not generate the report.'
            })
        } finally {
            setIsDownloading(false);
        }
    }

    const filteredHomework = useMemo(() => {
        if (!filterDate) return student.homework;
        return student.homework.filter(hw => new Date(hw.dueDate) >= filterDate);
    }, [student.homework, filterDate]);
    
    return (
        <Card className="mt-6 col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle className="text-2xl flex items-center gap-2"><User /> Report Card for {student.name}</CardTitle>
                    <CardDescription>Roll No: {student.rollNumber} | Class: {student.class}</CardDescription>
                </div>
                 <Button onClick={handleDownload} disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
                    Download Report
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <CardHeader className="p-0 pb-2 flex-row items-center gap-2">
                           <GraduationCap className="w-5 h-5 text-muted-foreground"/> <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                        </CardHeader>
                        <p className="text-2xl font-bold">{student.overallGrade}</p>
                    </Card>
                    <Card className="p-4">
                        <CardHeader className="p-0 pb-2 flex-row items-center gap-2">
                           <Percent className="w-5 h-5 text-muted-foreground"/> <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                        </CardHeader>
                        <p className="text-2xl font-bold">{student.overallScore}%</p>
                    </Card>
                    <Card className="p-4">
                        <CardHeader className="p-0 pb-2 flex-row items-center gap-2">
                           <BarChart className="w-5 h-5 text-muted-foreground"/> <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
                        </CardHeader>
                        <p className="text-2xl font-bold">{student.rank}</p>
                    </Card>
                    <AttendanceDialog student={student} />
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold mb-2">Subject Performance</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Marks Obtained</TableHead>
                                <TableHead>Total Marks</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {student.subjects.map(subject => (
                                <TableRow key={subject.name}>
                                    <TableCell className="font-medium">{subject.name}</TableCell>
                                    <TableCell>{subject.marks}</TableCell>
                                    <TableCell>100</TableCell>
                                    <TableCell><Badge>{subject.grade}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground text-xs">{subject.remarks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <div>
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2 gap-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2"><BookOpen/> Homework Details</h3>
                        <div className='flex items-center gap-2'>
                           <p className="text-xs text-muted-foreground">Data is updated in real-time.</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !filterDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filterDate ? format(filterDate, "PPP") : <span>Filter by due date...</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={filterDate}
                                    onSelect={setFilterDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            {filterDate && <Button variant="ghost" size="sm" onClick={() => setFilterDate(undefined)}>Clear</Button>}
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredHomework.map((hw, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{hw.subject}</TableCell>
                                    <TableCell>{hw.task}</TableCell>
                                    <TableCell>{hw.dueDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={getStatusVariant(hw.status)}>
                                            {hw.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

            </CardContent>
        </Card>
    )
}

export default function StudentReportsPage() {
    const [selectedClass, setSelectedClass] = useState(classes[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentReport | null>(null);

    const studentsInClass = useMemo(() => {
        const classData = classes.find(c => c.id === selectedClass);
        if (!classData) return [];
        return classData.students.filter(student => 
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(student.rollNumber).includes(searchQuery)
        );
    }, [selectedClass, searchQuery]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setSelectedStudent(null); // Clear selected student on new search
    };

    const handleSelectStudent = (student: StudentReport) => {
        setSelectedStudent(student);
        setSearchQuery(''); // Clear search to show full list again if desired
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Student Performance Reports</CardTitle>
                    <CardDescription>
                        View overall class performance and individual student report cards.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Select Class & Student</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Label>Class</Label>
                             <Select value={selectedClass} onValueChange={(value) => {setSelectedClass(value); setSelectedStudent(null);}}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a class"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                             <Label>Search Student</Label>
                              <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name or roll number..." 
                                    className="pl-8" 
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                         <CardTitle className="text-lg">Student List for {classes.find(c => c.id === selectedClass)?.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Roll No.</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Overall Score</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInClass.map(student => (
                                    <TableRow key={student.id} className={selectedStudent?.id === student.id ? "bg-secondary" : ""}>
                                        <TableCell>{student.rollNumber}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.overallScore}%</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleSelectStudent(student)}>
                                                View Report
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {selectedStudent && <ReportCard student={selectedStudent} />}
            </div>
        </div>
    );
}
