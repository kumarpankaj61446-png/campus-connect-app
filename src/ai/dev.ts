import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-reports.ts';
import '@/ai/flows/ai-study-buddy.ts';
import '@/ai/flows/ai-doubt-solver.ts';
import '@/ai/flows/quiz-generator.ts';
import '@/ai/flows/extract-text-from-image.ts';
import '@/ai/flows/lesson-planner.ts';
import '@/ai/flows/fee-reminder-flow.ts';
import '@/ai/flows/late-fee-prediction-flow.ts';
import '@/ai/flows/single-fee-reminder-flow.ts';
import '@/ai/flows/additional-student-billing-flow.ts';
