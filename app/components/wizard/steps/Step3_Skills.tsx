// 依赖：React

export interface Entry {
  id: number;
  text: string;
}

export interface Step3SkillsProps {
  skills: string[];
  skillInput: string;
  educationList: Entry[];
  certifications: string;
  onSkillsChange: (skills: string[]) => void;
  onSkillInputChange: (value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
  onEducationUpdate: (id: number, value: string) => void;
  onAddEducation: () => void;
  onRemoveEducation: (id: number) => void;
  onCertificationsChange: (value: string) => void;
  darkMode?: boolean;
}

export function Step3_Skills({
  skills,
  skillInput,
  educationList,
  certifications,
  onSkillsChange,
  onSkillInputChange,
  onAddSkill,
  onRemoveSkill,
  onEducationUpdate,
  onAddEducation,
  onRemoveEducation,
  onCertificationsChange,
  darkMode = false
}: Step3SkillsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Skills & Education
        </h2>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Add your qualifications and abilities
        </p>
      </div>

      {/* Skills Section */}
      <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Skills <span className="text-red-500">*</span>
        </h3>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, i) => {
            if (!skill.trim()) return null;
            return (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${darkMode ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-blue-100 text-blue-700 border border-blue-200"}
                `}
              >
                <span>{skill.trim()}</span>
                <button
                  onClick={() => onRemoveSkill(i)}
                  className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>

        {/* Add Skill Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Type a skill and press Enter (e.g., Forklift Operation)"
            value={skillInput}
            onChange={(e) => onSkillInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddSkill();
              }
            }}
            className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 outline-none
              ${darkMode ? "bg-slate-700 border-slate-600 focus:border-blue-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-blue-500 focus:bg-slate-50"}
            `}
          />
          <button
            onClick={onAddSkill}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${darkMode ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Education Section */}
      <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Education <span className="text-red-500">*</span>
        </h3>

        <div className="space-y-3">
          {educationList.map((edu, idx) => (
            <div key={edu.id} className="relative group">
              <textarea
                placeholder={`Education #${idx + 1} (e.g., High School Diploma - 2018)`}
                value={edu.text}
                onChange={(e) => onEducationUpdate(edu.id, e.target.value)}
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none resize-none
                  ${darkMode ? "bg-slate-700 border-slate-600 focus:border-blue-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-blue-500 focus:bg-slate-50"}
                `}
                style={{ minHeight: "80px" }}
              />
              {educationList.length > 1 && (
                <button
                  onClick={() => onRemoveEducation(edu.id)}
                  className="absolute right-2 top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onAddEducation}
          className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 mt-3
            ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Education
        </button>
      </div>

      {/* Certifications Section */}
      <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Certifications (Optional)
        </h3>
        <textarea
          placeholder="Forklift certification, OSHA training, safety certifications, etc."
          value={certifications}
          onChange={(e) => onCertificationsChange(e.target.value)}
          rows={3}
          maxLength={500}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none resize-none
            ${darkMode ? "bg-slate-700 border-slate-600 focus:border-blue-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-blue-500 focus:bg-slate-50"}
          `}
          style={{ minHeight: "100px" }}
        />
        <p className={`text-xs mt-1 text-right ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          {certifications.length}/500
        </p>
      </div>
    </div>
  );
}
