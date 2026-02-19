// 依赖：React
import { PricingCard } from "./PricingCard";

export interface PricingSectionProps {
  onSelectPlan: (plan: "free" | "basic" | "premium") => void;
  darkMode?: boolean;
}

// ==================== 默认选中 Basic 套餐 ====================
export function PricingSection({ onSelectPlan, darkMode = false }: PricingSectionProps) {
  const plans = [
    {
      id: "free" as const,
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "1 basic template",
        "PDF with watermark",
        "3 resumes per month",
        "Basic support"
      ],
      cta: "Get Started",
      // Free 不高亮，不默认选中
      highlighted: false
    },
    {
      id: "basic" as const,
      name: "Basic",
      price: "$4.99",
      period: "one-time",
      description: "Most popular for job seekers",
      features: [
        "3 professional templates",
        "Unlimited PDF downloads",
        "No watermarks",
        "Priority support",
        "Resume storage"
      ],
      cta: "Choose Basic",
      // ==================== Basic 默认高亮（最受欢迎） ====================
      highlighted: true
    },
    {
      id: "premium" as const,
      name: "Premium",
      price: "$9.99",
      period: "one-time",
      description: "Best value for professionals",
      features: [
        "All basic features",
        "5 premium templates",
        "ATS keyword optimization",
        "Cover letter templates",
        "Priority support",
        "Lifetime updates"
      ],
      cta: "Choose Premium",
      // Premium 不高亮，保留可选
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className={`py-16 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Choose the plan that works best for you. One-time payment, no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              {...plan}
              darkMode={darkMode}
              onCTAClick={() => onSelectPlan(plan.id)}
            />
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              30-day money-back guarantee
            </span>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className={`mt-16 p-6 rounded-2xl ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
          <h3 className={`text-xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-slate-900"}`}>
            Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <th className={`text-left py-3 px-4 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Feature
                  </th>
                  <th className={`text-center py-3 px-4 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Free
                  </th>
                  <th className={`text-center py-3 px-4 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Basic
                  </th>
                  <th className={`text-center py-3 px-4 text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <td className={`py-3 px-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Templates
                  </td>
                  <td className={`py-3 px-4 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    1
                  </td>
                  <td className={`py-3 px-4 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    3
                  </td>
                  <td className={`py-3 px-4 text-center text-sm font-semibold text-blue-600`}>
                    5
                  </td>
                </tr>
                <tr className={`border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <td className={`py-3 px-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    PDF Downloads
                  </td>
                  <td className={`py-3 px-4 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    3/month
                  </td>
                  <td className={`py-3 px-4 text-center text-sm font-semibold text-green-600`}>
                    Unlimited
                  </td>
                  <td className={`py-3 px-4 text-center text-sm font-semibold text-green-600`}>
                    Unlimited
                  </td>
                </tr>
                <tr className={`border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <td className={`py-3 px-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Watermark
                  </td>
                  <td className={`py-3 px-4 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Yes
                  </td>
                  <td className={`py-3 px-4 text-center text-sm font-semibold text-green-600`}>
                    No
                  </td>
                  <td className={`py-3 px-4 text-center text-sm font-semibold text-green-600`}>
                    No
                  </td>
                </tr>
                <tr>
                  <td className={`py-3 px-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    ATS Optimization
                  </td>
                  <td className={`py-3 px-4 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    -
                  </td>
                  <td className={`py-3 px-4 text-center text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    -
                  </td>
                  <td className={`py-3 px-4 text-center text-sm font-semibold text-blue-600`}>
                    ✓
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
