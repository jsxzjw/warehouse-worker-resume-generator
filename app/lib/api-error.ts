// ==================== API 错误处理工具 ====================

/**
 * 标准 API 错误代码
 */
export enum ErrorCode {
  // 请求错误 (4xx)
  MISSING_API_KEY = "MISSING_API_KEY",
  MISSING_PROMPT = "MISSING_PROMPT",
  INVALID_REQUEST = "INVALID_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",

  // 服务器错误 (5xx)
  API_ERROR = "API_ERROR",
  TIMEOUT = "TIMEOUT",
  RATE_LIMIT = "RATE_LIMIT",
  INSUFFICIENT_QUOTA = "INSUFFICIENT_QUOTA",
  NETWORK_ERROR = "NETWORK_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  UNKNOWN = "UNKNOWN"
}

/**
 * HTTP 状态码映射
 */
export const HttpStatus = {
  [ErrorCode.MISSING_API_KEY]: 500,
  [ErrorCode.MISSING_PROMPT]: 400,
  [ErrorCode.INVALID_REQUEST]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.API_ERROR]: 500,
  [ErrorCode.TIMEOUT]: 408,
  [ErrorCode.RATE_LIMIT]: 429,
  [ErrorCode.INSUFFICIENT_QUOTA]: 402,
  [ErrorCode.NETWORK_ERROR]: 503,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
  [ErrorCode.UNKNOWN]: 500
} as const;

/**
 * API 错误接口
 */
export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: string;
  retryable: boolean;
  timestamp: string;
  requestId?: string;
}

/**
 * 创建 API 错误响应
 */
export function createApiErrorResponse(
  code: ErrorCode,
  message: string,
  details?: string,
  retryable: boolean = false,
  requestId?: string
): Response {
  const error: ApiError = {
    code,
    message,
    details,
    retryable,
    timestamp: new Date().toISOString(),
    requestId
  };

  const status = HttpStatus[code];

  // 记录错误
  if (status >= 500) {
    console.error("[API Error]", JSON.stringify(error, null, 2));
  } else {
    console.warn("[API Warning]", JSON.stringify(error, null, 2));
  }

  return new Response(JSON.stringify(error), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Error-Code": code,
      "X-Request-ID": requestId || generateRequestId(),
      "X-Retryable": String(retryable)
    }
  });
}

/**
 * 处理异常并返回标准错误响应
 */
export function handleApiError(error: unknown, requestId?: string): Response {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // 余额不足
  if (isInsufficientQuotaError(errorMessage)) {
    return createApiErrorResponse(
      ErrorCode.INSUFFICIENT_QUOTA,
      "Insufficient account balance",
      "Please top up your account balance to continue generating resumes.",
      false,
      requestId
    );
  }

  // 速率限制
  if (isRateLimitError(error)) {
    return createApiErrorResponse(
      ErrorCode.RATE_LIMIT,
      "Too many requests",
      "Please wait a moment before trying again.",
      true,
      requestId
    );
  }

  // 网络错误
  if (isNetworkError(errorMessage)) {
    return createApiErrorResponse(
      ErrorCode.NETWORK_ERROR,
      "Network connection error",
      "Please check your internet connection and try again.",
      true,
      requestId
    );
  }

  // 认证错误
  if (isAuthError(errorMessage)) {
    return createApiErrorResponse(
      ErrorCode.UNAUTHORIZED,
      "API authentication failed",
      "Please check your API key configuration.",
      false,
      requestId
    );
  }

  // 服务不可用
  if (isServiceUnavailableError(errorMessage)) {
    return createApiErrorResponse(
      ErrorCode.SERVICE_UNAVAILABLE,
      "Service temporarily unavailable",
      "The AI service is currently unavailable. Please try again in a few minutes.",
      true,
      requestId
    );
  }

  // 超时
  if (isTimeoutError(errorMessage)) {
    return createApiErrorResponse(
      ErrorCode.TIMEOUT,
      "Request timeout",
      "The resume generation is taking longer than expected. Please try again.",
      true,
      requestId
    );
  }

  // 通用错误
  return createApiErrorResponse(
    ErrorCode.UNKNOWN,
    "Unable to generate resume",
    "An unexpected error occurred. Please try again.",
    true,
    requestId
  );
}

// ==================== 错误检测辅助函数 ====================

/**
 * 检测余额不足错误
 */
export function isInsufficientQuotaError(message: string): boolean {
  const keywords = ["余额不足", "insufficient", "quota", "402", "balance"];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
}

/**
 * 检测速率限制错误
 */
export function isRateLimitError(error: unknown): boolean {
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

/**
 * 检测网络错误
 */
export function isNetworkError(message: string): boolean {
  const keywords = [
    "network",
    "econnrefused",
    "econnreset",
    "etimedout",
    "enotfound",
    "connection reset"
  ];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
}

/**
 * 检测认证错误
 */
export function isAuthError(message: string): boolean {
  const keywords = ["401", "403", "unauthorized", "forbidden", "invalid api key"];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
}

/**
 * 检测服务不可用错误
 */
export function isServiceUnavailableError(message: string): boolean {
  const keywords = ["503", "service unavailable", "temporarily unavailable"];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
}

/**
 * 检测超时错误
 */
export function isTimeoutError(message: string): boolean {
  return message.toLowerCase().includes("timeout");
}

/**
 * 检测可重试的错误
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("econnreset") ||
      message.includes("econnrefused") ||
      message.includes("etimedout") ||
      isRateLimitError(error)
    );
  }
  return false;
}

// ==================== 请求 ID 生成 ====================

/**
 * 生成唯一的请求 ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * 从请求头获取请求 ID
 */
export function getRequestId(headers: Headers): string {
  return headers.get("X-Request-ID") || generateRequestId();
}

// ==================== 用户友好的错误消息 ====================

export const USER_FRIENDLY_MESSAGES = {
  [ErrorCode.MISSING_API_KEY]: "Server is not properly configured. Please contact support.",
  [ErrorCode.MISSING_PROMPT]: "Please provide your information to generate a resume.",
  [ErrorCode.INVALID_REQUEST]: "Invalid request. Please check your input and try again.",
  [ErrorCode.UNAUTHORIZED]: "Authentication failed. Please refresh the page and try again.",
  [ErrorCode.TIMEOUT]: "Request is taking too long. Please try again.",
  [ErrorCode.RATE_LIMIT]: "You're making too many requests. Please wait a moment.",
  [ErrorCode.INSUFFICIENT_QUOTA]: "Account balance insufficient. Please top up your account.",
  [ErrorCode.NETWORK_ERROR]: "Network connection failed. Please check your internet.",
  [ErrorCode.SERVICE_UNAVAILABLE]: "Service is temporarily down. Please try again later.",
  [ErrorCode.UNKNOWN]: "Something went wrong. Please try again."
};
