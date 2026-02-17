import { NextRequest } from "next/server";
import { ENV } from "../../../lib/env";
import {
  generateAdminToken,
  getSecurityHeaders,
  verifyPassword,
  getAdminPasswordHash,
  hashPassword
} from "../../../lib/auth";

// ==================== 类型定义 ====================
interface AdminLoginRequest {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  success: boolean;
  token?: string;
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message?: string;
  needsHash?: boolean;
  error?: string;
}

// ==================== 管理员账户配置 ====================
const ADMIN_ACCOUNTS = [
  {
    id: "admin_001",
    email: ENV.ADMIN_EMAIL,
    name: "Super Admin",
    role: "super_admin"
  }
];

// ==================== 错误处理 ====================
function createErrorResponse(message: string, status: number): Response {
  console.error("[Admin Auth Error]", message);

  return new Response(JSON.stringify({
    success: false,
    error: message
  }), {
    status,
    headers: getSecurityHeaders()
  });
}

// ==================== POST - 管理员登录 ====================
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: AdminLoginRequest = await req.json();

    // 验证必需字段
    if (!body.email || !body.password) {
      return createErrorResponse("Email and password are required", 400);
    }

    // 查找管理员账户
    const adminAccount = ADMIN_ACCOUNTS.find(
      account => account.email === body.email
    );

    if (!adminAccount) {
      return createErrorResponse("Invalid email or password", 401);
    }

    // 获取存储的密码（可能是哈希或明文）
    const storedPasswordHash = getAdminPasswordHash();
    const isHashed = storedPasswordHash.startsWith("$2b$");

    let passwordValid = false;

    if (isHashed) {
      // 使用 bcrypt 验证哈希密码
      passwordValid = await verifyPassword(body.password, storedPasswordHash);
      console.log("[Admin Login] Using bcrypt password verification");
    } else {
      // 开发环境：明文密码比较
      if (ENV.NODE_ENV === "production") {
        console.error("⚠️  SECURITY WARNING: Plain text password in production!");
      }
      passwordValid = body.password === storedPasswordHash;
      console.log("[Admin Login] Using plain text password comparison (development mode)");
    }

    if (!passwordValid) {
      return createErrorResponse("Invalid email or password", 401);
    }

    // 生成 JWT token（现在需要传递 adminEmail）
    const token = generateAdminToken(adminAccount.id, adminAccount.email);

    // 检查是否需要哈希密码
    const needsHash = !isHashed;

    // 返回成功响应（不包含密码）
    const response: AdminLoginResponse = {
      success: true,
      token,
      admin: {
        id: adminAccount.id,
        email: adminAccount.email,
        name: adminAccount.name,
        role: adminAccount.role
      },
      message: "Login successful",
      needsHash // 提示前端需要哈希密码（开发环境）
    };

    // 记录登录
    console.log("[Admin Login] Successful:", {
      adminId: adminAccount.id,
      email: adminAccount.email,
      timestamp: new Date().toISOString(),
      passwordType: isHashed ? "hashed" : "plain"
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...getSecurityHeaders(),
        // 设置 HttpOnly cookie
        "Set-Cookie": `admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
      }
    });

  } catch (error) {
    console.error("[Admin Login API Error]", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// ==================== GET - 生成密码哈希（仅开发环境） ====================
/**
 * 辅助接口：生成密码哈希
 * 仅用于开发环境，生产环境应该禁用此端点
 *
 * 使用方法: GET /api/admin/login?generate-hash=true&password=your-password
 */
export async function GET(req: NextRequest): Promise<Response> {
  // 仅允许开发环境
  if (ENV.NODE_ENV === "production") {
    return createErrorResponse("This endpoint is not available in production", 403);
  }

  const searchParams = req.nextUrl.searchParams;
  const generateHash = searchParams.get("generate-hash");
  const password = searchParams.get("password");

  if (generateHash === "true" && password) {
    const hash = await hashPassword(password);
    console.log("[Password Hash Generated]", { password, hash });

    return new Response(JSON.stringify({
      success: true,
      password,
      hash,
      envVar: `ADMIN_PASSWORD_HASH=${hash}`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({
    message: "Password hash generator",
    usage: "Add ?generate-hash=true&password=your-password to generate a bcrypt hash"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
