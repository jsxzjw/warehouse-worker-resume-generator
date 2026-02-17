import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "../data/blog-posts";

export const metadata: Metadata = {
  title: "Warehouse Worker Resume Blog | Tips & Career Advice",
  description: "Expert advice on writing warehouse worker resumes, career tips, interview strategies, and job search guidance for warehouse professionals.",
  keywords: "warehouse worker resume tips, career advice, job search tips, warehouse interview questions, forklift operator career",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            📚 Career Resources
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Warehouse Worker Career Blog
          </h1>
          <p className="text-xl sm:text-2xl text-emerald-100 max-w-3xl mx-auto">
            Expert advice, tips, and strategies to advance your warehouse career
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Featured Articles</h2>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {blogPosts.filter(post => post.featured).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300 hover:-translate-y-2"
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-slate-500 text-sm">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">{post.date}</span>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Posts */}
        <h2 className="text-3xl font-bold text-slate-900 mb-8">All Articles</h2>

        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-slate-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex items-start gap-6">
                <div className="text-4xl">{post.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-slate-500 text-sm">{post.readTime}</span>
                    <span className="text-slate-500 text-sm">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Use our AI-powered resume builder to create a customized resume in minutes
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Build My Resume Now
          </Link>
        </div>
      </section>
    </main>
  );
}
