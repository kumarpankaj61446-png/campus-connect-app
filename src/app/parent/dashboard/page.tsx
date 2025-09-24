
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, CalendarCheck, BarChart, FileText, Camera, Bell, CheckCircle, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import { useState, useRef, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const mockChildren = [
    { name: "Anjali Sharma", class: "10 A", avatar: "/avatars/01.png" },
    { name: "Rohan Sharma", class: "7 B", avatar: "/avatars/02.png" },
];

const mockHomework = [
    { subject: "Mathematics", task: "Complete Algebra exercise 5.2", due: "2024-08-10" },
    { subject: "Science", task: "Prepare a presentation on Photosynthesis", due: "2024-08-12" },
    { subject: "History", task: "Read chapter 3 of Modern India", due: "2024-08-15" },
];

const mockGrades = [
    { subject: "English", grade: "A-", notes: "Excellent work on the last essay." },
    { subject: "Physics", grade: "B+", notes: "Good understanding of concepts." },
    { subject: "Hindi", grade: "A", notes: "Highest in class." },
]

export default function ParentDashboardPage() {
  const currentChild = mockChildren[0];
  const [avatarUrl, setAvatarUrl] = useState(`https://avatar.vercel.sh/${currentChild.name}.png`);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                  id="avatar-upload"
                />
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarUrl} alt={currentChild.name} />
                      <AvatarFallback>{currentChild.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Label>
                <div>
                    <h2 className="text-2xl font-bold">{currentChild.name}</h2>
                    <p className="text-muted-foreground">Class: {currentChild.class}</p>
                </div>
            </div>
            {mockChildren.length > 1 && (
                 <div className="w-full md:w-auto">
                    <Select defaultValue={currentChild.name}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Switch Child" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockChildren.map(child => (
                                <SelectItem key={child.name} value={child.name}>{child.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
            )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/parent/attendance">
                <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">95%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/parent/fee-payments">
              <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">₹17,500</div>
                      <p className="text-xs text-muted-foreground">2 invoices due</p>
                  </CardContent>
              </Card>
            </Link>
            <Link href="/parent/growth-report">
                <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">A-</div>
                        <p className="text-xs text-muted-foreground">This academic term</p>
                    </CardContent>
                </Card>
            </Link>
             <Link href="/parent/homework">
                <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Homework</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockHomework.length} Items</div>
                        <p className="text-xs text-muted-foreground">To be submitted</p>
                    </CardContent>
                </Card>
            </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Homework</CardTitle>
                    <CardDescription>Here are the assignments due soon.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Task</TableHead>
                                <TableHead className="text-right">Due Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockHomework.map(hw => (
                                <TableRow key={hw.task}>
                                    <TableCell className="font-medium">{hw.subject}</TableCell>
                                    <TableCell>{hw.task}</TableCell>
                                    <TableCell className="text-right">{hw.due}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Recent Grades</CardTitle>
                    <CardDescription>Latest performance in recent tests and assignments.</CardDescription>
                </CardHeader>
                <CardContent>
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockGrades.map(grade => (
                                <TableRow key={grade.subject}>
                                    <TableCell className="font-medium">{grade.subject}</TableCell>
                                    <TableCell className="text-muted-foreground">{grade.notes}</TableCell>
                                    <TableCell className="text-right font-bold">
                                        <Badge variant="default">{grade.grade}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="text-primary"/>
                    Real-time Tracking
                </CardTitle>
                <CardDescription>Live status of your child's arrival and departure from school.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground">Arrival Time</p>
                            <p className="text-2xl font-bold">08:30 AM</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground text-right">Departure Time</p>
                            <p className="text-2xl font-bold text-right">--:--</p>
                        </div>
                    </div>
                </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <Label htmlFor="notifications" className="flex items-center gap-2 font-semibold">
                            <Bell className="w-5 h-5"/>
                            Departure Notifications
                        </Label>
                        <Switch
                            id="notifications"
                            checked={notificationsEnabled}
                            onCheckedChange={setNotificationsEnabled}
                        />
                    </div>
                    {notificationsEnabled && (
                        <RadioGroup defaultValue="daily" className="flex gap-4 pt-2">
                            <div>
                                <RadioGroupItem value="today" id="today" />
                                <Label htmlFor="today" className="ml-2">Notify today only</Label>
                            </div>
                            <div>
                                <RadioGroupItem value="daily" id="daily" />
                                <Label htmlFor="daily" className="ml-2">Notify daily</Label>
                            </div>
                        </RadioGroup>
                    )}
                 </div>
            </CardContent>
        </Card>

        <Link href="/parent/hostel-updates">
            <Card className="hover:border-primary hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Home className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Hostel Updates</CardTitle>
                        <CardDescription>View daily meal plans and activity schedules for students in the hostel.</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </Link>

        <Link href="/parent/gallery">
            <Card className="hover:border-primary hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Camera className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>School Gallery</CardTitle>
                        <CardDescription>View photos from recent school events and programs.</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </Link>

        <SocialLinks />
    </div>
  );
}
