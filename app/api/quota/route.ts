import { NextRequest } from "next/server";
import { canGenerateResume, recordResumeGeneration, getUserPlan } from "../../lib/quota";

// ==================== 类型定义 ====================

interface CheckQuotaRequest {
  email: string;
}

interface CheckQuotaResponse {
  success: boolean;
  allowed: boolean;
  remaining?: number;
  plan?: string;
  hasWatermark?: boolean;
  canDownloadPDF?: boolean;
  mustLogin?: boolean;
  reason?: string;
}

interface RecordUsageRequest {
  email: string;
}

interface RecordUsageResponse {
  success: boolean;
  remaining?: number;
  plan?: string;
  hasWatermark?: boolean;
  canDownloadPDF?: boolean;
  mustLogin?: boolean;
  message?: string;
}

// ==================== POST - 检查配额 ====================

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { email } = body as CheckQuotaRequest;

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: "Email is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 检查是否可以生成简历
    const quotaCheck = canGenerateResume(email);
    const userPlan = getUserPlan(email);

    const response: CheckQuotaResponse = {
      success: true,
      allowed: quotaCheck.allowed,
      remaining: quotaCheck.remaining,
      plan: userPlan.plan,
      hasWatermark: userPlan.limits.hasWatermark,
      canDownloadPDF: userPlan.limits.canDownloadPDF,
      mustLogin: userPlan.limits.mustLogin
    };

    if (!quotaCheck.allowed) {
      response.reason = quotaCheck.reason || 'quota_exceeded';
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[Quota API Error]", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// ==================== PUT - 记录使用 ====================

export async function PUT(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { email } = body as RecordUsageRequest;

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: "Email is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 记录简历生成
    const result = recordResumeGeneration(email);

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: "Monthly quota exceeded"
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response: RecordUsageResponse = {
      success: true,
      remaining: result.remaining,
      plan: result.plan,
      hasWatermark: result.hasWatermark,
      canDownloadPDF: result.canDownloadPDF,
      mustLogin: result.mustLogin,
      message: "Resume generation recorded successfully"
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[Quota API Error]", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// ==================== GET - 获取用户套餐信息 ====================

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        error: "Email parameter is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userPlan = getUserPlan(email);
    const remaining = userPlan.limits.monthlyResumes === -1
      ? -1
      : Math.max(0, userPlan.limits.monthlyResumes - userPlan.usage.monthlyResumes);

    return new Response(JSON.stringify({
      success: true,
      plan: userPlan.plan,
      limits: userPlan.limits,
      usage: userPlan.usage,
      remaining
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[Quota API Error]", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
