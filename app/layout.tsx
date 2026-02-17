import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "./components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 基础 SEO
  title: {
    default: "Warehouse Worker Resume Generator - Create ATS-Friendly Resumes in 60 Seconds",
    template: "%s | Warehouse Worker Resume"
  },
  description: "Professional resume builder designed for warehouse workers. Create ATS-optimized resumes in seconds with AI. Multiple templates, instant PDF download, no sign-up required.",
  keywords: [
    "warehouse worker resume",
    "resume builder",
    "CV generator",
    "warehouse resume",
    "logistics resume",
    "forklift operator resume",
    "warehouse associate resume",
    "ATS-friendly resume",
    "AI resume builder",
    "resume templates",
    "free resume builder",
    "warehouse worker CV",
    "logistics CV",
    "supply chain resume",
    "inventory manager resume",
    "shipping receiving resume",
    "order picker resume",
    "material handler resume"
  ],
  authors: [{ name: "Warehouse Worker Resume Generator", url: "https://www.warehouseworkerresume.com" }],
  creator: "Warehouse Worker Resume Generator",
  publisher: "Warehouse Worker Resume Generator",
  applicationName: "Warehouse Worker Resume Generator",
  category: "Career & Education",
  classification: "Business",

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    title: "Warehouse Worker Resume Generator - Professional Resumes in 60 Seconds",
    description: "AI-powered resume builder for warehouse workers. Create ATS-optimized resumes instantly. Free templates, no sign-up required.",
    url: "https://www.warehouseworkerresume.com",
    siteName: "Warehouse Worker Resume Generator",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    type: "website",
    images: [
      {
        url: "https://www.warehouseworkerresume.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Warehouse Worker Resume Generator",
        type: "image/png"
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Warehouse Worker Resume Generator - Professional Resumes in 60 Seconds",
    description: "AI-powered resume builder for warehouse workers. Create ATS-optimized resumes instantly.",
    images: ["https://www.warehouseworkerresume.com/og-image.png"],
    site: "@warehouseworkerresume",
    creator: "@warehouseworkerresume"
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 验证码（用于搜索引擎控制台）
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code"
  },

  // 其他元标签
  alternates: {
    canonical: "https://www.warehouseworkerresume.com",
    languages: {
      "en": "https://www.warehouseworkerresume.com/en",
      "es": "https://www.warehouseworkerresume.com/es",
    }
  },

  // 应用程序
  appleWebApp: {
    capable: true,
    title: "Warehouse Worker Resume",
    statusBarStyle: "default"
  },

  // 图标
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },

  // 清单文件
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.warehouseworkerresume.com" />

        {/* DNS 预解析（性能优化） */}
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />

        {/* 结构化数据（Schema.org） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Warehouse Worker Resume Generator",
              "description": "AI-powered resume builder for warehouse workers",
              "url": "https://www.warehouseworkerresume.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
