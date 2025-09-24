
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Palette, Phone } from 'lucide-react';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';

export default function FinancialSettingsPage() {
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSaveChanges = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Settings Saved",
                description: "Your profile information has been updated.",
            });
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User /> Profile Settings</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="Financial Officer" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="finance@example.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" type="password" placeholder="Enter a new password" />
                        </div>
                        <Button onClick={handleSaveChanges} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Palette/> Theme Preference</CardTitle>
                        <CardDescription>Choose how you want the dashboard to look.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue={theme} onValueChange={setTheme} className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light">Light Mode</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <Label htmlFor="dark">Dark Mode</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="system" />
                                <Label htmlFor="system">System Default</Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>If you encounter any issues or need assistance, please contact the Super Admin.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Pankaj kumar manjhi</p>
                        <p className="text-sm text-muted-foreground">Super Admin</p>
                    </div>
                    <Button asChild>
                        <a href="tel:9835517008">
                           <Phone className="mr-2 h-4 w-4"/> Call Admin
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
