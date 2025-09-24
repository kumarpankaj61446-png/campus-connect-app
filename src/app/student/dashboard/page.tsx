

import { AIDoubtSolver } from "@/components/dashboard/AIDoubtSolver";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookCheck, PencilRuler, Camera, QrCode, GanttChartSquare, Star } from "lucide-react";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import Link from "next/link";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
    href: string;
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
    className?: string;
};

const DashboardCard = ({ href, icon, title, value, description, className }: DashboardCardProps) => (
    <Link href={href}>
        <Card className={cn("group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl", className)}>
             <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-transparent via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    </Link>
);


export default function StudentDashboardPage() {
  const student = {
    name: "Demo Student",
    class: "Class 10 A",
    avatar: "https://avatar.vercel.sh/Demo%20Student.png",
  };

  return (
    <div className="grid gap-6">
      {/* Student Profile Header */}
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-lg opacity-75 animate-pulse-slow"></div>
        <Card className="relative overflow-hidden rounded-2xl shadow-lg border-2 border-primary/10">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-card to-secondary/20">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-foreground">{student.name}</h2>
                    <p className="text-muted-foreground">{student.class}</p>
                </div>
            </CardContent>
        </Card>
      </div>


      {/* Dashboard Cards */}
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <DashboardCard 
            href="/student/homework"
            icon={<div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50"><BookCheck className="h-4 w-4 text-blue-500 dark:text-blue-400" /></div>}
            title="Pending Homework"
            value="3 assignments"
            description="Due this week"
            className="hover:border-blue-500/50"
        />
         <DashboardCard 
            href="/student/quiz"
            icon={<div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50"><PencilRuler className="h-4 w-4 text-orange-500 dark:text-orange-400" /></div>}
            title="AI Quiz Generator"
            value="Practice Now"
            description="Unlimited adaptive quizzes"
            className="hover:border-orange-500/50"
        />
        <DashboardCard 
            href="/student/attendance"
            icon={<div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50"><QrCode className="h-4 w-4 text-green-500 dark:text-green-400" /></div>}
            title="Smart Attendance"
            value="Generate QR"
            description="For daily check-in"
            className="hover:border-green-500/50"
        />
        <DashboardCard 
            href="/student/chapter-tracking"
            icon={<div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50"><GanttChartSquare className="h-4 w-4 text-purple-500 dark:text-purple-400" /></div>}
            title="Chapter Progress"
            value="Track Topics"
            description="View real-time status"
            className="hover:border-purple-500/50"
        />
         <DashboardCard 
            href="/student/teacher-rating"
            icon={<div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/50"><Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400" /></div>}
            title="Teacher Rating"
            value="Rate Now"
            description="Weekly feedback"
            className="hover:border-yellow-500/50"
        />
      </div>

      <AIDoubtSolver />

      <Link href="/student/gallery">
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
