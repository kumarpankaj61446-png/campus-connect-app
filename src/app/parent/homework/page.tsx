
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileDown, Loader2 } from 'lucide-react';

const mockHomework = [
  { subject: "Mathematics", task: "Complete Algebra exercise 5.2", dueDate: "2024-08-10", status: "Pending" },
  { subject: "Science", task: "Prepare a presentation on Photosynthesis", dueDate: "2024-08-12", status: "Pending" },
  { subject: "History", task: "Read chapter 3 of Modern India", dueDate: "2024-08-15", status: "Pending" },
  { subject: "English", task: "Essay on 'My Summer Vacation'", dueDate: "2024-08-05", status: "Submitted" },
  { subject: "Physics", task: "Lab report for experiment 3", dueDate: "2024-08-02", status: "Graded" },
  { subject: "Hindi", task: "Poem recitation practice", dueDate: "2024-07-30", status: "Overdue" },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Submitted":
        case "Graded":
            return "default";
        case "Pending":
            return "secondary";
        case "Overdue":
            return "destructive";
        default:
            return "outline";
    }
}

export default function HomeworkPage() {
  const childName = "Anjali Sharma";
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    setIsDownloading(true);
    try {
        const headers = ["Subject", "Task", "Due Date", "Status"];
        const csvContent = [
            headers.join(','),
            ...mockHomework.map(hw => [
                hw.subject,
                `"${hw.task.replace(/"/g, '""')}"`, // Handle quotes in task description
                hw.dueDate,
                hw.status
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'homework_assignments.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
            title: "Download Started",
            description: "Your homework assignments report has been downloaded.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "Could not generate the homework report.",
        });
    } finally {
        setIsDownloading(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Homework Assignments</CardTitle>
              <CardDescription>
                Showing all homework assignments for {childName}.
              </CardDescription>
            </div>
             <Button onClick={handleDownload} disabled={isDownloading} variant="outline">
                {isDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <FileDown className="mr-2 h-4 w-4" />
                )}
                Export to CSV
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHomework.map((hw) => (
                <TableRow key={hw.task}>
                  <TableCell className="font-medium">{hw.subject}</TableCell>
                  <TableCell>{hw.task}</TableCell>
                  <TableCell>{hw.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(hw.status)}>
                      {hw.status}
                    </Badge>
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
