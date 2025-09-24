
'use server';
/**
 * @fileOverview An AI agent for sending a single, targeted fee reminder.
 *
 * - singleFeeReminderFlow - The main flow that sends a reminder to a specific parent.
 * - sendSms - A tool to send an SMS notification.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SingleFeeReminderInputSchema = z.object({
    studentName: z.string(),
    parentName: z.string(),
    parentPhone: z.string(),
    pendingAmount: z.number(),
    dueDate: z.string(),
});
export type SingleFeeReminderInput = z.infer<typeof SingleFeeReminderInputSchema>;

// Tool to send SMS
const sendSms = ai.defineTool(
  {
    name: 'sendSms',
    description: 'Sends an SMS to a parent.',
    inputSchema: z.object({ to: z.string(), message: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ to, message }) => {
    console.log(`Tool: sendSms executed for ${to}.`);
    // In a real app, integrate with a service like Twilio.
    console.log(`(Simulation) SMS sent to ${to}: "${message}"`);
    return { success: true };
  }
);

const singleReminderPrompt = ai.definePrompt({
    name: 'singleFeeReminderPrompt',
    system: `You are an administrative assistant for a school. Your task is to send a single, polite SMS reminder to a parent about a pending fee.
The message should clearly state the student's name, the pending amount, and the due date.
Example Message: "Dear [Parent Name], This is a friendly reminder regarding the fee payment of ₹[Amount] for [Student Name], which was due on [Due Date]. Thank you."
You must call the sendSms tool to send the message. Do not just state what you would do.`,
    tools: [sendSms],
    inputSchema: SingleFeeReminderInputSchema,
});


export const singleFeeReminderFlow = ai.defineFlow(
  {
    name: 'singleFeeReminderFlow',
    inputSchema: SingleFeeReminderInputSchema,
    outputSchema: z.object({
        status: z.string()
    }),
  },
  async (input) => {
    const llmResponse = await singleReminderPrompt(input);
    const toolRequest = llmResponse.toolRequests.find(req => req.name === 'sendSms');
    
    if (toolRequest) {
        return { status: `SMS reminder initiated for ${input.parentName}.` };
    }
    
    return { status: "AI did not generate an SMS. Please check the logs." };
  }
);
