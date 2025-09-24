
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, QrCode, ScanFace, Check, AlertCircle, SwitchCamera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockStudent = {
  name: "Anjali Sharma",
  class: "10 A",
  rollNumber: "25",
  photo: "https://avatar.vercel.sh/Anjali%20Sharma.png",
};

type FacingMode = "user" | "environment";

export default function SmartAttendancePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [lastScanned, setLastScanned] = useState<any | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const stopCameraStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    const getCameraPermission = async () => {
      stopCameraStream(); // Stop any existing stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
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
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
      stopCameraStream();
    }
  }, [toast, facingMode, stopCameraStream]);

  const handleScan = () => {
    // In a real app, you would use a library like html5-qrcode or a face recognition API.
    // Here, we just simulate a successful scan.
    setLastScanned(null); // Clear previous scan
    setTimeout(() => {
      const now = new Date();
      setLastScanned({ ...mockStudent, time: now.toLocaleTimeString() });
       toast({
        title: "Attendance Marked",
        description: `${mockStudent.name} has been marked present.`,
      });
    }, 1000);
  };
  
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="space-y-6">
       <Card>
         <CardHeader>
           <CardTitle>Smart Attendance Scanner</CardTitle>
           <CardDescription>
             Use the camera to scan student QR codes or faces to take daily attendance.
           </CardDescription>
         </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Camera /> Camera View</CardTitle>
                <Button variant="outline" size="icon" onClick={toggleCamera} title="Switch Camera">
                    <SwitchCamera className="w-5 h-5"/>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="relative aspect-video bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                    <video ref={videoRef} className="w-full aspect-video scale-x-[-1]" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}
                    {hasCameraPermission && (
                        <div className="absolute inset-0 border-4 border-primary/50 rounded-md pointer-events-none" />
                    )}
                </div>
                 <Tabs defaultValue="qr" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="qr"><QrCode className="mr-2"/>QR Scan Mode</TabsTrigger>
                        <TabsTrigger value="face"><ScanFace className="mr-2"/>Face Scan Mode</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Button className="w-full mt-4" onClick={handleScan} disabled={!hasCameraPermission}>
                    Scan Now
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Last Scanned Student</CardTitle>
                 <CardDescription>Details of the most recent student marked present.</CardDescription>
            </CardHeader>
            <CardContent>
                {lastScanned ? (
                     <div className="flex flex-col items-center text-center gap-4 p-6 bg-green-500/10 border border-green-500/50 rounded-lg">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                            <AvatarImage src={lastScanned.photo} />
                            <AvatarFallback>{lastScanned.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-xl font-bold">{lastScanned.name}</p>
                            <p className="text-muted-foreground">{lastScanned.class} | Roll: {lastScanned.rollNumber}</p>
                        </div>
                        <div className="text-green-700 dark:text-green-300 font-semibold flex items-center gap-2">
                            <Check /> Marked Present at {lastScanned.time}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground p-6 border-2 border-dashed rounded-lg">
                        <p>Scan a student to see their details here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
