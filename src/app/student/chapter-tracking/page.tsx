
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { subjects, aiInsights } from "@/lib/mock-data/chapter-data";
import { CheckCircle, Radio, XCircle, BrainCircuit, Book, History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
    Completed: { icon: CheckCircle, color: "bg-green-500", variant: "default" as const },
    "In Progress": { icon: Radio, color: "bg-blue-500", variant: "secondary" as const },
    "Not Started": { icon: XCircle, color: "bg-gray-400", variant: "outline" as const },
};

const InsightCard = ({ title, topic, description, icon }: { title: string, topic: string, description: string, icon: React.ReactNode }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
                {icon}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="font-semibold text-primary">{topic}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function ChapterTrackingPage() {
    const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0].id);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const { toast } = useToast();
    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

    const overallProgress = selectedSubject ?
        (selectedSubject.chapters.reduce((acc, chap) => acc + chap.progress, 0) / selectedSubject.chapters.length)
        : 0;
        
    const handleAnalysis = () => {
        setLoadingAnalysis(true);
        setTimeout(() => {
            setLoadingAnalysis(false);
            toast({
                title: "Analysis Complete",
                description: "Your progress insights have been updated.",
            });
        }, 1500);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Real-time Chapter Tracking</CardTitle>
                    <CardDescription>Monitor your learning progress for each subject, chapter, and topic.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                        <div className="max-w-sm w-full">
                            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map(subject => (
                                        <SelectItem key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedSubject && (
                            <div className="w-full md:w-1/3">
                                <p className="text-sm text-muted-foreground mb-1">Overall Progress for {selectedSubject.name}</p>
                                <div className="flex items-center gap-2">
                                     <Progress value={overallProgress} className="h-2" />
                                     <span className="text-sm font-semibold">{Math.round(overallProgress)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-secondary/50">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <BrainCircuit />
                            AI-Powered Progress Insights
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={handleAnalysis} disabled={loadingAnalysis}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${loadingAnalysis ? 'animate-spin' : ''}`} />
                            {loadingAnalysis ? 'Analyzing...' : 'Request New Analysis'}
                        </Button>
                    </div>
                    <CardDescription>AI analysis of your recent homework and quiz performance for '{selectedSubject?.name}'.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                   <InsightCard 
                        title="Current Topic"
                        topic={aiInsights.current.topic}
                        description={aiInsights.current.summary}
                        icon={<Book className="w-5 h-5 text-muted-foreground"/>}
                   />
                   <InsightCard 
                        title="Today's Lesson"
                        topic={aiInsights.today.topic}
                        description={aiInsights.today.summary}
                        icon={<CheckCircle className="w-5 h-5 text-muted-foreground"/>}
                   />
                   <InsightCard 
                        title="Yesterday's Lesson"
                        topic={aiInsights.yesterday.topic}
                        description={aiInsights.yesterday.summary}
                        icon={<History className="w-5 h-5 text-muted-foreground"/>}
                   />
                </CardContent>
            </Card>

            {selectedSubject && (
                <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-bold">Chapters & Topics</h3>
                    <Accordion type="multiple" className="w-full space-y-4">
                        {selectedSubject.chapters.map(chapter => (
                            <AccordionItem value={`chapter-${chapter.id}`} key={chapter.id} className="border-b-0">
                                <Card className="overflow-hidden">
                                    <AccordionTrigger className="p-4 hover:no-underline hover:bg-secondary/50">
                                        <div className="flex flex-col md:flex-row justify-between w-full md:items-center text-left gap-2">
                                            <div>
                                                <h4 className="font-bold text-base">{chapter.name}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {chapter.topics.length} topics
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 w-full md:w-1/3 pr-4">
                                                <Progress value={chapter.progress} className="h-2" />
                                                <span className="text-sm font-semibold w-12">{chapter.progress}%</span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-0">
                                        <ul className="divide-y border-t">
                                            {chapter.topics.map(topic => {
                                                const config = statusConfig[topic.status];
                                                return (
                                                    <li key={topic.id} className="p-4 space-y-2">
                                                        <div className="flex justify-between items-center">
                                                             <div className="flex items-center gap-2">
                                                                <config.icon className="w-4 h-4 text-muted-foreground" />
                                                                <h5 className="font-semibold">{topic.title}</h5>
                                                            </div>
                                                             <Badge variant={config.variant}>{topic.status}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground pl-6">{topic.description}</p>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </AccordionContent>
                                </Card>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}
        </div>
    );
}
