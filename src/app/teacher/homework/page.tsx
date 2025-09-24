
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Send, BookOpen, Camera, Sparkles, Loader2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { classes } from '@/lib/mock-data/report-data';
import { subjects } from '@/lib/mock-data/chapter-data';
import { cn } from '@/lib/utils';
import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

export default function HomeworkAssignmentPage() {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [homeworkText, setHomeworkText] = useState('');
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const { toast } = useToast();
    
    // Camera and OCR state
    const [showCamera, setShowCamera] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean|null>(null);
    const [capturedImage, setCapturedImage] = useState<string|null>(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        if (showCamera) {
            const getCameraPermission = async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment' }});
                setHasCameraPermission(true);
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                }
              } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                  variant: 'destructive',
                  title: 'Camera Access Denied',
                  description: 'Please enable camera permissions in your browser settings.',
                });
                setShowCamera(false);
              }
            };
            getCameraPermission();
        } else {
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [showCamera, toast]);

    const handleSubmit = () => {
        if (!selectedClass || !selectedSubject || !homeworkText || !dueDate) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all fields before assigning the homework.',
            });
            return;
        }
        console.log({ class: selectedClass, subject: selectedSubject, task: homeworkText, due: dueDate });
        toast({
            title: 'Homework Assigned!',
            description: `Homework for ${subjects.find(s=>s.id === selectedSubject)?.name}, Class ${classes.find(c=>c.id === selectedClass)?.name} has been assigned.`,
        });
        setSelectedClass('');
        setSelectedSubject('');
        setHomeworkText('');
        setDueDate(undefined);
        setCapturedImage(null);
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(dataUrl);
                setShowCamera(false); 
                handleExtractText(dataUrl);
            }
        }
    };
    
    const handleExtractText = async (imageData: string) => {
        setIsExtracting(true);
        try {
            const result = await extractTextFromImage({ photoDataUri: imageData });
            if (result.extractedText) {
                setHomeworkText(prev => prev ? `${prev}\n${result.extractedText}` : result.extractedText);
                toast({
                    title: "Text Extracted!",
                    description: "The text from the image has been added to the details.",
                });
            } else {
                 throw new Error("AI could not extract text.");
            }
        } catch (error) {
            console.error("Failed to extract text:", error);
            toast({
                variant: "destructive",
                title: "Extraction Failed",
                description: "The AI could not extract text from the image. Please type it manually.",
            });
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen/> Assign Homework</CardTitle>
                    <CardDescription>Create and assign new homework for your classes. You can type the details manually or scan them from a book.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {showCamera ? (
                        <Card>
                             <CardContent className="pt-6">
                                <div className="relative aspect-video bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                                    <video ref={videoRef} className="w-full aspect-video scale-x-[-1]" autoPlay muted playsInline />
                                    {hasCameraPermission === false && (
                                        <Alert variant="destructive">
                                            <AlertTitle>Camera Access Required</AlertTitle>
                                        </Alert>
                                    )}
                                </div>
                                <div className="flex justify-center gap-4 mt-4">
                                     <Button onClick={handleCapture} disabled={!hasCameraPermission}>
                                        <Camera className="mr-2 h-4 w-4" /> Capture Photo
                                    </Button>
                                     <Button variant="outline" onClick={() => setShowCamera(false)}>
                                        Cancel
                                    </Button>
                                </div>
                                 <canvas ref={canvasRef} className="hidden" />
                             </CardContent>
                        </Card>
                    ) : (
                         <>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="class-select">Select Class</Label>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger id="class-select"><SelectValue placeholder="Choose a class" /></SelectTrigger>
                                        <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject-select">Select Subject</Label>
                                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                        <SelectTrigger id="subject-select"><SelectValue placeholder="Choose a subject" /></SelectTrigger>
                                        <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="homework-text">Homework Details</Label>
                                    <Button variant="outline" size="sm" onClick={() => setShowCamera(true)}>
                                        <Camera className="mr-2 h-4 w-4" /> Scan from Book
                                    </Button>
                                </div>
                                 <div className="relative">
                                    <Textarea 
                                        id="homework-text" 
                                        placeholder="e.g., Complete exercises 1-10 on page 56 of the textbook." 
                                        className="min-h-[120px]"
                                        value={homeworkText}
                                        onChange={(e) => setHomeworkText(e.target.value)}
                                    />
                                     {isExtracting && (
                                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span className="ml-2">Extracting text...</span>
                                        </div>
                                    )}
                                </div>
                                {capturedImage && !isExtracting && (
                                    <div className="relative w-48 mt-2 group">
                                        <Image src={capturedImage} width={192} height={108} alt="Captured homework" className="rounded-md border" />
                                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setCapturedImage(null)}>
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due-date">Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} id="due-date" className={cn("w-[280px] justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus /></PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSubmit}><Send className="mr-2 h-4 w-4" /> Assign Homework</Button>
                            </div>
                         </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
