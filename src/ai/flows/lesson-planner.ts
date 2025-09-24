
'use server';
/**
 * @fileOverview Creates detailed, AI-generated lesson plans for teachers.
 *
 * - generateLessonPlan - A function that creates a lesson plan.
 * - GenerateLessonPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  className: z.string().optional().describe('The class or grade level for the lesson (e.g., "Class 10 A").'),
  subject: z.string().optional().describe('The subject of the lesson (e.g., "Mathematics").'),
  topic: z.string({ required_error: 'Please enter a topic.'}).min(1, 'Please enter a topic.').describe('The specific topic to be covered (e.g., "Quadratic Equations").'),
});
type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonTitle: z.string().describe('A creative and engaging title for the lesson.'),
  learningObjectives: z.array(z.string()).describe('A list of 3-4 clear, measurable learning objectives for the students.'),
  materials: z.array(z.string()).describe('A list of necessary materials, tools, or resources for the lesson.'),
  lessonActivities: z.array(z.object({
    duration: z.number().describe('The estimated time in minutes for the activity.'),
    activityName: z.string().describe('A descriptive name for the lesson activity (e.g., "Introduction & Hook", "Guided Practice", "Group Activity").'),
    description: z.string().describe('A detailed, step-by-step description of the activity and what the teacher and students will do.'),
  })).describe('A sequence of activities that form the lesson, including introduction, instruction, practice, and conclusion.'),
  assessmentMethods: z.array(z.string()).describe('A list of methods to assess student understanding (e.g., "Quiz", "Observation", "Exit Ticket").'),
  differentiation: z.object({
    support: z.string().describe('Strategies to support students who may be struggling with the topic.'),
    challenge: z.string().describe('Strategies to challenge advanced students who grasp the concept quickly.'),
  }).describe('Suggestions for differentiating instruction to meet the needs of all learners.'),
  homeworkSuggestion: z.string().optional().describe('A relevant and meaningful homework assignment to reinforce the lesson.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;


export async function generateLessonPlan(prevState: any, formData: FormData): Promise<GenerateLessonPlanOutput | { message: string }> {
  const input = {
    className: formData.get('className') as string,
    subject: formData.get('subject') as string,
    topic: formData.get('topic') as string,
  };

  const validatedFields = GenerateLessonPlanInputSchema.safeParse(input);
   if (!validatedFields.success) {
    const topicError = validatedFields.error.flatten().fieldErrors.topic?.[0];
    return {
      message: topicError || "Please check your input."
    };
  }

  return generateLessonPlanFlow(validatedFields.data);
}

const prompt = ai.definePrompt({
  name: 'lessonPlannerPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert instructional designer. Your task is to create a comprehensive and engaging lesson plan based on the teacher's request.

{{#if className}}Class: {{{className}}}{{/if}}
{{#if subject}}Subject: {{{subject}}}{{/if}}
Topic: {{{topic}}}

Please generate a complete lesson plan that includes:
1.  **Lesson Title:** A creative title for the lesson.
2.  **Learning Objectives:** 3-4 clear, specific, and measurable objectives starting with "Students will be able to...".
3.  **Materials:** A list of all necessary materials.
4.  **Lesson Activities:** A detailed, step-by-step plan. Break it down into logical parts (e.g., Introduction, Direct Instruction, Guided Practice, Independent Practice, Assessment/Wrap-up). For each activity, provide an estimated duration in minutes, a clear name, and a description of the teacher's and students' actions. The total duration should be around 45-60 minutes.
5.  **Assessment Methods:** How will the teacher check for understanding?
6.  **Differentiation:** Provide specific strategies for two groups: one for students who need extra support and one for students who need a challenge.
7.  **Homework Suggestion:** A relevant assignment to reinforce learning.

The tone should be professional, clear, and practical for a teacher to use in their classroom. Structure your response according to the output schema.
`,
});

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
