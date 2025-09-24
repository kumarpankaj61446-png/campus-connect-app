

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import { ClipboardList, MessageSquare, QrCode, Star, BookOpen, BrainCircuit, Camera, UserCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
};

const DashboardCard = ({ href, icon, title, description, className }: DashboardCardProps) => (
    <Link href={href} className="block group">
        <Card className={cn("relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full", className)}>
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative h-full">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        {icon}
                    </div>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
            </div>
        </Card>
    </Link>
);

const dashboardLinks = [
    { 
        href: '/teacher/attendance', 
        title: 'Smart Attendance', 
        icon: <UserCheck className="w-8 h-8"/>,
        description: "Scan student QR codes or use face recognition to take daily attendance seamlessly."
    },
    { 
        href: '/teacher/homework', 
        title: 'Update Homework', 
        icon: <BookOpen className="w-8 h-8"/>,
        description: "Assign and update homework for your classes, set due dates, and track submissions."
    },
    { 
        href: '/teacher/planner', 
        title: 'AI Lesson Planner', 
        icon: <BrainCircuit className="w-8 h-8"/>,
        description: "Generate detailed, structured lesson plans for any topic in minutes."
    },
    { 
        href: '/teacher/ratings', 
        title: 'My Ratings', 
        icon: <Star className="w-8 h-8"/>,
        description: "View anonymous weekly feedback and performance trends from your students."
    },
    { 
        href: '/teacher/reports', 
        title: 'Class Reports', 
        icon: <ClipboardList className="w-8 h-8"/>,
        description: "Generate and view academic reports for your classes and individual students."
    },
    { 
        href: '/teacher/parent-chat', 
        title: 'Parent Chat', 
        icon: <MessageSquare className="w-8 h-8"/>,
        description: "Communicate directly with parents regarding student progress and announcements."
    },
    { 
        href: '/teacher/gallery', 
        title: 'School Gallery', 
        icon: <Camera className="w-8 h-8"/>,
        description: "View photos from recent school events, functions, and programs."
    },
];

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Teacher!</CardTitle>
          <CardDescription>
            Here you can manage your classes, take attendance, and communicate with parents.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboardLinks.map(link => (
                <DashboardCard
                    key={link.title}
                    href={link.href}
                    icon={link.icon}
                    title={link.title}
                    description={link.description}
                />
            ))}
           </div>
        </CardContent>
      </Card>

      <SocialLinks />
    </div>
  );
}
