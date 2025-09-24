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
import { Loader2, FileDown, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";

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
          <FileDown className="mr-2 h-4 w-4" />
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
        toast({
          title: "File Ready for Analysis",
          description: `${file.name} has been loaded. Click Analyze to proceed.`,
        });
      }
    }
  };

  useEffect(() => {
    if (state.message === "Success") {
      // We don't reset the form here so the user can see the input and output
    }
  }, [state]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          File Summary Generator
        </CardTitle>
        <CardDescription>
          This tool uses AI to generate a concise summary of an uploaded report.
        </CardDescription>
      </CardHeader>
      <form action={dispatch} ref={formRef}>
        <CardContent className="space-y-4">
           <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="reportText">Report Content</Label>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                </Button>
              </div>
              <Textarea
                id="reportText"
                name="reportText"
                ref={textareaRef}
                className="min-h-[250px]"
                placeholder="Upload a file or paste report content here..."
              />
               {state.errors?.reportText && (
                <p className="text-sm text-destructive">{state.errors.reportText[0]}</p>
              )}
            </div>
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
