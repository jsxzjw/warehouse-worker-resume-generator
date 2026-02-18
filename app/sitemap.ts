import { MetadataRoute } from "next";
import { blogPosts } from "./data/blog-posts";
import { resumeExamples } from "./data/examples-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.warehouseworkerresume.com";
  const now = new Date();

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/examples`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Blog posts
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Resume examples
  const examplePages = resumeExamples.map((example) => ({
    url: `${baseUrl}/examples/${example.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...mainPages, ...blogPages, ...examplePages];
}
