import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumePro - Professional Resume Builder | Create ATS-Friendly Resumes",
  description: "Build professional, ATS-optimized resumes in seconds with AI-powered resume builder. Multiple templates, instant PDF download, and designed for job seekers in warehouse, logistics, and supply chain industries.",
  keywords: "resume builder, CV generator, professional resume, ATS-friendly resume, warehouse worker resume, logistics resume, AI resume builder, resume templates",
  authors: [{ name: "ResumePro" }],
  creator: "ResumePro",
  publisher: "ResumePro",
  openGraph: {
    title: "ResumePro - Professional Resume Builder",
    description: "Build professional resumes in seconds with AI-powered resume builder.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumePro - Professional Resume Builder",
    description: "Create professional, ATS-optimized resumes instantly with AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
