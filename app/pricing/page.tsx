import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing Plans | Warehouse Worker Resume Generator",
  description: "Affordable pricing plans for professional warehouse worker resume generation. Choose the plan that fits your needs - Free, Basic, or Premium.",
  keywords: "resume pricing, resume builder cost, warehouse resume plans, affordable resume service",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our service",
    features: [
      "1 AI-generated resume",
      "Basic template",
      "PDF download",
      "Standard support",
      "No credit card required"
    ],
    cta: "Get Started",
    ctaLink: "/",
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
      "Email support",
      "ATS optimization",
      "Save & edit resumes"
    ],
    cta: "Choose Basic",
    ctaLink: "/?plan=basic",
    popular: true,
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "one-time",
    description: "Complete career advancement package",
    features: [
      "Unlimited resumes",
      "All premium templates",
      "Priority generation",
      "Priority support",
      "Cover letter generator",
      "LinkedIn profile optimization",
      "Interview preparation guide",
      "30-day satisfaction guarantee"
    ],
    cta: "Choose Premium",
    ctaLink: "/?plan=premium",
    popular: false,
    color: "from-purple-500 to-purple-600"
  }
];

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast Generation",
    description: "Create professional resumes in under 60 seconds using our advanced AI technology"
  },
  {
    icon: "🎯",
    title: "ATS-Friendly Templates",
    description: "All templates are optimized to pass Applicant Tracking Systems and reach human recruiters"
  },
  {
    icon: "💾",
    title: "Save & Edit Anytime",
    description: "Your resumes are saved securely. Come back anytime to update or create new ones"
  },
  {
    icon: "📱",
    title: "Works on All Devices",
    description: "Access your resumes from desktop, tablet, or mobile - anywhere, anytime"
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "Your personal information is encrypted and never shared with third parties"
  },
  {
    icon: "💬",
    title: "Expert Support",
    description: "Get help from our career experts when you need it most"
  }
];

const faqs = [
  {
    question: "What's the difference between Free and Basic plans?",
    answer: "The Free plan lets you create 1 resume with a basic template. The Basic plan gives you 3 resumes, access to all premium templates, ATS optimization, and the ability to save and edit your resumes."
  },
  {
    question: "Is this a subscription or one-time payment?",
    answer: "Basic and Premium are one-time payments. You pay once and get access to the specified number of resumes forever. No recurring charges!"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal. All payments are processed securely through Stripe."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes! We offer a 30-day satisfaction guarantee on the Premium plan. If you're not completely satisfied, contact our support team for a full refund."
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Absolutely! You can start with the Free or Basic plan and upgrade to Premium anytime. You'll only pay the difference."
  },
  {
    question: "How long do I have access to my resumes?",
    answer: "Forever! Once you create a resume, it's saved in your account indefinitely. You can access, download, and edit it whenever you need."
  }
];

export default function PricingPage() {
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
            Invest in your career with professional resume generation. No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${
                plan.popular ? "border-blue-500 scale-105" : "border-slate-200"
              } transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
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
                </ul>

                {/* CTA Button */}
                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200 ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
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
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Instant Access</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600 border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              </details>
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
