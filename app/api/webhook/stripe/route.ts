import { NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { STRIPE_CONFIG } from "../../../lib/stripe";
import { upgradeUserPlan } from "../../../lib/quota";

const stripe = new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_CONFIG.webhookSecret
      );
    } catch (err) {
      console.error("[Webhook Signature Verification Failed]", err);
      return new Response("Invalid signature", { status: 400 });
    }

    // 处理 checkout.session.completed 事件
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.email && session.metadata?.plan) {
        const email = session.metadata.email;
        const plan = session.metadata.plan as 'basic' | 'premium';

        // 升级用户套餐
        const success = upgradeUserPlan(email, plan);

        if (success) {
          console.log(`[Webhook] Upgraded user ${email} to ${plan} plan`);
        } else {
          console.error(`[Webhook] Failed to upgrade user ${email}`);
        }
      }
    }

    // 处理 payment_intent.succeeded 事件
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      if (paymentIntent.metadata?.email && paymentIntent.metadata?.plan) {
        const email = paymentIntent.metadata.email;
        const plan = paymentIntent.metadata.plan as 'basic' | 'premium';

        const success = upgradeUserPlan(email, plan);

        if (success) {
          console.log(`[Webhook] Payment succeeded for ${email}, upgraded to ${plan}`);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[Webhook Error]", error);
    return new Response(JSON.stringify({ error: "Webhook handler failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
