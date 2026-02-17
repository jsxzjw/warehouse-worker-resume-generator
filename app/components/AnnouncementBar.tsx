import Link from "next/link";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export interface AnnouncementBarProps {
  darkMode?: boolean;
}

export function AnnouncementBar({ darkMode = false }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Check if user has dismissed it
  useEffect(() => {
    const dismissed = localStorage.getItem("announcement_dismissed");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement_dismissed", "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`relative z-40 transition-all duration-300 ${
      darkMode ? "bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-center gap-3 text-white">
          <span className="text-sm font-medium hidden sm:inline">
            🚀 Build your professional warehouse resume in minutes
          </span>
          <span className="text-sm font-medium sm:hidden">
            🚀 Build your resume in minutes
          </span>
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-blue-100 hover:text-white underline underline-offset-2 decoration-2 hover:decoration-blue-200 transition-all"
          >
            Get Started Free →
          </Link>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all duration-200 ${
          darkMode
            ? "text-white/60 hover:text-white hover:bg-white/10"
            : "text-white/60 hover:text-white hover:bg-white/20"
        }`}
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
