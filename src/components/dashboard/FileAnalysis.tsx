
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateReport, ReportState } from "@/lib/report-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileDown, Upload, Camera, Sparkles, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze and Summarize
        </>
      )}
    </Button>
  );
}

export function FileAnalysis() {
  const initialState: ReportState = {};
  const [state, dispatch] = useActionState(generateReport, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean|null>(null);
  const [capturedImage, setCapturedImage] = useState<string|null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const sampleReport = `
Student Performance Report
Student Name: Anjali Sharma
Class: 10 A
Date: 2024-07-25

Overall Performance: Excellent

Subject-wise Performance:
- Mathematics: 95/100. Consistently scores high. Grasps new concepts quickly.
- Science: 92/100. Shows great interest in practical experiments.
- English: 88/100. Good comprehension skills, but needs to work on creative writing.
- Social Studies: 90/100. Actively participates in class discussions.
- Hindi: 85/100. Good, but can improve on grammar.

Attendance: 98%

Teacher's Remarks:
Anjali is a bright and dedicated student. She is a quick learner and has a positive attitude towards her studies. We recommend she reads more books to improve her creative writing skills in English.
  `.trim();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For this prototype, we'll simulate reading the file by using the sample text.
      // In a real app, you would use FileReader to read the file content.
      if (textareaRef.current) {
        textareaRef.current.value = sampleReport;
        setCapturedImage(null); // Clear any captured image
        toast({
          title: "File Ready for Analysis",
          description: `${file.name} has been loaded. Click Analyze to proceed.`,
        });
      }
    }
  };

  useEffect(() => {
    // If text was extracted, update the textarea
    if (state.extractedText && textareaRef.current) {
      textareaRef.current.value = state.extractedText;
    }
  }, [state.extractedText]);

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
                if (textareaRef.current) textareaRef.current.value = ''; // Clear textarea
                setShowCamera(false); 
            }
        }
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          File Summary Generator
        </CardTitle>
        <CardDescription>
          This tool uses AI to generate a concise summary of an uploaded or scanned report.
        </CardDescription>
      </CardHeader>
      <form action={dispatch} ref={formRef}>
        <CardContent className="space-y-4">
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
                <div className="space-y-2">
                    <div className="flex justify-between items-center gap-4">
                        <Label htmlFor="reportText">Report Content</Label>
                        <div className="flex gap-2">
                             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                             <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload File
                            </Button>
                             <Button type="button" variant="outline" onClick={() => setShowCamera(true)}>
                                <Camera className="mr-2 h-4 w-4" />
                                Scan File
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        id="reportText"
                        name="reportText"
                        ref={textareaRef}
                        className="min-h-[250px]"
                        placeholder="Upload a file, scan a document, or paste report content here..."
                        defaultValue={state.input?.reportText}
                    />
                    <input type="hidden" name="imageData" value={capturedImage || ""} />
                    {state.errors?.reportText && (
                        <p className="text-sm text-destructive">{state.errors.reportText[0]}</p>
                    )}
                     {capturedImage && (
                        <div className="relative group w-fit mt-2">
                            <p className="text-sm font-medium mb-2">Scanned Image (will be analyzed by AI):</p>
                            <Image src={capturedImage} alt="Captured report" width={200} height={150} className="rounded-md border"/>
                            <Button variant="ghost" size="icon" className="absolute -top-3 -right-3 h-7 w-7 bg-background rounded-full group-hover:opacity-100 opacity-20 transition-opacity" onClick={() => setCapturedImage(null)}>
                                <XCircle className="text-destructive" />
                            </Button>
                        </div>
                    )}
                    </div>
                )}
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-4">
           <p className="text-sm text-destructive w-full">{state.message !== "Success" && state.message}</p>
           <SubmitButton />
        </CardFooter>
      </form>

      {state.summary && (
        <CardContent className="border-t pt-6">
            <h3 className="font-semibold mb-2">Generated Summary:</h3>
            <div className="prose prose-sm max-w-none text-foreground bg-secondary p-4 rounded-md">
                <p>{state.summary}</p>
            </div>
        </CardContent>
      )}
    </Card>
  );
}
