
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, Banknote, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

const mockStaffSalaries = [
  // Teachers
  { id: 'TCH001', name: 'Mr. Ramesh Kumar', role: 'Teacher', month: 'July 2024', salary: 60000, status: 'Paid' },
  { id: 'TCH002', name: 'Mrs. Sunita Gupta', role: 'Teacher', month: 'July 2024', salary: 58000, status: 'Paid' },
  { id: 'TCH003', name: 'Mr. Verma', role: 'Teacher', month: 'July 2024', salary: 55000, status: 'Pending' },
  
  // Drivers
  { id: 'DRV001', name: 'Suresh Singh', role: 'Driver', month: 'July 2024', salary: 25000, status: 'Paid' },
  { id: 'DRV002', name: 'Mohan Yadav', role: 'Driver', month: 'July 2024', salary: 25000, status: 'Paid' },

  // Other Staff
  { id: 'ADM001', name: 'Priya Sharma', role: 'Admin', month: 'July 2024', salary: 35000, status: 'Paid' },
  { id: 'JAN001', name: 'Kamal Kumar', role: 'Janitor', month: 'July 2024', salary: 18000, status: 'Paid' },
  
  // June Data
  { id: 'TCH001-Jun', name: 'Mr. Ramesh Kumar', role: 'Teacher', month: 'June 2024', salary: 60000, status: 'Paid' },
  { id: 'TCH002-Jun', name: 'Mrs. Sunita Gupta', role: 'Teacher', month: 'June 2024', salary: 58000, status: 'Paid' },
  { id: 'DRV001-Jun', name: 'Suresh Singh', role: 'Driver', month: 'June 2024', salary: 25000, status: 'Paid' },

];

const staffRoles = ['All Staff', 'Teacher', 'Driver', 'Admin', 'Janitor'];
const months = [...new Set(mockStaffSalaries.map(s => s.month))];

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Paid": return "default";
        case "Pending": return "destructive";
        default: return "secondary";
    }
}

const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const allYears = [...new Set(mockStaffSalaries.map(s => s.month.split(' ')[1]))];


export default function SalaryManagementPage() {
    const { toast } = useToast();
    const [roleFilter, setRoleFilter] = useState('All Staff');
    const [monthFilter, setMonthFilter] = useState(months[0] || '');
    
    const [tempSelectedMonth, setTempSelectedMonth] = useState(monthFilter.split(' ')[0]);
    const [tempSelectedYear, setTempSelectedYear] = useState(monthFilter.split(' ')[1]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const filteredSalaries = useMemo(() => {
        return mockStaffSalaries.filter(staff => {
            const roleMatch = roleFilter === 'All Staff' || staff.role === roleFilter;
            const monthMatch = monthFilter === '' || staff.month === monthFilter;
            return roleMatch && monthMatch;
        });
    }, [roleFilter, monthFilter]);

    const totalSalaryForMonth = filteredSalaries.reduce((acc, staff) => acc + staff.salary, 0);
    
    const handleFilterUpdate = () => {
        const newMonthFilter = `${tempSelectedMonth} ${tempSelectedYear}`;
        if (months.includes(newMonthFilter)) {
            setMonthFilter(newMonthFilter);
        } else {
             toast({
                variant: 'destructive',
                title: "No Data",
                description: `No salary data found for ${newMonthFilter}.`,
            });
        }
        setIsFilterOpen(false);
    }
    
    const handleExport = () => {
        setExporting(true);
        try {
            const headers = ["Staff ID", "Name", "Role", "Month", "Salary", "Status"];
            const csvContent = [
                headers.join(','),
                ...filteredSalaries.map(item => 
                    [item.id, item.name, item.role, item.month, item.salary, item.status].join(',')
                )
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `salary_report_${monthFilter.replace(' ', '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
                title: 'Export Successful',
                description: `Salary report for ${monthFilter} has been downloaded.`
            });

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Export Failed',
                description: 'An error occurred while generating the report.'
            });
        } finally {
            setExporting(false);
        }
    };


    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:border-primary transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Payroll for {monthFilter}</CardTitle>
                                <Banknote className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{totalSalaryForMonth.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">For {filteredSalaries.length} staff members</p>
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Filter Total Payout</DialogTitle>
                            <DialogDescription>Select a month and year to view the total payroll for that period.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Month</Label>
                                <Select value={tempSelectedMonth} onValueChange={setTempSelectedMonth}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allMonths.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Year</Label>
                                <Select value={tempSelectedYear} onValueChange={setTempSelectedYear}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleFilterUpdate}>Apply Filter</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Staff Salary Details</CardTitle>
                    <CardDescription>View, filter, and manage staff salary payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-muted-foreground"/>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffRoles.map(role => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground"/>
                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Filter by month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map(month => (
                                        <SelectItem key={month} value={month}>{month}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="md:ml-auto flex gap-2">
                            <Button variant="outline" onClick={handleExport} disabled={exporting}>
                                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4" />} 
                                Export Report
                            </Button>
                        </div>
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Staff Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Month</TableHead>
                                <TableHead>Salary Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSalaries.map(staff => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell><Badge variant="secondary">{staff.role}</Badge></TableCell>
                                    <TableCell>{staff.month}</TableCell>
                                    <TableCell>₹{staff.salary.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(staff.status)}>
                                            {staff.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {staff.status === 'Pending' && (
                                            <Button variant="default" size="sm">Pay Now</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
