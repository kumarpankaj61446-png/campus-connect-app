
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Palette, RotateCcw, Sun, Moon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const mockSchools = [
  { id: "SCH001", name: "Greenwood High" },
  { id: "SCH002", name: "Oakridge International" },
  { id: "SCH003", name: "Delhi Public School" },
  { id: "SCH004", name: "Global Edge School" },
];

type ThemeSettings = {
  baseTheme: 'light' | 'dark';
};

const initialThemes: Record<string, ThemeSettings> = {
  SCH001: { baseTheme: 'light' },
  SCH002: { baseTheme: 'dark' },
  SCH003: { baseTheme: 'light' },
  SCH004: { baseTheme: 'light' },
};


export default function CustomizeDesignPage() {
  const [themes, setThemes] = useState(initialThemes);
  const [selectedSchool, setSelectedSchool] = useState(mockSchools[0].id);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentTheme = themes[selectedSchool] || { baseTheme: 'light' };

  const handleThemeChange = (value: 'light' | 'dark') => {
    setThemes(prev => ({
      ...prev,
      [selectedSchool]: {
        baseTheme: value,
      }
    }));
  };

  const handleSave = () => {
    setLoading(true);
    // In a real app, you would save this theme preference to your database for the selected school.
    console.log("Saving theme for school:", selectedSchool, themes[selectedSchool]);
    toast({
      title: "Success",
      description: `Default theme for ${mockSchools.find(s => s.id === selectedSchool)?.name} has been updated.`,
    });
    setLoading(false);
  };
  
  const handleReset = () => {
    if (!selectedSchool) return;
    setThemes(prev => ({
      ...prev,
      [selectedSchool]: initialThemes[selectedSchool],
    }));
    toast({
      title: "Theme Reset",
      description: `Theme for ${mockSchools.find(s => s.id === selectedSchool)?.name} has been reset to its default. Remember to save to apply the changes.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customize Design</h2>
        <p className="text-muted-foreground">Change the default appearance for individual schools.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Per-School Theme Settings</CardTitle>
          <CardDescription>Select a school to set its default theme. Users can still override this with their own preference.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="max-w-sm space-y-2">
                <Label htmlFor="school-select">Select School</Label>
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger id="school-select">
                        <SelectValue placeholder="Select a school to customize" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockSchools.map(school => (
                             <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <Label className="text-lg">Base Theme</Label>
                 <RadioGroup 
                    value={currentTheme.baseTheme} 
                    onValueChange={(val) => handleThemeChange(val as 'light' | 'dark')}
                    className="grid md:grid-cols-2 gap-4"
                >
                    <Label
                      htmlFor="light-theme"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                        currentTheme.baseTheme === 'light' && "border-primary"
                      )}
                    >
                      <RadioGroupItem value="light" id="light-theme" className="sr-only" />
                      <div className="flex items-center gap-2 mb-4">
                        <Sun className="w-5 h-5"/>
                        <span className="font-bold">White (Light)</span>
                      </div>
                      <div className="w-full h-24 rounded-md bg-gray-100 p-2">
                          <div className="w-full h-4 bg-gray-300 rounded-sm mb-2"/>
                           <div className="w-2/3 h-4 bg-gray-300 rounded-sm"/>
                      </div>
                    </Label>
                     <Label
                      htmlFor="dark-theme"
                      className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                         currentTheme.baseTheme === 'dark' && "border-primary"
                      )}
                    >
                       <RadioGroupItem value="dark" id="dark-theme" className="sr-only" />
                      <div className="flex items-center gap-2 mb-4">
                        <Moon className="w-5 h-5"/>
                        <span className="font-bold">Black (Dark)</span>
                      </div>
                      <div className="w-full h-24 rounded-md bg-gray-800 p-2">
                          <div className="w-full h-4 bg-gray-600 rounded-sm mb-2"/>
                           <div className="w-2/3 h-4 bg-gray-600 rounded-sm"/>
                      </div>
                    </Label>
                  </RadioGroup>
            </div>
           
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleReset} disabled={loading || !selectedSchool}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Theme
            </Button>
            <Button onClick={handleSave} disabled={loading || !selectedSchool}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying Theme...
                </>
              ) : (
                <>
                  <Palette className="mr-2 h-4 w-4" />
                  Apply & Save Theme
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
