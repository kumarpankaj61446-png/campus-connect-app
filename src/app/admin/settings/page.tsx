
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSave = (section: string) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Settings Saved",
                description: `Your ${section} settings have been updated.`,
            });
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Global Settings</h2>
                <p className="text-muted-foreground">Manage global application settings and integrations.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Super Admin Profile</CardTitle>
                        <CardDescription>Manage your personal administrator account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-name">Name</Label>
                            <Input id="admin-name" defaultValue="Super Admin" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-email">Email</Label>
                            <Input id="admin-email" defaultValue="superadmin@campusconnect.com" type="email" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-password">New Password</Label>
                            <Input id="admin-password" type="password" placeholder="Enter a new password..." />
                        </div>
                        <Button onClick={() => handleSave('profile')} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Profile
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Twilio SMS Configuration</CardTitle>
                        <CardDescription>Set up your Twilio account to send SMS notifications and reminders.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="twilio-sid">Account SID</Label>
                            <Input id="twilio-sid" placeholder="ACxxxxxxxxxxxxxxxxx" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twilio-token">Auth Token</Label>
                            <Input id="twilio-token" type="password" placeholder="******************" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twilio-number">Twilio Phone Number</Label>
                            <Input id="twilio-number" placeholder="+15017122661" />
                        </div>
                        <Button onClick={() => handleSave('Twilio')} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Twilio Settings
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
