
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, Search, FileText, FileSpreadsheet, FileArchive, MoreVertical, Download, Eye, Trash2, Loader2, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { UploadButton } from "@/components/ui/upload-button";
import { ToastAction } from "@/components/ui/toast";

const mockFiles = [
  { name: "student_grades_q2.xlsx", type: "Excel", size: "1.2 MB", tag: "Academics", uploaded: "2024-07-28", uploader: "Demo Teacher" },
  { name: "school_budget_2024.pdf", type: "PDF", size: "850 KB", tag: "Finance Data", uploaded: "2024-07-27", uploader: "Demo Principal" },
  { name: "annual_report_2023.docx", type: "Word", size: "2.5 MB", tag: "Reports", uploaded: "2024-07-26", uploader: "Demo Principal" },
  { name: "enrollment_data.zip", type: "ZIP", size: "5.8 MB", tag: "Admissions", uploaded: "2024-07-25", uploader: "Admin Staff" },
  { name: "event_photos_sports_day.zip", type: "ZIP", size: "25.3 MB", tag: "Events", uploaded: "2024-07-24", uploader: "Demo Teacher" },
  { name: "q3_fee_structure.pdf", type: "PDF", size: "450 KB", tag: "Finance Data", uploaded: "2024-07-23", uploader: "Demo Principal" },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "Excel":
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    case "PDF":
      return <FileText className="w-5 h-5 text-red-600" />;
    case "Word":
      return <FileText className="w-5 h-5 text-blue-600" />;
    case "ZIP":
      return <FileArchive className="w-5 h-5 text-yellow-600" />;
    default:
      return <FileText className="w-5 h-5 text-gray-500" />;
  }
};

export default function FileManagerPage() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = (fileName: string) => {
    setIsDownloading(fileName);
    setTimeout(() => {
        setIsDownloading(null);
        toast({
            title: "Download Started",
            description: `${fileName} is being downloaded.`,
        });
    }, 1500);
  };
  
  const handleFileUpload = (file: File) => {
    toast({
        title: "File Upload Started",
        description: `Your file "${file.name}" is being uploaded.`,
        action: (
            <ToastAction altText="Add to school data" onClick={() => {
                toast({
                    title: "Processing Started",
                    description: `AI is now processing "${file.name}" to add to your school data.`,
                });
            }}>
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4"/> Add to your school data
                </div>
            </ToastAction>
        ),
    });
    // In a real application, you'd handle the multipart form upload to your backend.
    // If the file is a zip, you could have a serverless function to unzip it.
    if (file.type === 'application/zip') {
        toast({
            title: "ZIP File Detected",
            description: `AI will attempt to automatically unzip "${file.name}" after upload.`,
        });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">File Manager</h2>
        <UploadButton onFileSelect={handleFileUpload}>
          <Upload className="mr-2 h-4 w-4" /> Upload File
        </UploadButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Files</CardTitle>
          <CardDescription>Manage, preview, and download all school-related files.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search files..." className="pl-8" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFiles.map((file) => (
                <TableRow key={file.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <span>{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={file.tag === "Finance Data" ? "default" : "secondary"}>
                      {file.tag}
                    </Badge>
                  </TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.uploader}</TableCell>
                  <TableCell>{file.uploaded}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(file.name)}>
                          {isDownloading === file.name ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4" />}
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
