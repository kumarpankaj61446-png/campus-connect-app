
'use server';
/**
 * @fileOverview A voice assistant flow to process natural language commands.
 *
 * - processVoiceCommand - A function that interprets user commands and determines the appropriate action.
 * - VoiceCommandInput - The input type for the processVoiceCommand function.
 * - VoiceCommandOutput - The return type for the processVoiceCommand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VoiceCommandInputSchema = z.object({
  command: z.string().describe('The voice command spoken by the user.'),
  role: z.enum(['Student', 'Teacher', 'Parent', 'Principal', 'Admin', 'Financial'])
    .describe('The role of the user issuing the command to understand context.'),
});

const VoiceCommandOutputSchema = z.object({
  action: z.enum(['navigate', 'error']).describe('The action to be taken.'),
  target: z.string().describe('The target for the action, e.g., a URL path for navigation, or an error message.'),
});

export async function processVoiceCommand(
  input: z.infer<typeof VoiceCommandInputSchema>
): Promise<z.infer<typeof VoiceCommandOutputSchema>> {
  return voiceCommandFlow(input);
}

const navigationTool = ai.defineTool(
    {
        name: 'navigateTo',
        description: 'Navigates the user to a specific page in the application.',
        inputSchema: z.object({
            path: z.string().describe('The absolute path to navigate to (e.g., "/student/homework").'),
        }),
        outputSchema: z.string(),
    },
    async ({ path }) => path
);

const voiceCommandPrompt = ai.definePrompt({
    name: 'voiceCommandProcessor',
    system: `You are an intelligent voice assistant for the CampusConnect application. Your job is to understand the user's spoken command and determine the correct action. The user's role is provided for context.

You have one tool: 'navigateTo'.

Based on the user's command and role, decide which page to navigate to. The path should be one of the valid application routes.
- Student routes start with /student, e.g., /student/homework.
- Teacher routes start with /teacher, e.g., /teacher/attendance.
- Parent routes start with /parent, e.g., /parent/fee-payments.
- Principal routes start with /principal, e.g., /principal/users.
- Admin routes start with /admin, e.g., /admin/dashboard.
- Financial routes start with /financial, e.g., /financial/reports.

If the command is clear, call the 'navigateTo' tool with the correct path.
If the command is ambiguous or you don't understand it, you MUST NOT call the tool. Instead, provide a helpful error message explaining what you can do. For example: "I can help you navigate. Try saying 'Go to homework' or 'Open attendance'."

User Role: {{{role}}}
User Command: "{{{command}}}"`,
    tools: [navigationTool],
    output: {
        format: 'tool',
    }
});


const voiceCommandFlow = ai.defineFlow(
  {
    name: 'voiceCommandFlow',
    inputSchema: VoiceCommandInputSchema,
    outputSchema: VoiceCommandOutputSchema,
  },
  async (input) => {
    const llmResponse = await voiceCommandPrompt(input);
    const toolRequest = llmResponse.toolRequest();

    if (toolRequest && toolRequest.name === 'navigateTo') {
      return {
        action: 'navigate',
        target: toolRequest.input.path,
      };
    }

    // If the LLM didn't call a tool, it's because it couldn't understand.
    // Return the LLM's text response as the error message.
    return {
      action: 'error',
      target: llmResponse.text() || "I'm sorry, I didn't understand that. Please try again.",
    };
  }
);
