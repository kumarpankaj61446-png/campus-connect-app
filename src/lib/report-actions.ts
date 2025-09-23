
"use server";

import { z } from "zod";
import { summarizeReports } from "@/ai/flows/summarize-reports";
import { extractTextFromImage } from "@/ai/flows/extract-text-from-image";

const reportSchema = z.object({
  reportText: z.string().optional(),
  imageData: z.string().optional(),
}).refine(data => data.reportText || data.imageData, {
    message: "Please either upload/scan a file or paste text to be summarized.",
    path: ["reportText"],
});


export type ReportState = {
  message?: string;
  summary?: string;
  errors?: {
    reportText?: string[];
  };
  input?: {
    reportText: string;
  },
  extractedText?: string;
};

export async function generateReport(
  prevState: ReportState,
  formData: FormData
): Promise<ReportState> {
  const reportText = formData.get("reportText") as string;
  const imageData = formData.get("imageData") as string;

  const validatedFields = reportSchema.safeParse({
    reportText,
    imageData,
  });

  if (!validatedFields.success) {
    return {
      message: "Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      input: { reportText }
    };
  }
  
  let textToSummarize = reportText;
  let extractedText: string | undefined = undefined;

  try {
    // If there's image data, extract text from it first
    if (imageData) {
        const extractionResult = await extractTextFromImage({ photoDataUri: imageData });
        if (extractionResult.extractedText) {
            textToSummarize = extractionResult.extractedText;
            extractedText = extractionResult.extractedText;
        } else {
            return {
                 message: "AI could not extract text from the scanned image. Please type it manually.",
                 input: { reportText }
            }
        }
    }
    
    if (!textToSummarize) {
         return {
            message: "There is no text to summarize. Please upload, scan or paste content.",
            input: { reportText }
        };
    }

    const result = await summarizeReports({
      reportText: textToSummarize,
    });
    
    if (result.summary) {
        return {
            message: "Success",
            summary: result.summary,
            input: { reportText: textToSummarize },
            extractedText
        };
    } else {
        return {
            message: "The AI could not provide a summary. Please try again.",
            input: { reportText: textToSummarize }
        }
    }

  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      input: { reportText }
    };
  }
}
