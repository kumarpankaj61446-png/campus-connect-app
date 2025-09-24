
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, RefreshCw, MessageSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockOverageData = [
    { schoolName: 'Greenwood High', plan: 'Premium', additionalStudents: 50, dueAmount: 2750 },
    { schoolName: 'Global Edge School', plan: 'Pro', additionalStudents: 120, dueAmount: 3000 },
];

export default function ManagePricingPage() {
  const [proPrice, setProPrice] = useState(25);
  const [premiumPrice, setPremiumPrice] = useState(55);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [reminding, setReminding] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    setLoading(true);
    toast({
      title: "Success",
      description: "Pricing plans have been updated.",
    });
    setLoading(false);
  };
  
  const handleSync = () => {
    setSyncing(true);
    toast({
        title: "Sync Complete",
        description: "Data has been synced with the AI billing system.",
    });
    setSyncing(false);
  };

  const handleSendReminder = (schoolName: string) => {
    setReminding(schoolName);
    toast({
        title: "Reminder Sent",
        description: `A payment reminder has been sent to ${schoolName}.`,
    });
    setReminding(null);
  }
  
  const handleRemindAll = () => {
    setReminding('all');
    toast({
        title: "Bulk Reminders Sent",
        description: "AI is sending reminders to all schools with pending fees.",
    });
    setReminding(null);
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Manage Pricing</h2>
        <p className="text-muted-foreground">Adjust the monthly per-student pricing for your subscription plans.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Changes here will be reflected on the public pricing page and for new school registrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">Pro Plan</h3>
                <div className="space-y-2">
                  <Label htmlFor="pro-price">Price per Student (per month)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">₹</span>
                    <Input
                      id="pro-price"
                      type="number"
                      value={proPrice}
                      onChange={(e) => setProPrice(Number(e.target.value))}
                      className="text-xl font-bold w-24"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">This is the price for the basic feature set.</p>
              </div>
            </Card>
            <Card className="p-6 border-primary ring-2 ring-primary">
               <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary">Premium Plan</h3>
                <div className="space-y-2">
                  <Label htmlFor="premium-price">Price per Student (per month)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">₹</span>
                    <Input
                      id="premium-price"
                      type="number"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(Number(e.target.value))}
                      className="text-xl font-bold w-24"
                    />
                  </div>
                </div>
                 <p className="text-sm text-muted-foreground">This is the price for the complete school management suite.</p>
              </div>
            </Card>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Pricing"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2"><Bot /> Pending Additional Student Fees</CardTitle>
                <CardDescription>This list is automatically generated by the AI when a school exceeds its student limit.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleSync} disabled={syncing}>
                    {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Sync with AI
                </Button>
                 <Button onClick={handleRemindAll} disabled={!!reminding}>
                    {reminding === 'all' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                    Remind All Schools
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Additional Students</TableHead>
                        <TableHead>Amount Due (₹)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockOverageData.map(item => (
                         <TableRow key={item.schoolName}>
                            <TableCell className="font-medium">{item.schoolName}</TableCell>
                            <TableCell>{item.plan}</TableCell>
                            <TableCell>{item.additionalStudents}</TableCell>
                            <TableCell className="font-bold">{item.dueAmount.toLocaleString()}</TableCell>
                             <TableCell className="text-right">
                                <Button size="sm" variant="outline" onClick={() => handleSendReminder(item.schoolName)} disabled={!!reminding}>
                                    {reminding === item.schoolName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                                    Send Reminder
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
