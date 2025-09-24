
'use server';
/**
 * @fileOverview Provides an AI-powered quiz generator for students.
 *
 * - generateQuiz - A function that creates a quiz based on subject, topic, and difficulty.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  subject: z.string().describe('The subject of the quiz (e.g., Mathematics, Science).'),
  topic: z.string().describe('The specific topic within the subject (e.g., Algebra, Cell Biology).'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
});

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(10).describe('An array of 10 quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizGeneratorPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert quiz creator for students. Your task is to generate a 10-question multiple-choice quiz based on the provided subject, topic, and difficulty level.

Subject: {{{subject}}}
Topic: {{{topic}}}
Difficulty: {{{difficulty}}}

Please create 10 questions. Each question must have:
1.  A clear and concise question.
2.  Exactly 4 multiple-choice options.
3.  A clearly identified correct answer which must be one of the options.

The questions should be challenging but appropriate for the specified difficulty level ({{{difficulty}}}). Ensure the options are plausible and the correct answer is unambiguous.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
