import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

interface GenerateRequest {
  prompt: string;
}

interface GenerateResponse {
  resume?: string;
  error?: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: string;
}

// Error types
const ErrorCodes = {
  MISSING_API_KEY: "MISSING_API_KEY",
  MISSING_PROMPT: "MISSING_PROMPT",
  API_ERROR: "API_ERROR",
  TIMEOUT: "TIMEOUT",
  RATE_LIMIT: "RATE_LIMIT",
  UNKNOWN: "UNKNOWN"
} as const;

function createErrorResponse(error: ApiError, status: number): Response {
  return new Response(JSON.stringify(error), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const RETRY_COUNT = 1;
const TIMEOUT_MS = 30000; // 30 seconds

async function fetchWithRetry(
  fn: () => Promise<OpenAI.Chat.Completions.ChatCompletion>,
  retries: number = RETRY_COUNT
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  try {
    return await Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), TIMEOUT_MS)
      )
    ]);
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithRetry(fn, retries - 1);
    }
    throw error;
  }
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("econnreset")
    );
  }
  return false;
}

function isRateLimitError(error: unknown): boolean {
  if (error && typeof error === "object" && "status" in error) {
    return (error.status as number) === 429;
  }
  return false;
}

const RESUME_GENERATION_PROMPT = `You are a professional resume writer specializing in warehouse and logistics positions. Generate a polished, professional resume based on the information provided.

Requirements:
1. Format as clean, professional plain text (no markdown formatting like ** or ##)
2. Structure with clear sections: CONTACT INFORMATION, PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS
3. Include optional sections if provided: CERTIFICATIONS, LANGUAGES
4. Use strong action verbs and quantifiable achievements
5. Keep language professional but accessible
6. Focus on relevant warehouse skills: inventory management, forklift operation, shipping/receiving, safety compliance, etc.
7. Format contact info at the top in a standard business format
8. Use bullet points for experience entries
9. Keep total length to 1-2 pages worth of content

User Information:
`;

export async function POST(req: Request): Promise<Response> {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return createErrorResponse(
        {
          code: ErrorCodes.MISSING_API_KEY,
          message: "OpenAI API key is not configured",
          details: "Please set OPENAI_API_KEY environment variable"
        },
        500
      );
    }

    // Parse and validate request body
    let body: GenerateRequest;
    try {
      body = await req.json();
    } catch {
      return createErrorResponse(
        {
          code: ErrorCodes.MISSING_PROMPT,
          message: "Invalid request body",
          details: "Request must be valid JSON"
        },
        400
      );
    }

    if (!body.prompt || typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
      return createErrorResponse(
        {
          code: ErrorCodes.MISSING_PROMPT,
          message: "Prompt is required",
          details: "Please provide resume information to generate"
        },
        400
      );
    }

    const fullPrompt = RESUME_GENERATION_PROMPT + body.prompt;

    // Fetch with retry logic
    const completion = await fetchWithRetry(async () => {
      return await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Generate clean, well-formatted resumes in plain text format."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });
    });

    const resumeText = completion.choices[0]?.message?.content || "";

    if (!resumeText) {
      return createErrorResponse(
        {
          code: ErrorCodes.API_ERROR,
          message: "Failed to generate resume content",
          details: "The API returned an empty response"
        },
        500
      );
    }

    const response: GenerateResponse = { resume: resumeText };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: unknown) {
    console.error("OpenAI API error:", error);

    // Handle rate limiting specifically
    if (isRateLimitError(error)) {
      return createErrorResponse(
        {
          code: ErrorCodes.RATE_LIMIT,
          message: "Rate limit exceeded",
          details: "Too many requests. Please try again in a moment."
        },
        429
      );
    }

    // Handle timeout
    if (error instanceof Error && error.message === "Request timeout") {
      return createErrorResponse(
        {
          code: ErrorCodes.TIMEOUT,
          message: "Request timeout",
          details: "The resume generation took too long. Please try again."
        },
        408
      );
    }

    // Generic error response
    return createErrorResponse(
      {
        code: ErrorCodes.API_ERROR,
        message: "Failed to generate resume",
        details: error instanceof Error ? error.message : "Unknown error occurred"
      },
      500
    );
  }
}

// Export for testing
export { ErrorCodes, type ApiError, type GenerateRequest, type GenerateResponse };
