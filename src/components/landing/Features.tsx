
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  GraduationCap,
  Lightbulb,
  BarChart3,
  Users,
  Wallet,
  FileText,
  CheckCircle,
  Waypoints,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: "Role-Based Dashboards",
    description:
      "Customized interfaces for students, teachers, parents, and principals, providing relevant tools and information at a glance.",
    demoImage: "https://picsum.photos/seed/dashboard-demo/800/450",
    advantages: [
        "Reduces clutter by showing only relevant information to each user.",
        "Improves user experience and engagement.",
        "Enhances security by limiting access based on roles.",
        "Simplifies workflows for every user type."
    ],
    flowchart: `
[User Logs In]
      |
      v
[System Checks Role: Principal, Teacher, Student, etc.]
      |
      v
< Display Customized Dashboard >
      |
      +--> [Principal sees School Overview, Financials, User Mgt.]
      |
      +--> [Teacher sees Class Mgt, Attendance, Grading]
      |
      +--> [Student sees Homework, Quizzes, AI Buddy]
`
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    title: "AI Study Buddy",
    description:
      "Personalized AI-powered assistance for students to help with homework, concepts, and exam preparation.",
    demoImage: "https://picsum.photos/seed/ai-buddy-demo/800/450",
    advantages: [
        "Provides instant, 24/7 academic support.",
        "Offers multiple methods to solve a single problem.",
        "Visually explains complex processes with flowcharts.",
        "Boosts student confidence and independent learning."
    ],
    flowchart: `
[Student has a Question]
      |
      v
[Enters Question (Text or Image) into AI Study Buddy]
      |
      v
< AI Analyzes the Problem >
      |
      v
[AI Generates Response]
      |
      +--> Final Answer (Concise)
      |
      +--> Multiple Step-by-Step Solutions
      |
      +--> Visual Flowchart (if applicable)
`
  },
  {
    icon: <Wallet className="h-10 w-10 text-primary" />,
    title: "Financial Management",
    description:
      "A complete suite for principals to track fees, manage expenses, and generate financial reports with ease.",
    demoImage: "https://picsum.photos/seed/finance-demo/800/450",
    advantages: [
        "Centralizes all financial data in one place.",
        "Automates fee collection and reminder processes.",
        "Provides real-time insights into school's financial health.",
        "Simplifies expense tracking and budget management."
    ],
    flowchart: `
[Principal opens Financial Dashboard]
      |
      v
[Views Overview: Revenue, Expenses, Pending Fees]
      |
      +--> [Manage Fee Invoices] --> [Send AI-Powered Reminders]
      |
      +--> [Track Expenses] --> [Categorize Bills & Salaries]
      |
      +--> [Generate Reports] --> [Download P&L, Balance Sheet]
`
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Report Generation",
    description:
      "Automatically generate and share academic and financial reports in PDF and Excel formats.",
    demoImage: "https://picsum.photos/seed/reports-demo/800/450",
     advantages: [
        "Saves hours of manual report creation time.",
        "Ensures data consistency and accuracy.",
        "Easily downloadable and shareable with stakeholders.",
        "AI-powered summarization for quick insights."
    ],
    flowchart: `
[User Navigates to a Report Page (e.g., Financials)]
      |
      v
[Selects Filters (Date Range, Class, etc.)]
      |
      v
< System Compiles Data >
      |
      v
[User clicks "Export" or "Download"]
      |
      v
[File is Generated (PDF/CSV) and Downloaded]
`
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Seamless Communication",
    description:
      "Integrated chat and announcement features to keep parents, teachers, and students connected.",
    demoImage: "https://picsum.photos/seed/chat-demo/800/450",
    advantages: [
        "Provides a secure, internal communication platform.",
        "Enables direct parent-teacher conversations.",
        "Facilitates student collaboration on homework.",
        "Centralizes all school-related announcements."
    ],
    flowchart: `
[User A wants to communicate]
      |
      v
[Opens Chat Feature] --> [Selects Recipient (e.g., Teacher, Parent)]
      |
      v
< Types and Sends Message >
      |
      v
[User B Receives Instant Notification]
      |
      v
[Both users can chat in real-time]
`
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "Growth Analytics",
    description:
      "Track student performance and school growth with insightful analytics and visual reports.",
    demoImage: "https://picsum.photos/seed/analytics-demo/800/450",
    advantages: [
        "Visualizes complex data for easy understanding.",
        "Helps identify trends in student academic performance.",
        "Provides insights into teacher effectiveness via ratings.",
        "Data-driven decision making for school administration."
    ],
    flowchart: `
[Principal/Teacher views Analytics Dashboard]
      |
      v
[Selects Report (e.g., Student Performance, Teacher Ratings)]
      |
      v
< Data is Displayed in Interactive Charts & Tables >
      |
      +--> [Filter by class, subject, or date]
      |
      +--> [View trends over time]
      |
      +--> [Identify top performers and areas for improvement]
`
  },
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-12 md:px-6 md:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          Everything You Need in One Platform
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-foreground/80 md:text-lg">
          CampusConnect offers a powerful set of tools designed to modernize your
          institution.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Dialog key={feature.title}>
            <DialogTrigger asChild>
                <Card className="flex flex-col items-start text-left p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardHeader className="p-0">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-2">
                    <p className="text-foreground/70">{feature.description}</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                 <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-3">{feature.icon} {feature.title}</DialogTitle>
                    <DialogDescription>{feature.description}</DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2"><CheckCircle className="text-primary"/> Advantages</h3>
                        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                            {feature.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
                        </ul>
                        
                        <h3 className="font-semibold flex items-center gap-2 pt-4"><Waypoints className="text-primary"/> Workflow</h3>
                        <pre className="bg-secondary/50 p-4 rounded-md text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                            <code>{feature.flowchart.trim()}</code>
                        </pre>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Feature Demo</h3>
                        <div className="relative aspect-video rounded-lg overflow-hidden border">
                             <Image
                                src={feature.demoImage}
                                alt={`${feature.title} Demo`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
