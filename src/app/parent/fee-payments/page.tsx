
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockInvoices = [
  { id: "INV001", description: "Tuition Fee - Term 1", amount: 15000, dueDate: "2024-08-15", status: "Pending" },
  { id: "INV002", description: "Transportation Fee - July", amount: 2500, dueDate: "2024-08-10", status: "Pending" },
  { id: "INV003", description: "Exam Fee - Mid Term", amount: 1200, dueDate: "2024-08-05", status: "Paid" },
  { id: "INV004", description: "Tuition Fee - Term 2", amount: 15000, dueDate: "2024-12-15", status: "Upcoming" },
  { id: "INV005", description: "Sports Fee", amount: 800, dueDate: "2024-07-20", status: "Paid" },
];

export default function FeePaymentsPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const { toast } = useToast();
  
  const totalPending = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleDownload = () => {
    setIsDownloading(true);
    // CSV generation is fast, so we can do it directly.
    const headers = ["Invoice ID", "Description", "Amount", "Due Date", "Status"];
    const csvContent = [
      headers.join(','),
      ...invoices.map(inv => 
        [inv.id, `"${inv.description}"`, inv.amount, inv.dueDate, inv.status].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'payment_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "Your payment history report is being downloaded.",
    });
    setIsDownloading(false);
  };

  const handleNotify = (message: string) => {
    toast({
        title: "Request Sent to Finance Department",
        description: `The school has been notified that: "${message}". You will receive a notification once it has been reviewed.`,
    });
  };

  const handlePayTotal = () => {
    setIsPaying(true);
    // Simulate payment processing
    setInvoices(prevInvoices => 
        prevInvoices.map(inv => 
            inv.status === 'Pending' ? { ...inv, status: 'Paid' } : inv
        )
    );
    toast({
        title: "Payment Successful",
        description: `Successfully paid ₹${totalPending.toLocaleString()}.`,
    });
    setIsPaying(false);
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fee Payments</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Pending Amount</span>
              <span className="font-bold text-lg">₹{totalPending.toLocaleString()}</span>
            </div>
             <Button className="w-full" onClick={handlePayTotal} disabled={totalPending === 0 || isPaying}>
                {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CreditCard className="mr-2 h-4 w-4" />}
                {isPaying ? 'Processing...' : 'Pay Total Pending'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Clicking 'Pay' will redirect you to our secure payment gateway.
            </p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>View and pay your pending invoices. You can also notify the school about payment status.</CardDescription>
            </CardHeader>
             <CardContent>
                <div className="flex justify-end mb-4">
                    <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4" />}
                        Download History
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount (₹)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                            <Badge
                            variant={
                                invoice.status === "Paid" ? "default" : 
                                invoice.status === "Pending" ? "destructive" : "secondary"
                            }
                            className="capitalize"
                            >
                            {invoice.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">{invoice.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                            {invoice.status === "Pending" && (
                                <>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <Bell className="mr-2 h-4 w-4" />
                                            Notify
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => handleNotify('Fee has been paid')}>Fee has been paid</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleNotify('Will pay by tomorrow')}>Will pay by tomorrow</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleNotify('Will pay soon')}>Will pay soon</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="outline" size="sm">Pay Now</Button>
                                </>
                            )}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
