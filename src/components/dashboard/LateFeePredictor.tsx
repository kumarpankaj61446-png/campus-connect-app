
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, AlertTriangle, ShieldCheck, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LateFeePrediction } from "@/ai/flows/late-fee-prediction-flow";
import predictLateFeePayersFlow from "@/ai/flows/late-fee-prediction-flow";
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { classes } from '@/lib/mock-data/report-data';

export function LateFeePredictor() {
    const [predictions, setPredictions] = useState<LateFeePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [predictionScope, setPredictionScope] = useState('all');
    const [selectedClass, setSelectedClass] = useState('');
    const { toast } = useToast();

    const handleRunPrediction = async () => {
        setIsDialogOpen(false);
        setLoading(true);
        setPredictions([]);

        const options = {
            scope: predictionScope,
            className: predictionScope === 'class' ? classes.find(c => c.id === selectedClass)?.name : undefined,
        };

        try {
            const result = await predictLateFeePayersFlow(options);
            if (result && result.predictions.length > 0) {
                const sortedPredictions = result.predictions.sort((a, b) => b.riskScore - a.riskScore);
                setPredictions(sortedPredictions);
                toast({
                    title: "Prediction Complete",
                    description: `AI has identified ${sortedPredictions.length} students at risk of late payment.`,
                });
            } else {
                 toast({
                    title: "No High-Risk Students Found",
                    description: "AI analysis completed, and no students were flagged as high-risk.",
                });
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Prediction Failed',
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    const getRiskVariant = (level: 'High' | 'Medium' | 'Low') => {
        switch(level) {
            case 'High': return 'destructive';
            case 'Medium': return 'secondary';
            case 'Low': return 'default';
        }
    };

     const getRiskIcon = (level: 'High' | 'Medium' | 'Low') => {
        switch(level) {
            case 'High': return <AlertTriangle className="w-4 h-4 text-destructive"/>;
            case 'Medium': return <TrendingDown className="w-4 h-4 text-orange-500"/>;
            case 'Low': return <ShieldCheck className="w-4 h-4 text-green-500"/>;
        }
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><Bot /> AI Late Fee Prediction</CardTitle>
                    <CardDescription>Predict which students may pay late based on historical data.</CardDescription>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg">
                            <Bot className="mr-2 h-4 w-4" />
                            Run AI Prediction
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Configure Prediction Task</DialogTitle>
                            <DialogDescription>Choose the scope for the late fee payment prediction.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-6">
                            <RadioGroup value={predictionScope} onValueChange={setPredictionScope}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="r1" />
                                    <Label htmlFor="r1">For the whole school</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="class" id="r2" />
                                    <Label htmlFor="r2">For a specific class</Label>
                                </div>
                            </RadioGroup>
                            {predictionScope === 'class' && (
                                 <div className="pl-6">
                                    <Label>Select Class</Label>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a class..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button onClick={handleRunPrediction} disabled={predictionScope === 'class' && !selectedClass}>
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Bot className="mr-2 h-4 w-4" />
                                )}
                                Start Prediction
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>
            </CardHeader>
            {(loading || predictions.length > 0) && (
                 <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-48 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="ml-4">AI is analyzing student data...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Risk Score</TableHead>
                                    <TableHead>Risk Level</TableHead>
                                    <TableHead>AI Justification</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {predictions.map(pred => (
                                    <TableRow key={pred.studentId}>
                                        <TableCell className="font-medium">{pred.studentName}</TableCell>
                                        <TableCell>{pred.className}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={pred.riskScore} className="w-24 h-2" />
                                                <span>{pred.riskScore}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getRiskVariant(pred.riskLevel)} className="flex items-center gap-1.5">
                                                {getRiskIcon(pred.riskLevel)}
                                                {pred.riskLevel} Risk
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{pred.justification}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            )}
        </Card>
    );
}
