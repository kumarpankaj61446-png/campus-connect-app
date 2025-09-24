
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, Sector } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bot, Users, BookOpen, Wallet, Star, UserCheck } from "lucide-react";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const featureUsageData = [
    { feature: 'AI Quiz Gen', teacher: 150, student: 4500, parent: 0, fill: "var(--color-quiz)" },
    { feature: 'AI Study Buddy', teacher: 0, student: 8200, parent: 0, fill: "var(--color-buddy)" },
    { feature: 'Fee Payments', teacher: 0, student: 0, parent: 6500, fill: "var(--color-fees)" },
    { feature: 'Homework', teacher: 1200, student: 9500, parent: 7200, fill: "var(--color-homework)" },
    { feature: 'Teacher Rating', teacher: 0, student: 6800, parent: 0, fill: "var(--color-rating)" },
];

const featureUsageConfig = {
    teacher: { label: "Teacher", color: "hsl(var(--chart-1))" },
    student: { label: "Student", color: "hsl(var(--chart-2))" },
    parent: { label: "Parent", color: "hsl(var(--chart-3))" },
    quiz: { label: "AI Quiz", color: "hsl(var(--chart-1))" },
    buddy: { label: "AI Buddy", color: "hsl(var(--chart-2))" },
    fees: { label: "Fee Payments", color: "hsl(var(--chart-3))" },
    homework: { label: "Homework", color: "hsl(var(--chart-4))" },
    rating: { label: "Teacher Rating", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const dailyActiveUsers = [
    { date: 'Jul 22', Teachers: 40, Students: 800, Parents: 500 },
    { date: 'Jul 23', Teachers: 45, Students: 950, Parents: 600 },
    { date: 'Jul 24', Teachers: 42, Students: 850, Parents: 550 },
    { date: 'Jul 25', Teachers: 50, Students: 1100, Parents: 700 },
    { date: 'Jul 26', Teachers: 48, Students: 1050, Parents: 650 },
    { date: 'Jul 27', Teachers: 30, Students: 400, Parents: 200 },
    { date: 'Jul 28', Teachers: 25, Students: 300, Parents: 150 },
];

const dailyActiveUsersConfig = {
    Teachers: { label: "Teachers", color: "hsl(var(--chart-1))" },
    Students: { label: "Students", color: "hsl(var(--chart-2))" },
    Parents: { label: "Parents", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const allTimeInAppData = {
    daily: [
        { role: 'Student', minutes: 45, fill: 'hsl(var(--chart-2))'},
        { role: 'Teacher', minutes: 35, fill: 'hsl(var(--chart-1))' },
        { role: 'Parent', minutes: 15, fill: 'hsl(var(--chart-4))' },
        { role: 'Principal', minutes: 55, fill: 'hsl(var(--chart-5))' },
        { role: 'Admin', minutes: 65, fill: 'hsl(var(--muted))' },
    ],
    weekly: [
        { role: 'Student', minutes: 315, fill: 'hsl(var(--chart-2))'},
        { role: 'Teacher', minutes: 245, fill: 'hsl(var(--chart-1))' },
        { role: 'Parent', minutes: 105, fill: 'hsl(var(--chart-4))' },
        { role: 'Principal', minutes: 385, fill: 'hsl(var(--chart-5))' },
        { role: 'Admin', minutes: 455, fill: 'hsl(var(--muted))' },
    ],
    monthly: [
        { role: 'Student', minutes: 1350, fill: 'hsl(var(--chart-2))'},
        { role: 'Teacher', minutes: 1050, fill: 'hsl(var(--chart-1))' },
        { role: 'Parent', minutes: 450, fill: 'hsl(var(--chart-4))' },
        { role: 'Principal', minutes: 1650, fill: 'hsl(var(--chart-5))' },
        { role: 'Admin', minutes: 1950, fill: 'hsl(var(--muted))' },
    ]
};

const timePerSchoolData = [
    { school: 'Greenwood High', Student: 40, Teacher: 30, Parent: 15, Principal: 50 },
    { school: 'Oakridge', Student: 50, Teacher: 40, Parent: 10, Principal: 60 },
    { school: 'DPS', Student: 35, Teacher: 25, Parent: 20, Principal: 45 },
    { school: 'Global Edge', Student: 42, Teacher: 38, Parent: 12, Principal: 55 },
];

const timePerSchoolConfig = {
    Student: { label: "Student", color: "hsl(var(--chart-2))" },
    Teacher: { label: "Teacher", color: "hsl(var(--chart-1))" },
    Parent: { label: "Parent", color: "hsl(var(--chart-4))" },
    Principal: { label: "Principal", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export default function FeatureAnalyticsPage() {
    const [activePieIndex, setActivePieIndex] = useState(0);
    const [roleFilter, setRoleFilter] = useState('all');
    const [timeframeFilter, setTimeframeFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    const timeInApp = useMemo(() => {
        const dataForTimeframe = allTimeInAppData[timeframeFilter];
        if (roleFilter === 'all') {
            return dataForTimeframe;
        }
        return dataForTimeframe.filter(d => d.role === roleFilter);
    }, [roleFilter, timeframeFilter]);

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

        return (
            <g>
                <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="hsl(var(--foreground))" className="font-bold">
                    {payload.role}
                </text>
                 <text x={cx} y={cy} dy={15} textAnchor="middle" fill="hsl(var(--foreground))" className="text-xl font-bold">
                    {value} min
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
            </g>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> Feature Engagement Analytics</CardTitle>
                    <CardDescription>
                        Visualize how users are interacting with different features across the platform. Data is updated in real-time.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Feature Usage by Role</CardTitle>
                    <CardDescription>Total interactions per feature, segmented by user type.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={featureUsageConfig} className="min-h-[300px] w-full">
                        <BarChart accessibilityLayer data={featureUsageData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="feature" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="teacher" stackId="a" fill="var(--color-teacher)" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="student" stackId="a" fill="var(--color-student)" />
                            <Bar dataKey="parent" stackId="a" fill="var(--color-parent)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Active Users</CardTitle>
                        <CardDescription>DAU trends for each user role over the past 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={dailyActiveUsersConfig} className="min-h-[250px] w-full">
                            <LineChart accessibilityLayer data={dailyActiveUsers}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line type="monotone" dataKey="Teachers" stroke="var(--color-Teachers)" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Students" stroke="var(--color-Students)" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Parents" stroke="var(--color-Parents)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Average Session Duration</CardTitle>
                        <CardDescription>Average time spent in the app per session.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex justify-end gap-2 mb-4">
                           <Select value={timeframeFilter} onValueChange={(v) => setTimeframeFilter(v as any)}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="Student">Student</SelectItem>
                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                    <SelectItem value="Parent">Parent</SelectItem>
                                    <SelectItem value="Principal">Principal</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                       </div>
                       <ChartContainer config={featureUsageConfig} className="min-h-[250px] w-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie 
                                    data={timeInApp} 
                                    cx="50%" 
                                    cy="50%" 
                                    labelLine={false}
                                    outerRadius={100}
                                    innerRadius={80}
                                    dataKey="minutes"
                                    activeIndex={activePieIndex}
                                    activeShape={renderActiveShape}
                                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                                >
                                    {timeInApp.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                 {timeInApp.length > 1 && <Legend />}
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Time Spent by Role per School (Avg. Minutes)</CardTitle>
                    <CardDescription>Breakdown of average session duration for each user role across different schools.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={timePerSchoolConfig} className="min-h-[350px] w-full">
                        <BarChart accessibilityLayer data={timePerSchoolData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="school" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="Student" stackId="a" fill="var(--color-Student)" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="Teacher" stackId="a" fill="var(--color-Teacher)" />
                            <Bar dataKey="Parent" stackId="a" fill="var(--color-Parent)" />
                            <Bar dataKey="Principal" stackId="a" fill="var(--color-Principal)" radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

        </div>
    );
}
