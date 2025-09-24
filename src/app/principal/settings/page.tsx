import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode } from "lucide-react";
import Image from "next/image";

export default function SettingsPage() {
    const upiId = "9835517008@paytm";
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=CampusConnect&cu=INR`;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your school's settings and integrations.</p>
      </div>
      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">Payment Gateways</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure how you receive payments from parents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Razorpay Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-key">Razorpay Key ID</Label>
                    <Input id="razorpay-key" placeholder="rzp_test_xxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razorpay-secret">Razorpay Key Secret</Label>
                    <Input id="razorpay-secret" type="password" placeholder="******************" />
                  </div>
                  <Button>Save Razorpay Settings</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">UPI / QR Code Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upi-id">Your UPI ID</Label>
                    <Input id="upi-id" defaultValue={upiId} placeholder="your-school@upi" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Button>Save UPI ID</Button>
                  </div>
                   <div className="p-4 border rounded-md flex justify-center bg-gray-50">
                        <Image src={qrCodeUrl} alt="School UPI QR Code" width={200} height={200} />
                   </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
                <CardTitle>Notification Services</CardTitle>
                <CardDescription>Configure Twilio and SendGrid for SMS and email notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Twilio SMS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="twilio-sid">Account SID</Label>
                            <Input id="twilio-sid" placeholder="ACxxxxxxxxxxxxxxxxx"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twilio-token">Auth Token</Label>
                            <Input id="twilio-token" type="password" placeholder="******************" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="twilio-number">Twilio Phone Number</Label>
                            <Input id="twilio-number" placeholder="+15017122661" />
                        </div>
                        <Button>Save Twilio Settings</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">SendGrid Email</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
                            <Input id="sendgrid-key" type="password" placeholder="******************" />
                        </div>
                        <Button>Save SendGrid Settings</Button>
                    </CardContent>
                </Card>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="general">
             <Card>
                 <CardHeader>
                     <CardTitle>General Settings</CardTitle>
                     <CardDescription>Manage general school information.</CardDescription>
                 </CardHeader>
                <CardContent>
                    <p>General school settings will be here.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
