'use server';
/**
 * @fileOverview Extracts text from an image using AI.
 *
 * - extractTextFromImage - A function that performs OCR on an image.
 * - ExtractTextInput - The input type for the function.
 * - ExtractTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a document or page, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextInput = z.infer<typeof ExtractTextInputSchema>;

const ExtractTextOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the image. It should be returned as clean, unformatted text.'),
});
export type ExtractTextOutput = z.infer<typeof ExtractTextOutputSchema>;


export async function extractTextFromImage(input: ExtractTextInput): Promise<ExtractTextOutput> {
  return extractTextFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ocrPrompt',
  input: {schema: ExtractTextInputSchema},
  output: {schema: ExtractTextOutputSchema},
  prompt: `You are an Optical Character Recognition (OCR) expert. Your task is to accurately extract all text from the provided image.

Please adhere to the following rules:
1.  Return ONLY the extracted text.
2.  Do not add any commentary, headings, or explanations.
3.  Preserve line breaks and basic formatting as much as possible.

Image to process:
{{media url=photoDataUri}}`,
});

const extractTextFromImageFlow = ai.defineFlow(
  {
    name: 'extractTextFromImageFlow',
    inputSchema: ExtractTextInputSchema,
    outputSchema: ExtractTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
