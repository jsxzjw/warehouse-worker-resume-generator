import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface ATSScoreInput {
  resumeText: string;
  jobDescription: string;
}

export interface ATSScoreOutput {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  readabilityScore: number;
  suggestions: string[];
}

export async function calculateATSScore(
  input: ATSScoreInput
): Promise<ATSScoreOutput> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an ATS (Applicant Tracking System) expert. Analyze how well a resume matches a job description.

Scoring Criteria (0-100):
1. Keyword matching (40 points)
2. Skills alignment (25 points)
3. Experience relevance (20 points)
4. Format & structure (15 points)

Output JSON format:
{
  "atsScore": 85,
  "matchedKeywords": ["forklift", "inventory management", ...],
  "missingKeywords": ["SAP", "cross-docking", ...],
  "readabilityScore": 8,
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    ...
  ]
}`
      },
      {
        role: 'user',
        content: `Resume:
${input.resumeText}

Job Description:
${input.jobDescription}

Analyze ATS compatibility and provide actionable suggestions.`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  return result as ATSScoreOutput;
}
