import { NextRequest } from "next/server";
import { verifyAdminAuth, getSecurityHeaders } from "../../../lib/auth";

// ==================== 类型定义 ====================
interface AdminVerifyResponse {
  success: boolean;
  valid?: boolean;
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
}

// ==================== GET - 验证管理员 Token ====================
/**
 * 验证管理员身份
 * 用于检查当前请求是否有有效的管理员 token
 *
 * 使用认证中间件 verifyAdminAuth 进行统一的认证
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // 使用认证中间件验证身份
    const authResult = verifyAdminAuth(req);

    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: true,
        valid: false,
        error: authResult.error
      }), {
        status: 200,
        headers: getSecurityHeaders()
      });
    }

    // Token 有效，返回管理员信息
    const response: AdminVerifyResponse = {
      success: true,
      valid: true,
      admin: {
        id: authResult.admin!.id,
        email: authResult.admin!.email,
        name: authResult.admin!.name,
        role: authResult.admin!.role
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: getSecurityHeaders()
    });

  } catch (error) {
    console.error("[Admin Verify API Error]", error);

    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: getSecurityHeaders()
    });
  }
}
