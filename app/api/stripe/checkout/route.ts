import { NextRequest } from "next/server";
import Stripe from "stripe";
import { ENV } from "../../../lib/env";

// ==================== Stripe 客户端初始化 ====================
let stripe: Stripe | null = null;

try {
  if (ENV.STRIPE_SECRET_KEY) {
    stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
} catch (error) {
  console.warn("Failed to initialize Stripe:", error);
}

// ==================== 价格配置 ====================
const PRICES = {
  basic: ENV.STRIPE_PRICE_BASIC || "price_basic",
  premium: ENV.STRIPE_PRICE_PREMIUM || "price_premium"
};

// ==================== 类型定义 ====================
interface CheckoutRequest {
  plan: "basic" | "premium";
  email?: string;
  metadata?: Record<string, string>;
}

interface CheckoutResponse {
  success: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
}

// ==================== 错误处理 ====================
function createErrorResponse(message: string, status: number): Response {
  console.error("[Stripe Error]", message);

  return new Response(JSON.stringify({
    success: false,
    error: message,
    code: status === 500 ? "STRIPE_ERROR" : "INVALID_REQUEST"
  }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

// ==================== 主 API 路由 ====================
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // 检查 Stripe 是否配置
    if (!stripe) {
      // 开发模式下返回模拟响应
      if (ENV.NODE_ENV === "development") {
        console.warn("Stripe not configured - returning mock response");
        const body = await req.json() as CheckoutRequest;

        return new Response(JSON.stringify({
          success: true,
          url: `${ENV.NEXT_PUBLIC_APP_URL}?payment=mock&plan=${body.plan}`,
          sessionId: `mock_session_${Date.now()}`
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      return createErrorResponse(
        "Payment service is not configured. Please contact support.",
        500
      );
    }

    // 解析请求体
    const body: CheckoutRequest = await req.json();

    // 验证 plan
    if (!body.plan || !["basic", "premium"].includes(body.plan)) {
      return createErrorResponse(
        "Invalid plan. Must be 'basic' or 'premium'.",
        400
      );
    }

    // 获取价格 ID
    const priceId = PRICES[body.plan];

    if (!priceId || priceId.startsWith("price_")) {
      return createErrorResponse(
        "Price not configured. Please set up Stripe price IDs.",
        500
      );
    }

    // 创建 Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${ENV.NEXT_PUBLIC_APP_URL}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ENV.NEXT_PUBLIC_APP_URL}?payment=cancelled`,
      metadata: {
        planId: body.plan,
        ...body.metadata,
      },
    };

    // 添加客户邮箱
    if (body.email) {
      sessionParams.customer_email = body.email;
    }

    // 创建 session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // 返回结果
    const response: CheckoutResponse = {
      success: true,
      url: session.url!,
      sessionId: session.id
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: unknown) {
    console.error("[Stripe API Error]", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Stripe 特定错误
    if (errorMessage.includes("Price")) {
      return createErrorResponse(
        "Price configuration error. Please contact support.",
        500
      );
    }

    if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
      return createErrorResponse(
        "Payment service configuration error. Please contact support.",
        500
      );
    }

    return createErrorResponse(
      "Unable to create checkout session. Please try again.",
      500
    );
  }
}

// ==================== 导出 ====================
export { stripe, PRICES };
