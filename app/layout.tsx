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
  title: "Warehouse Worker Resume Generator - Create ATS-Friendly Resumes",
  description: "Build professional, ATS-optimized resumes for warehouse workers in seconds with AI-powered resume builder. Multiple templates, instant PDF download.",
  keywords: "warehouse worker resume, resume builder, CV generator, warehouse resume, logistics resume, ATS-friendly resume, AI resume builder, resume templates",
  authors: [{ name: "Warehouse Worker Resume Generator" }],
  creator: "Warehouse Worker Resume Generator",
  publisher: "Warehouse Worker Resume Generator",
  openGraph: {
    title: "Warehouse Worker Resume Generator",
    description: "Build professional warehouse worker resumes in seconds with AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warehouse Worker Resume Generator",
    description: "Create professional, ATS-optimized resumes for warehouse workers instantly with AI.",
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
