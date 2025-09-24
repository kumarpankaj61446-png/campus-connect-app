
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, Wallet, BarChart3, Bot, FileText, Folder } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const initialFeatures = [
  { id: 'ai-buddy', name: 'AI Study Buddy', description: 'Personalized AI assistant for students.', enabled: true, icon: Bot },
  { id: 'financials', name: 'Financials Dashboard', description: 'For principals to manage school finances.', enabled: true, icon: Wallet },
  { id: 'growth-reports', name: 'Growth Reports', description: 'Advanced analytics for student and school performance.', enabled: true, icon: BarChart3 },
  { id: 'file-manager', name: 'File Manager', description: 'Cloud storage for school documents.', enabled: true, icon: Folder },
  { id: 'report-generation', name: 'AI Report Summarization', description: 'AI-powered summary for reports.', enabled: true, icon: FileText },
];

export default function ManageFeaturesPage() {
  const [features, setFeatures] = useState(initialFeatures);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call to save feature flags
    console.log("Saving feature flags:", features);
    toast({
      title: "Success",
      description: "Feature flags have been updated.",
    });
    setLoading(false);
  };
  
  const Icon = ({ icon: IconComponent }: { icon: LucideIcon }) => {
    return <IconComponent className="w-6 h-6 text-primary" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Control Features</h2>
        <p className="text-muted-foreground">Enable or disable application modules. Changes will apply to all schools.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>Use these toggles to control which features are available in the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {features.map(feature => (
            <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-4">
                <Icon icon={feature.icon} />
                <div>
                  <Label htmlFor={feature.id} className="text-base font-bold">{feature.name}</Label>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
              <Switch
                id={feature.id}
                checked={feature.enabled}
                onCheckedChange={() => handleToggle(feature.id)}
                aria-label={`Toggle ${feature.name}`}
              />
            </div>
          ))}
           <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Feature Settings"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
