
'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import { allTeacherRatings } from "@/lib/mock-data/rating-data";
import { allTeacherPerformanceData } from '@/lib/mock-data/teacher-performance-data';
import { BarChart, Book, CalendarCheck, CheckCircle, Clock, XCircle, User } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

type PageProps = {
  params: { id: string };
};

const statusConfig = {
    Completed: { icon: CheckCircle, color: "text-green-500" },
    "In Progress": { icon: Clock, color: "text-blue-500" },
    "Not Started": { icon: XCircle, color: "text-gray-500" },
};

export default function TeacherDetailsPage({ params }: PageProps) {
  const teacherInfo = allTeacherRatings.find(t => t.id === params.id);
  const teacherPerformance = allTeacherPerformanceData.find(t => t.id === params.id);

  if (!teacherInfo || !teacherPerformance) {
    return notFound();
  }

  const attendancePercentage = (teacherPerformance.attendance.present / teacherPerformance.attendance.totalDays) * 100;
  
  const chartData = [
    { name: 'Present', value: teacherPerformance.attendance.present, fill: 'hsl(var(--chart-1))' },
    { name: 'Late', value: teacherPerformance.attendance.late, fill: 'hsl(var(--chart-5))' },
    { name: 'Absent', value: teacherPerformance.attendance.absent, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={teacherInfo.avatar} />
              <AvatarFallback>{teacherInfo.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{teacherInfo.name}</CardTitle>
            <CardDescription>{teacherInfo.subject} Teacher</CardDescription>
          </CardHeader>
           <CardContent className="text-center">
            <Badge>ID: {teacherInfo.id}</Badge>
          </CardContent>
        </Card>

        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarCheck /> Attendance Summary</CardTitle>
                <CardDescription>Monthly attendance record for {teacherInfo.name}.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <div className="flex justify-between p-3 bg-secondary/50 rounded-md">
                        <span className="font-medium">Total Working Days</span>
                        <span className="font-bold">{teacherPerformance.attendance.totalDays}</span>
                    </div>
                     <div className="flex justify-between p-3 bg-secondary/50 rounded-md">
                        <span className="font-medium">Present</span>
                        <span className="font-bold text-green-600">{teacherPerformance.attendance.present}</span>
                    </div>
                     <div className="flex justify-between p-3 bg-secondary/50 rounded-md">
                        <span className="font-medium">Late</span>
                        <span className="font-bold text-orange-500">{teacherPerformance.attendance.late}</span>
                    </div>
                     <div className="flex justify-between p-3 bg-secondary/50 rounded-md">
                        <span className="font-medium">Absent</span>
                        <span className="font-bold text-red-600">{teacherPerformance.attendance.absent}</span>
                    </div>
                    <div>
                        <Progress value={attendancePercentage} className="h-2"/>
                        <p className="text-xs text-right text-muted-foreground mt-1">{attendancePercentage.toFixed(1)}% Present</p>
                    </div>
                </div>
                 <ChartContainer config={{}} className="h-48 w-full">
                    <ResponsiveContainer>
                        <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={60}/>
                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: "hsl(var(--background))" }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Book /> Real-Time Chapter Tracking</CardTitle>
            <CardDescription>Current status of chapters being taught by {teacherInfo.name} in different classes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {teacherPerformance.classActivities.length > 0 ? teacherPerformance.classActivities.map((activity, index) => (
                <Card key={index} className="bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="text-xl">{activity.class}</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                            <p><strong>Last Activity:</strong> {activity.lastActivity}</p>
                            <p><strong>Next Topic:</strong> {activity.nextTopic}</p>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Chapter</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Completed On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activity.chapters.map((chapter, chapIdx) => {
                                    const statusInfo = statusConfig[chapter.status];
                                    return (
                                        <TableRow key={chapIdx}>
                                            <TableCell className="font-medium">{chapter.chapter}</TableCell>
                                            <TableCell>
                                                <div className={`flex items-center gap-2 ${statusInfo.color}`}>
                                                    <statusInfo.icon className="w-4 h-4" />
                                                    <span>{chapter.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{chapter.completionDate || 'N/A'}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )) : (
                <div className="text-center text-muted-foreground p-8">
                    <p>No class activity data available for this teacher.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
