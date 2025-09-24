'use server';

/**
 * @fileOverview A reports summarization AI agent.
 *
 * - summarizeReports - A function that handles the reports summarization process.
 * - SummarizeReportsInput - The input type for the summarizeReports function.
 * - SummarizeReportsOutput - The return type for the summarizeReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReportsInputSchema = z.object({
  reportText: z.string().describe('The text of the report to be summarized.'),
});
export type SummarizeReportsInput = z.infer<typeof SummarizeReportsInputSchema>;

const SummarizeReportsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the report.'),
});
export type SummarizeReportsOutput = z.infer<typeof SummarizeReportsOutputSchema>;

export async function summarizeReports(input: SummarizeReportsInput): Promise<SummarizeReportsOutput> {
  return summarizeReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReportsPrompt',
  input: {schema: SummarizeReportsInputSchema},
  output: {schema: SummarizeReportsOutputSchema},
  prompt: `You are an expert at summarizing reports. Please provide a concise summary of the following report:\n\nReport: {{{reportText}}}`,
});

const summarizeReportsFlow = ai.defineFlow(
  {
    name: 'summarizeReportsFlow',
    inputSchema: SummarizeReportsInputSchema,
    outputSchema: SummarizeReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
