'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Banknote, FileDown, PlusCircle, Users, Bolt, Wifi, Droplets, Loader2, BookOpen, Filter, Calendar as CalendarIcon, ArrowDownUp } from "lucide-react";
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UploadButton } from '@/components/ui/upload-button';


const mockBills = [
    { id: 'BILL001', type: 'Electricity Bill', amount: 45000, dueDate: '2024-08-05', status: 'Paid' },
    { id: 'BILL002', type: 'Internet Bill', amount: 8000, dueDate: '2024-08-10', status: 'Paid' },
    { id: 'BILL003', type: 'Water Bill', amount: 12000, dueDate: '2024-08-15', status: 'Pending' },
    { id: 'BILL004', type: 'Maintenance', amount: 25000, dueDate: '2024-08-20', status: 'Pending' },
];

const mockStaffSalaries = [
  { id: 'TCH001', name: 'Mr. Ramesh Kumar', role: 'Teacher', month: 'July 2024', salary: 60000, status: 'Paid' },
  { id: 'TCH002', name: 'Mrs. Sunita Gupta', role: 'Teacher', month: 'July 2024', salary: 58000, status: 'Paid' },
  { id: 'DRV001', name: 'Suresh Singh', role: 'Driver', month: 'July 2024', salary: 25000, status: 'Paid' },
  { id: 'TCH003', name: 'Mr. Verma', role: 'Teacher', month: 'July 2024', salary: 55000, status: 'Pending' },
];

const staffRoles = ['All Staff', 'Teacher', 'Driver', 'Admin', 'Janitor'];
const months = [...new Set(mockStaffSalaries.map(s => s.month))];

const getStatusVariant = (status: string) => {
    switch(status) {
        case 'Paid': return 'default';
        case 'Pending': return 'destructive';
        default: return 'secondary';
    }
}

const getBillIcon = (type: string) => {
    if (type.includes('Electricity')) return <Bolt className="w-4 h-4 text-yellow-500" />;
    if (type.includes('Internet')) return <Wifi className="w-4 h-4 text-blue-500" />;
    if (type.includes('Water')) return <Droplets className="w-4 h-4 text-sky-500" />;
    return <Banknote className="w-4 h-4 text-muted-foreground" />;
}

export default function ExpensesManagementPage() {
    const { toast } = useToast();
    const [exportingBills, setExportingBills] = useState(false);
    const [exportingSalaries, setExportingSalaries] = useState(false);
    const [isAddBillOpen, setIsAddBillOpen] = useState(false);
    
    // State for salary tab
    const [roleFilter, setRoleFilter] = useState('All Staff');
    const [monthFilter, setMonthFilter] = useState(months[0] || '');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

    const filteredSalaries = useMemo(() => {
        let filtered = mockStaffSalaries.filter(staff => {
            const roleMatch = roleFilter === 'All Staff' || staff.role === roleFilter;
            const monthMatch = monthFilter === '' || staff.month === monthFilter;
            return roleMatch && monthMatch;
        });

        filtered.sort((a, b) => {
            const key = sortConfig.key as keyof typeof a;
            if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        return filtered;
    }, [roleFilter, monthFilter, sortConfig]);
    
    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };


    const handleExport = (type: 'bills' | 'salaries') => {
        if (type === 'bills') {
            setExportingBills(true);
            try {
                const headers = ["Bill ID", "Type", "Amount", "Due Date", "Status"];
                const csv = [
                    headers.join(','),
                    ...mockBills.map(b => [b.id, b.type, b.amount, b.dueDate, b.status].join(','))
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "operational_bills.csv";
                link.click();
                URL.revokeObjectURL(link.href);
                 toast({ title: "Export Successful", description: "Operational bills have been exported."});
            } catch (e) {
                 toast({ variant: 'destructive', title: "Export Failed" });
            } finally {
                setExportingBills(false);
            }
        } else {
             setExportingSalaries(true);
             try {
                const headers = ["Staff ID", "Name", "Role", "Month", "Salary", "Status"];
                const csv = [
                    headers.join(','),
                    ...filteredSalaries.map(s => [s.id, s.name, s.role, s.month, s.salary, s.status].join(','))
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `salaries_${monthFilter}.csv`;
                link.click();
                URL.revokeObjectURL(link.href);
                 toast({ title: "Export Successful", description: `Salary data for ${monthFilter} has been exported.`});
            } catch (e) {
                 toast({ variant: 'destructive', title: "Export Failed" });
            } finally {
                setExportingSalaries(false);
            }
        }
    };
    
    const handleAddBill = () => {
        // Logic to add the new bill would go here
        toast({ title: "Bill Added", description: "The new bill has been successfully recorded."});
        setIsAddBillOpen(false);
    }
    
    const handleFileUpload = (file: File) => {
        toast({ title: "File Uploaded", description: `"${file.name}" has been attached to the new bill.`});
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Expenses Management</CardTitle>
                    <CardDescription>Track all school expenditures, from salaries to operational bills, in one centralized location.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="bills">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="bills">Operational Bills</TabsTrigger>
                            <TabsTrigger value="salary">Salary Payouts</TabsTrigger>
                        </TabsList>
                        <TabsContent value="bills" className="mt-6">
                             <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
                                <Card>
                                    <CardHeader className="flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Utility & Operational Bills</CardTitle>
                                            <CardDescription>Manage payments for electricity, internet, maintenance, and more.</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => handleExport('bills')} disabled={exportingBills}>
                                                {exportingBills ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4"/>}
                                                Export
                                            </Button>
                                             <DialogTrigger asChild>
                                                <Button><PlusCircle className="mr-2 h-4 w-4"/>Add New Bill</Button>
                                             </DialogTrigger>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Bill Type</TableHead>
                                                    <TableHead>Due Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Amount (₹)</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {mockBills.map(bill => (
                                                    <TableRow key={bill.id}>
                                                        <TableCell className="font-medium flex items-center gap-2">
                                                            {getBillIcon(bill.type)}
                                                            {bill.type}
                                                        </TableCell>
                                                        <TableCell>{bill.dueDate}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={getStatusVariant(bill.status)}>{bill.status}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-bold">{bill.amount.toLocaleString()}</TableCell>
                                                        <TableCell className="text-right">
                                                            {bill.status === 'Pending' && <Button size="sm">Pay Now</Button>}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                                 <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add a New Bill</DialogTitle>
                                        <DialogDescription>Enter the details of the new bill and upload the invoice document.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="bill-type" className="text-right">Bill Type</Label>
                                            <Input id="bill-type" placeholder="e.g., Electricity Bill" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="bill-amount" className="text-right">Amount (₹)</Label>
                                            <Input id="bill-amount" type="number" placeholder="45000" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="bill-due-date" className="text-right">Due Date</Label>
                                            <Input id="bill-due-date" type="date" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right">Invoice</Label>
                                            <div className="col-span-3">
                                               <UploadButton onFileSelect={handleFileUpload} variant="outline">
                                                    Upload PDF, Excel, ZIP...
                                                </UploadButton>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddBill}>Save Bill</Button>
                                    </DialogFooter>
                                </DialogContent>
                             </Dialog>
                        </TabsContent>
                        <TabsContent value="salary" className="mt-6">
                            <Card>
                                <CardHeader className="flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Staff Salary Details</CardTitle>
                                        <CardDescription>A quick overview of salary payouts for the selected month.</CardDescription>
                                    </div>
                                    <Button asChild variant="outline">
                                        <Link href="/financial/salary">Go to Full Salary Management</Link>
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col md:flex-row items-center mb-4 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-4 w-4 text-muted-foreground"/>
                                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                                <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
                                                <SelectContent>{staffRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground"/>
                                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                                <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
                                                <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="md:ml-auto">
                                            <Button variant="outline" onClick={() => handleExport('salaries')} disabled={exportingSalaries}>
                                                {exportingSalaries ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
                                                Export
                                            </Button>
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                     <Button variant="ghost" size="sm" onClick={() => requestSort('name')}>
                                                        Staff Name <ArrowDownUp className="ml-2 h-4 w-4"/>
                                                     </Button>
                                                </TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Salary (₹)</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredSalaries.map(staff => (
                                                <TableRow key={staff.id}>
                                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                                    <TableCell><Badge variant="secondary">{staff.role}</Badge></TableCell>
                                                    <TableCell>{staff.salary.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusVariant(staff.status)}>{staff.status}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
