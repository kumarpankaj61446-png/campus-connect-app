

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, MessageSquare, QrCode, BookOpen, Star, BrainCircuit, PencilRuler, Wallet, BarChart2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Feature = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: LucideIcon;
  requiresAdminApproval?: boolean;
};

const initialFeatures: Record<'teacher' | 'student' | 'parent', Feature[]> = {
  teacher: [
    { id: 'teacher-attendance', name: 'Smart Attendance', description: 'Scan QR codes or faces to take attendance.', enabled: true, icon: QrCode },
    { id: 'teacher-homework', name: 'Update Homework', description: 'Assign and update homework for classes.', enabled: true, icon: BookOpen },
    { id: 'teacher-planner', name: 'AI Lesson Planner', description: 'Generate detailed lesson plans with AI.', enabled: true, icon: BrainCircuit },
    { id: 'teacher-ratings', name: 'My Ratings', description: 'View weekly feedback from students.', enabled: true, icon: Star },
    { id: 'teacher-parent-chat', name: 'Parent Chat', description: 'Communicate directly with parents.', enabled: true, icon: MessageSquare },
  ],
  student: [
    { id: 'student-quiz', name: 'AI Quiz Generator', description: 'Practice with unlimited adaptive quizzes.', enabled: true, icon: PencilRuler },
    { id: 'student-doubt-solver', name: 'AI Study Buddy', description: 'Get help with questions and concepts.', enabled: true, icon: Bot },
    { id: 'student-teacher-rating', name: 'Teacher Rating', description: 'Provide weekly feedback on teachers.', enabled: true, icon: Star },
    { id: 'student-chapter-tracking', name: 'Chapter Progress', description: 'Track your learning progress by topic.', enabled: true, icon: BrainCircuit },
  ],
  parent: [
      { id: 'parent-fee-payment', name: 'Online Fee Payments', description: 'Pay school fees through the app.', enabled: true, icon: Wallet },
      { id: 'parent-growth-report', name: 'Growth Reports', description: 'View detailed academic reports.', enabled: true, icon: BarChart2 },
      { id: 'parent-chat', name: 'Chat with Teacher', description: 'Directly message your child\'s teachers.', enabled: true, icon: MessageSquare },
      { id: 'parent-departure-notifications', name: 'Departure Notifications', description: 'New feature from admin to get real-time alerts when your child leaves school.', enabled: false, icon: Bot, requiresAdminApproval: true },
      { id: 'financials-dashboard', name: 'Financials Dashboard', description: 'For principals to manage school finances.', enabled: true, icon: Wallet },
  ]
};

const FeatureToggle = ({ feature, onToggle }: { feature: Feature, onToggle: (id: string) => void }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-start gap-4">
        <feature.icon className="w-6 h-6 text-primary mt-1" />
        <div>
          <Label htmlFor={feature.id} className="text-base font-bold flex items-center gap-2">
            {feature.name}
            {feature.requiresAdminApproval && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">New from Admin</span>
            )}
          </Label>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      </div>
      <Switch
        id={feature.id}
        checked={feature.enabled}
        onCheckedChange={() => onToggle(feature.id)}
        aria-label={`Toggle ${feature.name}`}
      />
    </div>
);


export default function ManageSchoolFeaturesPage() {
  const [features, setFeatures] = useState(initialFeatures);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = (role: 'teacher' | 'student' | 'parent', id: string) => {
    setFeatures(prev => ({
        ...prev,
        [role]: prev[role].map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    }));
  };

  const handleSave = (role: 'teacher' | 'student' | 'parent') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Saved",
        description: `Feature settings for ${role}s have been updated for your school.`,
      });
      console.log(`Saving ${role} feature flags:`, features[role]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Manage Dashboard Features</h2>
        <p className="text-muted-foreground">Enable or disable specific features for different user roles within your school.</p>
      </div>

       <Tabs defaultValue="teacher">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teacher">For Teachers</TabsTrigger>
          <TabsTrigger value="student">For Students</TabsTrigger>
          <TabsTrigger value="parent">For Parents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teacher">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Dashboard Features</CardTitle>
              <CardDescription>Control the tools available to all teachers in your school.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.teacher.map(feature => (
                <FeatureToggle key={feature.id} feature={feature} onToggle={(id) => handleToggle('teacher', id)} />
              ))}
              <div className="flex justify-end pt-4">
                <Button onClick={() => handleSave('teacher')} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Teacher Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="student">
            <Card>
                <CardHeader>
                <CardTitle>Student Dashboard Features</CardTitle>
                <CardDescription>Control the tools available to all students in your school.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {features.student.map(feature => (
                    <FeatureToggle key={feature.id} feature={feature} onToggle={(id) => handleToggle('student', id)} />
                ))}
                <div className="flex justify-end pt-4">
                    <Button onClick={() => handleSave('student')} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Student Settings
                    </Button>
                </div>
                </CardContent>
            </Card>
        </TabsContent>
        
         <TabsContent value="parent">
            <Card>
                <CardHeader>
                <CardTitle>Parent Dashboard Features</CardTitle>
                <CardDescription>Control the tools available to all parents in your school. New features from the admin can be enabled here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {features.parent.map(feature => (
                    <FeatureToggle key={feature.id} feature={feature} onToggle={(id) => handleToggle('parent', id)} />
                ))}
                <div className="flex justify-end pt-4">
                    <Button onClick={() => handleSave('parent')} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Parent Settings
                    </Button>
                </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
