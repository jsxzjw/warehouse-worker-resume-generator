// 依赖：React

export interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  onCTAClick: () => void;
  darkMode?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  cta,
  onCTAClick,
  darkMode = false
}: PricingCardProps) {
  return (
    <div className={`relative rounded-2xl border-2 p-6 transition-all duration-300 flex flex-col
      ${highlighted
        ? "border-blue-500 shadow-xl scale-105"
        : "border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg"
      } ${darkMode && highlighted ? "bg-blue-500/10" : ""}
      ${!darkMode && highlighted ? "bg-blue-50" : ""}
    `}>
      {/* Popular Badge */}
      {highlighted && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            POPULAR
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className={`text-xl font-bold mb-2 ${highlighted ? "text-blue-600" : darkMode ? "text-white" : "text-slate-900"}`}>
          {name}
        </h3>
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className={`text-4xl font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
            {price}
          </span>
          {period && (
            <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {period}
            </span>
          )}
        </div>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          {description}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${highlighted ? "text-blue-600" : "text-green-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onCTAClick}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200
          ${highlighted
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
            : darkMode
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
      >
        {cta}
      </button>
    </div>
  );
}
