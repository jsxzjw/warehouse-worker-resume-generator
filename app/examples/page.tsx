import { Metadata } from "next";
import Link from "next/link";
import { resumeExamples } from "../data/examples-data";

export const metadata: Metadata = {
  title: "Warehouse Worker Resume Examples | Free Sample Resumes",
  description: "Browse professional warehouse worker resume examples. Get inspired by sample resumes for forklift operators, warehouse associates, shipping receivers, and more.",
  keywords: "warehouse worker resume examples, sample resume, resume templates, forklift operator resume example, warehouse associate resume sample",
};

export default function ResumeExamplesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Warehouse Worker Resume Examples
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Get inspired by professionally crafted resume examples tailored for warehouse positions
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your Resume
          </Link>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Sample Resumes by Position
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Click on any example to view details and get inspiration for your own resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumeExamples.map((example, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300 hover:-translate-y-2"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${example.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">{example.title}</h3>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {example.experience}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-600 mb-6">{example.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {example.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/examples/${example.slug}`}
                    className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Example
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 text-center py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    Create Similar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Use our AI-powered resume builder to create a customized resume in minutes
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Build My Resume Now
          </Link>
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Resume Writing Tips for Warehouse Workers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Highlight Your Skills
              </h3>
              <p className="text-slate-600">
                Emphasize equipment operation, safety certifications, and process improvement achievements
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Use Quantifiable Results
              </h3>
              <p className="text-slate-600">
                Include numbers: "Increased efficiency by 25%", "Reduced errors by 40%"
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C13.168 18.477 11.582 18 9.833 18c-1.253 0-2.5-.322-3.5-1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Keep It ATS-Friendly
              </h3>
              <p className="text-slate-600">
                Use simple formatting, standard headings, and keyword-rich content for applicant tracking systems
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
