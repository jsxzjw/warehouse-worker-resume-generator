// 依赖：React

export interface Template {
  id: "modern" | "classic" | "professional";
  name: string;
  type: "basic" | "advanced" | "premium";
  description: string;
  price?: string;
  locked?: boolean;
}

export interface TemplateSelectorProps {
  selectedTemplate: "modern" | "classic" | "professional";
  onTemplateChange: (template: "modern" | "classic" | "professional") => void;
  darkMode?: boolean;
  onUnlock?: (template: "professional") => void;
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Basic",
    type: "basic",
    description: "Clean & Simple Design",
    price: "Free"
  },
  {
    id: "classic",
    name: "Advanced",
    type: "advanced",
    description: "Traditional & Professional",
    price: "Free"
  },
  {
    id: "professional",
    name: "Premium",
    type: "premium",
    description: "Executive & Elegant",
    price: "$4.99",
    locked: true
  }
];

export function TemplateSelector({ selectedTemplate, onTemplateChange, darkMode = false, onUnlock }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
          Choose Your Template
        </h3>
        <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}>
          {selectedTemplate === "professional" ? "Premium Selected" : "Free Templates"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isLocked = template.locked;

          return (
            <div
              key={template.id}
              className={`relative rounded-2xl border-2 p-4 transition-all duration-300 cursor-pointer
                ${isSelected
                  ? "border-blue-500 shadow-xl scale-105"
                  : "border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:scale-102"
                } ${isLocked ? "opacity-75" : ""}
                ${darkMode && isSelected ? "bg-blue-500/10" : ""}
                ${!darkMode && isSelected ? "bg-blue-50" : ""}
              `}
              onClick={() => {
                if (!isLocked) {
                  onTemplateChange(template.id);
                } else if (onUnlock && template.id === "professional") {
                  onUnlock(template.id);
                }
              }}
            >
              {/* Template Header */}
              <div className="flex items-center justify-between mb-3">
                <div className={`text-sm font-semibold ${
                  isSelected ? "text-blue-600" : darkMode ? "text-slate-300" : "text-slate-700"
                }`}>
                  {template.name}
                </div>
                {template.price && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    template.type === "premium"
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {template.price}
                  </span>
                )}
              </div>

              {/* Template Preview */}
              <div className={`mb-3 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                isSelected ? "border-blue-400" : "border-slate-200 dark:border-slate-600"
              }`}>
                <div className={`aspect-[3/4] p-3 ${
                  template.id === "modern"
                    ? "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/30 dark:to-slate-800"
                    : template.id === "classic"
                      ? "bg-gradient-to-br from-stone-50 to-white dark:from-stone-900/30 dark:to-slate-800"
                      : "bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/30 dark:to-slate-800"
                }`}>
                  {/* Mini Preview */}
                  <div className="space-y-2">
                    <div className={`h-3 rounded ${template.id === "modern" ? "bg-blue-400" : template.id === "classic" ? "bg-stone-400" : "bg-slate-400"}`} style={{ width: "60%" }}></div>
                    <div className="h-2 rounded bg-slate-300 dark:bg-slate-600" style={{ width: "100%" }}></div>
                    <div className="h-2 rounded bg-slate-300 dark:bg-slate-600" style={{ width: "80%" }}></div>
                    <div className="space-y-1 mt-3">
                      <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" style={{ width: "100%" }}></div>
                      <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Description */}
              <p className={`text-sm mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {template.description}
              </p>

              {/* Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className={`text-sm font-semibold ${darkMode ? "text-slate-800" : "text-slate-900"}`}>
                      Premium
                    </p>
                    <p className={`text-xs ${darkMode ? "text-slate-600" : "text-slate-500"}`}>
                      Unlock for {template.price}
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Badge */}
              {isSelected && !isLocked && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Template Type Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full bg-green-500`}></span>
          <span className={darkMode ? "text-slate-400" : "text-slate-600"}>Free</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500`}></span>
          <span className={darkMode ? "text-slate-400" : "text-slate-600"}>Premium</span>
        </div>
      </div>
    </div>
  );
}
