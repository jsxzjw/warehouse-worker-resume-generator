import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface GenerateExperienceInput {
  originalExperience: string;
  jobDescription: string;
  targetJobTitle: string;
}

export interface GenerateExperienceOutput {
  optimizedExperience: string[];
  keywordsExtracted: string[];
  atsOptimized: boolean;
}

export async function generateTailoredExperience(
  input: GenerateExperienceInput
): Promise<GenerateExperienceOutput> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert resume writer specializing in warehouse and logistics positions. Your task is to rewrite work experience to be ATS-optimized and tailored to specific job descriptions.

Rules:
1. Extract 5-8 key skills/keywords from the job description
2. Rewrite the original experience using warehouse/logistics industry terminology
3. Quantify achievements with numbers (orders processed, team size, efficiency gains)
4. Create 3-5 bullet points that are ATS-friendly
5. Start each bullet with strong action verbs
6. Keep each bullet under 25 words

Output JSON format:
{
  "optimizedExperience": ["bullet point 1", "bullet point 2", ...],
  "keywordsExtracted": ["keyword1", "keyword2", ...],
  "atsOptimized": true
}`
      },
      {
        role: 'user',
        content: `Original Experience: ${input.originalExperience}

Target Job Title: ${input.targetJobTitle}

Job Description:
${input.jobDescription}

Please generate ATS-optimized bullet points for this experience.`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  return result as GenerateExperienceOutput;
}
