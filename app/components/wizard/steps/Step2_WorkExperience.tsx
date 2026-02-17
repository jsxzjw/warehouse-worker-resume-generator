// 依赖：React

export interface Entry {
  id: number;
  text: string;
  description?: string;
}

export interface Step2WorkExperienceProps {
  experienceList: Entry[];
  onUpdate: (id: number, field: string, value: string) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  darkMode?: boolean;
}

export function Step2_WorkExperience({ experienceList, onUpdate, onAdd, onRemove, darkMode = false }: Step2WorkExperienceProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Work Experience
        </h2>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Add your relevant work history
        </p>
      </div>

      <div className="space-y-4">
        {experienceList.map((exp, idx) => (
          <div
            key={exp.id}
            className={`relative p-5 rounded-2xl border-2 transition-all duration-200 ${
              darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {/* Experience Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Work Experience #{idx + 1}
              </h3>
              {experienceList.length > 1 && (
                <button
                  onClick={() => onRemove(exp.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  aria-label="Remove experience"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Job Title/Position */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Position & Company <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Warehouse Associate at ABC Corp (2 years)"
                value={exp.text}
                onChange={(e) => onUpdate(exp.id, "text", e.target.value)}
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none resize-none
                  ${darkMode ? "bg-slate-700 border-slate-600 focus:border-blue-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-blue-500 focus:bg-slate-50"}
                `}
                style={{ minHeight: "80px" }}
              />
            </div>

            {/* Experience Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                Description (Optional)
              </label>
              <textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.description || ""}
                onChange={(e) => onUpdate(exp.id, "description", e.target.value)}
                rows={3}
                maxLength={500}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none resize-none
                  ${darkMode ? "bg-slate-700 border-slate-600 focus:border-blue-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-blue-500 focus:bg-slate-50"}
                `}
                style={{ minHeight: "100px" }}
              />
              <p className={`text-xs mt-1 text-right ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                {(exp.description?.length || 0)}/500
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Experience Button */}
      <div className="flex justify-center">
        <button
          onClick={onAdd}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
            ${darkMode ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Experience
        </button>
      </div>
    </div>
  );
}
