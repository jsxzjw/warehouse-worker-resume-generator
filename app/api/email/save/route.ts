import { NextRequest } from "next/server";

// ==================== 类型定义 ====================
interface SaveEmailRequest {
  email: string;
  source?: "popup" | "footer" | "checkout";
  metadata?: Record<string, any>;
}

interface SaveEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  alreadyExists?: boolean;
}

// ==================== 错误处理 ====================
function createErrorResponse(message: string, status: number): Response {
  console.error("[Email Save Error]", message);

  return new Response(JSON.stringify({
    success: false,
    error: message
  }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

// ==================== 邮箱验证 ====================
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==================== 模拟数据库（生产环境应使用真实数据库） ====================
const emailDatabase = new Map<string, {
  email: string;
  source?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}>();

// ==================== 主 API 路由 ====================
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // 解析请求体
    let body: SaveEmailRequest;
    try {
      body = await req.json();
    } catch {
      return createErrorResponse("Invalid request body", 400);
    }

    // 验证邮箱
    if (!body.email || typeof body.email !== "string") {
      return createErrorResponse("Email is required", 400);
    }

    const email = body.email.trim().toLowerCase();

    if (!isValidEmail(email)) {
      return createErrorResponse("Invalid email address", 400);
    }

    // 检查邮箱是否已存在
    const alreadyExists = emailDatabase.has(email);

    // 保存邮箱
    if (!alreadyExists) {
      const emailRecord = {
        email,
        source: body.source || "unknown",
        metadata: body.metadata || {},
        createdAt: new Date().toISOString()
      };

      emailDatabase.set(email, emailRecord);

      // TODO: 在生产环境中，应该：
      // 1. 保存到数据库
      // await db.emails.create({ email, source, metadata });
      //
      // 2. 发送欢迎邮件（使用 Resend）
      // if (ENV.RESEND_API_KEY) {
      //   await resend.emails.send({
      //     from: 'noreply@warehouseworkerresume.com',
      //     to: email,
      //     subject: 'Welcome to Warehouse Worker Resume Generator',
      //     html: welcomeEmailTemplate
      //   });
      // }

      console.log("[Email Saved]", {
        email,
        source: body.source,
        timestamp: new Date().toISOString()
      });
    }

    // 返回成功响应
    const response: SaveEmailResponse = {
      success: true,
      message: alreadyExists
        ? "Email already registered"
        : "Email saved successfully",
      alreadyExists
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: unknown) {
    console.error("[Email Save API Error]", error);

    return createErrorResponse(
      "Failed to save email. Please try again.",
      500
    );
  }
}

// ==================== GET 路由 - 获取邮箱统计 ====================
export async function GET(): Promise<Response> {
  try {
    const stats = {
      total: emailDatabase.size,
      bySource: {} as Record<string, number>
    };

    // 统计各来源的邮箱数量
    emailDatabase.forEach((record) => {
      const source = record.source || "unknown";
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    });

    return new Response(JSON.stringify({
      success: true,
      stats
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: unknown) {
    console.error("[Email Stats Error]", error);

    return new Response(JSON.stringify({
      success: false,
      error: "Failed to retrieve email statistics"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
