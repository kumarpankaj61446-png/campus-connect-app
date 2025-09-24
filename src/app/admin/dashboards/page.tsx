
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, UserCog, User, Briefcase, GraduationCap, DollarSign } from "lucide-react";
import Link from "next/link";

const dashboardLinks = [
    {
        role: "Principal",
        description: "Oversee school operations, finances, and user management.",
        href: "/principal/dashboard",
        icon: Briefcase
    },
    {
        role: "Teacher",
        description: "Manage classes, take attendance, and communicate with parents.",
        href: "/teacher/dashboard",
        icon: UserCog
    },
    {
        role: "Student",
        description: "Access homework, grades, and the AI study buddy.",
        href: "/student/dashboard",
        icon: GraduationCap
    },
    {
        role: "Parent",
        description: "Monitor child's progress, pay fees, and view announcements.",
        href: "/parent/dashboard",
        icon: User
    },
    {
        role: "Financial",
        description: "Manage school fees, expenses, and view financial reports.",
        href: "/financial/dashboard",
        icon: DollarSign
    },
]

export default function ManageDashboardsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Manage & Preview Dashboards</h2>
                <p className="text-muted-foreground">
                    Select a dashboard to preview its layout and content. You can then request edits.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dashboardLinks.map(({ role, description, href, icon: Icon }) => (
                    <Link href={href} key={role}>
                        <Card className="hover:border-primary hover:shadow-md transition-all h-full">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-3">
                                        <Icon className="h-6 w-6 text-primary" />
                                        <span>{role} Dashboard</span>
                                    </CardTitle>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
