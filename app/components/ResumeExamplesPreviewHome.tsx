import Link from "next/link";
import { resumeExamples } from "../data/examples-data";

export interface ResumeExamplesPreviewHomeProps {
  darkMode?: boolean;
}

export function ResumeExamplesPreviewHome({ darkMode = false }: ResumeExamplesPreviewHomeProps) {
  // Select 3 representative examples: Entry-Level, Forklift, Supervisor
  const featuredExamples = [
    resumeExamples.find(e => e.slug === "material-handler"), // Entry-Level (2+ Years)
    resumeExamples.find(e => e.slug === "forklift-operator"), // Forklift
    resumeExamples.find(e => e.slug === "warehouse-manager"), // Supervisor
  ].filter((e): e is Exclude<typeof e, undefined> => Boolean(e));

  return (
    <section className={`py-16 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Real Warehouse Resume Examples
          </h2>
          <p className={`text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            See how other warehouse workers have landed their dream jobs
          </p>
        </div>

        {/* Example Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredExamples.map((example) => (
            <div
              key={example.id}
              className={`group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                darkMode ? "bg-slate-700 border border-slate-600" : "bg-white border border-slate-200"
              }`}
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${example.color} p-6`}>
                <h3 className="text-2xl font-bold text-white mb-2">{example.title}</h3>
                <p className="text-white/90 text-sm font-medium">{example.experience} Experience</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className={`text-sm mb-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {example.description}
                </p>

                {/* Key Skills Preview */}
                <div className="mb-4">
                  <p className={`text-xs font-semibold mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    KEY SKILLS:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {example.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          darkMode ? "bg-slate-600 text-slate-300" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {example.skills.length > 3 && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        darkMode ? "bg-slate-600 text-slate-400" : "bg-slate-100 text-slate-600"
                      }`}>
                        +{example.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* View Example Button */}
                <Link
                  href={`/examples/${example.slug}`}
                  className="group/btn w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
                >
                  View Example
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Browse All Link */}
        <div className="text-center">
          <Link
            href="/examples"
            className={`inline-flex items-center gap-2 text-lg font-semibold transition-all duration-200 hover:gap-3 ${
              darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
            }`}
          >
            Browse All Resume Examples
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
