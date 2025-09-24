
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, BarChart, CalendarCheck, Loader2 } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const student = {
    name: "Anjali Sharma",
    class: "10 A",
    overallGrade: "A-",
    attendance: "95%",
};

const subjectPerformance = [
    { subject: "Mathematics", grade: "A", score: "95/100", remarks: "Excellent grasp of concepts." },
    { subject: "Science", grade: "A-", score: "92/100", remarks: "Strong in practicals." },
    { subject: "English", grade: "B+", score: "88/100", remarks: "Good, needs to work on creative writing." },
    { subject: "Social Studies", grade: "A", score: "90/100", remarks: "Actively participates in discussions." },
    { subject: "Hindi", grade: "B+", score: "85/100", remarks: "Can improve in grammar." },
];

const recentAssessments = [
    { id: 'T001', name: 'Maths Unit Test', date: '2024-07-20', score: '24/25' },
    { id: 'Q002', name: 'Science Quiz', date: '2024-07-22', score: '8/10' },
    { id: 'T002', name: 'History Mid-Term', date: '2024-07-15', score: '45/50' },
];

const chartData = [
  { month: "Jan", present: 22, absent: 1 },
  { month: "Feb", present: 20, absent: 2 },
  { month: "Mar", present: 21, absent: 1 },
  { month: "Apr", present: 23, absent: 0 },
  { month: "May", present: 22, absent: 1 },
  { month: "Jun", present: 20, absent: 2 },
  { month: "Jul", present: 18, absent: 3 },
];

const chartConfig = {
  present: { label: "Present", color: "hsl(var(--chart-1))" },
  absent: { label: "Absent", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;


export default function GrowthReportPage() {
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    const handleDownload = () => {
        setIsDownloading(true);
        try {
            const headers = [
                "Category", "Metric", "Value"
            ];
            
            const generalData = [
                ["Overall", "Name", student.name],
                ["Overall", "Class", student.class],
                ["Overall", "Overall Grade", student.overallGrade],
                ["Overall", "Attendance", student.attendance],
            ];
            
            const subjectHeaders = ["Subject Performance", "Subject", "Grade", "Score", "Remarks"];
            const subjectData = subjectPerformance.map(s => 
                ["", s.subject, s.grade, s.score, `"${s.remarks.replace(/"/g, '""')}"`]
            );
            
            const assessmentHeaders = ["Recent Assessments", "Assessment", "Date", "Score"];
            const assessmentData = recentAssessments.map(a => 
                 ["", a.name, a.date, a.score]
            );

            let csvContent = "";
            
            csvContent += `Growth Report for ${student.name}\n\n`;
            csvContent += "Overall Summary\n";
            csvContent += generalData.map(e => e.slice(1).join(",")).join("\n");
            csvContent += "\n\n";

            csvContent += subjectHeaders.slice(1).join(",") + "\n";
            csvContent += subjectData.map(e => e.slice(1).join(",")).join("\n");
            csvContent += "\n\n";
            
            csvContent += assessmentHeaders.slice(1).join(",") + "\n";
            csvContent += assessmentData.map(e => e.slice(1).join(",")).join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', `growth_report_${student.name.replace(/\s+/g, '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

             toast({
                title: "Download Started",
                description: "Your growth report is being downloaded.",
            });

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Download Failed",
                description: "An error occurred while generating the report.",
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Growth Report for {student.name}</h2>
                    <p className="text-muted-foreground">Class: {student.class} | Academic Year 2024-2025</p>
                </div>
                <Button onClick={handleDownload} disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
                    Download Report
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student.overallGrade}</div>
                         <p className="text-xs text-muted-foreground">This academic term</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student.attendance}</div>
                        <p className="text-xs text-muted-foreground">Year to date</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Subject-wise Performance</CardTitle>
                    <CardDescription>Detailed breakdown of grades and teacher remarks for each subject.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Teacher's Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjectPerformance.map((perf) => (
                                <TableRow key={perf.subject}>
                                    <TableCell className="font-medium">{perf.subject}</TableCell>
                                    <TableCell>
                                        <Badge variant="default">{perf.grade}</Badge>
                                    </TableCell>
                                    <TableCell>{perf.score}</TableCell>
                                    <TableCell className="text-muted-foreground">{perf.remarks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Assessments</CardTitle>
                        <CardDescription>Performance in recent tests and quizzes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Assessment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentAssessments.map((asm) => (
                                    <TableRow key={asm.id}>
                                        <TableCell className="font-medium">{asm.name}</TableCell>
                                        <TableCell>{asm.date}</TableCell>
                                        <TableCell className="text-right font-bold">{asm.score}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Attendance Summary</CardTitle>
                        <CardDescription>Visual overview of attendance trends.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <RechartsBarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="present" fill="var(--color-present)" radius={4} />
                                <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
                            </RechartsBarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
