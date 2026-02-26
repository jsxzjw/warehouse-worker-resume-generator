import { NextRequest } from "next/server";
import { upgradeUserPlan } from "../../../lib/quota";
import crypto from "crypto";

// ==================== PayPal 配置 ====================
/**
 * PAYPAL_MODE: 'sandbox' | 'live'
 * Sandbox 用于测试，Live 用于生产环境
 */
const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || "";

// PayPal API URLs
const PAYPAL_API_BASE =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// ==================== 套餐金额配置 ====================
/**
 * 验证支付金额和币种
 */
const PLAN_PRICES: Record<string, { amount: string; currency: string }> = {
  basic: { amount: "4.99", currency: "USD" },
  premium: { amount: "9.99", currency: "USD" },
};

// ==================== 类型定义 ====================
interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    status?: string;
    amount?: {
      value: string;
      currency_code: string;
    };
    custom_id?: string;
    payment_source?: {
      [key: string]: any;
    };
  };
  resource_type: string;
  summary?: string;
  create_time: string;
}

interface VerifyWebhookSignatureResponse {
  verification_status: "SUCCESS" | "FAILURE";
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
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * 验证 PayPal Webhook 签名
 */
async function verifyWebhookSignature(
  headers: Headers,
  body: string,
  webhookId: string
): Promise<boolean> {
  try {
    const authAlgo = headers.get("paypal-auth-algo");
    const certId = headers.get("paypal-cert-id");
    const transmissionId = headers.get("paypal-transmission-id");
    const transmissionSig = headers.get("paypal-transmission-sig");
    const transmissionTime = headers.get("paypal-transmission-time");
    const actualSig = headers.get("paypal-transmission-sig");

    if (!authAlgo || !certId || !transmissionId || !transmissionSig || !transmissionTime) {
      console.error("[PayPal Webhook] Missing required headers");
      return false;
    }

    // 获取访问令牌
    const accessToken = await getPayPalAccessToken();

    // 验证签名
    const verifyResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_id: certId,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: JSON.parse(body),
        }),
      }
    );

    if (!verifyResponse.ok) {
      console.error("[PayPal Webhook] Signature verification failed");
      return false;
    }

    const verifyData: VerifyWebhookSignatureResponse = await verifyResponse.json();
    return verifyData.verification_status === "SUCCESS";
  } catch (error) {
    console.error("[PayPal Webhook] Signature verification error:", error);
    return false;
  }
}

/**
 * 从 custom_id 中提取用户邮箱
 * custom_id 格式: "user:email@example.com"
 */
function extractUserEmail(customId?: string): string | null {
  if (!customId) return null;
  if (customId.startsWith("user:")) {
    return customId.substring(5);
  }
  return null;
}

// ==================== Webhook 处理 ====================

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

    // 获取请求头和请求体
    const headers = req.headers;
    const rawBody = await req.text();

    // 验证 Webhook 签名（仅在生产环境或配置了 WEBHOOK_ID 时验证）
    if (PAYPAL_WEBHOOK_ID) {
      const isValid = await verifyWebhookSignature(
        headers,
        rawBody,
        PAYPAL_WEBHOOK_ID
      );

      if (!isValid) {
        console.error("[PayPal Webhook] Invalid signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // 解析事件
    const event: PayPalWebhookEvent = JSON.parse(rawBody);
    console.log("[PayPal Webhook] Event type:", event.event_type);

    // 处理付款完成事件
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const { resource } = event;

      // 提取用户邮箱
      const email = extractUserEmail(resource.custom_id);

      if (!email) {
        console.error("[PayPal Webhook] No user email in custom_id");
        return new Response(
          JSON.stringify({ error: "No user email found" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 验证金额和币种
      if (!resource.amount) {
        console.error("[PayPal Webhook] No amount in resource");
        return new Response(
          JSON.stringify({ error: "No amount found" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const { amount, currency_code } = resource.amount;

      // 检查是否匹配某个套餐
      let matchedPlan: "basic" | "premium" | null = null;

      for (const [plan, config] of Object.entries(PLAN_PRICES)) {
        if (
          config.amount === amount &&
          config.currency === currency_code
        ) {
          matchedPlan = plan as "basic" | "premium";
          break;
        }
      }

      if (!matchedPlan) {
        console.error(
          `[PayPal Webhook] Amount mismatch: ${amount} ${currency_code}`
        );
        return new Response(
          JSON.stringify({ error: "Amount mismatch" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 升级用户套餐
      const upgraded = upgradeUserPlan(email, matchedPlan);

      if (!upgraded) {
        console.error("[PayPal Webhook] Failed to upgrade user plan");
        return new Response(
          JSON.stringify({ error: "Failed to upgrade plan" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      console.log(
        `[PayPal Webhook] User ${email} upgraded to ${matchedPlan} plan`
      );

      return new Response(
        JSON.stringify({
          success: true,
          plan: matchedPlan,
          email,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 其他事件类型也返回成功
    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("[PayPal Webhook] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
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
      status: "PayPal Webhook endpoint is ready",
      mode: PAYPAL_MODE,
      hasClientId: !!PAYPAL_CLIENT_ID,
      hasClientSecret: !!PAYPAL_CLIENT_SECRET,
      hasWebhookId: !!PAYPAL_WEBHOOK_ID,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
