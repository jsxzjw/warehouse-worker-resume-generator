// 依赖：React

export interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  darkMode?: boolean;
  color?: "blue" | "green" | "indigo";
}

export function ProgressBar({ progress, label, showPercentage = true, darkMode = false, color = "blue" }: ProgressBarProps) {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    indigo: "bg-indigo-600"
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full h-2 ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
