
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send, User, FileText, GraduationCap, Percent, BarChart, CalendarCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { allTeacherRatings } from "@/lib/mock-data/rating-data";
import { classes, type StudentReport } from '@/lib/mock-data/report-data';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';

const ReportCard = ({ student }: { student: StudentReport }) => (
    <Card className="mt-4 border-primary">
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">Report for {student.name}</CardTitle>
            <CardDescription>Class: {student.class} | Roll No: {student.rollNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md">
                    <GraduationCap className="w-5 h-5 text-muted-foreground"/> 
                    <div>
                        <p className="text-xs font-medium">Overall Grade</p>
                        <p className="font-bold">{student.overallGrade}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md">
                    <Percent className="w-5 h-5 text-muted-foreground"/> 
                    <div>
                        <p className="text-xs font-medium">Score</p>
                        <p className="font-bold">{student.overallScore}%</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md">
                    <BarChart className="w-5 h-5 text-muted-foreground"/> 
                    <div>
                        <p className="text-xs font-medium">Rank</p>
                        <p className="font-bold">{student.rank}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md">
                    <CalendarCheck className="w-5 h-5 text-muted-foreground"/> 
                    <div>
                        <p className="text-xs font-medium">Attendance</p>
                        <p className="font-bold">{student.attendance}%</p>
                    </div>
                </div>
            </div>
            <Table>
                <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
                <TableBody>
                    {student.subjects.map(s => (
                        <TableRow key={s.name}><TableCell>{s.name}</TableCell><TableCell>{s.marks}/100</TableCell><TableCell><Badge>{s.grade}</Badge></TableCell></TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const student = classes.find(c => c.name === "Class 10 A")?.students[0];

export default function ParentChatPage() {
    const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
    const [showReport, setShowReport] = useState(false);

    if (!student) {
        return <div>Student data not found.</div>;
    }

    // Get teachers for the student's subjects
    const studentSubjects = student.subjects.map(s => s.name);
    const teachers = allTeacherRatings.filter(t => studentSubjects.includes(t.subject));

    return (
        <Card className="h-[calc(100vh-8rem)] flex">
            {/* Left Panel: Teacher List */}
            <div className="w-1/3 border-r h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Chat with Teacher</CardTitle>
                    <CardDescription>Select a teacher to start a conversation.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col p-4">
                    <div className="flex-grow overflow-y-auto pr-2">
                        <div className="space-y-2">
                            {teachers.map(teacher => (
                                <button key={teacher.id} onClick={() => {setSelectedTeacher(teacher); setShowReport(false);}} className={`w-full text-left p-2 rounded-md flex items-center gap-3 transition-colors ${selectedTeacher?.id === teacher.id ? 'bg-primary/10' : 'hover:bg-secondary'}`}>
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={teacher.avatar} />
                                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{teacher.name}</p>
                                        <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </div>

            {/* Right Panel: Chat Interface */}
            <div className="w-2/3 h-full flex flex-col">
                {selectedTeacher ? (
                    <>
                        <CardHeader className="border-b">
                           <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                     <Avatar className="h-10 w-10">
                                        <AvatarImage src={selectedTeacher.avatar} />
                                        <AvatarFallback>{selectedTeacher.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{selectedTeacher.name}</p>
                                        <p className="text-sm text-muted-foreground">{selectedTeacher.subject} Teacher</p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => setShowReport(!showReport)}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    {showReport ? "Hide" : "View"} {student.name}'s Report
                                </Button>
                           </div>
                        </CardHeader>
                        <CardContent className="flex-grow p-4 space-y-4 overflow-y-auto">
                            {showReport && <ReportCard student={student} />}

                            {/* Chat Messages */}
                            <div className="flex items-end gap-2">
                                <Avatar className="h-8 w-8"><AvatarImage src={selectedTeacher.avatar} /></Avatar>
                                <div className="p-3 rounded-lg bg-secondary max-w-xs">
                                    <p>Hello, how can I help you today regarding {student.name}?</p>
                                </div>
                            </div>
                             <div className="flex items-end gap-2 justify-end">
                                <div className="p-3 rounded-lg bg-primary text-primary-foreground max-w-xs">
                                    <p>Hi {selectedTeacher.name}, I wanted to ask about the recent English test results.</p>
                                </div>
                                <Avatar className="h-8 w-8"><AvatarImage src="https://avatar.vercel.sh/Demo%20Parent.png" /></Avatar>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t p-4">
                            <div className="relative w-full">
                                <Input placeholder="Type a message..." className="pr-12"/>
                                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </>
                ) : (
                     <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <User className="h-12 w-12 mb-4" />
                        <p className="font-semibold">Select a teacher to begin chatting</p>
                        <p className="text-sm">Your conversation will appear here.</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
