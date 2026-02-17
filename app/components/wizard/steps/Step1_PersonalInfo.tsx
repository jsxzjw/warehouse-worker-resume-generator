// 依赖：React

export interface Step1PersonalInfoProps {
  formData: {
    name: string;
    contact: string;
  };
  onChange: (field: string, value: string) => void;
  errors: {
    name?: string;
    contact?: string;
  };
  touched: Set<string>;
  onFieldBlur: (field: string) => void;
  darkMode?: boolean;
}

export function Step1_PersonalInfo({ formData, onChange, errors, touched, onFieldBlur, darkMode = false }: Step1PersonalInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Personal Information
        </h2>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Let's start with your basic details
        </p>
      </div>

      {/* Name Field */}
      <div className="w-full max-w-md mx-auto">
        <label htmlFor="name" className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          onBlur={() => onFieldBlur("name")}
          maxLength={50}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none
            ${errors.name && touched.has("name")
              ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-slate-200 focus:border-blue-500 " + (darkMode ? "bg-slate-700 focus:bg-slate-600" : "bg-white focus:bg-slate-50")
            }`}
        />
        {errors.name && touched.has("name") && (
          <p className="text-sm text-red-500 mt-2">{errors.name}</p>
        )}
      </div>

      {/* Contact Field */}
      <div className="w-full max-w-md mx-auto">
        <label htmlFor="contact" className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          Email or Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="contact"
          type="text"
          placeholder="john@example.com or (555) 123-4567"
          value={formData.contact}
          onChange={(e) => onChange("contact", e.target.value)}
          onBlur={() => onFieldBlur("contact")}
          maxLength={100}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none
            ${errors.contact && touched.has("contact")
              ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-slate-200 focus:border-blue-500 " + (darkMode ? "bg-slate-700 focus:bg-slate-600" : "bg-white focus:bg-slate-50")
            }`}
        />
        {errors.contact && touched.has("contact") && (
          <p className="text-sm text-red-500 mt-2">{errors.contact}</p>
        )}
      </div>
    </div>
  );
}
