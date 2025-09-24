

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SocialLinks } from "@/components/dashboard/SocialLinks";
import { Users, UserCheck, Star, AppWindow, DollarSign, Folder, FileClock, ShieldCheck, ClipboardList, Camera, Home } from "lucide-react";
import Link from "next/link";

const mockSchoolData = {
    students: 1250,
    teachers: 55,
    avgRating: 4.6,
};

const managementLinks = [
    {
        href: "/principal/users",
        icon: <Users className="h-8 w-8 text-primary"/>,
        label: "User Management",
        description: "Add, edit, or remove students, teachers, and parents."
    },
     {
        href: "/financial/dashboard",
        icon: <DollarSign className="h-8 w-8 text-primary"/>,
        label: "Financials Dashboard",
        description: "Track fees, manage expenses, and view financial reports."
    },
    {
        href: "/principal/features",
        icon: <AppWindow className="h-8 w-8 text-primary"/>,
        label: "Manage Features",
        description: "Enable or disable dashboard features for all users."
    },
    {
        href: "/principal/file-manager",
        icon: <Folder className="h-8 w-8 text-primary"/>,
        label: "File Manager",
        description: "Manage all school-related documents in one place."
    },
    {
        href: "/principal/reports",
        icon: <FileClock className="h-8 w-8 text-primary"/>,
        label: "File Analysis",
        description: "Upload a file and get an AI-powered analysis and summary."
    },
    {
        href: "/principal/special-access",
        icon: <ShieldCheck className="h-8 w-8 text-primary"/>,
        label: "Special Access",
        description: "Grant special permissions or elevated access to users."
    },
    {
        href: "/principal/hostel-management",
        icon: <Home className="h-8 w-8 text-primary"/>,
        label: "Hostel Management",
        description: "Manage hostel meals, activities, and schedules."
    },
];

export default function PrincipalDashboardPage() {
  return (
    <div className="space-y-6">
       <div>
            <h2 className="text-2xl font-bold">School Overview</h2>
            <p className="text-muted-foreground">Your school's command center at a glance.</p>
       </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/principal/users?tab=students">
                <Card className="hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockSchoolData.students.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Enrolled in the school</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/principal/users?tab=teachers">
                <Card className="hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockSchoolData.teachers}</div>
                        <p className="text-xs text-muted-foreground">Across all departments</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/principal/teacher-ratings">
                <Card className="hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Teacher Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockSchoolData.avgRating.toFixed(1)}/5.0</div>
                        <p className="text-xs text-muted-foreground">Based on weekly student feedback</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Key management tasks for your school.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {managementLinks.map((link) => (
                    <Link href={link.href} key={link.label}>
                        <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors h-full hover:bg-accent border">
                           {link.icon}
                           <span className="font-medium">{link.label}</span>
                           <p className="text-xs text-muted-foreground">{link.description}</p>
                       </div>
                    </Link>
                ))}
                 <Link href="/principal/teacher-ratings">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors h-full hover:bg-accent border">
                        <Star className="h-8 w-8 text-primary"/>
                        <span className="font-medium">Teacher Performance</span>
                        <p className="text-xs text-muted-foreground">View teacher ratings, attendance, and performance metrics.</p>
                    </div>
                </Link>
                <Link href="/principal/student-reports">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors h-full hover:bg-accent border">
                        <ClipboardList className="h-8 w-8 text-primary"/>
                        <span className="font-medium">Student Performance</span>
                        <p className="text-xs text-muted-foreground">View detailed academic reports for all students.</p>
                    </div>
                </Link>
                 <Link href="/principal/gallery">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-colors h-full hover:bg-accent border">
                        <Camera className="h-8 w-8 text-primary"/>
                        <span className="font-medium">School Gallery</span>
                        <p className="text-xs text-muted-foreground">Manage photos and videos from school events.</p>
                    </div>
                </Link>
            </CardContent>
        </Card>

      <SocialLinks />
    </div>
  );
}
