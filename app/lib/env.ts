// ==================== 环境变量配置管理 ====================
/**
 * 环境变量统一管���
 * 提供类型安全的环境变量访问和验证
 */

export const ENV = {
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
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",

  // Email Service
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",

  // Admin Credentials (生产环境必须设置)
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@warehouseworkerresume.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123456",
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || "",

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-min-32-characters-long-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",

  // Application
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_MAX_FREE_RESUMES: parseInt(process.env.NEXT_PUBLIC_MAX_FREE_RESUMES || "1"),
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// ==================== 环境变量验证 ====================

interface ValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * 验证必需的环境变量
 */
export function validateEnv(requiredOnly: boolean = false): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // 必需的环境变量
  if (!ENV.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");

  // 生产环境必需的变量
  if (ENV.NODE_ENV === "production") {
    if (!ENV.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
    if (!ENV.RESEND_API_KEY) warnings.push("RESEND_API_KEY (email features will be disabled)");
  }

  // 可选变量的警告
  if (!ENV.STRIPE_SECRET_KEY && requiredOnly) {
    warnings.push("Stripe payment features will be disabled");
  }
  if (!ENV.RESEND_API_KEY && requiredOnly) {
    warnings.push("Email features will be disabled");
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings
  };
}

/**
 * 获取公开的环境变量（客户端可用）
 */
export function getPublicEnv() {
  return {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: ENV.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_MAX_FREE_RESUMES: ENV.NEXT_PUBLIC_MAX_FREE_RESUMES,
    NODE_ENV: ENV.NODE_ENV
  };
}

/**
 * 检查功能是否可用
 */
export const featureFlags = {
  stripe: !!ENV.STRIPE_SECRET_KEY && !!ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  email: !!ENV.RESEND_API_KEY,
  production: ENV.NODE_ENV === "production",
  development: ENV.NODE_ENV !== "production"
};

/**
 * 获取 API 配置
 */
export function getApiConfig() {
  return {
    openai: {
      apiKey: ENV.OPENAI_API_KEY,
      baseURL: ENV.OPENAI_BASE_URL,
      model: ENV.OPENAI_MODEL,
      temperature: ENV.OPENAI_TEMPERATURE,
      maxTokens: ENV.OPENAI_MAX_TOKENS,
      timeout: 60000,
      maxRetries: 2
    },
    stripe: {
      secretKey: ENV.STRIPE_SECRET_KEY,
      publishableKey: ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      priceBasic: ENV.STRIPE_PRICE_BASIC,
      pricePremium: ENV.STRIPE_PRICE_PREMIUM
    },
    email: {
      apiKey: ENV.RESEND_API_KEY
    }
  };
}

// ==================== 错误消息 ====================

export const ERROR_MESSAGES = {
  MISSING_API_KEY: "Server configuration error: API key is missing",
  MISSING_STRIPE: "Payment features are currently unavailable",
  MISSING_EMAIL: "Email features are currently unavailable",
  NETWORK_ERROR: "Network connection error. Please check your internet connection.",
  TIMEOUT: "Request timeout. The server is taking too long to respond.",
  RATE_LIMIT: "Too many requests. Please wait a moment before trying again.",
  INSUFFICIENT_QUOTA: "Insufficient account balance. Please top up your account.",
  AUTH_FAILED: "Authentication failed. Please check your API credentials.",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable. Please try again later."
};

// ==================== 导出 ====================

export type EnvConfig = typeof ENV;
export type FeatureFlags = typeof featureFlags;
export type ApiConfig = ReturnType<typeof getApiConfig>;
