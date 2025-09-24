

'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QrCode, Edit, Save, Upload, Camera, ScanFace, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const initialStudentData = {
  name: "Demo Student",
  photo: "https://avatar.vercel.sh/Demo%20Student.png",
  class: "10 A",
  rollNumber: "25",
  fatherName: "Demo Father",
  motherName: "Demo Mother",
  phone: "9876543210",
};

export default function SmartAttendancePage() {
  const [studentData, setStudentData] = useState(initialStudentData);
  const [isEditing, setIsEditing] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [registeredFace, setRegisteredFace] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (isCapturing) {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
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
            setIsCapturing(false);
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
  }, [isCapturing, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setStudentData(prev => ({ ...prev, photo: result }));
        setRegisteredFace(result); // Also set as registered face
        toast({
            title: "Photo Uploaded",
            description: "Your profile photo has been updated and registered for attendance."
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const generateQrCode = () => {
    const qrDataString = JSON.stringify({
      studentId: "STU-12345", 
      name: studentData.name,
      class: studentData.class,
      roll: studentData.rollNumber,
    });
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrDataString)}`;
    setQrCodeUrl(url);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    generateQrCode();
    toast({
        title: "Information Saved",
        description: "Your permanent QR code has been generated.",
    });
  }

  const handleCaptureFace = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setRegisteredFace(dataUrl);
            setStudentData(prev => ({...prev, photo: dataUrl})); // Update avatar as well
            setIsCapturing(false); 
             toast({
                title: "Face Registered!",
                description: "Your face has been captured for attendance verification.",
            });
        }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Attendance</CardTitle>
          <CardDescription>
            Manage your QR code and Face Recognition for daily attendance.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
            {/* QR Code Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><QrCode/> QR Code</CardTitle>
                     <CardDescription>
                        {isEditing ? "Save your information to generate a permanent QR code." : "Use this QR code for daily attendance."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                     {qrCodeUrl ? (
                        <Image 
                            src={qrCodeUrl} 
                            alt="Student Attendance QR Code" 
                            width={250} 
                            height={250} 
                            className="rounded-lg shadow-md"
                        />
                        ) : (
                            <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-200 rounded-lg">
                                <p className="text-sm text-muted-foreground text-center p-4">Your unique QR code will appear here after you save your info.</p>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground text-center">This QR code is permanent and unique to you.</p>
                </CardContent>
            </Card>

            {/* Face Registration Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ScanFace/> Face Registration</CardTitle>
                    <CardDescription>Register your face for verification by the school's attendance system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative aspect-video bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                        <video ref={videoRef} className={`w-full aspect-video scale-x-[-1] ${!isCapturing && 'hidden'}`} autoPlay muted playsInline />
                        <canvas ref={canvasRef} className="hidden" />

                        {!isCapturing && !registeredFace && (
                            <div className="text-center p-4">
                                <Button type="button" onClick={() => setIsCapturing(true)}><Camera className="mr-2"/> Start Camera</Button>
                            </div>
                        )}

                        {isCapturing && hasCameraPermission === false && (
                            <Alert variant="destructive" className="w-auto m-4">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>Please allow camera access.</AlertDescription>
                            </Alert>
                        )}
                        
                        {isCapturing && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-4">
                                <Button type="button" onClick={handleCaptureFace} variant="destructive">
                                    <CheckCircle className="mr-2" /> Register Face
                                </Button>
                            </div>
                        )}

                        {registeredFace && !isCapturing && (
                             <Image src={registeredFace} alt="Registered Face" fill className="object-cover scale-x-[-1]" />
                        )}
                    </div>

                    {registeredFace ? (
                        <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300">
                           <CheckCircle className="h-4 w-4 !text-green-500"/>
                           <AlertTitle>Face Registered</AlertTitle>
                           <AlertDescription>
                             Your face is ready for verification. You can re-register if needed.
                           </AlertDescription>
                            <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-green-700 dark:text-green-300" onClick={() => setIsCapturing(true)}>Re-register Face</Button>
                        </Alert>
                    ) : (
                         <Alert variant="destructive">
                           <AlertCircle className="h-4 w-4"/>
                           <AlertTitle>Action Required</AlertTitle>
                           <AlertDescription>
                             Your face is not registered. Please use the camera or upload a photo to complete your profile.
                           </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Keep your details up to date.</CardDescription>
            </div>
            {isEditing ? (
             <Button size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Info
             </Button>
           ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Info
            </Button>
           )}
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={studentData.photo} />
                    <AvatarFallback>{studentData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture-upload">Upload Profile Photo</Label>
                        <Input id="picture-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm"/>
                        <p className="text-xs text-muted-foreground">Or use the camera above to capture a photo.</p>
                    </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={studentData.name} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={studentData.phone} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="class">Class</Label>
                  <Input id="class" name="class" value={studentData.class} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input id="rollNumber" name="rollNumber" value={studentData.rollNumber} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input id="fatherName" name="fatherName" value={studentData.fatherName} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input id="motherName" name="motherName" value={studentData.motherName} onChange={handleInputChange} disabled={!isEditing} />
                </div>
              </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
