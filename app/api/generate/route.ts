import OpenAI from "openai";

// ==================== 环境变量管理 ====================
const ENV = {
  // OpenAI API
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || process.env.NEXT_PUBLIC_OPENAI_BASE_URL || "https://api.openai.com/v1",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
  OPENAI_TEMPERATURE: parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
  OPENAI_MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || "2000"),

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_PRICE_BASIC: process.env.STRIPE_PRICE_BASIC || "",
  STRIPE_PRICE_PREMIUM: process.env.STRIPE_PRICE_PREMIUM || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  // Email Service
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",

  // Application
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_MAX_FREE_RESUMES: parseInt(process.env.NEXT_PUBLIC_MAX_FREE_RESUMES || "1"),
} as const;

// 验证必需的环境变量
function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!ENV.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");

  return {
    valid: missing.length === 0,
    missing
  };
}

// ==================== 类型定义 ====================
interface GenerateRequest {
  prompt: string;
  template?: "modern" | "classic" | "professional";
  experience?: string;
}

interface GenerateResponse {
  resume?: string;
  error?: string;
  metadata?: {
    model: string;
    tokensUsed: number;
    template: string;
  };
}

interface ApiError {
  code: string;
  message: string;
  details?: string;
  retryable?: boolean;
}

// ==================== 错误代码 ====================
const ErrorCodes = {
  MISSING_API_KEY: "MISSING_API_KEY",
  MISSING_PROMPT: "MISSING_PROMPT",
  API_ERROR: "API_ERROR",
  TIMEOUT: "TIMEOUT",
  RATE_LIMIT: "RATE_LIMIT",
  INSUFFICIENT_QUOTA: "INSUFFICIENT_QUOTA",
  NETWORK_ERROR: "NETWORK_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  UNKNOWN: "UNKNOWN"
} as const;

// ==================== OpenAI 客户端 ====================
const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
  baseURL: ENV.OPENAI_BASE_URL,
  timeout: 60000, // 60 seconds
  maxRetries: 2,
});

// ==================== 模板特定关键词优化 ====================
const TEMPLATE_KEYWORDS = {
  modern: [
    "results-driven", "innovative", "dynamic", "forward-thinking",
    "metrics-oriented", "data-driven", "efficient", "productive"
  ],
  classic: [
    "dependable", "experienced", "dedicated", "conscientious",
    "thorough", "methodical", "professional", "consistent"
  ],
  professional: [
    "strategic", "leadership", "managerial", "supervisory",
    "analytical", "process-improvement", "cost-reduction", "quality-focused"
  ]
};

function getTemplateOptimizationPrompt(template: "modern" | "classic" | "professional" = "modern"): string {
  const keywords = TEMPLATE_KEYWORDS[template].join(", ");
  const templateStyles = {
    modern: "Emphasize innovation, efficiency metrics, and modern warehouse technologies",
    classic: "Emphasize reliability, experience, and traditional warehouse operations",
    professional: "Emphasize leadership, process improvements, and managerial achievements"
  };

  return `

TEMPLATE: ${template.toUpperCase()} STYLE
Focus on: ${templateStyles[template]}
Key keywords to incorporate: ${keywords}
`;
}

// ==================== 优化的简历生成提示词 ====================
function createEnhancedPrompt(
  userPrompt: string,
  template: "modern" | "classic" | "professional" = "modern"
): string {
  const basePrompt = `You are an expert resume writer specializing in warehouse, logistics, and supply chain positions. Create a highly professional, ATS-optimized resume.

CRITICAL FORMATTING RULES:
- Use ONLY plain text - NO markdown, NO **bold**, NO ## headers
- Use ALL CAPS for section headers followed by a colon
- Section headers must be: CONTACT INFORMATION:, PROFESSIONAL SUMMARY:, WORK EXPERIENCE:, EDUCATION:, SKILLS:, CERTIFICATIONS:, LANGUAGES:
- Put a blank line before each section header
- Use dash (-) for all bullet points
- Put company/position names on their own lines
- Use specific, quantifiable achievements (numbers, percentages, results)
- Keep total content under 800 words

STRUCTURE:
1. CONTACT INFORMATION: - Name, email, phone, location
2. PROFESSIONAL SUMMARY: - 2-3 powerful summary lines
3. WORK EXPERIENCE: - Job Title, Company, Dates, 3-5 achievements per job
4. EDUCATION: - Degree, School, Year
5. SKILLS: - Technical skills, equipment, certifications
6. CERTIFICATIONS: - Professional certifications
7. LANGUAGES: - Language proficiency

CONTENT GUIDELINES:
- Highlight warehouse skills: inventory, forklift, shipping/receiving, order fulfillment
- Emphasize safety, compliance, productivity improvements
- Use action verbs: Managed, Supervised, Operated, Processed, Maintained, Coordinated
- Include quantifiable results: "increased efficiency by 25%", "reduced errors by 40%"
- Show leadership and teamwork abilities`;

  return basePrompt + getTemplateOptimizationPrompt(template) + `\n\nUser Information:\n${userPrompt}`;
}

// ==================== 错误响应创建 ====================
function createErrorResponse(error: ApiError, status: number): Response {
  // 记录错误（生产环境应该使用日志服务）
  if (status >= 500) {
    console.error("Server Error:", error);
  } else {
    console.warn("Client Error:", error);
  }

  return new Response(JSON.stringify(error), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Error-Code": error.code
    }
  });
}

// ==================== 重试逻辑 ====================
const RETRY_CONFIG = {
  maxRetries: 2,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  timeoutMs: 60000 // 60 seconds
};

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = RETRY_CONFIG.maxRetries
): Promise<T> {
  try {
    return await Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), RETRY_CONFIG.timeoutMs)
      )
    ]);
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      const delay = Math.min(
        RETRY_CONFIG.initialDelay * Math.pow(2, RETRY_CONFIG.maxRetries - retries),
        RETRY_CONFIG.maxDelay
      );
      await new Promise(resolve => setTimeout(resolve, delay));
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
      message.includes("econnrefused") ||
      message.includes("etimedout")
    );
  }
  return false;
}

function isRateLimitError(error: unknown): boolean {
  if (error && typeof error === "object") {
    if ("status" in error) {
      return (error.status as number) === 429;
    }
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes("rate limit") || message.includes("429");
    }
  }
  return false;
}

// ==================== 主 API 路由 ====================
export async function POST(req: Request): Promise<Response> {
  try {
    // 验证环境变量
    const envValidation = validateEnv();
    if (!envValidation.valid) {
      return createErrorResponse(
        {
          code: ErrorCodes.MISSING_API_KEY,
          message: "Server configuration error",
          details: `Missing environment variables: ${envValidation.missing.join(", ")}`
        },
        500
      );
    }

    // 解析和验证请求
    let body: GenerateRequest;
    try {
      body = await req.json();
    } catch {
      return createErrorResponse(
        {
          code: ErrorCodes.INVALID_REQUEST,
          message: "Invalid request body",
          details: "Request must be valid JSON",
          retryable: false
        },
        400
      );
    }

    if (!body.prompt || typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
      return createErrorResponse(
        {
          code: ErrorCodes.MISSING_PROMPT,
          message: "Prompt is required",
          details: "Please provide resume information to generate",
          retryable: false
        },
        400
      );
    }

    // 获取模板类型（默认 modern）
    const template = body.template || "modern";

    // 创建优化的提示词
    const enhancedPrompt = createEnhancedPrompt(body.prompt, template);

    // 调用 OpenAI API（带重试逻辑）
    const completion = await fetchWithRetry(async () => {
      return await openai.chat.completions.create({
        model: ENV.OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Generate clean, well-formatted resumes in plain text format optimized for Applicant Tracking Systems (ATS)."
          },
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        temperature: ENV.OPENAI_TEMPERATURE,
        max_tokens: ENV.OPENAI_MAX_TOKENS,
        presence_penalty: 0.3, // 鼓励多样性
        frequency_penalty: 0.3 // 减少重复
      });
    });

    const resumeText = completion.choices[0]?.message?.content || "";

    if (!resumeText) {
      return createErrorResponse(
        {
          code: ErrorCodes.API_ERROR,
          message: "Failed to generate resume content",
          details: "The API returned an empty response. Please try again.",
          retryable: true
        },
        500
      );
    }

    // 成功响应
    const response: GenerateResponse = {
      resume: resumeText,
      metadata: {
        model: ENV.OPENAI_MODEL,
        tokensUsed: completion.usage?.total_tokens || 0,
        template: template
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Tokens-Used": String(completion.usage?.total_tokens || 0)
      }
    });

  } catch (error: unknown) {
    console.error("API Error:", error);
    return handleApiError(error);
  }
}

// ==================== 错误处理 ====================
function handleApiError(error: unknown): Response {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // 余额不足
  if (errorMessage.includes("余额不足") ||
      errorMessage.includes("insufficient") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("402")) {
    return createErrorResponse(
      {
        code: ErrorCodes.INSUFFICIENT_QUOTA,
        message: "Insufficient account balance",
        details: "Please top up your account balance to continue generating resumes.",
        retryable: false
      },
      402
    );
  }

  // 速率限制
  if (isRateLimitError(error)) {
    return createErrorResponse(
      {
        code: ErrorCodes.RATE_LIMIT,
        message: "Too many requests",
        details: "Please wait a moment before trying again.",
        retryable: true
      },
      429
    );
  }

  // 网络错误
  if (errorMessage.includes("network") ||
      errorMessage.includes("econnrefused") ||
      errorMessage.includes("econnreset") ||
      errorMessage.includes("etimedout")) {
    return createErrorResponse(
      {
        code: ErrorCodes.NETWORK_ERROR,
        message: "Network connection error",
        details: "Please check your internet connection and try again.",
        retryable: true
      },
      503
    );
  }

  // 认证错误
  if (errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("unauthorized")) {
    return createErrorResponse(
      {
        code: ErrorCodes.API_ERROR,
        message: "API authentication failed",
        details: "Please check your API key configuration.",
        retryable: false
      },
      401
    );
  }

  // 服务不可用
  if (errorMessage.includes("503") || errorMessage.includes("service unavailable")) {
    return createErrorResponse(
      {
        code: ErrorCodes.SERVICE_UNAVAILABLE,
        message: "Service temporarily unavailable",
        details: "The AI service is currently unavailable. Please try again in a few minutes.",
        retryable: true
      },
      503
    );
  }

  // 超时
  if (errorMessage.includes("timeout")) {
    return createErrorResponse(
      {
        code: ErrorCodes.TIMEOUT,
        message: "Request timeout",
        details: "The resume generation is taking longer than expected. Please try again.",
        retryable: true
      },
      408
    );
  }

  // 通用错误
  return createErrorResponse(
    {
      code: ErrorCodes.UNKNOWN,
      message: "Unable to generate resume",
      details: "An unexpected error occurred. Please try again.",
      retryable: true
    },
    500
  );
}

// ==================== 导出 ====================
export { ErrorCodes, type ApiError, type GenerateRequest, type GenerateResponse, ENV };
