// 依赖：React
import { useState } from "react";

export interface EmailCaptureProps {
  onSubmit: (email: string) => void;
  darkMode?: boolean;
}

export function EmailCapture({ onSubmit, darkMode = false }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      await onSubmit(email);
      setStatus("success");
      setEmail("");
      setTimeout(() => {
        setShow(false);
        setStatus("idle");
      }, 2000);
    } catch {
      setStatus("error");
    }
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} underline`}
      >
        Save my resume progress
      </button>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm`}>
      <div className={`rounded-2xl shadow-xl max-w-md w-full p-6 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
        <button
          onClick={() => setShow(false)}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-slate-300 hover:bg-slate-700" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className={`w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mx-auto mb-4`}>
            <svg className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Save Your Progress
          </h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Enter your email to save your resume and get a copy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none
              ${darkMode ? "bg-slate-700 border-slate-600 focus:border-blue-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-blue-500 focus:bg-slate-50"}
            `}
          />

          {status === "success" && (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved successfully!
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-red-500 text-center">
              Failed to save. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200
              ${status === "loading" || status === "success"
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
          >
            {status === "loading" ? "Saving..." : "Save My Resume"}
          </button>
        </form>

        <p className={`text-xs text-center mt-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          We'll send you a copy of your resume and helpful tips
        </p>
      </div>
    </div>
  );
}
