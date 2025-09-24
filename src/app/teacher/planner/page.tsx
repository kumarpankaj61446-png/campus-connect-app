
'use client';

import { useActionState, ChangeEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input }from "@/components/ui/input";
import { Loader2, Sparkles, Target, Book, Clock, Users, GraduationCap, Home, ListChecks } from 'lucide-react';
import { classes } from '@/lib/mock-data/report-data';
import { subjects } from '@/lib/mock-data/chapter-data';
import { generateLessonPlan, type GenerateLessonPlanOutput as PlanOutput } from '@/ai/flows/lesson-planner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';

type GenerateLessonPlanOutput = PlanOutput;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan...</>
      ) : (
        <><Sparkles className="mr-2 h-4 w-4" /> Generate Lesson Plan</>
      )}
    </Button>
  );
}

const PlannerResult = ({ plan }: { plan: GenerateLessonPlanOutput }) => (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle className="text-2xl text-primary">{plan.lessonTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Target /> Learning Objectives</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {plan.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Book /> Materials & Resources</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {plan.materials.map((mat, i) => <li key={i}>{mat}</li>)}
                    </ul>
                </div>
            </div>

            <Separator />
            
            <div>
                 <h3 className="font-semibold text-lg flex items-center gap-2 mb-4"><Clock /> Lesson Activities</h3>
                 <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-2">
                    {plan.lessonActivities.map((activity, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="bg-secondary/30 rounded-md border">
                            <AccordionTrigger className="px-4 font-medium">
                                <div className="flex items-center gap-4">
                                     <Badge>{activity.duration} min</Badge>
                                     <span>{activity.activityName}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pt-2 pb-4">
                               <p className="text-muted-foreground">{activity.description}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
            </div>
            
            <Separator />
            
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><ListChecks /> Assessment Methods</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {plan.assessmentMethods.map((method, i) => <li key={i}>{method}</li>)}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Users /> Differentiation</h3>
                     <div className="space-y-2">
                        <p><strong className="text-foreground">Support:</strong> <span className="text-muted-foreground">{plan.differentiation.support}</span></p>
                        <p><strong className="text-foreground">Challenge:</strong> <span className="text-muted-foreground">{plan.differentiation.challenge}</span></p>
                    </div>
                </div>
            </div>

            {plan.homeworkSuggestion && (
                 <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Home /> Homework Suggestion</h3>
                        <p className="text-muted-foreground">{plan.homeworkSuggestion}</p>
                    </div>
                 </>
            )}

        </CardContent>
    </Card>
);

export default function AILessonPlannerPage() {
    const [state, formAction] = useActionState(generateLessonPlan, {} as GenerateLessonPlanOutput);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Lesson Planner</CardTitle>
                    <CardDescription>Generate a detailed, step-by-step lesson plan for any topic in minutes. Just provide the details below and let the AI do the heavy lifting.</CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="class-select">Class (Optional)</Label>
                                <Select name="className">
                                    <SelectTrigger id="class-select"><SelectValue placeholder="Choose a class" /></SelectTrigger>
                                    <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject-select">Subject (Optional)</Label>
                                <Select name="subject">
                                    <SelectTrigger id="subject-select"><SelectValue placeholder="Choose a subject" /></SelectTrigger>
                                    <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="topic-input">Topic / Chapter</Label>
                                <Input id="topic-input" name="topic" placeholder="e.g., Photosynthesis" required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4 items-center">
                         <SubmitButton />
                         {state && 'message' in state && (state as { message: string }).message !== 'Success' && (
                            <Alert variant="destructive" className="w-auto">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{(state as any).message}</AlertDescription>
                            </Alert>
                         )}
                    </CardFooter>
                </form>
            </Card>

            {state && 'lessonTitle' in state && (
                <PlannerResult plan={state as GenerateLessonPlanOutput} />
            )}
        </div>
    );
}
