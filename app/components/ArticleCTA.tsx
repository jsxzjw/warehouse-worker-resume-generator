import Link from "next/link";

export interface ArticleCTAProps {
  darkMode?: boolean;
  variant?: "primary" | "secondary" | "compact";
}

export function ArticleCTA({ darkMode = false, variant = "primary" }: ArticleCTAProps) {
  if (variant === "compact") {
    return (
      <div className={`my-8 p-6 rounded-xl border-2 text-center ${
        darkMode
          ? "bg-slate-800 border-blue-500"
          : "bg-blue-50 border-blue-200"
      }`}>
        <p className={`text-sm font-semibold mb-3 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
          Ready to create your professional warehouse resume?
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105"
        >
          Create Your Resume Now
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    );
  }

  if (variant === "secondary") {
    return (
      <div className={`my-12 p-8 rounded-2xl text-center ${
        darkMode ? "bg-gradient-to-r from-slate-800 to-slate-700" : "bg-gradient-to-r from-blue-50 to-indigo-50"
      }`}>
        <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Start Building Your Resume Today
        </h3>
        <p className={`text-lg mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          Join thousands of warehouse workers who got hired with our AI-powered resumes
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Get Started Free
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    );
  }

  // Primary variant (full width)
  return (
    <div className={`my-12 py-12 rounded-2xl text-center ${
      darkMode
        ? "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"
        : "bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"
    }`}>
      <h3 className={`text-3xl font-bold mb-4 text-white`}>
        Create Your Professional Warehouse Resume Now
      </h3>
      <p className={`text-xl mb-8 text-blue-100 max-w-2xl mx-auto`}>
        Use our AI-powered builder to create an ATS-optimized resume in minutes. Free to start.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl shadow-2xl hover:bg-blue-50 transition-all duration-300 hover:scale-105"
        >
          Create Resume Now
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-blue-100 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Free to Start</span>
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
          <span>Instant PDF</span>
        </div>
      </div>
    </div>
  );
}
