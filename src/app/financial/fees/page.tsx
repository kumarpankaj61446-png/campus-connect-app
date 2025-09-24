

'use client';

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileDown, Loader2, Bot, Wallet, Users, Mail, MessageSquare, Folder, Check, AlertTriangle, History, Edit, DollarSign } from "lucide-react";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";
import { sendFeeReminders, sendSingleReminder } from "@/lib/actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { mockStudentFees as allStudentFees } from "@/lib/mock-data/report-data";
import { classes } from "@/lib/mock-data/report-data";
import { LateFeePredictor } from "@/components/dashboard/LateFeePredictor";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";

const mockStudentFees = [
  { studentId: 'S001', studentName: 'Ravi Kumar', className: '10 A', invoices: [
    { id: 'INV1001', description: 'Term 1 Tuition', amount: 15000, dueDate: '2024-07-15', status: 'Paid', paidOn: '2024-07-10' },
    { id: 'INV1002', description: 'Bus Fee - July', amount: 2500, dueDate: '2024-07-10', status: 'Pending' },
  ]},
  { studentId: 'S002', studentName: 'Priya Sharma', className: '9 B', invoices: [
    { id: 'INV2001', description: 'Term 1 Tuition', amount: 14000, dueDate: '2024-07-15', status: 'Pending' },
    { id: 'INV2002', description: 'Sports Fee', amount: 1500, dueDate: '2024-07-20', status: 'Paid', paidOn: '2024-07-18' },
     { id: 'INV2003', description: 'Lab Fee', amount: 1000, dueDate: '2024-06-20', status: 'Overdue' },
  ]},
   { studentId: 'S003', studentName: 'Amit Singh', className: '10 A', invoices: [
    { id: 'INV3001', description: 'Term 1 Tuition', amount: 15000, dueDate: '2024-07-15', status: 'Paid', paidOn: '2024-07-14' },
  ]},
];

type ParentRequest = {
    id: string;
    studentName: string;
    parentName: string;
    parentAvatar: string;
    request: string;
    message: string;
    invoiceId: string;
    amount: number;
    parentPhone: string;
};

type RequestHistoryItem = ParentRequest & {
    action: 'Approved' | 'Rejected' | 'Reminder Sent';
    timestamp: Date;
    editCount: number;
};

const mockParentRequests: ParentRequest[] = [
    { id: 'REQ001', studentName: 'Ravi Kumar', parentName: 'Mr. Kumar', parentAvatar: 'https://avatar.vercel.sh/mr-kumar.png', request: 'Already Paid', message: 'I have paid the bus fee of ₹2500 via UPI. Please check.', invoiceId: 'INV1002', amount: 2500, parentPhone: '9999999991' },
    { id: 'REQ002', studentName: 'Priya Sharma', parentName: 'Mrs. Sharma', parentAvatar: 'https://avatar.vercel.sh/mrs-sharma.png', request: 'Will pay soon', message: 'I will be paying the pending tuition fee by this weekend.', invoiceId: 'INV2001', amount: 14000, parentPhone: '9999999992' },
    { id: 'REQ003', studentName: 'Geeta Iyer', parentName: 'Mr. Iyer', parentAvatar: 'https://avatar.vercel.sh/mr-iyer.png', request: 'Will pay by tomorrow', message: 'Sorry for the delay, will clear the sports fee tomorrow for sure.', invoiceId: 'INV4002', amount: 1200, parentPhone: '9999999993' },
];

const mockClassData = {
    '10 A': { paid: 30000, pending: 2500, overdue: 0 },
    '9 B': { paid: 1500, pending: 14000, overdue: 1000 },
    '8 C': { paid: 45000, pending: 5000, overdue: 2000 },
};

const chartConfig: ChartConfig = {
    paid: { label: "Paid", color: "hsl(var(--chart-1))" },
    pending: { label: "Pending", color: "hsl(var(--chart-2))" },
    overdue: { label: "Overdue", color: "hsl(var(--destructive))" },
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Paid": return "default";
        case "Pending": return "secondary";
        case "Overdue": return "destructive";
        default: return "outline";
    }
};

export default function FeeManagementPage() {
    const [search, setSearch] = useState("");
    const [studentFees, setStudentFees] = useState(mockStudentFees);
    const [parentRequests, setParentRequests] = useState<ParentRequest[]>(mockParentRequests);
    const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);
    const [selectedClass, setSelectedClass] = useState("10 A");
    const [exporting, setExporting] = useState(false);
    const [sendingReminders, setSendingReminders] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingHistoryItem, setEditingHistoryItem] = useState<RequestHistoryItem | null>(null);

    const { toast } = useToast();

    const searchResults = useMemo(() => {
        if (!search) return [];
        return studentFees.filter(s => 
            s.studentName.toLowerCase().includes(search.toLowerCase()) || 
            s.studentId.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, studentFees]);
    
    const classChartData = useMemo(() => {
        const data = mockClassData[selectedClass as keyof typeof mockClassData];
        return data ? [
            { name: "Paid", value: data.paid, fill: "var(--color-paid)" },
            { name: "Pending", value: data.pending, fill: "var(--color-pending)" },
            { name: "Overdue", value: data.overdue, fill: "var(--color-overdue)" },
        ] : [];
    }, [selectedClass]);

    const handleExport = () => {
        setExporting(true);
        setTimeout(() => {
            setExporting(false);
            toast({
                title: "Export Started",
                description: "A full fee report is being generated.",
            });
        }, 1500);
    };

    const handleSendReminders = async () => {
        setSendingReminders(true);
        try {
            const result = await sendFeeReminders();
            if (result.success) {
                toast({
                    title: 'AI Task Started',
                    description: `The AI is sending ${result.remindersSent} reminders via Email, SMS, and WhatsApp.`,
                });
            } else {
                throw new Error(result.message || "An unknown error occurred.");
            }
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Reminder Task Failed',
                description: error.message,
            });
        } finally {
            setSendingReminders(false);
        }
    };
    
    const moveRequestToHistory = (requestId: string, action: RequestHistoryItem['action']) => {
        const requestToMove = parentRequests.find(req => req.id === requestId);
        if (requestToMove) {
            setRequestHistory(prev => [{ ...requestToMove, action, timestamp: new Date(), editCount: 0 }, ...prev]);
            setParentRequests(prev => prev.filter(req => req.id !== requestId));
        }
    };

    const handleApproveRequest = (requestId: string, studentId: string, invoiceId: string) => {
        setActionLoading(requestId);
        setTimeout(() => {
            setStudentFees(prevFees => prevFees.map(student => {
                if (student.studentId === studentId) {
                    return {
                        ...student,
                        invoices: student.invoices.map(invoice => 
                            invoice.id === invoiceId ? { ...invoice, status: 'Paid', paidOn: new Date().toISOString().split('T')[0] } : invoice
                        )
                    }
                }
                return student;
            }));
            moveRequestToHistory(requestId, 'Approved');
            toast({
                title: 'Payment Approved',
                description: `Invoice ${invoiceId} marked as paid. Parent has been notified.`,
            });
            setActionLoading(null);
        }, 1000);
    };
    
    const handleRejectRequest = (requestId: string, request: ParentRequest) => {
        setActionLoading(requestId);
        handleSendSingleReminder(requestId, request, 'Rejected');
    };

    const handleSendSingleReminder = async (requestId: string, request: ParentRequest, action: RequestHistoryItem['action'] = 'Reminder Sent') => {
        setActionLoading(requestId);
        try {
            const result = await sendSingleReminder({
                studentName: request.studentName,
                parentName: request.parentName,
                parentPhone: request.parentPhone,
                pendingAmount: request.amount,
                dueDate: 'the specified due date'
            });
            if (result.success) {
                 toast({
                    title: `AI Reminder Sent (${action})`,
                    description: `A reminder SMS has been sent to ${request.parentName}. They have been notified.`,
                });
                moveRequestToHistory(requestId, action);
            } else {
                 throw new Error(result.message || "An unknown error occurred.");
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Failed to Send Reminder',
                description: error.message,
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleEditHistoryItem = (item: RequestHistoryItem) => {
        setEditingHistoryItem(item);
        setIsEditModalOpen(true);
    };

    const handleSaveHistoryEdit = (newAction: RequestHistoryItem['action']) => {
        if (!editingHistoryItem) return;
        setRequestHistory(prev => prev.map(item => 
            item.id === editingHistoryItem.id 
            ? { ...item, action: newAction, editCount: item.editCount + 1 }
            : item
        ));
        setIsEditModalOpen(false);
        setEditingHistoryItem(null);
        toast({ title: 'History Updated', description: 'The action has been modified.' });
    };

    const handlePurchaseEdits = () => {
         toast({
            title: 'Payment Required',
            description: 'This is a demo. In a real app, this would lead to a payment flow.',
            action: <Button size="sm">Pay ₹25</Button>
        });
    }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>Class-wise Fee Analytics</CardTitle>
                    <CardDescription>Visualize fee collection status for each class.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(mockClassData).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <Tabs defaultValue="bar">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                        <TabsTrigger value="line">Line Chart</TabsTrigger>
                        <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bar">
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full mt-4">
                            <BarChart accessibilityLayer data={classChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="value" radius={4}>
                                    {classChartData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                    <TabsContent value="line">
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full mt-4">
                            <LineChart accessibilityLayer data={classChartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="value" stroke="var(--color-paid)" strokeWidth={3} dot={{ fill: "var(--color-paid)" }} />
                            </LineChart>
                        </ChartContainer>
                    </TabsContent>
                    <TabsContent value="pie" className="flex justify-center">
                         <ChartContainer config={chartConfig} className="min-h-[250px] w-[400px] mt-4">
                            <PieChart accessibilityLayer>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={classChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                     {classChartData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                                </Pie>
                                <Legend />
                            </PieChart>
                         </ChartContainer>
                    </TabsContent>
                 </Tabs>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Student Fee Records</CardTitle>
                <CardDescription>Search for a student to view their detailed fee payment history.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by student name or ID..." 
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                    </div>
                    <Button variant="outline" onClick={handleExport} disabled={exporting}>
                        {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                        Export All Records
                    </Button>
                </div>

                {search && searchResults.length > 0 && (
                    <div className="space-y-4">
                        {searchResults.map(student => (
                             <Card key={student.studentId} className="bg-secondary/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">{student.studentName}</CardTitle>
                                    <CardDescription>Class: {student.className} | Student ID: {student.studentId}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Invoice ID</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Amount (₹)</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Paid On</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {student.invoices.map(invoice => (
                                                <TableRow key={invoice.id}>
                                                    <TableCell>{invoice.id}</TableCell>
                                                    <TableCell>{invoice.description}</TableCell>
                                                    <TableCell>{invoice.amount.toLocaleString()}</TableCell>
                                                    <TableCell>{invoice.dueDate}</TableCell>
                                                    <TableCell><Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge></TableCell>
                                                    <TableCell>{invoice.paidOn || 'N/A'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                             </Card>
                        ))}
                    </div>
                )}
                 {search && searchResults.length === 0 && (
                    <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-md">
                        <p>No student found for '{search}'.</p>
                    </div>
                )}
            </CardContent>
        </Card>
        
         <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full">
                    <Bot className="mr-2 h-4 w-4" />
                    Configure & Send Automated Reminders
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Configure AI Reminder Task</DialogTitle>
                    <DialogDescription>Set the parameters for the AI to send fee reminders.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="font-semibold">1. Reminder Type</Label>
                            <RadioGroup defaultValue="with-amount">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="with-amount" id="r1" />
                                    <Label htmlFor="r1" className="flex items-center gap-2"><Wallet className="w-4 h-4 text-muted-foreground"/> Send with exact amount</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="normal" id="r2" />
                                    <Label htmlFor="r2">Send a general reminder</Label>
                                </div>
                            </RadioGroup>
                        </div>
                            <div className="space-y-3">
                            <Label className="font-semibold">3. Channels</Label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="c-all" defaultChecked />
                                    <Label htmlFor="c-all" className="font-medium">All Channels</Label>
                                </div>
                                <div className="pl-6 space-y-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="c-email" defaultChecked/>
                                        <Label htmlFor="c-email" className="font-normal flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground"/> Email</Label>
                                    </div>
                                        <div className="flex items-center space-x-2">
                                        <Checkbox id="c-sms" defaultChecked/>
                                        <Label htmlFor="c-sms" className="font-normal">SMS</Label>
                                    </div>
                                        <div className="flex items-center space-x-2">
                                        <Checkbox id="c-whatsapp" defaultChecked/>
                                        <Label htmlFor="c-whatsapp" className="font-normal flex items-center gap-2"><MessageSquare className="w-4 h-4 text-muted-foreground"/> WhatsApp</Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label className="font-semibold">2. Target Audience</Label>
                        <RadioGroup defaultValue="all-dues">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all-dues" id="t1" />
                                <Label htmlFor="t1" className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground"/> All students with fee dues</Label>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="by-class" id="t2" />
                                    <Label htmlFor="t2">Selected classes</Label>
                                </div>
                                <Select>
                                    <SelectTrigger className="ml-6 w-[200px] h-8">
                                        <SelectValue placeholder="Select classes..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="by-student" id="t3" />
                                    <Label htmlFor="t3">Selected students</Label>
                                </div>
                                <Input className="ml-6 w-[200px] h-8" placeholder="Enter Student IDs..." />
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <Button onClick={handleSendReminders} disabled={sendingReminders} size="lg" className="w-full mt-4">
                        {sendingReminders ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Bot className="mr-2 h-4 w-4" />
                    )}
                    Use AI to Send Reminders
                </Button>
            </DialogContent>
        </Dialog>

        <LateFeePredictor />
        
        <Link href="/financial/file-manager">
            <Card className="hover:border-primary hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Folder className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>File Manager</CardTitle>
                        <CardDescription>Upload and manage financial documents, reports, and invoices.</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </Link>
        
        <Card>
            <CardHeader>
                <CardTitle>Parent Fee Requests</CardTitle>
                <CardDescription>Review and take action on fee payment notifications sent by parents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {parentRequests.length > 0 ? parentRequests.map(req => (
                    <div key={req.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={req.parentAvatar} />
                                <AvatarFallback>{req.parentName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{req.parentName} <span className="text-muted-foreground font-normal">(Parent of {req.studentName})</span></p>
                                <p className="text-sm text-muted-foreground italic">"{req.message}"</p>
                                <Badge variant="secondary" className="mt-1">{req.request}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 justify-end">
                            {req.request === 'Already Paid' ? (
                                <Button 
                                    onClick={() => handleApproveRequest(req.id, findStudentIdByInvoice(req.invoiceId), req.invoiceId)}
                                    disabled={actionLoading === req.id}
                                    variant="outline"
                                >
                                    {actionLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4 text-green-500" />}
                                    Approve & Mark Paid
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => handleSendSingleReminder(req.id, req)}
                                    disabled={actionLoading === req.id}
                                    variant="outline"
                                >
                                     {actionLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <MessageSquare className="mr-2 h-4 w-4" />}
                                    Send Polite Reminder
                                </Button>
                            )}
                             <Button 
                                onClick={() => handleRejectRequest(req.id, req)}
                                disabled={actionLoading === req.id}
                                variant="destructive"
                            >
                                 {actionLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <AlertTriangle className="mr-2 h-4 w-4" />}
                                Reject & Send Reminder
                            </Button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-md">
                        <p>No pending parent requests.</p>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5"/>
                    Recent Request History
                </CardTitle>
                <CardDescription>A log of the last few actions taken on parent requests. You can modify a record up to two times.</CardDescription>
            </CardHeader>
             <CardContent>
                {requestHistory.length > 0 ? (
                    <div className="space-y-3">
                        {requestHistory.map(item => {
                            const canEdit = item.editCount < 2;
                            return (
                                <div key={item.id} className="flex items-center justify-between p-3 border rounded-md bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={item.parentAvatar} />
                                            <AvatarFallback>{item.parentName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{item.parentName} - <span className="text-muted-foreground">{item.message}</span></p>
                                            <p className="text-xs text-muted-foreground">Request: "{item.request}"</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <Badge variant={
                                                item.action === 'Approved' ? 'default' :
                                                item.action === 'Rejected' ? 'destructive' : 'secondary'
                                            }>{item.action}</Badge>
                                            <p className="text-xs text-muted-foreground mt-1">{item.timestamp.toLocaleString()}</p>
                                        </div>
                                        {canEdit ? (
                                            <Button variant="outline" size="sm" onClick={() => handleEditHistoryItem(item)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Modify ({2 - item.editCount} left)
                                            </Button>
                                        ) : (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="secondary" size="sm">
                                                         <DollarSign className="mr-2 h-4 w-4" />
                                                         Unlock More Edits
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Unlock More Edits</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            You have used your 2 free modifications for this entry. To make more changes, a payment of ₹25 is required for 2 more edits.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handlePurchaseEdits}>Proceed to Pay ₹25</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                        <p>No actions have been taken recently.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        {editingHistoryItem && (
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modify History Action</DialogTitle>
                        <DialogDescription>
                            Change the recorded action for {editingHistoryItem.parentName}'s request. This will use one of your available edits.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p><strong>Original Action:</strong> {editingHistoryItem.action}</p>
                        <p className="text-sm">You are about to change the status. What should the new action be?</p>
                        <div className="flex gap-4">
                            <Button onClick={() => handleSaveHistoryEdit('Approved')} variant="outline">
                                <Check className="mr-2 h-4 w-4"/> Revert to Approved
                            </Button>
                            <Button onClick={() => handleSaveHistoryEdit('Rejected')} variant="destructive">
                                <AlertTriangle className="mr-2 h-4 w-4"/> Revert to Rejected
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )}
    </div>
  );
}

function findStudentIdByInvoice(invoiceId: string): string {
    const student = mockStudentFees.find(s => s.invoices.some(inv => inv.id === invoiceId));
    return student ? student.studentId : '';
}

    
