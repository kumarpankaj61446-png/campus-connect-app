
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allTeacherRatings, subjectsWithTeachers } from "@/lib/mock-data/rating-data";
import { classes } from '@/lib/mock-data/report-data';
import { Star, Medal, ArrowUp, ArrowDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function TeacherRatingsDashboardPage() {
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedClass, setSelectedClass] = useState('all');

    const teachersForClass = useMemo(() => {
        if (selectedClass === 'all') return subjectsWithTeachers.flatMap(s => s.teachers.map(t => t.id));
        
        const classData = classes.find(c => c.id === selectedClass);
        if (!classData) return [];

        const subjectsInClass = classData.students[0]?.subjects.map(s => s.name) || [];
        const teacherIds: string[] = [];

        subjectsWithTeachers.forEach(subject => {
            if (subjectsInClass.includes(subject.subjectName)) {
                subject.teachers.forEach(teacher => {
                    if(!teacherIds.includes(teacher.id)) {
                        teacherIds.push(teacher.id);
                    }
                });
            }
        });
        return teacherIds;
    }, [selectedClass]);

    const filteredAndSortedRatings = useMemo(() => {
        return allTeacherRatings
            .filter(teacher => {
                const subjectMatch = selectedSubject === 'all' || teacher.subject.toLowerCase().includes(selectedSubject.toLowerCase());
                const classMatch = selectedClass === 'all' || teachersForClass.includes(teacher.id);
                return subjectMatch && classMatch;
            })
            .sort((a, b) => b.monthlyAvg - a.monthlyAvg);
    }, [selectedSubject, selectedClass, teachersForClass]);
    
    const topPerformer = filteredAndSortedRatings[0];
    const needsAttention = [...filteredAndSortedRatings].sort((a, b) => a.monthlyAvg - b.monthlyAvg)[0];

    const getRankBadge = (index: number) => {
        if (index === 0) return <Medal className="w-5 h-5 text-yellow-500" />;
        if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
        if (index === 2) return <Medal className="w-5 h-5 text-yellow-700" />;
        return <span className="text-sm font-bold">{index + 1}</span>;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Teacher Ratings Dashboard</CardTitle>
                    <CardDescription>
                        Monitor and analyze teacher performance based on weekly student feedback.
                    </CardDescription>
                </CardHeader>
            </Card>

             {topPerformer && needsAttention && <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performer (This Month)</CardTitle>
                        <ArrowUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                             <Avatar className="h-12 w-12">
                                <AvatarImage src={topPerformer.avatar} />
                                <AvatarFallback>{topPerformer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-bold">{topPerformer.name}</p>
                                <p className="text-sm text-muted-foreground">{topPerformer.subject}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-2xl font-bold flex items-center gap-1">{topPerformer.monthlyAvg.toFixed(2)} <Star className="w-5 h-5 text-yellow-400 fill-yellow-400"/></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                        <ArrowDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                             <Avatar className="h-12 w-12">
                                <AvatarImage src={needsAttention.avatar} />
                                <AvatarFallback>{needsAttention.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-bold">{needsAttention.name}</p>
                                <p className="text-sm text-muted-foreground">{needsAttention.subject}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-2xl font-bold flex items-center gap-1">{needsAttention.monthlyAvg.toFixed(2)} <Star className="w-5 h-5 text-yellow-400 fill-yellow-400"/></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>}
            
            <Card>
                <CardHeader>
                    <CardTitle>Teacher Rankings</CardTitle>
                    <CardDescription>Detailed monthly average ratings for all teachers, ranked by performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end gap-4 mb-4">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Filter by class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Filter by subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjectsWithTeachers.map(s => <SelectItem key={s.subjectId} value={s.subjectName}>{s.subjectName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16 text-center">Rank</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead className="text-center">Week 1</TableHead>
                                <TableHead className="text-center">Week 2</TableHead>
                                <TableHead className="text-center">Week 3</TableHead>
                                <TableHead className="text-center">Week 4</TableHead>
                                <TableHead className="text-right font-bold">Monthly Avg.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedRatings.length > 0 ? filteredAndSortedRatings.map((teacher, index) => (
                                <TableRow key={teacher.id}>
                                    <TableCell className="font-bold text-center">{getRankBadge(index)}</TableCell>
                                    <TableCell>
                                        <Link href={`/principal/teacher/${teacher.id}`} className="flex items-center gap-3 hover:underline">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={teacher.avatar} />
                                                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{teacher.name}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell><Badge variant="secondary">{teacher.subject}</Badge></TableCell>
                                    {teacher.weeklyRatings.map((r, i) => (
                                        <TableCell key={i} className="text-center">{r.toFixed(1)}</TableCell>
                                    ))}
                                    <TableCell className="text-right font-bold text-lg text-primary">{teacher.monthlyAvg.toFixed(2)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        No teachers found for the selected filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
