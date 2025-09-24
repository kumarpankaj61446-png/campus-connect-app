
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, User, FileDown, GraduationCap, Percent, BarChart, CalendarCheck, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { classes, type StudentReport } from '@/lib/mock-data/report-data';
import { Label } from '@/components/ui/label';

function ReportCard({ student }: { student: StudentReport }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    const handleDownload = () => {
        setIsDownloading(true);
        toast({
            title: "Download Started",
            description: `Report card for ${student.name} is being downloaded.`
        });
        // In a real app, you'd generate a PDF here.
        setIsDownloading(false);
    }
    
    return (
        <Card className="mt-6 col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle className="text-2xl flex items-center gap-2"><User /> Report Card for {student.name}</CardTitle>
                    <CardDescription>Roll No: {student.rollNumber} | Class: {student.class}</CardDescription>
                </div>
                 <Button onClick={handleDownload} disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
                    Download PDF
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
                    <Card className="p-4">
                        <CardHeader className="p-0 pb-2 flex-row items-center gap-2">
                           <CalendarCheck className="w-5 h-5 text-muted-foreground"/> <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        </CardHeader>
                        <p className="text-2xl font-bold">{student.attendance}%</p>
                    </Card>
                </div>
                
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
            </CardContent>
        </Card>
    )
}

export default function ClassReportsPage() {
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
                    <CardTitle>Class & Student Reports</CardTitle>
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
                             <Select value={selectedClass} onValueChange={setSelectedClass}>
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
