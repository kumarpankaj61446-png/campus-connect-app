

"use client";

import { useActionState, useEffect, useRef, useState, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { askDoubtSolver, DoubtSolverState } from "@/lib/actions";
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
import { Bot, Loader2, Sparkles, Camera, XCircle, History, Waypoints, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Thinking...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Ask Study Buddy
        </>
      )}
    </Button>
  );
}

export function AIDoubtSolver() {
  const initialState: DoubtSolverState = { history: [] };
  const [state, dispatch] = useActionState(askDoubtSolver, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [shouldEnableCamera, setShouldEnableCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const { toast } = useToast();

  const history = useMemo(() => state.history || [], [state.history]);

  useEffect(() => {
    const pendingQuestion = sessionStorage.getItem('ai-buddy-question');
    if (pendingQuestion && questionTextareaRef.current) {
        questionTextareaRef.current.value = pendingQuestion;
        sessionStorage.removeItem('ai-buddy-question');
    }
  }, []);


  useEffect(() => {
    if (state.message === "Success") {
      formRef.current?.reset();
      setImageData(null);
    }
  }, [state]);

  useEffect(() => {
    const stopCamera = () => {
      if (videoTrackRef.current) {
        videoTrackRef.current.stop();
        videoTrackRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setTorchOn(false);
      setTorchSupported(false);
    };

    if (!shouldEnableCamera) {
      stopCamera();
      return;
    }

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const track = stream.getVideoTracks()[0];
        videoTrackRef.current = track;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);

        const capabilities = track.getCapabilities();
        if (capabilities.torch) {
          setTorchSupported(true);
        }

      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    };

    getCameraPermission();

    return () => {
      stopCamera();
    }
  }, [shouldEnableCamera, toast]);


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
            setImageData(dataUrl);
            setShouldEnableCamera(false); 
        }
    }
  };

  const toggleTorch = async () => {
    if (videoTrackRef.current && torchSupported) {
        try {
            await videoTrackRef.current.applyConstraints({
                advanced: [{ torch: !torchOn }]
            });
            setTorchOn(!torchOn);
        } catch (error) {
            console.error("Error toggling torch:", error);
            toast({
                variant: "destructive",
                title: "Could not toggle flash",
                description: "This feature may not be supported on your device.",
            });
        }
    }
  };

  const handleAskFromHistory = (item: { question: string; image?: string }) => {
    if (formRef.current) {
        const questionTextarea = formRef.current.querySelector('textarea[name="question"]') as HTMLTextAreaElement;
        if(questionTextarea) questionTextarea.value = item.question;
        if(item.image) {
          setImageData(item.image);
        } else {
          setImageData(null);
        }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          AI Study Buddy
        </CardTitle>
        <CardDescription>
          Stuck on a problem? Type your question or use your camera to scan it from a book.
        </CardDescription>
      </CardHeader>
      <form action={dispatch} ref={formRef}>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side: Camera View */}
                <div className="space-y-4">
                    <CardTitle className="text-lg flex items-center gap-2"><Camera className="w-5 h-5"/> Scan your Question</CardTitle>
                    <div className="relative aspect-video bg-secondary rounded-md flex items-center justify-center">
                        <video ref={videoRef} className={`w-full aspect-video rounded-md ${!shouldEnableCamera && 'hidden'}`} autoPlay muted playsInline />
                        <canvas ref={canvasRef} className="hidden" />

                        {!shouldEnableCamera && (
                            <div className="text-center p-4">
                                <p className="text-muted-foreground mb-4">Enable your camera to scan questions.</p>
                                <Button type="button" onClick={() => setShouldEnableCamera(true)}>Enable Camera</Button>
                            </div>
                        )}
                        
                        {shouldEnableCamera && hasCameraPermission === false && (
                            <Alert variant="destructive" className="w-auto m-4">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                    Please allow camera access in your browser.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {shouldEnableCamera && hasCameraPermission && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-4">
                                <Button type="button" onClick={handleCapture}>
                                    <Camera className="mr-2" /> Capture
                                </Button>
                                {torchSupported && (
                                     <Button type="button" variant="outline" size="icon" onClick={toggleTorch} className={torchOn ? "bg-amber-400 text-white" : ""}>
                                        <Zap />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                 {/* Right side: Text Input & Captured Image */}
                <div className="space-y-4">
                     <CardTitle className="text-lg">Or type your question</CardTitle>
                      <div className="space-y-2">
                        <Textarea
                            id="question"
                            name="question"
                            ref={questionTextareaRef}
                            placeholder="e.g., How do I solve for x in 2x + 5 = 15? You can also add notes about your scanned question."
                            className="min-h-[120px]"
                            defaultValue={state.input?.question}
                        />
                        {state.errors?.question && (
                            <p className="text-sm text-destructive">{state.errors.question[0]}</p>
                        )}
                        <input type="hidden" name="image" value={imageData || ""} />
                        <input type="hidden" name="history" value={JSON.stringify(history)} />
                    </div>
                     {imageData && (
                        <div className="relative group w-fit">
                            <p className="text-sm font-medium mb-2">Captured Image:</p>
                            <Image src={imageData} alt="Captured question" width={200} height={150} className="rounded-md border"/>
                            <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6 group-hover:opacity-100 opacity-0 transition-opacity" onClick={() => setImageData(null)}>
                               <XCircle className="text-destructive" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

        </CardContent>
        <CardFooter className="flex-col items-end gap-4">
           <p className="w-full text-sm text-destructive">{state.message !== "Success" && state.message}</p>
           <SubmitButton />
        </CardFooter>
      </form>

      {/* Response Section */}
      {(state.finalAnswer || state.flowchart) && (
        <CardContent className="border-t pt-6 space-y-6">
            {state.finalAnswer && (
                <div>
                    <h3 className="font-bold text-lg mb-2 text-primary">Answer</h3>
                    <div className="prose prose-sm max-w-none text-foreground bg-primary/10 p-4 rounded-md">
                        <p className="text-lg font-semibold">{state.finalAnswer}</p>
                    </div>
                </div>
            )}
            
            {state.solutions && state.solutions.length > 0 && (
                <div>
                    <h3 className="font-bold text-lg mb-2">Step-by-step Solutions</h3>
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {state.solutions.map((solution, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="font-semibold">{solution.title}</AccordionTrigger>
                            <AccordionContent>
                            <div
                                className="prose prose-sm max-w-none text-foreground"
                                dangerouslySetInnerHTML={{ __html: solution.steps.replace(/\n/g, '<br />') }}
                            />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </div>
            )}

            {state.flowchart && (
                 <div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Waypoints /> Flowchart</h3>
                    <pre className="bg-secondary/50 p-4 rounded-md text-sm whitespace-pre-wrap font-mono">
                        <code>{state.flowchart}</code>
                    </pre>
                </div>
            )}
        </CardContent>
      )}
      
       {/* History Section */}
       {history.length > 0 && (
         <CardContent className="border-t pt-6 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><History className="w-5 h-5"/> Recent Questions</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((item, index) => (
                    <button 
                        key={index}
                        onClick={() => handleAskFromHistory(item)}
                        className="w-full text-left p-2 rounded-md hover:bg-secondary transition-colors text-sm text-muted-foreground truncate"
                    >
                       {item.image && <Camera className="inline-block w-4 h-4 mr-2"/>} {item.question}
                    </button>
                ))}
            </div>
         </CardContent>
       )}
    </Card>
  );
}
