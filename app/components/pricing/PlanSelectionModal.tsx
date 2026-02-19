"use client";

import { useState } from "react";

// ==================== 类型定义 ====================
export interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
  onPlanSelect: (plan: 'free' | 'basic' | 'premium') => void;
  userEmail?: string;
}

// ==================== 主组件 ====================
export function PlanSelectionModal({
  isOpen,
  onClose,
  darkMode = false,
  onPlanSelect,
  userEmail = ''
}: PlanSelectionModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // ==================== 从 localStorage 获取预选中的套餐 ====================
  const getPreselectedPlan = (): 'basic' | 'premium' | null => {
    if (typeof window !== 'undefined') {
      const preselected = localStorage.getItem('preselectedPlan');
      if (preselected === 'basic' || preselected === 'premium') {
        return preselected;
      }
    }
    return null;
  };

  if (!isOpen) return null;

  // ==================== 支付处理逻辑 ====================
  const handlePurchase = async (planType: 'basic' | 'premium') => {
    setLoadingPlan(planType);

    try {
      // 检查用户是否登录
      if (!userEmail) {
        // 未登录 → 触发登录流程
        onPlanSelect(planType);
        onClose();
        return;
      }

      // 已登录 → 调用 Stripe 支付 API
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          plan: planType
        })
      });

      const data = await res.json();

      if (data.url) {
        // 跳转到 Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session. Please try again.');
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session. Please try again.');
      setLoadingPlan(null);
    }
  };

  // ==================== Free 按钮处理 ====================
  const handleFreePlan = () => {
    onPlanSelect('free');
    onClose();
  };

  // ==================== 套餐配置 ====================
  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1 resume total (not monthly)',
        'Preview only - NO PDF download',
        'Basic template only',
        'Must login to generate',
        'Basic support'
      ],
      limitations: [
        'Cannot download PDF files',
        'Only 1 resume ever',
        'Preview in browser only',
        'Must upgrade to download'
      ],
      cta: 'Get Started Free',
      color: 'from-slate-500 to-slate-600',
      popular: false
    },
    {
      id: 'basic' as const,
      name: 'Basic',
      price: '$4.99',
      period: 'one-time',
      description: 'Great for multiple job applications',
      features: [
        '3 AI-generated resumes',
        'All premium templates',
        'Unlimited PDF downloads',
        'No watermark',
        'Email support'
      ],
      cta: 'Choose Basic',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: '$9.99',
      period: 'one-time',
      description: 'Complete career advancement package',
      features: [
        'Everything in Basic',
        'AI auto-write work experience',
        'AI cover letter generator',
        'ATS score + suggestions',
        'Priority support',
        '30-day satisfaction guarantee'
      ],
      cta: 'Choose Premium',
      color: 'from-purple-500 to-purple-600',
      popular: false
    }
  ];

  // ==================== 渲染 ====================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`rounded-2xl shadow-2xl max-w-6xl w-full p-8 relative ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* ==================== 关闭按钮 - 右上角 X ==================== */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 transition-colors z-50 ${
            darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ==================== 套餐卡片 - 移到顶部 ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {plans.map((plan) => {
            const preselectedPlan = getPreselectedPlan();
            const isPreselected = plan.id === preselectedPlan;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isPreselected
                    ? 'border-purple-500 ring-4 ring-purple-200 scale-105'
                    : plan.popular
                      ? 'border-blue-500 scale-105'
                      : darkMode
                        ? 'border-slate-700'
                        : 'border-slate-200'
                }`}
              >
                {/* 预选中标签 */}
                {isPreselected && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold z-20">
                    SELECTED
                  </div>
                )}
                {/* 热门标签 */}
                {plan.popular && !isPreselected && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold z-10">
                    Most Popular
                  </div>
                )}

                {/* ==================== 头部背景：Premium 紫色，Basic 蓝色，Free 灰色 ==================== */}
                <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-white/80">/ {plan.period}</span>
                  </div>
                  <p className="text-white/80 text-sm">{plan.description}</p>
                </div>

                <div className={`p-6 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{feature}</span>
                      </li>
                    ))}

                    {plan.id === 'free' && plan.limitations && (
                      <>
                        <li className="border-t border-slate-200 pt-3 mt-3">
                          <p className={`text-xs font-semibold uppercase mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Limitations:</p>
                        </li>
                        {plan.limitations.map((limit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{limit}</span>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>

                  <button
                    onClick={() => {
                      if (plan.id === 'free') {
                        handleFreePlan();
                      } else {
                        handlePurchase(plan.id);
                      }
                    }}
                    disabled={loadingPlan === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.id === 'premium'
                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
                        : plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                          : darkMode
                            ? 'bg-slate-700 text-white hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loadingPlan === plan.id ? 'Processing...' : plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================== 标题 - 移到卡片下方 ==================== */}
        <div className="text-center mb-6">
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Choose Your Plan
          </h2>
          <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            Invest in your career with professional resume generation
          </p>
        </div>

        {/* 信任标识 */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            darkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Secure payment • 30-day money-back guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
