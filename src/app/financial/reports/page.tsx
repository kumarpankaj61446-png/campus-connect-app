
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Loader2, BarChart, Columns, Check, PlusCircle, Trash2, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const mockIncomeData = [
    { source: 'Tuition Fees', amount: 350000, description: 'Collected for Term 2' },
    { source: 'Transportation Fees', amount: 85000, description: 'Monthly bus fees' },
    { source: 'Late Fee Fines', amount: 12500, description: 'Fines collected this month' },
    { source: 'Event Tickets', amount: 25000, description: 'Annual Day function tickets' },
    { source: 'Miscellaneous', amount: 5000, description: 'Uniform sales, etc.' },
];

const mockExpenseData = [
    { category: 'Staff Salaries', amount: 250000, description: 'Teaching and non-teaching staff' },
    { category: 'Electricity Bill', amount: 45000, description: 'Monthly utility payment' },
    { category: 'Internet & Phone', amount: 12000, description: 'Connectivity bills' },
    { category: 'Maintenance', amount: 35000, description: 'Campus upkeep and repairs' },
    { category: 'Event Costs', amount: 15000, description: 'Annual Day preparation' },
    { category: 'Miscellaneous', amount: 8000, description: 'Office supplies, etc.' },
];

// Mock data for multiple months for comparison
const monthlyFinancialData = {
    'July 2024': { income: 477500, expenses: 365000 },
    'June 2024': { income: 450000, expenses: 350000 },
    'May 2024': { income: 465000, expenses: 355000 },
    'April 2024': { income: 480000, expenses: 370000 },
};

const ReportSection = ({ title, description, data, dataKey, dataLabel }: { title: string, description: string, data: any[], dataKey: string, dataLabel: string }) => {
    const [exporting, setExporting] = useState(false);
    const { toast } = useToast();

    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

    const handleExport = () => {
        setExporting(true);
        try {
            const headers = [Object.keys(data[0])[0].charAt(0).toUpperCase() + Object.keys(data[0])[0].slice(1), "Amount", "Description"];
            const csv = [
                headers.join(','),
                ...data.map(item => Object.values(item).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${title.toLowerCase().replace(/\s+/g, '_')}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
            toast({ title: 'Export Successful', description: `The ${title} has been downloaded.` });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Export Failed' });
        } finally {
            setExporting(false);
        }
    };
    
    const chartData = data.map(item => ({ name: item[dataKey], amount: item.amount }));

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Button variant="outline" onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
                    Export CSV
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="h-64 w-full">
                     <ResponsiveContainer>
                        <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                            <XAxis type="number" tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }}/>
                            <RechartsTooltip 
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                contentStyle={{ background: "hsl(var(--background))" }}
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, dataLabel]}
                            />
                            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/3">{dataLabel}</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount (₹)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                             <TableRow key={index}>
                                <TableCell className="font-medium">{item[dataKey]}</TableCell>
                                <TableCell className="text-muted-foreground text-xs">{item.description}</TableCell>
                                <TableCell className="text-right font-bold">{item.amount.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                         <TableRow className="bg-secondary/50 font-bold">
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell className="text-right text-lg">₹{totalAmount.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

type ComparisonResult = {
    month: string;
    income: number;
    expenses: number;
    net: number;
};

type ComparisonHistoryItem = {
    id: string;
    date: Date;
    data: ComparisonResult[];
};

const ComparisonTool = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [comparisonData, setComparisonData] = useState<ComparisonResult[]>([]);
    const [comparisonHistory, setComparisonHistory] = useState<ComparisonHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleRunComparison = () => {
        if (selectedMonths.length < 2) {
            toast({
                variant: 'destructive',
                title: 'Select More Months',
                description: 'Please select at least two months to run a comparison.',
            });
            return;
        }

        setLoading(true);
        setIsCreateDialogOpen(false);
        // Simulate data fetching and processing
        setTimeout(() => {
            const results = selectedMonths.map(month => {
                const data = monthlyFinancialData[month as keyof typeof monthlyFinancialData];
                return {
                    month,
                    income: data.income,
                    expenses: data.expenses,
                    net: data.income - data.expenses,
                };
            });
            setComparisonData(results);
            setComparisonHistory(prev => [
                { id: new Date().toISOString(), date: new Date(), data: results }, 
                ...prev
            ].slice(0, 7));
            setLoading(false);
            toast({
                title: 'Comparison Complete',
                description: 'Your financial comparison report is ready.',
            });
        }, 1500);
    };

    const handleDownloadComparison = () => {
        try {
            const headers = ["Month", "Total Income (₹)", "Total Expenses (₹)", "Net Balance (₹)"];
            const csv = [
                headers.join(','),
                ...comparisonData.map(d => [d.month, d.income, d.expenses, d.net].join(','))
            ].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "financial_comparison.csv";
            link.click();
            URL.revokeObjectURL(link.href);
            toast({ title: "Export Successful", description: "The comparison data has been downloaded." });
        } catch (e) {
            toast({ variant: 'destructive', title: "Export Failed" });
        }
    };

    const handleLoadFromHistory = (historyItem: ComparisonHistoryItem) => {
        setComparisonData(historyItem.data);
        setIsHistoryDialogOpen(false);
        toast({ title: "History Loaded", description: "The selected comparison has been loaded."});
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart /> Financial Comparison</CardTitle>
                <CardDescription>Compare income, expenses, and net balance across different months.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex gap-4">
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Create New Comparison</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select Months to Compare</DialogTitle>
                                <DialogDescription>Choose at least two months to generate a comparative report.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 grid grid-cols-2 gap-4">
                                {Object.keys(monthlyFinancialData).map(month => (
                                    <div key={month} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={month} 
                                            checked={selectedMonths.includes(month)}
                                            onCheckedChange={(checked) => {
                                                setSelectedMonths(prev => 
                                                    checked ? [...prev, month] : prev.filter(m => m !== month)
                                                )
                                            }}
                                        />
                                        <Label htmlFor={month}>{month}</Label>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleRunComparison} disabled={selectedMonths.length < 2}>Run Comparison</Button>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" disabled={comparisonHistory.length === 0}>
                                <History className="mr-2 h-4 w-4"/> View History ({comparisonHistory.length})
                            </Button>
                        </DialogTrigger>
                         <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Comparison History</DialogTitle>
                                <DialogDescription>Your last 7 comparisons are saved here. Click one to reload it.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-2 max-h-96 overflow-y-auto">
                                {comparisonHistory.length > 0 ? comparisonHistory.map(item => (
                                    <button 
                                        key={item.id} 
                                        className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors"
                                        onClick={() => handleLoadFromHistory(item)}
                                    >
                                        <p className="font-semibold">{item.data.map(d => d.month).join(' vs. ')}</p>
                                        <p className="text-xs text-muted-foreground">{item.date.toLocaleString()}</p>
                                    </button>
                                )) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">No history yet. Run a new comparison to save it here.</p>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading && (
                     <div className="flex items-center justify-center h-48 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="ml-4">Generating comparison...</p>
                    </div>
                )}

                {comparisonData.length > 0 && !loading && (
                    <div className="space-y-4">
                        <div className="flex justify-end gap-2">
                           <Button variant="ghost" size="sm" onClick={() => setComparisonData([])}><Trash2 className="mr-2 h-4 w-4"/>Clear</Button>
                           <Button variant="outline" size="sm" onClick={handleDownloadComparison}><FileDown className="mr-2 h-4 w-4"/>Download Comparison</Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Metric</TableHead>
                                    {comparisonData.map(d => <TableHead key={d.month} className="text-right">{d.month}</TableHead>)}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Total Income</TableCell>
                                    {comparisonData.map(d => <TableCell key={d.month} className="text-right text-green-600">₹{d.income.toLocaleString()}</TableCell>)}
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Total Expenses</TableCell>
                                     {comparisonData.map(d => <TableCell key={d.month} className="text-right text-red-600">₹{d.expenses.toLocaleString()}</TableCell>)}
                                </TableRow>
                                <TableRow className="bg-secondary/50 font-bold">
                                    <TableCell>Net Balance</TableCell>
                                     {comparisonData.map(d => <TableCell key={d.month} className="text-right">₹{d.net.toLocaleString()}</TableCell>)}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


export default function ReportsAndAnalyticsPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Financial Reports & Analytics</CardTitle>
                <CardDescription>Generate detailed financial reports, view trends, and analyze the school's financial health for the current month.</CardDescription>
            </CardHeader>
        </Card>
        
        <div className="grid lg:grid-cols-2 gap-6">
            <ReportSection 
                title="Monthly Income Report"
                description="Breakdown of all revenue streams for this month."
                data={mockIncomeData}
                dataKey="source"
                dataLabel="Income Source"
            />
            <ReportSection 
                title="Monthly Expenses Report"
                description="Breakdown of all expenditures for this month."
                data={mockExpenseData}
                dataKey="category"
                dataLabel="Expense Category"
            />
        </div>
        
        <ComparisonTool />
    </div>
  );
}
