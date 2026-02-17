"use client";

import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { AnnouncementBar } from "./AnnouncementBar";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayoutContent({ children }: MainLayoutProps) {
  const { darkMode, toggleDarkMode, language, setLanguage } = useTheme();

  return (
    <>
      <Navigation
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        language={language}
        onLanguageChange={setLanguage}
      />
      <AnnouncementBar darkMode={darkMode} />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer darkMode={darkMode} />
    </>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </ThemeProvider>
  );
}
