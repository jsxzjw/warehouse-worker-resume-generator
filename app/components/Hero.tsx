"use client";

import { Language } from "../page";

interface HeroProps {
  language: Language;
  onStart: () => void;
  darkMode: boolean;
}

const heroTranslations = {
  en: {
    title: "Warehouse Resume in Minutes",
    subtitle: "AI-Powered, ATS-Ready. Create professional resumes that get you hired.",
    cta: "Create Resume Now",
    features: [
      { title: "ATS-Friendly", desc: "Optimized for applicant tracking systems" },
      { title: "3 Professional Templates", desc: "Modern, Classic, and Professional designs" },
      { title: "Instant PDF Download", desc: "Get your resume ready to apply immediately" }
    ]
  },
  es: {
    title: "Crea tu Curriculum Profesional en 60 Segundos",
    subtitle: "Generador de currículums con IA diseñado específicamente para trabajadores de almacén. Optimizado para sistemas ATS utilizados por empleadores en EE.UU., Reino Unido y Europa.",
    cta: "Comenzar a Crear",
    features: [
      { title: "Compatible con ATS", desc: "Optimizado para sistemas de seguimiento de candidatos" },
      { title: "3 Plantillas Profesionales", desc: "Diseños Moderno, Clásico y Profesional" },
      { title: "Descarga PDF Instantánea", desc: "Obtén tu currículo listo para aplicar de inmediato" }
    ]
  },
  fr: {
    title: "Créez votre CV Professionnel en 60 Secondes",
    subtitle: "Générateur de CV alimenté par l'IA conçu spécifiquement pour les travailleurs d'entrepôt. Optimisé pour les systèmes ATS utilisés par les employeurs américains, britanniques et européens.",
    cta: "Commencer à Créer",
    features: [
      { title: "Compatible ATS", desc: "Optimisé pour les systèmes de suivi des candidats" },
      { title: "3 Modèles Professionnels", desc: "Designs Moderne, Classique et Professionnel" },
      { title: "Téléchargement PDF Instantané", desc: "Obtenez votre CV prêt à postuler immédiatement" }
    ]
  },
  de: {
    title: "Erstellen Sie Ihren professionellen Lebenslauf in 60 Sekunden",
    subtitle: "KI-gestützter Lebenslauf-Generator, der speziell für Lagerarbeiter entwickelt wurde. Optimiert für ATS-Systeme, die von Arbeitgebern in den USA, Großbritannien und Europa verwendet werden.",
    cta: "Jetzt Erstellen",
    features: [
      { title: "ATS-kompatibel", desc: "Optimiert für Bewerber-Tracking-Systeme" },
      { title: "3 Professionelle Vorlagen", desc: "Designs: Modern, Klassisch und Professionell" },
      { title: "Sofortiger PDF-Download", desc: "Erhalten Sie Ihren lebenslauf sofort bereit zur Bewerbung" }
    ]
  }
};

export function Hero({ language, onStart, darkMode }: HeroProps) {
  const t = heroTranslations[language];

  return (
    <section className={`relative overflow-hidden ${darkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 via-white to-slate-50"}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="text-center">
          {/* Main Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-blue-100 text-blue-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            {language === "en" ? "Free for Limited Time" : language === "es" ? "Gratis por tiempo limitado" : language === "fr" ? "Gratuit pour une durée limitée" : "Kostenlos für begrenzte Zeit"}
          </div>

          {/* Main Heading */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}>
            {t.title}
          </h1>

          {/* Subtitle */}
          <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-10 ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}>
            {t.subtitle}
          </p>

          {/* CTA Button - 移动端居中，蓝色 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={onStart}
              className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                {t.cta}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <a
              href="#features"
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                darkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow"
              }`}
            >
              {language === "en" ? "Learn More" : language === "es" ? "Más Información" : language === "fr" ? "En Savoir Plus" : "Mehr Erfahren"}
            </a>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {t.features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  darkMode ? "bg-slate-800/50 border border-slate-700" : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto ${
                  darkMode ? "bg-indigo-500/20" : "bg-indigo-100"
                }`}>
                  <svg className={`w-6 h-6 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {index === 0 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                    {index === 1 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    )}
                    {index === 2 && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    )}
                  </svg>
                </div>
                <h3 className={`font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className={`absolute bottom-0 left-0 right-0 ${darkMode ? "text-slate-900" : "text-white"}`}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 64L60 69.3C120 75 240 85 360 80C480 75 600 53 720 48C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64L1440 64V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V64Z" fill="currentColor"/>
        </svg>
      </div>
    </section>
  );
}
