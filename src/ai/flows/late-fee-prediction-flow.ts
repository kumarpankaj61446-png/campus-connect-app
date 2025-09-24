
'use server';
/**
 * @fileOverview Predicts which students are likely to pay fees late.
 * 
 * - predictLateFeePayers - The main flow to predict late fee payments.
 * - LateFeePrediction - The output type for a single student prediction.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Mock data representing student financial profiles
const mockStudentFinancialData = [
  { studentId: 'S001', studentName: 'Ravi Kumar', className: '10 A', pastPayments: 5, onTimePayments: 5, latePayments: 0, familyIncomeBracket: 'High', communicationHistory: 2 },
  { studentId: 'S002', studentName: 'Priya Sharma', className: '9 B', pastPayments: 5, onTimePayments: 2, latePayments: 3, familyIncomeBracket: 'Medium', communicationHistory: 8 },
  { studentId: 'S003', studentName: 'Amit Singh', className: '11 C', pastPayments: 5, onTimePayments: 5, latePayments: 0, familyIncomeBracket: 'High', communicationHistory: 1 },
  { studentId: 'S004', studentName: 'Sunita Devi', className: '10 A', pastPayments: 5, onTimePayments: 4, latePayments: 1, familyIncomeBracket: 'Medium', communicationHistory: 4 },
  { studentId: 'S005', studentName: 'Rahul Verma', className: '12 A', pastPayments: 5, onTimePayments: 1, latePayments: 4, familyIncomeBracket: 'Low', communicationHistory: 12 },
  { studentId: 'S006', studentName: 'Anjali Mehta', className: '9 B', pastPayments: 5, onTimePayments: 3, latePayments: 2, familyIncomeBracket: 'Low', communicationHistory: 6 },
];

const LateFeePredictionInputSchema = z.object({
    scope: z.enum(['all', 'class']),
    className: z.string().optional(),
});

export type LateFeePrediction = z.infer<typeof LateFeePredictionSchema>;

const LateFeePredictionSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  className: z.string(),
  riskScore: z.number().int().min(0).max(100).describe('The predicted probability (0-100) that the student will pay late.'),
  riskLevel: z.enum(['High', 'Medium', 'Low']),
  justification: z.string().describe('A brief, data-driven justification for the assigned risk score.'),
});

const LateFeePredictionOutputSchema = z.object({
    predictions: z.array(LateFeePredictionSchema)
});

// Define a tool to get the data
const getStudentFinancialData = ai.defineTool(
    {
        name: 'getStudentFinancialData',
        description: 'Retrieves financial and behavioral data for all students.',
        inputSchema: z.object({ className: z.string().optional() }),
        outputSchema: z.array(z.object({
            studentId: z.string(),
            studentName: z.string(),
            className: z.string(),
            pastPayments: z.number(),
            onTimePayments: z.number(),
            latePayments: z.number(),
            familyIncomeBracket: z.string(),
            communicationHistory: z.number().describe('Number of communications sent to the parent.'),
        }))
    },
    async ({ className }) => {
        if (className) {
            return mockStudentFinancialData.filter(s => s.className === className);
        }
        return mockStudentFinancialData;
    }
);


const predictionPrompt = ai.definePrompt({
    name: 'lateFeePredictorPrompt',
    system: `You are an expert financial analyst for a school. Your task is to predict which students are at high risk of paying their fees late for the upcoming cycle.

Use the provided 'getStudentFinancialData' tool to get the list of students. If a class name is provided, use it to filter the students.

Analyze each student based on the following factors:
1.  **Past Payment History:** A high number of late payments is a strong indicator of future late payments.
2.  **Family Income Bracket:** Students from 'Low' income brackets might face more financial challenges. This is a contributing factor, not a primary one.
3.  **Communication History:** A high number of past reminders could indicate difficulty in paying on time.

For each student, you MUST calculate a 'riskScore' from 0 (no risk) to 100 (highest risk).
- A student with multiple late payments and from a low-income bracket should have a HIGH risk score (e.g., > 70).
- A student with a perfect payment history should have a very LOW risk score (e.g., < 10).

Based on the risk score, classify the 'riskLevel' as 'High' (>= 70), 'Medium' (30-69), or 'Low' (< 30).

Provide a concise 'justification' for your prediction for each student, referencing the data points (e.g., "3 out of 5 past payments were late").

Return a list of predictions for all analyzed students. The client will filter for high-risk students if needed.`,
    tools: [getStudentFinancialData],
    output: { schema: LateFeePredictionOutputSchema },
});

async function predictLateFeePayersFlow(input: z.infer<typeof LateFeePredictionInputSchema>): Promise<z.infer<typeof LateFeePredictionOutputSchema>> {
    const toolInput = input.scope === 'class' ? { className: input.className } : {};
    const llmResponse = await predictionPrompt(toolInput);
    return llmResponse.output() || { predictions: [] };
}

export default ai.defineFlow(
  {
    name: 'predictLateFeePayersFlow',
    inputSchema: LateFeePredictionInputSchema,
    outputSchema: LateFeePredictionOutputSchema,
  },
  predictLateFeePayersFlow
);
