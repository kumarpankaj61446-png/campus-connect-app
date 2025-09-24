
'use server';
/**
 * @fileOverview An AI agent for handling additional student billing.
 * 
 * - additionalStudentBillingFlow - The main flow that orchestrates the billing and notification process.
 * - sendSms - A tool to send SMS notifications.
 * - sendWhatsApp - A tool to send WhatsApp notifications.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AdditionalStudentBillingInputSchema = z.object({
    schoolName: z.string(),
    additionalStudentCount: z.number(),
    amountPerStudent: z.number(),
    principalContact: z.string().describe("Principal's phone number for SMS and WhatsApp."),
    adminPhoneNumber: z.string().describe("Super Admin's WhatsApp number."),
});

// Tool to send SMS
const sendSms = ai.defineTool(
  {
    name: 'sendSms',
    description: 'Sends an SMS notification.',
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

// Tool to send WhatsApp
const sendWhatsApp = ai.defineTool(
  {
    name: 'sendWhatsApp',
    description: 'Sends a WhatsApp message.',
    inputSchema: z.object({ to: z.string(), message: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ to, message }) => {
    console.log(`Tool: sendWhatsApp executed for ${to}.`);
    // In a real app, integrate with the WhatsApp Business API.
    console.log(`(Simulation) WhatsApp message sent to ${to}: "${message}"`);
    return { success: true };
  }
);


const billingPrompt = ai.definePrompt({
    name: 'additionalStudentBillingPrompt',
    system: `You are a billing assistant for CampusConnect. Your task is to handle the billing and notification process when a school exceeds its paid student limit.

You will receive details about the school, the number of additional students, and the cost per student.
Your tasks are:
1.  Calculate the total due amount (additionalStudentCount * amountPerStudent).
2.  Create a clear and polite billing message for the school's principal. This message MUST include the total due amount and present two options: "Pay now" or "Add to next month's invoice".
3.  Send this message to the principal via both SMS and WhatsApp using the provided tools.
4.  Create a notification message for the Super Admin. This message MUST include the school's name, the number of additional students, and the total due amount.
5.  Send this notification to the Super Admin via WhatsApp using the provided tool.

You MUST call the correct tools to send the messages. Do not just describe the messages. Execute the sending process.
`,
    tools: [sendSms, sendWhatsApp],
    inputSchema: AdditionalStudentBillingInputSchema,
});


export const additionalStudentBillingFlow = ai.defineFlow(
  {
    name: 'additionalStudentBillingFlow',
    inputSchema: AdditionalStudentBillingInputSchema,
    outputSchema: z.object({
        status: z.string()
    }),
  },
  async (input) => {
    const llmResponse = await billingPrompt(input);
    const toolRequests = llmResponse.toolRequests;

    const principalMessagesSent = toolRequests.filter(req => req.input.to === input.principalContact).length;
    const adminMessagesSent = toolRequests.filter(req => req.input.to === input.adminPhoneNumber).length;
    
    if (principalMessagesSent > 0 && adminMessagesSent > 0) {
        return { status: `Billing notifications initiated for ${input.schoolName}.` };
    }
    
    return { status: "AI did not generate the required notifications. Please check the logs." };
  }
);
