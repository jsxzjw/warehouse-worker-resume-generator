"use client";

import { useRouter } from "next/navigation";

export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: 'monthly_limit_exceeded' | 'template_limit' | 'watermark';
  currentPlan?: 'free' | 'basic' | 'premium';
  remaining?: number;
}

export function UpgradeModal({
  isOpen,
  onClose,
  reason = 'monthly_limit_exceeded',
  currentPlan = 'free',
  remaining = 0
}: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = (plan: 'basic' | 'premium') => {
    router.push(`/pricing?selected=${plan}`);
  };

  const getTitle = () => {
    switch (reason) {
      case 'monthly_limit_exceeded':
        return "Monthly Resume Limit Reached";
      case 'template_limit':
        return "Premium Template Required";
      case 'watermark':
        return "Remove Watermark & Unlock Features";
      default:
        return "Upgrade Your Plan";
    }
  };

  const getMessage = () => {
    switch (reason) {
      case 'monthly_limit_exceeded':
        return (
          <div className="text-center space-y-4">
            <p className="text-lg">
              You've used <span className="font-bold text-red-600">all 3 free resumes</span> for this month.
            </p>
            <p className="text-slate-600">
              Upgrade to Basic or Premium to generate unlimited resumes and remove watermarks.
            </p>
          </div>
        );
      case 'template_limit':
        return (
          <div className="text-center space-y-4">
            <p className="text-lg">
              This template is only available for <span className="font-bold">Basic</span> and <span className="font-bold">Premium</span> plans.
            </p>
            <p className="text-slate-600">
              Upgrade to access 3 professional templates (Basic) or 5 premium templates (Premium).
            </p>
          </div>
        );
      case 'watermark':
        return (
          <div className="text-center space-y-4">
            <p className="text-lg">
              Your resume includes a <span className="font-bold text-red-600">"Free Version" watermark</span>.
            </p>
            <p className="text-slate-600">
              Upgrade to remove watermarks and unlock additional features.
            </p>
          </div>
        );
      default:
        return (
          <p className="text-center text-lg">
            Upgrade your plan to unlock unlimited resumes and premium features.
          </p>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {getTitle()}
          </h2>
          {getMessage()}
        </div>

        {/* Pricing Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Basic Plan */}
          <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer"
               onClick={() => handleUpgrade('basic')}>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$4.99</div>
              <ul className="text-left text-sm space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>3 Professional Templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited PDF Downloads</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No Watermarks</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority Support</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Choose Basic
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-purple-500 rounded-xl p-6 relative cursor-pointer"
               onClick={() => handleUpgrade('premium')}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              BEST VALUE
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Premium</h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">$9.99</div>
              <ul className="text-left text-sm space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All Basic Features</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>5 Premium Templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ATS Keyword Optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cover Letter Templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lifetime Updates</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Choose Premium
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center text-sm text-slate-500">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>30-day money-back guarantee</span>
          </div>
        </div>

        {/* Maybe Later */}
        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Maybe later, continue with free plan
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
