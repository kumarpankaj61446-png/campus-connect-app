'use server';
/**
 * @fileOverview Provides an AI Study Buddy for students.
 *
 * - aiDoubtSolver - A function that provides answers to student doubts.
 * - AIDoubtSolverInput - The input type for the aiDoubtSolver function.
 * - AIDoubtSolverOutput - The return type for the aiDoubtSolver function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDoubtSolverInputSchema = z.object({
  question: z.string().describe('The specific question the student has.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of the question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AIDoubtSolverInput = z.infer<typeof AIDoubtSolverInputSchema>;

const AIDoubtSolverOutputSchema = z.object({
  finalAnswer: z.string().describe('The final, correct answer to the question, stated concisely.'),
  solutions: z.array(z.object({
    title: z.string().describe('The title of the solution method (e.g., "Method 1: Using the Quadratic Formula").'),
    steps: z.string().describe('The detailed, step-by-step explanation for this solution method. Use markdown for formatting.'),
  })).describe('An array of 2-3 different methods to solve the problem, each with a title and step-by-step instructions.'),
  flowchart: z.string().optional().describe('A text-based flowchart that visually represents the problem-solving steps. Use characters like ->, [ ], ( ), and { } to create the chart.'),
});
export type AIDoubtSolverOutput = z.infer<typeof AIDoubtSolverOutputSchema>;


export async function aiDoubtSolver(input: AIDoubtSolverInput): Promise<AIDoubtSolverOutput> {
  return aiDoubtSolverFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDoubtSolverPrompt',
  input: {schema: AIDoubtSolverInputSchema},
  output: {schema: AIDoubtSolverOutputSchema},
  prompt: `You are a friendly and encouraging AI Study Buddy. Your goal is to help students understand concepts, not just give them answers.

The user has the following question:
Question: {{{question}}}
{{#if photoDataUri}}
The user has also provided an image of the question:
{{media url=photoDataUri}}
{{/if}}

Please provide the following:
1.  **Final Answer:** A concise and correct final answer to the question.
2.  **Solutions:** Provide 2-3 different ways to solve the problem if applicable. For each method:
    *   Give it a clear title (e.g., "Method 1: Substitution").
    *   Provide a detailed, step-by-step explanation. Format the steps using markdown for clarity (e.g., using numbered lists).
    *   Explain the concepts and reasoning behind each step.
3.  **Flowchart:** If the problem involves a process or algorithm, create a simple, text-based flowchart to visualize the steps. Use characters like ->, [Decision], (Process), and {Start/End} to build the flowchart.

Your tone should be helpful and patient. Your response must be structured according to the output schema.
`,
});

const aiDoubtSolverFlow = ai.defineFlow(
  {
    name: 'aiDoubtSolverFlow',
    inputSchema: AIDoubtSolverInputSchema,
    outputSchema: AIDoubtSolverOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
