// 依赖：React
import { TemplateSelector } from "../../templates/TemplateSelector";
import { AIPremiumTools } from "../../premium/AIPremiumTools";

export interface Step4GenerateProps {
  selectedTemplate: "modern" | "classic" | "professional";
  onTemplateChange: (template: "modern" | "classic" | "professional") => void;
  resume: string;
  loading: boolean;
  onGenerate: () => void;
  onDownloadPDF: () => void;
  darkMode?: boolean;
  onUnlockPremium?: () => void;
  userPlan?: 'free' | 'basic' | 'premium';
  canDownloadPDF?: boolean;
  userEmail?: string;
  userName?: string;
}

export function Step4_Generate({
  selectedTemplate,
  onTemplateChange,
  resume,
  loading,
  onGenerate,
  onDownloadPDF,
  darkMode = false,
  onUnlockPremium,
  userPlan = 'free',
  canDownloadPDF = false,
  userEmail = '',
  userName = ''
}: Step4GenerateProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Review & Generate
        </h2>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Choose a template and generate your resume
        </p>
      </div>

      {/* Template Selection - Using new TemplateSelector component */}
      <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={onTemplateChange}
          darkMode={darkMode}
          onUnlock={onUnlockPremium ? (template) => {
            if (template === "professional") onUnlockPremium();
          } : undefined}
        />
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={loading}
          className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3
            ${loading
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-[0.98]"
            }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Resume
            </>
          )}
        </button>
      </div>

      {/* Resume Preview */}
      {resume && (
        <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
              Resume Preview
            </h3>
            <span className={`text-sm px-3 py-1 rounded-full ${darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
              Generated
            </span>
          </div>

          {/* Preview Content */}
          <div className={`max-h-96 overflow-y-auto p-4 rounded-xl mb-4
            ${selectedTemplate === "modern"
              ? "bg-white text-slate-800 border-l-4 border-blue-600"
              : selectedTemplate === "classic"
                ? "bg-stone-50 text-stone-900 border-2 border-stone-200"
                : "bg-slate-50 text-slate-800 border border-slate-200"
            }
          `}>
            <div className={`whitespace-pre-wrap leading-relaxed text-sm
              ${selectedTemplate === "classic" ? "font-serif" : "font-sans"}
            `}>
              {resume.split("\n").map((line, idx) => {
                const isSectionHeader = /^[A-Z][A-Z\s]{4,}:?$/.test(line);
                const isJobTitle = /^[A-Z]/.test(line) && line.length < 60 && !line.includes(":") && !line.startsWith("-");
                const isBullet = line.trim().startsWith("-");
                const content = isBullet ? line.trim().substring(1).trim() : line;
                if (!content && !isSectionHeader) return <br key={idx} />;

                if (isSectionHeader) {
                  return (
                    <div key={idx} className="mt-3 mb-2">
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 inline-block px-2 py-1 rounded">
                        {line.replace(/:/g, "")}
                      </div>
                    </div>
                  );
                }
                if (isJobTitle) {
                  return (
                    <div key={idx} className="mt-2 mb-1">
                      <div className="font-semibold text-slate-800">{line}</div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className={isBullet ? "ml-4 mb-1 flex items-start gap-2" : "mb-1"}>
                    {isBullet && <span className="mt-0.5 text-blue-500 text-sm">▸</span>}
                    <span className="text-slate-700">{content}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Download Button */}
          {userPlan === 'free' ? (
            // Free users see upgrade prompt instead of download
            <button
              onClick={onDownloadPDF}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                ${darkMode
                  ? "bg-orange-600 text-white hover:bg-orange-500"
                  : "bg-orange-500 text-white hover:bg-orange-600"
                } shadow-md hover:shadow-lg border-2 border-orange-300`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-bold">UPGRADE TO DOWNLOAD PDF</div>
                <div className="text-xs opacity-90">Free users can preview only</div>
              </div>
            </button>
          ) : (
            // Paid users can download
            <button
              onClick={onDownloadPDF}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                ${darkMode
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
                } shadow-md hover:shadow-lg`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          )}
        </div>
      )}

      {/* Premium AI Tools - Only for Premium users */}
      {userPlan === 'premium' && resume && (
        <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-purple-500" : "bg-white border-purple-200 shadow-sm"}`}>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
              Premium AI Tools
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"}`}>
              PREMIUM
            </span>
          </div>

          <AIPremiumTools
            darkMode={darkMode}
            userEmail={userEmail}
            userName={userName}
            currentResume={resume}
            userPlan={userPlan}
            onUpgradeRequired={onUnlockPremium || (() => {})}
          />
        </div>
      )}

      {/* Premium Upgrade Prompt - For Free/Basic users */}
      {userPlan !== 'premium' && resume && (
        <div className={`p-5 rounded-2xl border-2 ${darkMode ? "bg-slate-800 border-orange-500" : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"}`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${darkMode ? "bg-orange-500/20" : "bg-orange-100"}`}>
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                Unlock Premium AI Features
              </h3>
              <ul className={`space-y-2 mb-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>AI-powered work experience optimizer</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Smart cover letter generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>ATS score & improvement suggestions</span>
                </li>
              </ul>
              <button
                onClick={onUnlockPremium}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                  darkMode
                    ? "bg-orange-600 text-white hover:bg-orange-500"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                } shadow-lg hover:shadow-xl`}
              >
                Upgrade to Premium - $9.99
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
