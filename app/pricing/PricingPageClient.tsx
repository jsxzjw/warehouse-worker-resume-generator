"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our service",
    features: [
      "1 basic template only",
      "1 resume total (not monthly)",
      "Preview only - NO PDF download",
      "Basic support",
      "No credit card required"
    ],
    limitations: [
      "Cannot download PDF files",
      "Only 1 resume ever",
      "Preview in browser only",
      "Must upgrade to download"
    ],
    cta: "Get Started Free",
    planType: 'free' as const,
    popular: false,
    color: "from-slate-500 to-slate-600"
  },
  {
    name: "Basic",
    price: "$4.99",
    period: "one-time",
    description: "Great for multiple job applications",
    features: [
      "3 AI-generated resumes",
      "All premium templates",
      "Unlimited PDF downloads",
      "No watermark",
      "Email support"
    ],
    cta: "Choose Basic",
    planType: 'basic' as const,
    popular: true,
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "one-time",
    description: "Complete career advancement package",
    features: [
      "Everything in Basic",
      "AI auto-write work experience",
      "AI cover letter generator",
      "ATS score + suggestions",
      "Priority support",
      "30-day satisfaction guarantee"
    ],
    cta: "Choose Premium",
    planType: 'premium' as const,
    popular: false,
    color: "from-purple-500 to-purple-600"
  }
];

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast Generation",
    description: "Create professional resumes in under 60 seconds"
  },
  {
    icon: "🎯",
    title: "ATS-Friendly Templates",
    description: "Optimized to pass Applicant Tracking Systems"
  },
  {
    icon: "💾",
    title: "Save & Edit Anytime",
    description: "Your resumes are saved securely"
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "Your information is encrypted and never shared"
  }
];

export default function PricingPageClient() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePurchase = async (planType: 'free' | 'basic' | 'premium') => {
    if (planType === 'free') {
      window.location.href = "/";
      return;
    }

    setLoadingPlan(planType);

    try {
      const email = localStorage.getItem('userEmail') || '';

      if (!email) {
        window.location.href = "/?login=true&plan=" + planType;
        return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: planType })
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            💰 Simple, Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            Invest in your career with professional resume generation
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular ? "border-blue-500 scale-105" : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-blue-100">/ {plan.period}</span>
                </div>
                <p className="text-blue-100 text-sm">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}

                  {/* Show limitations for Free plan */}
                  {plan.name === "Free" && plan.limitations && (
                    <>
                      <li className="border-t border-slate-200 pt-3 mt-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Limitations:</p>
                      </li>
                      {plan.limitations.map((limit, limitIndex) => (
                        <li key={limitIndex} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-slate-500 text-sm">{limit}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchase(plan.planType)}
                  disabled={loadingPlan === plan.planType}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200 ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === plan.planType ? "Processing..." : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="text-center mb-16">
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>No Auto-Renewal</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Everything You Need to Land Your Dream Job
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of warehouse workers who have landed their dream jobs
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Building Now
          </Link>
        </div>
      </section>
    </main>
  );
}
