import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: "https://api.evolink.ai/v1"
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
  INSUFFICIENT_QUOTA: "INSUFFICIENT_QUOTA",
  UNKNOWN: "UNKNOWN"
} as const;

function createErrorResponse(error: ApiError, status: number): Response {
  return new Response(JSON.stringify(error), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

const RETRY_COUNT = 1;
const TIMEOUT_MS = 60000; // 60 seconds

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
      message.includes("econnreset") ||
      message.includes("econnrefused")
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

const RESUME_GENERATION_PROMPT = `You are an expert resume writer specializing in warehouse, logistics, and supply chain positions. Create a highly professional, ATS-optimized resume in clean plain text format.

CRITICAL FORMATTING RULES:
- Use ONLY plain text - NO markdown, NO **bold**, NO ## headers
- Use ALL CAPS for section headers followed by a colon
- Section headers must be: CONTACT INFORMATION:, PROFESSIONAL SUMMARY:, WORK EXPERIENCE:, EDUCATION:, SKILLS:, CERTIFICATIONS:, LANGUAGES:
- Put a blank line before each section header
- Use dash (-) for all bullet points
- Put company/position names on their own lines (not on the same line as dates)
- Use specific, quantifiable achievements (numbers, percentages, results)

STRUCTURE:
1. CONTACT INFORMATION: - Name on first line, contact details on following lines
2. PROFESSIONAL SUMMARY: - 2-3 lines of powerful career summary
3. WORK EXPERIENCE: - For each job:
   - Job Title on one line
   - Company Name, Location | Employment Dates on next line
   - 3-5 bullet points with achievements
   - Start with action verbs: Managed, Supervised, Operated, Processed, Maintained, Coordinated
4. EDUCATION: - Degree, School Name, Location | Graduation Year
5. SKILLS: - Technical skills, certifications, equipment operation
6. CERTIFICATIONS: - Each on separate line if multiple
7. LANGUAGES: - Format as "Language - Proficiency Level"

CONTENT GUIDELINES:
- Highlight warehouse-specific skills: inventory control, forklift operation, shipping/receiving, order fulfillment
- Emphasize safety records and compliance
- Include productivity improvements and cost savings
- Show leadership and teamwork
- Use professional industry terminology
- Keep total content under 800 words

User Information:
`;

export async function POST(req: Request): Promise<Response> {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return createErrorResponse(
        {
          code: ErrorCodes.MISSING_API_KEY,
          message: "API key is not configured",
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

    // Fetch with retry logic using OpenAI SDK
    const completion = await fetchWithRetry(async () => {
      return await openai.chat.completions.create({
        model: "gemini-2.5-pro",
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
    console.error("API error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Handle insufficient quota (balance)
    if (errorMessage.includes("余额不足") || errorMessage.includes("insufficient") || errorMessage.includes("quota")) {
      return createErrorResponse(
        {
          code: ErrorCodes.INSUFFICIENT_QUOTA,
          message: "Insufficient account balance",
          details: "Please top up your account balance to continue generating resumes."
        },
        402
      );
    }

    // Handle rate limiting specifically
    if (isRateLimitError(error)) {
      return createErrorResponse(
        {
          code: ErrorCodes.RATE_LIMIT,
          message: "Too many requests",
          details: "Please wait a moment before trying again."
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
          details: "The resume generation is taking longer than expected. Please try again."
        },
        408
      );
    }

    // Generic error response with more helpful details
    let userMessage = "Unable to generate resume. Please try again.";
    let details = errorMessage;

    if (errorMessage.includes("401") || errorMessage.includes("403")) {
      userMessage = "API authentication failed";
      details = "Please check your API key configuration.";
    } else if (errorMessage.includes("404")) {
      userMessage = "API service not found";
      details = "Please check your API endpoint configuration.";
    } else if (errorMessage.includes("network") || errorMessage.includes("ECONNREFUSED")) {
      userMessage = "Network connection error";
      details = "Please check your internet connection and try again.";
    }

    return createErrorResponse(
      {
        code: ErrorCodes.API_ERROR,
        message: userMessage,
        details
      },
      500
    );
  }
}

// Export for testing
export { ErrorCodes, type ApiError, type GenerateRequest, type GenerateResponse };
