import { NextRequest } from "next/server";
import Stripe from "stripe";
import { STRIPE_CONFIG, PRODUCTS } from "../../lib/stripe";

// 检查 Stripe 是否已配置
const isStripeConfigured = !!STRIPE_CONFIG.secretKey;

// 初始化 Stripe（仅在配置了密钥时）
const stripe = isStripeConfigured ? new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: "2025-02-24.acacia",
}) : null;

export async function POST(req: NextRequest) {
  // 检查 Stripe 是否配置
  if (!stripe || !isStripeConfigured) {
    return new Response(JSON.stringify({
      error: "Payment system is not configured. Please contact support."
    }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { email, plan } = await req.json();

    if (!email || !plan) {
      return new Response(JSON.stringify({
        error: "Missing required fields: email and plan"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!['basic', 'premium'].includes(plan)) {
      return new Response(JSON.stringify({
        error: "Invalid plan type"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const product = PRODUCTS[plan as keyof typeof PRODUCTS];
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
              metadata: {
                plan: plan
              }
            },
            unit_amount: Math.round(product.price * 100), // 转换为分
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // 一次性支付
      customer_email: email,
      metadata: {
        email: email,
        plan: plan
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      billing_address_collection: 'required',
    });

    return new Response(JSON.stringify({
      sessionId: session.id,
      url: session.url
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[Stripe Checkout Error]", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Failed to create checkout session"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
