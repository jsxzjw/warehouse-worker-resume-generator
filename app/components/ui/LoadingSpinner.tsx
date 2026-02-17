// 依赖：React

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  darkMode?: boolean;
}

export function LoadingSpinner({ size = "md", text, darkMode = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={`animate-spin ${sizeClasses[size]} text-blue-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {text}
        </p>
      )}
    </div>
  );
}

export interface FullPageLoaderProps {
  text?: string;
  darkMode?: boolean;
  progress?: number; // 0-100
}

export function FullPageLoader({ text = "Loading...", darkMode = false, progress }: FullPageLoaderProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? "bg-slate-900/80" : "bg-white/80"} backdrop-blur-sm`}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" text={text} darkMode={darkMode} />

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="w-64 space-y-2">
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
              <div
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`text-xs text-center ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
