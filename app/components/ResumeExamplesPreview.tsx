import Link from "next/link";

export interface ResumeExamplesPreviewProps {
  darkMode?: boolean;
}

export function ResumeExamplesPreview({ darkMode = false }: ResumeExamplesPreviewProps) {
  const examples = [
    {
      title: "Forklift Operator",
      experience: "5+ Years",
      description: "Experienced forklift operator with expertise in inventory management",
      tags: ["Forklift", "Inventory", "Safety"],
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Warehouse Associate",
      experience: "3+ Years",
      description: "Dedicated warehouse associate skilled in order fulfillment",
      tags: ["Order Fulfillment", "Shipping", "Team Player"],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Warehouse Manager",
      experience: "8+ Years",
      description: "Results-driven warehouse manager with proven leadership",
      tags: ["Management", "Leadership", "Process Improvement"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className={`py-20 transition-colors ${darkMode ? "bg-slate-800" : "bg-gradient-to-b from-blue-50 to-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Resume Examples That Get Results
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Browse professionally crafted resume examples tailored for warehouse positions
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {examples.map((example, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                darkMode ? "border-slate-700" : "border-slate-200"
              } hover:-translate-y-2`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${example.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{example.title}</h3>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {example.experience}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className={`text-sm mb-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {example.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {example.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Button */}
                <Link
                  href="/examples"
                  className={`block w-full text-center py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  View Example
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/examples"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            View All Examples
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
