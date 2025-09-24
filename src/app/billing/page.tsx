
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { School, Users, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';

const proPrice = 25;
const premiumPrice = 55;

export default function BillingPage() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'pro';
    const [students, setStudents] = useState(500);

    const pricePerStudent = plan === 'pro' ? proPrice : premiumPrice;
    const totalPrice = students * pricePerStudent;
    const upiId = '9835517008@paytm'; // As per user request
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=CampusConnect&am=${totalPrice}&cu=INR&tn=CampusConnect%20Subscription`;


    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader className="text-center">
                    <Link href="/" className="flex items-center justify-center gap-2 font-bold text-lg mb-2">
                        <School className="h-6 w-6 text-primary" />
                        <span>CampusConnect</span>
                    </Link>
                    <CardTitle className="text-3xl">Complete Your Purchase</CardTitle>
                    <CardDescription>
                        You've selected the <span className="font-bold text-primary capitalize">{plan}</span> plan. Calculate your price and proceed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 p-8">
                     {/* Left Side: Calculator */}
                    <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-primary"/> Select Number of Students</h3>
                            <p className="text-sm text-muted-foreground">Slide to select the total number of students in your school.</p>
                        </div>
                        
                        <div className="space-y-4 pt-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="students-slider">Number of Students</Label>
                                <span className="font-bold text-2xl">{students}</span>
                            </div>
                            <Slider
                                id="students-slider"
                                min={50}
                                max={5000}
                                step={50}
                                value={[students]}
                                onValueChange={(value) => setStudents(value[0])}
                            />
                        </div>

                        <Card className="bg-secondary/50">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-muted-foreground">Total Estimated Price</p>
                                        <p className="text-sm text-muted-foreground">{students} students x ₹{pricePerStudent}</p>
                                    </div>
                                    <p className="text-3xl font-bold">₹{totalPrice.toLocaleString()}<span className="text-sm font-normal">/month</span></p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Payment */}
                    <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary"/> Pay via UPI</h3>
                            <p className="text-sm text-muted-foreground">Scan the QR code with any UPI app to complete the payment.</p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                            <Image 
                                src={qrCodeUrl}
                                alt="UPI QR Code"
                                width={250}
                                height={250}
                            />
                            <p className="mt-4 font-semibold">UPI ID: {upiId}</p>
                            <p className="text-sm text-muted-foreground">Amount: ₹{totalPrice.toLocaleString()}</p>
                        </div>
                        
                        <div className="space-y-2">
                             <Button asChild className="w-full" size="lg">
                                <Link href="/signup/principal">
                                    I have paid, complete registration <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/#pricing">
                                     <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                                </Link>
                            </Button>
                             <p className="text-xs text-muted-foreground text-center pt-2">
                                After successful payment, click the button above to create your school's dashboard.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
