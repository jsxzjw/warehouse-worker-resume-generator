// Stripe 配置和类型定义

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  // 价格 ID（需要在 Stripe Dashboard 创建）
  prices: {
    basic: process.env.STRIPE_PRICE_ID_BASIC || '',
    premium: process.env.STRIPE_PRICE_ID_PREMIUM || ''
  }
};

// 支付产品配置
export const PRODUCTS = {
  basic: {
    name: 'Basic Plan',
    description: 'Unlimited PDF downloads, 3 templates, no watermark',
    price: 4.99,
    currency: 'usd',
    features: [
      'Unlimited PDF downloads',
      'No watermark',
      'Access to 3 templates',
      'Resume cloud storage',
      'Basic ATS keyword optimization'
    ]
  },
  premium: {
    name: 'Premium Plan',
    description: 'Everything in Basic + AI features',
    price: 9.99,
    currency: 'usd',
    features: [
      'Everything in Basic',
      'AI auto-write work experience',
      'AI cover letter generator',
      'ATS score + improvement suggestions',
      'Priority support'
    ]
  }
} as const;

// 套餐类型
export type PlanType = 'basic' | 'premium';

// 支付会话数据接口
export interface CheckoutSessionData {
  email: string;
  plan: PlanType;
  successUrl: string;
  cancelUrl: string;
}

// Stripe Webhook 事件类型
export type StripeWebhookEvent = {
  type: string;
  data: {
    object: {
      id: string;
      amount_total?: number;
      currency?: string;
      customer_email?: string;
      metadata?: {
        email: string;
        plan: string;
      };
      payment_intent?: string;
      status?: string;
    };
  };
};
