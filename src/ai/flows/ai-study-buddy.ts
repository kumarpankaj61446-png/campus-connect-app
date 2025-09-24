'use server';

/**
 * @fileOverview Provides an AI study buddy to give personalized support for students.
 *
 * - aiStudyBuddy - A function that provides personalized study support.
 * - AIStudyBuddyInput - The input type for the aiStudyBuddy function.
 * - AIStudyBuddyOutput - The return type for the aiStudyBuddy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIStudyBuddyInputSchema = z.object({
  topic: z.string().describe('The topic the student wants to study.'),
  question: z.string().describe('The specific question the student has.'),
});
export type AIStudyBuddyInput = z.infer<typeof AIStudyBuddyInputSchema>;

const AIStudyBuddyOutputSchema = z.object({
  answer: z.string().describe('The personalized answer from the AI study buddy.'),
});
export type AIStudyBuddyOutput = z.infer<typeof AIStudyBuddyOutputSchema>;

export async function aiStudyBuddy(input: AIStudyBuddyInput): Promise<AIStudyBuddyOutput> {
  return aiStudyBuddyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStudyBuddyPrompt',
  input: {schema: AIStudyBuddyInputSchema},
  output: {schema: AIStudyBuddyOutputSchema},
  prompt: `You are an AI study buddy helping students with their studies.

  Topic: {{{topic}}}
  Question: {{{question}}}

  Please provide a clear and helpful answer.`,
});

const aiStudyBuddyFlow = ai.defineFlow(
  {
    name: 'aiStudyBuddyFlow',
    inputSchema: AIStudyBuddyInputSchema,
    outputSchema: AIStudyBuddyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
