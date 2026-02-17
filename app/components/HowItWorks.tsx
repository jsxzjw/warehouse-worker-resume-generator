export interface HowItWorksProps {
  darkMode?: boolean;
}

export function HowItWorks({ darkMode = false }: HowItWorksProps) {
  const steps = [
    {
      number: "1",
      title: "Enter Your Details",
      description: "Fill in your work experience, skills, and education in our simple form",
      icon: "📝"
    },
    {
      number: "2",
      title: "AI Generates Resume",
      description: "Our AI creates a professional, ATS-optimized resume instantly",
      icon: "🤖"
    },
    {
      number: "3",
      title: "Download Your PDF",
      description: "Get your polished resume ready to send to employers",
      icon: "📥"
    }
  ];

  return (
    <section className={`py-20 transition-colors ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>
            How It Works
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Create your professional warehouse resume in just 3 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                {step.number}
              </div>

              {/* Step Card */}
              <div className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                darkMode
                  ? "bg-slate-800 border-slate-700 hover:border-blue-500"
                  : "bg-white border-slate-200 hover:border-blue-300 shadow-md"
              }`}>
                {/* Icon */}
                <div className={`text-5xl mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className={`text-lg mb-6 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
            Ready to get started? It's completely free to try!
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 500, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
          >
            Start Building Your Resume
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
