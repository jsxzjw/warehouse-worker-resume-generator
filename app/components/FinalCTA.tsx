export interface FinalCTAProps {
  darkMode?: boolean;
  onStart: () => void;
}

export function FinalCTA({ darkMode = false, onStart }: FinalCTAProps) {
  return (
    <section className={`py-20 transition-colors ${
      darkMode
        ? "bg-gradient-to-br from-slate-800 to-slate-900"
        : "bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-white/20 backdrop-blur-sm text-white">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Free to Use • No Credit Card Required
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Start Building Your Professional Resume Today
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
          Join thousands of warehouse workers who have landed their dream jobs with our AI-powered resume generator
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={onStart}
            className="group relative px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl shadow-2xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-3">
              Start Building Your Resume
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>100% Free to Start</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>ATS-Optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Instant PDF Download</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>No Sign Up Required</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
          <div>
            <div className="text-4xl font-bold text-white mb-2">5,000+</div>
            <div className="text-blue-200 text-sm">Resumes Created</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-blue-200 text-sm">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">2 weeks</div>
            <div className="text-blue-200 text-sm">Avg. Time to Hire</div>
          </div>
        </div>
      </div>
    </section>
  );
}
