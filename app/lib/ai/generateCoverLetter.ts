import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface GenerateCoverLetterInput {
  userName: string;
  targetCompany: string;
  targetJobTitle: string;
  jobDescription: string;
  resumeSummary: string;
}

export interface GenerateCoverLetterOutput {
  coverLetter: string;
  wordCount: number;
}

export async function generateCoverLetter(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert cover letter writer for warehouse and logistics positions. Generate professional, tailored cover letters.

Rules:
1. Length: 200-300 words
2. Professional, concise tone
3. No template痕迹 - customize for each company/role
4. Include specific details from the job description
5. Highlight relevant warehouse/logistics experience
6. Strong opening and closing
7. Focus on value proposition

Output JSON format:
{
  "coverLetter": "Full cover letter text",
  "wordCount": 250
}`
      },
      {
        role: 'user',
        content: `Applicant Name: ${input.userName}
Target Company: ${input.targetCompany}
Target Position: ${input.targetJobTitle}

Job Description:
${input.jobDescription}

Resume Summary:
${input.resumeSummary}

Generate a professional cover letter for this application.`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  return result as GenerateCoverLetterOutput;
}
