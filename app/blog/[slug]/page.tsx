import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, blogPosts } from "../../data/blog-posts";
import { ArticleCTA } from "../../components/ArticleCTA";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  author: string;
  featured: boolean;
  image: string;
  seoTitle?: string;
  seoDescription?: string;
}

// 生成文章的详细内容
function generatePostContent(post: BlogPost): string {
  const content = `
# ${post.title}

## Introduction

${post.excerpt}

## Why This Matters for Your Career

In the competitive warehouse industry, having a well-crafted resume is essential. This guide will show you exactly what employers are looking for in 2025.

## Key Takeaways

- Professional formatting matters
- Quantifiable achievements get attention
- ATS optimization is critical
- Continuous learning sets you apart

## Practical Tips

### Tip 1: Tailor Your Resume
Customize your resume for each position. Highlight relevant experience and skills that match the job description.

### Tip 2: Use Action Verbs
Start bullet points with strong action verbs: "Managed," "Supervised," "Operated," "Processed," "Maintained."

### Tip 3: Quantify Results
Include numbers wherever possible: "Increased efficiency by 25%," "Reduced errors by 40%," "Trained 5 team members."

### Tip 4: Highlight Certifications
List relevant certifications prominently: OSHA 30, Forklift Certification, Hazmat Training, CPL.

### Tip 5: Show Safety Record
Emphasize your safety achievements: "3 years without lost-time incidents," "Zero safety violations."

## Common Mistakes to Avoid

### Mistake 1: Being Too Vague
❌ "Responsible for warehouse operations"
✅ "Managed daily operations for 50,000+ sq ft warehouse, processing 500+ orders daily"

### Mistake 2: Ignoring Soft Skills
❌ Just listing technical skills
✅ Including teamwork, communication, problem-solving, and adaptability

### Mistake 3: Not Updating Regularly
❌ Using a resume from 5 years ago
✅ Updating with recent skills, certifications, and achievements

## Expert Advice

Industry experts recommend:

> "Focus on measurable achievements rather than job responsibilities. Employers want to see impact, not just duties." - Senior HR Manager, Logistics Company

> "Keywords are crucial for ATS. Include terms like 'inventory control,' 'order fulfillment,' 'safety compliance' throughout your resume." - Career Coach

## Next Steps

Now that you understand these principles, it's time to put them into practice. Use our AI-powered resume builder to create your professional warehouse worker resume.

## Conclusion

A well-crafted warehouse worker resume is your ticket to better job opportunities and higher pay. Follow these tips, stay updated on industry trends, and continuously improve your skills.

---

**Additional Resources:**

- [Resume Examples](/examples) - View sample resumes by position
- [Career Blog](/blog) - More career advice and tips
- [Resume Builder](/) - Create your AI-powered resume now

---

*Last updated: ${post.date}*
*Author: ${post.author}*
*Category: ${post.category}*
`;

  return content;
}

// 生成静态路径
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug
  }));
}

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found."
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      url: `https://www.warehouseworkerresume.com/blog/${post.slug}`,
      siteName: "Warehouse Worker Resume Generator",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: "https://www.warehouseworkerresume.com/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: ["https://www.warehouseworkerresume.com/og-image.png"],
    },
    alternates: {
      canonical: `https://www.warehouseworkerresume.com/blog/${post.slug}`
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = post.content || generatePostContent(post);
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Article Header */}
      <article className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/blog" className="text-blue-200 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li className="text-blue-200">/</li>
              <li>
                <Link href={`/blog/${post.slug}`} className="text-white hover:text-blue-200 transition-colors">
                  {post.title}
                </Link>
              </li>
            </ol>
          </nav>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-blue-200 text-sm">{post.readTime}</span>
            <span className="text-blue-200 text-sm">{post.date}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-blue-100 max-w-3xl">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 mt-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              {post.image}
            </div>
            <div>
              <p className="font-semibold">By {post.author}</p>
              <p className="text-sm text-blue-200">Career Expert</p>
            </div>
          </div>
        </div>
      </article>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* CTA 1: After article header - Compact version */}
        <ArticleCTA variant="compact" />

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12">
          <div className="prose prose-lg max-w-none">
            {/* First paragraph with intro */}
            <div className="mb-8">
              <p className="text-lg text-slate-700 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Main content */}
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
              {content.split('\n').map((line, index) => {
                // Headers
                if (line.startsWith('## ')) {
                  const headerText = line.replace('## ', '');
                  return (
                    <h2 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                      {headerText}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  const headerText = line.replace('### ', '');
                  return (
                    <h3 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-3">
                      {headerText}
                    </h3>
                  );
                }
                if (line.startsWith('# ')) {
                  const headerText = line.replace('# ', '');
                  return (
                    <h1 key={index} className="text-3xl font-bold text-slate-900 mt-8 mb-4">
                      {headerText}
                    </h1>
                  );
                }
                // Blockquotes
                if (line.startsWith('>')) {
                  const quoteText = line.replace(/^>?\s*/, '');
                  return (
                    <blockquote key={index} className="border-l-4 border-blue-500 pl-4 my-6 italic text-slate-600 bg-blue-50 py-2 pr-4">
                      "{quoteText}"
                    </blockquote>
                  );
                }
                // Lists
                if (line.startsWith('- ')) {
                  const itemText = line.replace('- ', '');
                  return (
                    <li key={index} className="mb-2 text-slate-700">
                      {itemText}
                    </li>
                  );
                }
                if (line.match(/^\d+\./)) {
                  return (
                    <p key={index} className="text-slate-700 mb-4">
                      {line}
                    </p>
                  );
                }
                // Code blocks
                if (line.startsWith('```')) {
                  return <br key={index} />;
                }
                // Regular paragraphs
                if (line.trim()) {
                  return (
                    <p key={index} className="text-slate-700 mb-4">
                      {line}
                    </p>
                  );
                }
                return <br key={index} />;
              })}
            </div>

            {/* CTA 2: Middle of article - Secondary version */}
            <div className="mt-12">
              <ArticleCTA variant="secondary" />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/blog?tag=${tag}`}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA 3: Final CTA - Primary version */}
          <div className="mt-12">
            <ArticleCTA variant="primary" />
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Share this article</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.warehouseworkerresume.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554l-1.68-9.332c-.806-3.529-3.489-5.513-3.678C12.574 1.589 9.083 1.168 5.828.327c-3.255 3.08-3.635 8.057-1.68 9.332zm-13.386-5.223c-1.252-5.542.968-8.636 5.026-3.084 1.078-3.635 1.084v.5c.053.016.098.098.147.249.246l3.077 5.524c3.157-1.768 5.966-4.263 5.667-8.229a.5.5.5 0 00-.55-.5v-.057c0-2.639 1.467-4.558 3.633-4.547zM3.96 7.227c.522.603 1.054.19 1.595.308.95a5.477 5.477 0 004.672 2.534c.108.284.216.608.324.924v.514a.5.5.5 0 00-.55.5v-.521c0-2.65-1.48-4.58-3.622-4.542-3.648a5.477 5.477 0 00-4.667 2.472"/>
                </svg>
                LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.warehouseworkerresume.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10.953 10.953 0 01-5.55-9.681c-1.029-.44-2.068-.656-3.069-.656a10.954 10.954 0 01-7.78 3.23c-.995.995-2.016 1.078-3.069.656a10.954 10.954 0 01-3.069 2.237c-.995.995-2.016 2.078-3.069.656a10.954 10.954 0 01-3.069-2.237m11.058 11.058a10.954 10.954 0 01-3.069 2.237c.995.995 2.016-1.078 3.069-.656a10.954 10.954 0 013.069-2.237m-11.058 11.058a10.954 10.954 0 013.069-2.237c.995-.995 2.016-1.078 3.069-.656a10.954 10.954 0 013.069.656"/>
                </svg>
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.warehouseworkerresume.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12zm-1 4c0-2.21-1.791-4-4-4s1.791-4 4-4 4 1.791 4 4 4-1.791 4-4 4zm-4.5 0c-.276 0-.5-.224-.5-.5s.224-.5.5-.5.5.224.5.5.5-.5.224-.5-.5-.5zM15 10c0 .276-.224.5-.5.5-.5s-.224.5-.5-.5.5.224.5.5-.5.5.224.5-.5zm0 1c0 .276-.224.5-.5.5-.5s-.224.5-.5-.5.5.224.5.5-.5.5.224.5-.5zm-3-4.5c0 .276-.224.5-.5-.5-.5s-.224.5-.5-.5.5.224.5.5-.5.5.224.5-.5zm0 1c0 .276-.224.5-.5.5-.5s-.224.5-.5-.5.5.224.5.5-.5.5.224.5-.5z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{relatedPost.image}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {relatedPost.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{relatedPost.readTime}</span>
                    <span>{relatedPost.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white text-center shadow-xl">
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
    </main>
  );
}
