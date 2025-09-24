
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, Sector } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { useState } from "react";
import { Activity, Clock, Utensils, Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const mealDataByDay: Record<string, { breakfast: string, lunch: string, dinner: string, rating: number }> = {
    'Mon': { breakfast: 'Poha', lunch: 'Roti, Dal, Sabzi', dinner: 'Rice, Chana Masala', rating: 4 },
    'Tue': { breakfast: 'Upma', lunch: 'Roti, Rajma, Sabzi', dinner: 'Rice, Paneer', rating: 5 },
    'Wed': { breakfast: 'Idli', lunch: 'Roti, Mixed Veg', dinner: 'Rice, Aloo Gobi', rating: 3 },
    'Thu': { breakfast: 'Paratha', lunch: 'Roti, Dal Fry', dinner: 'Rice, Kofta', rating: 4 },
    'Fri': { breakfast: 'Sandwich', lunch: 'Roti, Chole', dinner: 'Rice, Bhindi Fry', rating: 5 },
    'Sat': { breakfast: 'Dosa', lunch: 'Roti, Special Sabzi', dinner: 'Special Dinner', rating: 4 },
    'Sun': { breakfast: 'Puri Sabzi', lunch: 'Special Lunch', dinner: 'Rice, Dal Makhani', rating: 5 },
};

const mealData = Object.entries(mealDataByDay).map(([day, data]) => ({ day, ...data }));


const activitySchedule = [
    { time: '6:00 AM - 7:00 AM', activity: 'Wake up & Morning Exercise' },
    { time: '7:00 AM - 8:00 AM', activity: 'Getting Ready for School' },
    { time: '8:00 AM - 8:30 AM', activity: 'Breakfast' },
    { time: '8:30 AM - 2:30 PM', activity: 'School Hours' },
    { time: '2:30 PM - 3:30 PM', activity: 'Lunch & Rest' },
    { time: '3:30 PM - 5:00 PM', activity: 'Evening Study Hours' },
    { time: '5:00 PM - 6:30 PM', activity: 'Sports & Recreation' },
    { time: '6:30 PM - 8:00 PM', activity: 'Free Time / Hobby Class' },
    { time: '8:00 PM - 9:00 PM', activity: 'Dinner' },
    { time: '9:00 PM - 10:00 PM', activity: 'Night Study / Revision' },
    { time: '10:00 PM', activity: 'Lights Out' },
];

const timeDistributionData = [
    { activity: 'School', hours: 6, fill: "var(--color-school)" },
    { activity: 'Study', hours: 2.5, fill: "var(--color-study)" },
    { activity: 'Sports', hours: 1.5, fill: "var(--color-sports)" },
    { activity: 'Meals', hours: 2, fill: "var(--color-meals)" },
    { activity: 'Free Time', hours: 1.5, fill: "var(--color-free)" },
    { activity: 'Sleep', hours: 8.5, fill: "var(--color-sleep)" },
];

const timeDistributionConfig = {
    hours: { label: "Hours" },
    school: { label: "School", color: "hsl(var(--chart-1))" },
    study: { label: "Self-Study", color: "hsl(var(--chart-2))" },
    sports: { label: "Sports", color: "hsl(var(--chart-3))" },
    meals: { label: "Meals", color: "hsl(var(--chart-4))" },
    free: { label: "Free Time", color: "hsl(var(--chart-5))" },
    sleep: { label: "Sleep", color: "hsl(var(--muted))" },
} satisfies ChartConfig;

const studyHoursData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 2 },
  { day: "Thu", hours: 2.5 },
  { day: "Fri", hours: 1.5 },
  { day: "Sat", hours: 3.5 },
  { day: "Sun", hours: 1 },
]

const studyHoursConfig = {
  hours: {
    label: "Study Hours",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const mealRatingData = mealData.map(m => ({ name: m.day, rating: m.rating }));

const mealRatingConfig = {
  rating: {
    label: "Rating",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


export default function HostelUpdatesPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [ratings, setRatings] = useState(mealData.reduce((acc, meal) => ({ ...acc, [meal.day]: meal.rating }), {} as Record<string, number>));
    const [activePieIndex, setActivePieIndex] = useState(0);

    const handleRatingChange = (day: string, rating: number) => {
        setRatings(prev => ({ ...prev, [day]: rating }));
    };
    
    const renderActiveShape = (props: any) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
                {payload.activity}
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
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="dark:fill-white">{`${value} Hours`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
            </g>
        );
    };

    const selectedDay = date ? format(date, 'E') : format(new Date(), 'E');
    const todayMeal = mealDataByDay[selectedDay.substring(0,3) as keyof typeof mealDataByDay];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <CardTitle>Hostel Updates</CardTitle>
                            <CardDescription>Daily meals, activities, and other updates for hostel residents.</CardDescription>
                        </div>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full md:w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Utensils /> Meal Plan for {date ? format(date, "eeee") : "Today"}</CardTitle>
                    <CardDescription>Give your feedback on the meals provided.</CardDescription>
                </CardHeader>
                <CardContent>
                    {todayMeal ? (
                         <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                            <Table className="flex-1">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Meal</TableHead>
                                        <TableHead>Menu</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow><TableCell className="font-medium">Breakfast</TableCell><TableCell>{todayMeal.breakfast}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Lunch</TableCell><TableCell>{todayMeal.lunch}</TableCell></TableRow>
                                    <TableRow><TableCell className="font-medium">Dinner</TableCell><TableCell>{todayMeal.dinner}</TableCell></TableRow>
                                </TableBody>
                            </Table>
                             <div className="w-full md:w-64 text-center p-4 rounded-lg bg-secondary/50">
                                <h4 className="font-semibold mb-2">Rate Today's Meal</h4>
                                <StarRating rating={ratings[selectedDay.substring(0,3)] || 0} onRatingChange={(r) => handleRatingChange(selectedDay.substring(0,3), r)} />
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center">No meal data available for the selected day.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clock /> Daily Activity Schedule</CardTitle>
                    <CardDescription>A general schedule followed by students in the hostel.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="space-y-2">
                        {activitySchedule.map(item => (
                            <div key={item.time} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                                <Badge variant="outline">{item.time}</Badge>
                                <p className="font-medium">{item.activity}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity/> Student Activity Analytics</CardTitle>
                    <CardDescription>Visual breakdown of time spent and performance metrics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pie">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="pie">Weekly Time Distribution</TabsTrigger>
                            <TabsTrigger value="bar">Weekly Meal Ratings</TabsTrigger>
                            <TabsTrigger value="line">Weekly Study Hours</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pie">
                             <ChartContainer config={timeDistributionConfig} className="min-h-[400px] w-full mt-4">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie 
                                        data={timeDistributionData} 
                                        cx="50%" 
                                        cy="50%" 
                                        labelLine={false}
                                        outerRadius={120} 
                                        innerRadius={80}
                                        dataKey="hours" 
                                        activeIndex={activePieIndex}
                                        activeShape={renderActiveShape}
                                        onMouseEnter={(_, index) => setActivePieIndex(index)}
                                    >
                                        {timeDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </TabsContent>
                        <TabsContent value="bar">
                            <ChartContainer config={mealRatingConfig} className="min-h-[300px] w-full mt-4">
                                <BarChart accessibilityLayer data={mealRatingData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis domain={[0, 5]} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Bar dataKey="rating" fill="var(--color-rating)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </TabsContent>
                         <TabsContent value="line">
                            <ChartContainer config={studyHoursConfig} className="min-h-[300px] w-full mt-4">
                                <LineChart accessibilityLayer data={studyHoursData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={3} dot={{ r: 5, fill: 'var(--color-hours)' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ChartContainer>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
