import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getExampleBySlug, resumeExamples } from "../../data/examples-data";
import { ArticleCTA } from "../../components/ArticleCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params
export function generateStaticParams() {
  return resumeExamples.map((example) => ({
    slug: example.slug
  }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const example = getExampleBySlug(slug);

  if (!example) {
    return {
      title: "Example Not Found",
      description: "The requested resume example could not be found."
    };
  }

  return {
    title: `${example.title} Resume Example | Warehouse Worker Resume`,
    description: example.fullDescription,
    keywords: example.tags.join(", "),
    openGraph: {
      title: `${example.title} Resume Example`,
      description: example.fullDescription,
      url: `https://www.warehouseworkerresume.com/examples/${example.slug}`,
      siteName: "Warehouse Worker Resume Generator",
      type: "article",
      images: [
        {
          url: "https://www.warehouseworkerresume.com/og-image.png",
          width: 1200,
          height: 630,
          alt: example.title
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${example.title} Resume Example`,
      description: example.fullDescription,
      images: ["https://www.warehouseworkerresume.com/og-image.png"],
    },
    alternates: {
      canonical: `https://www.warehouseworkerresume.com/examples/${example.slug}`
    }
  };
}

export default async function ExampleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const example = getExampleBySlug(slug);

  if (!example) {
    notFound();
  }

  const relatedExamples = resumeExamples
    .filter(e => e.id !== example.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Header */}
      <section className={`bg-gradient-to-r ${example.color} text-white py-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/examples" className="text-blue-100 hover:text-white transition-colors">
                  Examples
                </Link>
              </li>
              <li className="text-blue-100">/</li>
              <li className="text-white">{example.title}</li>
            </ol>
          </nav>

          {/* Title Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
            <span>{example.experience}</span>
            <span>•</span>
            <span>Resume Example</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {example.title} Resume Example
          </h1>

          {/* Description */}
          <p className="text-xl text-blue-100 max-w-3xl">
            {example.fullDescription}
          </p>
        </div>
      </section>

      {/* CTA 1 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArticleCTA variant="compact" />
      </div>

      {/* Skills */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {example.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Responsibilities</h2>
          <ul className="space-y-3">
            {example.responsibilities.map((resp, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span className="text-slate-700">{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Achievements */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Achievements</h2>
          <ul className="space-y-3">
            {example.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700 font-medium">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA 2 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleCTA variant="secondary" />
      </div>

      {/* Related Examples */}
      {relatedExamples.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            More Resume Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedExamples.map((relatedExample) => (
              <Link
                key={relatedExample.id}
                href={`/examples/${relatedExample.slug}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className={`bg-gradient-to-r ${relatedExample.color} p-4 rounded-lg mb-4`}>
                    <h3 className="text-xl font-bold text-white">{relatedExample.title}</h3>
                    <p className="text-white/80 text-sm">{relatedExample.experience}</p>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{relatedExample.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedExample.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ArticleCTA variant="primary" />
      </div>
    </main>
  );
}
