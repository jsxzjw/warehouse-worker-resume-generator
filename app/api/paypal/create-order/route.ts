import { NextRequest } from "next/server";

// ==================== PayPal 配置 ====================
/**
 * PAYPAL_MODE: 'sandbox' | 'live'
 * Sandbox 用于测试，Live 用于生产环境
 */
const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";

// PayPal API URLs
const PAYPAL_API_BASE =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// ==================== 套餐配置 ====================
const PLAN_PRICES: Record<string, { amount: string; currency: string; description: string }> = {
  basic: { amount: "4.99", currency: "USD", description: "Basic Plan - Warehouse Worker Resume Generator" },
  premium: { amount: "9.99", currency: "USD", description: "Premium Plan - Warehouse Worker Resume Generator" },
};

// ==================== 类型定义 ====================
interface CreateOrderRequest {
  plan: "basic" | "premium";
  email: string;
}

interface CreateOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

// ==================== 辅助函数 ====================

/**
 * 获取 PayPal 访问令牌
 */
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString(
    "base64"
  );

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[PayPal Create Order] Failed to get access token:", errorText);
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * 创建 PayPal 订单
 */
async function createPayPalOrder(
  amount: string,
  currency: string,
  description: string,
  userEmail: string
): Promise<CreateOrderResponse> {
  const accessToken = await getPayPalAccessToken();

  // 使用 custom_id 传递用户邮箱
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
          description,
          custom_id: `user:${userEmail}`,
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "Warehouse Worker Resume Generator",
            locale: "en-US",
            landing_page: "LOGIN",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`,
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[PayPal Create Order] Failed to create order:", errorText);
    throw new Error("Failed to create PayPal order");
  }

  return await response.json();
}

// ==================== POST - 创建订单 ====================

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // 检查 PayPal 配置
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({
          error: "PayPal is not configured",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 解析请求
    const body = await req.json();
    const { plan, email } = body as CreateOrderRequest;

    // 验证参数
    if (!plan || !email) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: plan and email",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!["basic", "premium"].includes(plan)) {
      return new Response(
        JSON.stringify({
          error: "Invalid plan type. Must be 'basic' or 'premium'",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 获取套餐配置
    const planConfig = PLAN_PRICES[plan];
    if (!planConfig) {
      return new Response(
        JSON.stringify({
          error: "Plan not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 创建 PayPal 订单
    const order = await createPayPalOrder(
      planConfig.amount,
      planConfig.currency,
      planConfig.description,
      email
    );

    console.log("[PayPal Create Order] Order created:", order.id);

    return new Response(
      JSON.stringify({
        orderId: order.id,
        status: order.status,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("[PayPal Create Order] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to create order",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// ==================== GET - 用于调试 ====================

export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: "PayPal Create Order endpoint is ready",
      mode: PAYPAL_MODE,
      hasClientId: !!PAYPAL_CLIENT_ID,
      hasClientSecret: !!PAYPAL_CLIENT_SECRET,
      plans: Object.keys(PLAN_PRICES),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
