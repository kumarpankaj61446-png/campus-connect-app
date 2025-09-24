
"use server";

import { z } from "zod";
import { aiStudyBuddy } from "@/ai/flows/ai-study-buddy";
import { aiDoubtSolver } from "@/ai/flows/ai-doubt-solver";
import { feeReminderFlow } from "@/ai/flows/fee-reminder-flow";
import { singleFeeReminderFlow, type SingleFeeReminderInput } from "@/ai/flows/single-fee-reminder-flow";

const studyBuddySchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  question: z.string().min(10, "Question must be at least 10 characters long."),
});

const doubtSolverSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters long."),
  image: z.string().optional(),
});


export type StudyBuddyState = {
  message?: string;
  answer?: string;
  errors?: {
    topic?: string[];
    question?: string[];
  };
  input?: {
    topic: string;
    question: string;
  }
};

export type DoubtSolverState = {
    message?: string;
    finalAnswer?: string;
    solutions?: { title: string; steps: string }[];
    flowchart?: string;
    errors?: {
        question?: string[];
        image?: string[];
    };
    input?: {
        question: string;
        image?: string;
    },
    history?: { question: string; image?: string }[];
};


export async function askStudyBuddy(
  prevState: StudyBuddyState,
  formData: FormData
): Promise<StudyBuddyState> {
  const topic = formData.get("topic") as string;
  const question = formData.get("question") as string;

  const validatedFields = studyBuddySchema.safeParse({
    topic,
    question,
  });

  if (!validatedFields.success) {
    return {
      message: "Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      input: { topic, question }
    };
  }
  
  try {
    const result = await aiStudyBuddy({
      topic: validatedFields.data.topic,
      question: validatedFields.data.question,
    });
    
    if (result.answer) {
        return {
            message: "Success",
            answer: result.answer,
        };
    } else {
        return {
            message: "The AI could not provide an answer. Please try again.",
            input: { topic, question }
        }
    }

  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      input: { topic, question }
    };
  }
}


export async function askDoubtSolver(
  prevState: DoubtSolverState,
  formData: FormData
): Promise<DoubtSolverState> {
  const question = formData.get("question") as string;
  const image = formData.get("image") as string;
  const historyString = formData.get("history") as string;
  
  let history: { question: string; image?: string }[] = [];
  try {
    history = historyString ? JSON.parse(historyString) : [];
  } catch (e) {
    console.error("Failed to parse history");
  }


  const validatedFields = doubtSolverSchema.safeParse({
    question,
    image,
  });

  if (!validatedFields.success) {
    return {
      message: "Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      input: { question, image },
      history,
    };
  }
  
  try {
    const result = await aiDoubtSolver({
      question: validatedFields.data.question,
      photoDataUri: validatedFields.data.image,
    });
    
    const newHistoryEntry = { question, image };
    const updatedHistory = [newHistoryEntry, ...history].slice(0, 15);


    if (result.finalAnswer && result.solutions) {
        return {
            message: "Success",
            finalAnswer: result.finalAnswer,
            solutions: result.solutions,
            flowchart: result.flowchart,
            history: updatedHistory,
        };
    } else {
        return {
            message: "The AI could not provide an answer. Please try again.",
            input: { question, image },
            history,
        }
    }

  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      input: { question, image },
      history,
    };
  }
}


export async function sendFeeReminders(): Promise<{ success: boolean, message?: string, remindersSent?: number }> {
    try {
        const result = await feeReminderFlow();
        return {
            success: true,
            message: result.message,
            remindersSent: result.remindersSent
        };
    } catch (error: any) {
        console.error("Failed to run fee reminder flow:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred while sending reminders."
        };
    }
}

export async function sendSingleReminder(input: SingleFeeReminderInput): Promise<{ success: boolean, message?: string }> {
    try {
        const result = await singleFeeReminderFlow(input);
        return { success: true, message: result.status };
    } catch (error: any) {
        console.error("Failed to run single reminder flow:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred while sending the reminder."
        };
    }
}
