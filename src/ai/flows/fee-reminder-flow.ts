
'use server';
/**
 * @fileOverview An AI agent for sending fee reminders to parents.
 *
 * - feeReminderFlow - The main flow that orchestrates getting pending fees and sending reminders.
 * - getPendingFees - A tool to fetch students with pending fees.
 * - sendEmail, sendSms, sendWhatsApp - Tools to send notifications.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

// Mock data representing students with pending fees
const mockStudentFees = [
  { studentId: 'S001', studentName: 'Ravi Kumar', className: '10 A', parentName: 'Mr. Kumar', parentEmail: 'test-parent-1@example.com', parentPhone: '9999999991', pendingAmount: 2500, dueDate: '2024-07-10', previousInvoice: 'INV1002' },
  { studentId: 'S002', studentName: 'Priya Sharma', className: '9 B', parentName: 'Mrs. Sharma', parentEmail: 'test-parent-2@example.com', parentPhone: '9999999992', pendingAmount: 15000, dueDate: '2024-07-15', previousInvoice: 'INV2001' },
];

// Define tools for the AI
const getPendingFees = ai.defineTool(
  {
    name: 'getPendingFees',
    description: 'Retrieves a list of students who have pending fee payments.',
    outputSchema: z.array(z.object({
        studentName: z.string(),
        parentName: z.string(),
        parentEmail: z.string(),
        parentPhone: z.string(),
        pendingAmount: z.number(),
        dueDate: z.string(),
        previousInvoice: z.string(),
    })),
  },
  async () => {
    // In a real application, you would fetch this data from your database.
    console.log('Tool: getPendingFees executed.');
    return mockStudentFees;
  }
);

const sendEmail = ai.defineTool(
  {
    name: 'sendEmail',
    description: 'Sends an email to a parent.',
    inputSchema: z.object({
      to: z.string(),
      subject: z.string(),
      body: z.string(),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  async ({ to, subject, body }) => {
    console.log(`Tool: sendEmail executed for ${to}.`);
    // In a real app, integrate with a service like Resend or SendGrid.
    // NOTE: This will not actually send an email without a valid RESEND_API_KEY.
    if (process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to,
                subject,
                html: `<p>${body}</p>`,
            });
            return { success: true };
        } catch (error) {
            console.error("Email sending failed:", error);
            return { success: false };
        }
    }
    console.log(`(Simulation) Email sent to ${to} with subject "${subject}"`);
    return { success: true };
  }
);

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

const sendWhatsApp = ai.defineTool(
  {
    name: 'sendWhatsApp',
    description: 'Sends a WhatsApp message to a parent.',
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

const reminderPrompt = ai.definePrompt({
    name: 'feeReminderPrompt',
    system: `You are an administrative assistant for a school. Your task is to handle pending fee reminders.
First, get the list of all students with pending fees using the getPendingFees tool.
Then, for each student, you MUST send a reminder to their parent via all available channels: email, SMS, and WhatsApp.
The message should be polite and clearly state the student's name, the pending amount, the due date, and mention that the previous invoice is attached.
Example Email Subject: "Gentle Reminder: Fee Payment for [Student Name]"
Example Body/Message: "Dear [Parent Name], This is a friendly reminder that the fee payment of ₹[Amount] for [Student Name] was due on [Due Date]. The previous invoice [Invoice ID] is attached for your reference. Thank you."
You must call the appropriate tool (sendEmail, sendSms, sendWhatsApp) for each parent. Do not just list what you would do.`,
    tools: [getPendingFees, sendEmail, sendSms, sendWhatsApp],
});


export const feeReminderFlow = ai.defineFlow(
  {
    name: 'feeReminderFlow',
    outputSchema: z.object({
        message: z.string(),
        remindersSent: z.number(),
    }),
  },
  async () => {
    const llmResponse = await reminderPrompt();

    // In a tool-use scenario like this, the LLM's final text response might not be the most important output.
    // The real work is done by the tool calls. We can check the tool calls to count how many reminders were sent.
    
    const sentCount = llmResponse.toolRequests.filter(req => 
        req.name === 'sendEmail' || req.name === 'sendSms' || req.name === 'sendWhatsApp'
    ).length;

    return {
        message: llmResponse.text || `Successfully initiated ${sentCount} reminders.`,
        remindersSent: sentCount
    };
  }
);
