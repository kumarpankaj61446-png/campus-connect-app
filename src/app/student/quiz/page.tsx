
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subjects } from "@/lib/mock-data/chapter-data";
import { Loader2, BrainCircuit, Sparkles, Check, X, RefreshCw } from 'lucide-react';
import { GenerateQuizOutput, generateQuiz } from '@/ai/flows/quiz-generator';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';

type QuizState = 'config' | 'loading' | 'active' | 'results';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export default function AIQuizPage() {
    const [quizState, setQuizState] = useState<QuizState>('config');
    const [subject, setSubject] = useState(subjects[0].id);
    const [topic, setTopic] = useState(subjects[0].chapters[0].id);
    const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
    const [quizData, setQuizData] = useState<GenerateQuizOutput | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState(0);

    const { toast } = useToast();
    const selectedSubject = subjects.find(s => s.id === subject);

    const handleStartQuiz = async () => {
        setQuizState('loading');
        try {
            const subjectName = selectedSubject?.name || '';
            const topicName = selectedSubject?.chapters.find(c => c.id === topic)?.name || '';

            if (!topicName) {
                toast({
                    variant: "destructive",
                    title: "Invalid Topic",
                    description: "Please select a valid topic before starting the quiz.",
                });
                setQuizState('config');
                return;
            }

            const result = await generateQuiz({ subject: subjectName, topic: topicName, difficulty });
            if (result.questions && result.questions.length === 10) {
                setQuizData(result);
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                setScore(0);
                setQuizState('active');
            } else {
                throw new Error("Invalid quiz format received.");
            }
        } catch (error) {
            console.error("Failed to generate quiz:", error);
            toast({
                variant: "destructive",
                title: "Quiz Generation Failed",
                description: "The AI could not generate a quiz. Please try again.",
            });
            setQuizState('config');
        }
    };
    
    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < 9) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // End of quiz, calculate score
            let finalScore = 0;
            quizData?.questions.forEach((q, index) => {
                if(selectedAnswers[index] === q.correctAnswer) {
                    finalScore++;
                }
            });
            setScore(finalScore);
            setQuizState('results');
        }
    };
    
    const restartQuiz = () => {
        setQuizData(null);
        setQuizState('config');
    }
    
    const handleSubjectChange = (subjectId: string) => {
        setSubject(subjectId);
        const firstTopic = subjects.find(s => s.id === subjectId)?.chapters[0].id;
        if (firstTopic) {
            setTopic(firstTopic);
        }
    };

    const topicsForCombobox = selectedSubject?.chapters.map(c => ({
        value: c.id,
        label: c.name,
    })) || [];


    const currentQuestion = quizData?.questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / 10) * 100;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit /> AI Quiz Generator</CardTitle>
                    <CardDescription>Practice any topic with unlimited, AI-generated quizzes to master your subjects.</CardDescription>
                </CardHeader>

                {quizState === 'config' && (
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label>Select Subject</Label>
                                <Select value={subject} onValueChange={handleSubjectChange}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Select Topic / Chapter</Label>
                                 <Combobox
                                    options={topicsForCombobox}
                                    value={topic}
                                    onChange={setTopic}
                                    placeholder="Select a topic"
                                    searchPlaceholder="Search topics..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Select Difficulty</Label>
                            <RadioGroup value={difficulty} onValueChange={(v: Difficulty) => setDifficulty(v)} className="grid grid-cols-3 gap-4">
                                <div><Label htmlFor="beginner" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent"><RadioGroupItem value="Beginner" id="beginner" /> Beginner</Label></div>
                                <div><Label htmlFor="intermediate" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent"><RadioGroupItem value="Intermediate" id="intermediate" /> Intermediate</Label></div>
                                <div><Label htmlFor="pro" className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent"><RadioGroupItem value="Advanced" id="pro" /> Advanced</Label></div>
                            </RadioGroup>
                        </div>
                        <div className="text-center pt-4">
                            <Button size="lg" onClick={handleStartQuiz}><Sparkles className="mr-2"/> Start AI Quiz</Button>
                        </div>
                    </CardContent>
                )}

                {quizState === 'loading' && (
                     <CardContent className="h-60 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="font-bold text-lg">Generating your quiz...</p>
                        <p className="text-sm">The AI is preparing your questions. Please wait a moment.</p>
                    </CardContent>
                )}

                {quizState === 'active' && currentQuestion && (
                    <CardContent className="space-y-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-muted-foreground text-center">Question {currentQuestionIndex + 1} of 10</p>
                        <CardTitle className="text-xl md:text-2xl text-center">{currentQuestion.question}</CardTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                            {currentQuestion.options.map((option, index) => (
                                <Button
                                    key={index}
                                    variant={selectedAnswers[currentQuestionIndex] === option ? 'default' : 'outline'}
                                    className="h-auto py-4 text-wrap"
                                    onClick={() => handleAnswerSelect(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                        <div className="text-center pt-4">
                            <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestionIndex]}>
                                {currentQuestionIndex < 9 ? 'Next Question' : 'Finish Quiz'}
                            </Button>
                        </div>
                    </CardContent>
                )}
                
                {quizState === 'results' && quizData && (
                     <CardContent className="text-center space-y-6">
                        <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                        <p className="text-5xl font-bold text-primary">{score} / 10</p>
                        <p className="text-muted-foreground">You scored {score * 10}%. {score > 7 ? "Great job!" : score > 4 ? "Good effort!" : "Keep practicing!"}</p>
                        <div className="space-y-4 max-w-4xl mx-auto text-left">
                            <h3 className="font-bold text-lg">Review Your Answers:</h3>
                            {quizData.questions.map((q, index) => {
                                const userAnswer = selectedAnswers[index];
                                const isCorrect = userAnswer === q.correctAnswer;
                                return (
                                    <div key={index} className={cn("p-4 rounded-md border", isCorrect ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10")}>
                                        <p className="font-semibold">{index + 1}. {q.question}</p>
                                        <div className="text-sm mt-2">
                                            <p className={cn("flex items-center gap-2", !isCorrect && "text-red-700 dark:text-red-400")}>
                                                {isCorrect ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4" />}
                                                Your answer: {userAnswer}
                                            </p>
                                            {!isCorrect && (
                                                <p className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold">
                                                     <Check className="w-4 h-4" />
                                                     Correct answer: {q.correctAnswer}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                         <div className="flex justify-center gap-4 pt-4">
                            <Button onClick={handleStartQuiz}><RefreshCw className="mr-2"/> Take Another Quiz on this Topic</Button>
                            <Button variant="outline" onClick={restartQuiz}>Choose a New Topic</Button>
                        </div>
                    </CardContent>
                )}

            </Card>
        </div>
    );
}
