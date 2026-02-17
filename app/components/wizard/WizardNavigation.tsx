// 依赖：React

export interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  nextLabel?: string;
  darkMode?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isNextDisabled = false,
  isNextLoading = false,
  nextLabel,
  darkMode = false
}: WizardNavigationProps) {
  const getNextLabel = () => {
    if (isNextLoading) return "Processing...";
    if (nextLabel) return nextLabel;
    if (currentStep === totalSteps) return "Complete";
    return "Continue";
  };

  return (
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
          ${currentStep === 1
            ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800"
            : darkMode
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        style={{ minWidth: "120px" }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Step Indicators */}
      <div className="hidden sm:flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i + 1 === currentStep
                ? "bg-blue-600 scale-125"
                : i + 1 < currentStep
                  ? "bg-blue-400"
                  : "bg-slate-300 dark:bg-slate-600"
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={isNextDisabled || isNextLoading}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
          ${isNextDisabled || isNextLoading
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        style={{ minWidth: "140px" }}
      >
        {getNextLabel()}
        {!isNextLoading && currentStep < totalSteps && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        {isNextLoading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
      </button>
    </div>
  );
}
