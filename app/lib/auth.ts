// ==================== 管理员认证中间件 ====================
/**
 * 提供可复用的管理员认证功能
 * 用于保护所有 Admin API 路由
 *
 * 安全特性:
 * - JWT Token 签名和验证
 * - bcrypt 密码哈希和比较
 * - Token 自动过期
 * - 安全响应头
 */

import { NextRequest } from "next/server";
import { ENV } from "./env";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ==================== 类型定义 ====================
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  admin?: AdminUser;
  error?: string;
}

export interface JWTPayload {
  adminId: string;
  email: string;
  type: string;
  iat?: number;
  exp?: number;
}

// 管理员账户配置（不包含密码）
const ADMIN_ACCOUNTS: AdminUser[] = [
  {
    id: "admin_001",
    email: ENV.ADMIN_EMAIL,
    name: "Super Admin",
    role: "super_admin"
  }
];

// ==================== JWT Token 管理 ====================
/**
 * 生成 JWT Token
 * 使用 HS256 算法签名，包含管理员信息和过期时间
 */
export function generateAdminToken(adminId: string, adminEmail: string): string {
  const payload: JWTPayload = {
    adminId,
    email: adminEmail,
    type: "admin_access"
  };

  const token = jwt.sign(
    payload,
    ENV.JWT_SECRET,
    {
      expiresIn: ENV.JWT_EXPIRES_IN as any,
      issuer: "warehouse-worker-resume",
      audience: "admin-api"
    }
  );

  return token;
}

/**
 * 验证 JWT Token
 * 检查签名、过期时间、签发者和受众
 */
export function verifyAdminToken(token: string): { valid: boolean; payload?: JWTPayload; error?: string } {
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET, {
      issuer: "warehouse-worker-resume",
      audience: "admin-api"
    }) as JWTPayload;

    return { valid: true, payload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, error: "Token has expired" };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { valid: false, error: "Invalid token signature" };
    }
    return { valid: false, error: "Token verification failed" };
  }
}

// ==================== 密码管理 ====================
/**
 * 哈希密码（用于首次设置或更改密码）
 * 使用 bcrypt，salt rounds = 10
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

/**
 * 验证密码
 * 比较明文密码和哈希密码
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * 获取管理员密码哈希
 * 优先使用环境变量中的哈希密码，如果没有则返回明文（开发环境）
 */
export function getAdminPasswordHash(): string {
  // 生产环境必须使用哈希密码
  if (ENV.ADMIN_PASSWORD_HASH) {
    return ENV.ADMIN_PASSWORD_HASH;
  }

  // 开发环境：如果设置了哈希密码，使用它
  if (ENV.ADMIN_PASSWORD && !ENV.ADMIN_PASSWORD.startsWith("$2b$")) {
    // 明文密码 - 开发环境警告
    if (ENV.NODE_ENV === "production") {
      console.error("⚠️  SECURITY WARNING: Using plain text password in production!");
    }
    return ENV.ADMIN_PASSWORD;
  }

  return ENV.ADMIN_PASSWORD;
}

/**
 * 检查是否需要哈希密码
 * 如果密码不是 bcrypt 格式，则需要哈希
 */
export function needsPasswordHash(): boolean {
  const password = getAdminPasswordHash();
  return !password.startsWith("$2b$");
}

// ==================== Token 提取 ====================
/**
 * 从请求中提取 JWT token
 * 优先从 Authorization header 获取，其次从 cookie 获取
 */
function extractToken(req: NextRequest): string | null {
  // 优先从 Authorization header 获取
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // 其次从 cookie 获取
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map(c => c.trim());
    const tokenCookie = cookies.find(c => c.startsWith("admin_token="));
    if (tokenCookie) {
      return tokenCookie.substring(12);
    }
  }

  return null;
}

// ==================== 管理员认证 ====================
/**
 * 验证管理员身份并返回管理员信息
 * 这是一个中间件函数，可用于所有需要认证的 API 路由
 *
 * 使用示例:
 * ```typescript
 * export async function GET(req: NextRequest) {
 *   const auth = verifyAdminAuth(req);
 *   if (!auth.success) {
 *     return createAuthResponse(auth.error!, 401);
 *   }
 *   // auth.admin 包含管理员信息
 * }
 * ```
 */
export function verifyAdminAuth(req: NextRequest): AuthResult {
  try {
    const token = extractToken(req);

    if (!token) {
      return {
        success: false,
        error: "Authentication token missing"
      };
    }

    // 验证 JWT token
    const verification = verifyAdminToken(token);

    if (!verification.valid) {
      return {
        success: false,
        error: verification.error || "Invalid token"
      };
    }

    // 从 JWT payload 中提取管理员 ID
    const adminId = verification.payload!.adminId;

    // 查找管理员账户
    const adminAccount = ADMIN_ACCOUNTS.find(account => account.id === adminId);

    if (!adminAccount) {
      return {
        success: false,
        error: "Admin account not found"
      };
    }

    return {
      success: true,
      admin: adminAccount
    };

  } catch (error) {
    console.error("[Auth Middleware Error]", error);
    return {
      success: false,
      error: "Authentication failed"
    };
  }
}

/**
 * 创建认证失败的响应
 */
export function createAuthResponse(error: string, status: number = 401): Response {
  return new Response(JSON.stringify({
    success: false,
    error
  }), {
    status,
    headers: getSecurityHeaders()
  });
}

// ==================== 安全响应头 ====================
/**
 * 添加安全相关的响应头
 * 防止常见的 Web 攻击
 */
export function getSecurityHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };
}

// ==================== 工具函数 ====================
/**
 * 生成安全的 JWT secret
 * 用于生成生产环境的随机密钥
 */
export function generateSecureSecret(): string {
  const crypto = require("crypto");
  return crypto.randomBytes(64).toString("hex");
}

/**
 * 验证 JWT secret 强度
 * 至少需要 32 个字符
 */
export function validateSecretStrength(secret: string): { valid: boolean; error?: string } {
  if (secret.length < 32) {
    return {
      valid: false,
      error: "JWT_SECRET must be at least 32 characters long"
    };
  }

  if (secret === "your-super-secret-jwt-key-min-32-characters-long-change-in-production") {
    return {
      valid: false,
      error: "JWT_SECRET is using default value. Please change it in production!"
    };
  }

  return { valid: true };
}
