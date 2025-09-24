
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, Search, FileText, FileSpreadsheet, FileArchive, MoreVertical, Download, Trash2, Loader2, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadButton } from "@/components/ui/upload-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const mockSchools = [
    { id: "all", name: "All Schools" },
    { id: "SCH001", name: "Greenwood High" },
    { id: "SCH002", name: "Oakridge International" },
    { id: "SCH003", name: "Delhi Public School" },
];

const mockFiles = [
  { name: "student_grades_q2.xlsx", type: "Excel", size: "1.2 MB", schoolId: "SCH001", tag: "Academics", uploaded: "2024-07-28", uploader: "Demo Teacher" },
  { name: "school_budget_2024.pdf", type: "PDF", size: "850 KB", schoolId: "SCH001", tag: "Finance Data", uploaded: "2024-07-27", uploader: "Demo Principal" },
  { name: "annual_report_2023.docx", type: "Word", size: "2.5 MB", schoolId: "SCH002", tag: "Reports", uploaded: "2024-07-26", uploader: "Demo Principal" },
  { name: "enrollment_data.zip", type: "ZIP", size: "5.8 MB", schoolId: "SCH003", tag: "Admissions", uploaded: "2024-07-25", uploader: "Admin Staff" },
  { name: "event_photos_sports_day.zip", type: "ZIP", size: "25.3 MB", schoolId: "SCH001", tag: "Events", uploaded: "2024-07-24", uploader: "Demo Teacher" },
  { name: "q3_fee_structure.pdf", type: "PDF", size: "450 KB", schoolId: "SCH002", tag: "Finance Data", uploaded: "2024-07-23", uploader: "Demo Principal" },
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

export default function AdminFileManagerPage() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadSchool, setUploadSchool] = useState('');
  const [uploadFileType, setUploadFileType] = useState('normal');
  const { toast } = useToast();
  
  const filteredFiles = useMemo(() => {
    if (selectedSchool === 'all') {
        return mockFiles;
    }
    return mockFiles.filter(file => file.schoolId === selectedSchool);
  }, [selectedSchool]);

  const handleDownload = (fileName: string) => {
    setIsDownloading(true);
    toast({
        title: "Download Started",
        description: `${fileName} is being downloaded.`,
    });
    setIsDownloading(null);
  };
  
  const getSchoolName = (schoolId: string) => {
    return mockSchools.find(s => s.id === schoolId)?.name || schoolId;
  }
  
  const handleFileUpload = (file: File) => {
    const schoolName = getSchoolName(uploadSchool);
    toast({
        title: "File Upload Started",
        description: `Uploading "${file.name}" for ${schoolName} as a ${uploadFileType} file.`,
    });
    // Here you would handle the actual file upload logic
    setIsUploadDialogOpen(false); // Close dialog after upload starts
  };

  return (
    <div className="space-y-6">
       <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Global File Manager</h2>
                <DialogTrigger asChild>
                    <Button>
                        <Upload className="mr-2 h-4 w-4" /> Upload New File
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a New File</DialogTitle>
                    <DialogDescription>
                        Specify the school and file type before uploading.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="upload-school">Select School</Label>
                        <Select value={uploadSchool} onValueChange={setUploadSchool}>
                            <SelectTrigger id="upload-school">
                                <SelectValue placeholder="Select a school for this file" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockSchools.filter(s => s.id !== 'all').map(school => (
                                    <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                         <Label>File Type</Label>
                         <RadioGroup value={uploadFileType} onValueChange={setUploadFileType} className="flex gap-4">
                            <Label htmlFor="type-normal" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent has-[input:checked]:border-primary">
                                <RadioGroupItem value="normal" id="type-normal" /> Normal File
                            </Label>
                             <Label htmlFor="type-financial" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent has-[input:checked]:border-primary">
                                <RadioGroupItem value="financial" id="type-financial" /> Financial File
                            </Label>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <UploadButton onFileSelect={handleFileUpload} disabled={!uploadSchool}>
                        Select File & Upload
                    </UploadButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>


      <Card>
        <CardHeader>
          <CardTitle>All School Files</CardTitle>
          <CardDescription>Manage, preview, and download files from all subscribed schools.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search files across all schools..." className="pl-8" />
            </div>
            <div className="flex items-center gap-2">
                 <Building className="h-4 w-4 text-muted-foreground" />
                 <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Filter by school" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockSchools.map(school => (
                             <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <span>{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getSchoolName(file.schoolId)}
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
