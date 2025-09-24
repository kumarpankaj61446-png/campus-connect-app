
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { School, Info, Users, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { SignUpForm } from '@/components/auth/SignUpForm';

const proPrice = 25;
const premiumPrice = 55;

export default function PrincipalSignupPage() {
    const [plan, setPlan] = useState('pro');
    const [students, setStudents] = useState(100);

    const pricePerStudent = plan === 'pro' ? proPrice : premiumPrice;
    const totalPrice = students * pricePerStudent;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader className="text-center">
                    <Link href="/" className="flex items-center justify-center gap-2 font-bold text-lg mb-2">
                        <School className="h-6 w-6 text-primary" />
                        <span>CampusConnect</span>
                    </Link>
                    <CardTitle className="text-3xl">Register Your School</CardTitle>
                    <CardDescription>
                        Complete the steps below to create your school's dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 p-8">
                    {/* Left Side: School Info & Admin Account */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-primary"/> Your Admin Account</h3>
                            <p className="text-sm text-muted-foreground">First, create your personal principal account.</p>
                        </div>
                        <SignUpForm />
                        
                        <div className="pt-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Info className="w-5 h-5 text-primary"/> School Information</h3>
                             <p className="text-sm text-muted-foreground mb-4">Next, provide some basic details about your school.</p>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="school-name">School Name</Label>
                                    <Input id="school-name" placeholder="e.g., Greenwood High" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="school-address">School Address</Label>
                                    <Input id="school-address" placeholder="123 Education Lane, City" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Plan & Payment */}
                    <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary"/> Plan & Payment</h3>
                            <p className="text-sm text-muted-foreground">Finally, choose your plan and complete the payment.</p>
                        </div>

                        {/* Plan Selection */}
                        <RadioGroup defaultValue="pro" value={plan} onValueChange={setPlan}>
                            <div className="grid grid-cols-2 gap-4">
                                <Label htmlFor="pro-plan" className={`border rounded-md p-4 cursor-pointer ${plan === 'pro' ? 'border-primary ring-2 ring-primary' : ''}`}>
                                    <RadioGroupItem value="pro" id="pro-plan" className="sr-only" />
                                    <span className="font-bold block">Pro Plan</span>
                                    <span className="text-sm">₹{proPrice}/student</span>
                                </Label>
                                <Label htmlFor="premium-plan" className={`border rounded-md p-4 cursor-pointer ${plan === 'premium' ? 'border-primary ring-2 ring-primary' : ''}`}>
                                    <RadioGroupItem value="premium" id="premium-plan" className="sr-only" />
                                    <span className="font-bold block">Premium Plan</span>
                                    <span className="text-sm">₹{premiumPrice}/student</span>
                                </Label>
                            </div>
                        </RadioGroup>

                        {/* Student Calculator */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="students-slider">Number of Students</Label>
                                <span className="font-bold text-lg">{students}</span>
                            </div>
                            <Slider
                                id="students-slider"
                                min={50}
                                max={5000}
                                step={50}
                                value={[students]}
                                onValueChange={(value) => setStudents(value[0])}
                            />
                            <p className="text-xs text-muted-foreground text-center">Slide to select the number of students in your school.</p>
                        </div>

                        {/* Total Price */}
                        <Card className="bg-secondary/50">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-muted-foreground">Total Estimated Price</p>
                                    <p className="text-2xl font-bold">₹{totalPrice.toLocaleString()}<span className="text-sm font-normal">/month</span></p>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Button className="w-full" size="lg">
                            Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            After successful payment, you will receive a unique School Code and your dashboard will be activated.
                        </p>
                    </div>
                </CardContent>
                 <div className="mt-4 text-center text-sm p-4 border-t">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
            </Card>
        </div>
    );
}
