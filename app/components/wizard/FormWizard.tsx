// 依赖：React

export interface FormWizardProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

export function FormWizard({ children, currentStep, totalSteps }: FormWizardProps) {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps Content */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}
