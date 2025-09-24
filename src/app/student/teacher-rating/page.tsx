
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { subjectsWithTeachers, studentRatings } from "@/lib/mock-data/rating-data";
import { StarRating } from '@/components/ui/star-rating';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TeacherRatingPage() {
    const [ratings, setRatings] = useState(studentRatings);
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const { toast } = useToast();

    const handleRatingChange = (teacherId: string, subjectId: string, newRating: number) => {
        setRatings(prev => ({
            ...prev,
            [teacherId]: { ...prev[teacherId], [subjectId]: newRating }
        }));
    };

    const handleSubmitRating = (teacherId: string, subjectId: string) => {
        setIsSubmitting(teacherId);
        // Simulate API call
        toast({
            title: "Rating Submitted!",
            description: "Thank you for your valuable feedback.",
        });
        // Here you would typically update a "submitted" state
        setIsSubmitting(null);
    };
    
    const weekEndDate = "August 3, 2024";

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Rate Your Teachers</CardTitle>
                    <CardDescription>
                        Your weekly feedback helps improve the learning experience. This week's ratings are for the week ending {weekEndDate}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Alert className="mb-6">
                        <CheckCircle className="h-4 w-4"/>
                        <AlertTitle>Note on Feedback</AlertTitle>
                        <AlertDescription>
                            You can rate each teacher once per week. Your ratings are anonymous to the teachers but visible to the principal for quality assessment. The rating window for this week resets automatically.
                        </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-8">
                        {subjectsWithTeachers.map(subject => (
                             <Card key={subject.subjectId} className="overflow-hidden">
                                <CardHeader className="bg-secondary/50">
                                    <CardTitle className="text-xl">{subject.subjectName}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {subject.teachers.map(teacher => {
                                        const currentRating = ratings[teacher.id]?.[subject.subjectId] || 0;
                                        // In a real app, you'd check if a rating for the current week has been submitted
                                        const isRated = currentRating > 0 && !isSubmitting;

                                        return (
                                            <div key={teacher.id} className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={`https://avatar.vercel.sh/${teacher.name}.png`} />
                                                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{teacher.name}</p>
                                                        <p className="text-sm text-muted-foreground">{subject.subjectName} Teacher</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                     <StarRating 
                                                        rating={currentRating}
                                                        onRatingChange={(newRating) => handleRatingChange(teacher.id, subject.subjectId, newRating)}
                                                        disabled={isRated || !!isSubmitting}
                                                    />
                                                    <Button
                                                        onClick={() => handleSubmitRating(teacher.id, subject.subjectId)}
                                                        disabled={isRated || !currentRating || !!isSubmitting}
                                                        size="sm"
                                                        className="w-28"
                                                    >
                                                        {isSubmitting === teacher.id ? <Loader2 className="animate-spin" /> : isRated ? "Rated" : "Submit"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                             </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
