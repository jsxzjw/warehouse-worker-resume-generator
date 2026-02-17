import Link from "next/link";

export interface SocialProofProps {
  darkMode?: boolean;
}

export function SocialProof({ darkMode = false }: SocialProofProps) {
  return (
    <section className={`py-12 border-b transition-colors ${
      darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* User Count */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <p className={`text-lg font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              Trusted by <span className="text-blue-600 font-bold">5,000+</span> job seekers worldwide
            </p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              <span className="font-semibold">4.8/5</span> average rating from <span className="font-semibold">1,250+</span> reviews
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              darkMode ? "bg-slate-800 border border-slate-700" : "bg-slate-50 border border-slate-200"
            }`}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className={`text-sm mb-3 italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                "Got hired within 2 weeks! The ATS optimization really works."
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${darkMode ? "bg-blue-600" : "bg-blue-100 text-blue-600"}`}>
                  👨
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Michael R.</p>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Forklift Operator</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              darkMode ? "bg-slate-800 border border-slate-700" : "bg-slate-50 border border-slate-200"
            }`}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className={`text-sm mb-3 italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                "So easy to use. Created my resume in under 5 minutes!"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${darkMode ? "bg-purple-600" : "bg-purple-100 text-purple-600"}`}>
                  👩
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Sarah T.</p>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Warehouse Associate</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              darkMode ? "bg-slate-800 border border-slate-700" : "bg-slate-50 border border-slate-200"
            }`}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className={`text-sm mb-3 italic ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                "Finally got promoted to supervisor after 3 years of trying!"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${darkMode ? "bg-green-600" : "bg-green-100 text-green-600"}`}>
                  👨
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>James K.</p>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Warehouse Manager</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 opacity-60">
            <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              ✓ ATS-Friendly
            </div>
            <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              ✓ Secure & Private
            </div>
            <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              ✓ No Credit Card Required
            </div>
            <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              ✓ Instant Download
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
