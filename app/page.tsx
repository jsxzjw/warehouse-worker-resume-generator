"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { downloadResumePDF } from "./lib/pdf-generator";
import { ToastContainer } from "./components/Toast";

// Types
type Language = "en" | "es" | "fr" | "de";

interface Entry {
  id: number;
  text: string;
}

interface FormErrors {
  name: string;
  contact: string;
  experience: string;
  education: string;
  skills: string;
}

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

interface FormData {
  name: string;
  contact: string;
  experienceList: Entry[];
  educationList: Entry[];
  skills: string[];
  skillInput: string;
  objective: string;
  certifications: string;
  languages: string;
  address: string;
}

const STORAGE_KEYS = {
  name: "wr_name",
  contact: "wr_contact",
  skills: "wr_skills",
  skillInput: "wr_skill_input",
  objective: "wr_objective",
  certifications: "wr_certifications",
  languages: "wr_languages",
  address: "wr_address",
  theme: "wr_theme",
  language: "wr_language",
  experience: "wr_experience",
  education: "wr_education",
  resume: "wr_resume",
  template: "wr_template"
} as const;

// Translations
const translations = {
  en: {
    // Header
    appTitle: "ResumePro - Professional Resume Builder",
    appSubtitle: "Create ATS-friendly resumes in seconds with AI",
    resetForm: "Reset form",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",

    // Language names
    languageNames: {
      en: "English",
      es: "Español",
      fr: "Français",
      de: "Deutsch"
    },

    // Personal Information Card
    personalInfo: "Personal Information",
    personalInfoDesc: "Enter your basic contact details",
    fullName: "Full Name",
    emailOrPhone: "Email or Phone",
    emailOrPhonePlaceholder: "john@example.com or (555) 123-4567",
    namePlaceholder: "John Doe",

    // Work Experience Card
    workExperience: "Work Experience",
    workExperienceDesc: "Add your relevant work history",
    workExperiencePlaceholder: (idx: number) => `Work experience #${idx + 1} (e.g., "Warehouse Associate at ABC Corp - 2 years")`,
    addAnotherExperience: "Add Another Experience",
    removeExperience: "Remove experience",

    // Education Card
    education: "Education",
    educationDesc: "Add your educational background",
    educationPlaceholder: (idx: number) => `Education #${idx + 1} (e.g., "High School Diploma - 2018")`,
    addAnotherEducation: "Add Another Education",
    removeEducation: "Remove education",

    // Skills Card
    skills: "Skills",
    skillsDesc: "Add relevant warehouse skills",
    skillPlaceholder: "Type a skill and press Enter",
    addSkill: "Add skill",
    removeSkill: (skill: string) => `Remove ${skill}`,

    // Optional Information
    optionalInfo: "Optional Information",
    optionalInfoDesc: "Additional details for your resume",
    professionalObjective: "Professional Objective",
    objectivePlaceholder: "Brief career summary or objective...",
    certifications: "Certifications & Training",
    certificationsPlaceholder: "Forklift certification, OSHA training, etc.",
    languages: "Languages",
    languagesPlaceholder: "English, Spanish, etc.",
    address: "Address",
    addressPlaceholder: "City, State",

    // Actions
    generateResume: "Generate Resume",
    generating: "Generating...",
    downloadPDF: "Download PDF",
    selectTemplate: "Select Template",
    templateModern: "Modern",
    templateClassic: "Classic",
    templateProfessional: "Professional",

    // Preview
    resumePreview: "Resume Preview",
    resumePreviewDesc: (hasResume: boolean) => hasResume ? "Your generated resume" : "Fill in the form to generate",
    noResumeYet: "No resume generated yet",
    fillRequiredFields: "Fill in the required fields and click Generate",

    // Footer
    footerText: "We do not store your personal information. All data is used only for generating resumes.",

    // Modal
    resetFormTitle: "Reset Form?",
    resetFormDesc: "This will clear all entered information. This action cannot be undone.",
    cancel: "Cancel",
    reset: "Reset",

    // Validation Messages
    nameRequired: "Name is required",
    nameMinLength: "Name must be at least 2 characters",
    contactRequired: "Contact information is required",
    contactInvalid: "Please enter a valid email or phone number",
    experienceRequired: "At least one work experience is required",
    educationRequired: "At least one education entry is required",
    skillsRequired: "At least one skill is required",

    // Toast Messages
    formReset: "Form has been reset",
    fixErrors: "Please fix all errors before generating",
    resumeGenerated: "Resume generated successfully!",
    generateFailed: "Failed to generate resume",
    unknownError: "Unknown error occurred",
    connectionError: "Failed to connect to the server",
    generateFirst: "Please generate a resume first",
    pdfDownloaded: "PDF downloaded successfully!",

    // Character Counter
    remaining: "remaining"
  },
  es: {
    // Header
    appTitle: "ResumePro - Generador de Currculums Profesionales",
    appSubtitle: "Crea currculums optimizados para ATS en segundos con IA",
    resetForm: "Restablecer formulario",
    switchToLight: "Cambiar a modo claro",
    switchToDark: "Cambiar a modo oscuro",

    // Language names
    languageNames: {
      en: "English",
      es: "Español",
      fr: "Français",
      de: "Deutsch"
    },

    // Personal Information Card
    personalInfo: "Información Personal",
    personalInfoDesc: "Ingrese sus datos de contacto básicos",
    fullName: "Nombre Completo",
    emailOrPhone: "Correo Electrnico o Telfono",
    emailOrPhonePlaceholder: "juan@ejemplo.com o (555) 123-4567",
    namePlaceholder: "Juan Prez",

    // Work Experience Card
    workExperience: "Experiencia Laboral",
    workExperienceDesc: "Agregue su historial laboral relevante",
    workExperiencePlaceholder: (idx: number) => `Experiencia laboral #${idx + 1} (ej. "Auxiliar de Almacén en ABC Corp - 2 años")`,
    addAnotherExperience: "Agregar Otra Experiencia",
    removeExperience: "Eliminar experiencia",

    // Education Card
    education: "Educación",
    educationDesc: "Agregue su antecedentes educativos",
    educationPlaceholder: (idx: number) => `Educación #${idx + 1} (ej. "Diploma de Secundaria - 2018")`,
    addAnotherEducation: "Agregar Otra Educación",
    removeEducation: "Eliminar educación",

    // Skills Card
    skills: "Habilidades",
    skillsDesc: "Agregue habilidades de almacén relevantes",
    skillPlaceholder: "Escriba una habilidad y presione Enter",
    addSkill: "Agregar habilidad",
    removeSkill: (skill: string) => `Eliminar ${skill}`,

    // Optional Information
    optionalInfo: "Información Opcional",
    optionalInfoDesc: "Detalles adicionales para su currículo",
    professionalObjective: "Objetivo Profesional",
    objectivePlaceholder: "Breve resumen laboral u objetivo...",
    certifications: "Certificaciones y Capacitación",
    certificationsPlaceholder: "Certificación de montacargas, capacitación OSHA, etc.",
    languages: "Idiomas",
    languagesPlaceholder: "Español, ingls, etc.",
    address: "Dirección",
    addressPlaceholder: "Ciudad, Estado",

    // Actions
    generateResume: "Generar Currículum",
    generating: "Generando...",
    downloadPDF: "Descargar PDF",
    selectTemplate: "Seleccionar Plantilla",
    templateModern: "Moderno",
    templateClassic: "Clásico",
    templateProfessional: "Profesional",

    // Preview
    resumePreview: "Vista Previa del Currículum",
    resumePreviewDesc: (hasResume: boolean) => hasResume ? "Su currículo generado" : "Llene el formulario para generar",
    noResumeYet: "an no se ha generado un currículo",
    fillRequiredFields: "Llene los campos obligatorios y haga clic en Generar",

    // Modal
    resetFormTitle: "Restablecer Formulario?",
    resetFormDesc: "Esto borrara toda la información ingresada. Esta acción no se puede deshacer.",
    cancel: "Cancelar",
    reset: "Restablecer",

    // Validation Messages
    nameRequired: "El nombre es obligatorio",
    nameMinLength: "El nombre debe tener al menos 2 caracteres",
    contactRequired: "La información de contacto es obligatoria",
    contactInvalid: "Ingrese un correo electrónico o número de teléfono válido",
    experienceRequired: "Se requiere al menos una experiencia laboral",
    educationRequired: "Se requiere al menos una entrada de educación",
    skillsRequired: "Se requiere al menos una habilidad",

    // Toast Messages
    formReset: "El formulario se ha restablecido",
    fixErrors: "Corrija todos los errores antes de generar",
    resumeGenerated: "¡Currículo generado con éxito!",
    generateFailed: "Error al generar el currículo",
    unknownError: "Ocurrió un error desconocido",
    connectionError: "Error al conectar con el servidor",
    generateFirst: "Genere un currículo primero",
    pdfDownloaded: "¡PDF descargado con éxito!",

    // Footer
    footerText: "No almacenamos su información personal. Todos los datos se usan solo para generar currículos.",

    // Character Counter
    remaining: "restantes"
  },
  fr: {
    // Header
    appTitle: "ResumePro - Générateur de CV Professionnels",
    appSubtitle: "Créez des CV optimisés pour les ATS en quelques secondes avec l'IA",
    resetForm: "Réinitialiser le formulaire",
    switchToLight: "Passer en mode clair",
    switchToDark: "Passer en mode sombre",

    // Language names
    languageNames: {
      en: "English",
      es: "Español",
      fr: "Français",
      de: "Deutsch"
    },

    // Personal Information Card
    personalInfo: "Informations Personnelles",
    personalInfoDesc: "Entrez vos coordonnées de base",
    fullName: "Nom Complet",
    emailOrPhone: "Email ou Télphone",
    emailOrPhonePlaceholder: "jean@exemple.com ou (555) 123-4567",
    namePlaceholder: "Jean Dupont",

    // Work Experience Card
    workExperience: "Exprience Professionnelle",
    workExperienceDesc: "Ajoutez votre historique professionnel pertinent",
    workExperiencePlaceholder: (idx: number) => `Expérience professionnelle #${idx + 1} (ex. "Employ d'entrepôt chez ABC Corp - 2 ans")`,
    addAnotherExperience: "Ajouter une Autre Expérience",
    removeExperience: "Supprimer l'expérience",

    // Education Card
    education: "ducation",
    educationDesc: "Ajoutez votre parcours ducatif",
    educationPlaceholder: (idx: number) => `ducation #${idx + 1} (ex. "Baccalaurat - 2018")`,
    addAnotherEducation: "Ajouter une Autre Formation",
    removeEducation: "Supprimer la formation",

    // Skills Card
    skills: "Comptences",
    skillsDesc: "Ajoutez des comptences d'entrepôt pertinentes",
    skillPlaceholder: "Tapez une comptence et appuyez sur Entre",
    addSkill: "Ajouter une comptence",
    removeSkill: (skill: string) => `Supprimer ${skill}`,

    // Optional Information
    optionalInfo: "Informations Optionnelles",
    optionalInfoDesc: "Dtails supplmentaires pour votre CV",
    professionalObjective: "Objectif Professionnel",
    objectivePlaceholder: "Rsum professionnel ou objectif bref...",
    certifications: "Certifications et Formation",
    certificationsPlaceholder: "Certification chariot lvateur, formation OSHA, etc.",
    languages: "Langues",
    languagesPlaceholder: "Français, anglais, etc.",
    address: "Adresse",
    addressPlaceholder: "Ville, Rgion",

    // Actions
    generateResume: "Générer le CV",
    generating: "Génération...",
    downloadPDF: "Télécharger PDF",
    selectTemplate: "Sélectionner le Modèle",
    templateModern: "Moderne",
    templateClassic: "Classique",
    templateProfessional: "Professionnel",

    // Preview
    resumePreview: "Aperçu du CV",
    resumePreviewDesc: (hasResume: boolean) => hasResume ? "Votre CV généré" : "Remplissez le formulaire pour générer",
    noResumeYet: "Aucun CV généré pour le moment",
    fillRequiredFields: "Remplissez les champs obligatoires et cliquez sur Générer",

    // Modal
    resetFormTitle: "Réinitialiser le Formulaire?",
    resetFormDesc: "Cela effacera toutes les informations saisies. Cette action ne peut pas tre annule.",
    cancel: "Annuler",
    reset: "Réinitialiser",

    // Validation Messages
    nameRequired: "Le nom est obligatoire",
    nameMinLength: "Le nom doit contenir au moins 2 caractères",
    contactRequired: "Les informations de contact sont obligatoires",
    contactInvalid: "Veuillez entrer un email ou un numéro de téléphone valide",
    experienceRequired: "Au moins une expérience professionnelle est requise",
    educationRequired: "Au moins une formation est requise",
    skillsRequired: "Au moins une comptence est requise",

    // Toast Messages
    formReset: "Le formulaire a t rinitialis",
    fixErrors: "Veuillez corriger toutes les erreurs avant de générer",
    resumeGenerated: "CV généré avec succès!",
    generateFailed: "chec de la gnration du CV",
    unknownError: "Une erreur inconnue s'est produite",
    connectionError: "chec de la connexion au serveur",
    generateFirst: "Gnrez d'abord un CV",
    pdfDownloaded: "PDF tlcharg avec succs!",

    // Footer
    footerText: "Nous ne stockons pas vos informations personnelles. Toutes les donnes sont utilises uniquement pour gnrer des CV.",

    // Character Counter
    remaining: "restants"
  },
  de: {
    // Header
    appTitle: "ResumePro - Professioneller Lebenslauf-Generator",
    appSubtitle: "Erstellen Sie ATS-optimierte Lebensläufe in Sekunden mit KI",
    resetForm: "Formular zurcksetzen",
    switchToLight: "Zum hellen Modus wechseln",
    switchToDark: "Zum dunklen Modus wechseln",

    // Language names
    languageNames: {
      en: "English",
      es: "Español",
      fr: "Français",
      de: "Deutsch"
    },

    // Personal Information Card
    personalInfo: "Persönliche Informationen",
    personalInfoDesc: "Geben Sie Ihre grundlegenden Kontaktdaten ein",
    fullName: "Vollständiger Name",
    emailOrPhone: "E-Mail oder Telefon",
    emailOrPhonePlaceholder: "max@beispiel.de oder (555) 123-4567",
    namePlaceholder: "Max Mustermann",

    // Work Experience Card
    workExperience: "Berufserfahrung",
    workExperienceDesc: "Fgen Sie Ihre relevante Berufserfahrung hinzu",
    workExperiencePlaceholder: (idx: number) => `Berufserfahrung #${idx + 1} (z. B. "Lagermitarbeiter bei ABC GmbH - 2 Jahre")`,
    addAnotherExperience: "Weitere Erfahrung hinzufgen",
    removeExperience: "Erfahrung entfernen",

    // Education Card
    education: "Bildung",
    educationDesc: "Fgen Sie Ihren Bildungshintergrund hinzu",
    educationPlaceholder: (idx: number) => `Bildung #${idx + 1} (z. B. "Realschulabschluss - 2018")`,
    addAnotherEducation: "Weitere Ausbildung hinzufgen",
    removeEducation: "Ausbildung entfernen",

    // Skills Card
    skills: "Fhigkeiten",
    skillsDesc: "Fgen Sie relevante Lagerfhigkeiten hinzu",
    skillPlaceholder: "Fhigkeit eingeben und Enter drcken",
    addSkill: "Fhigkeit hinzufgen",
    removeSkill: (skill: string) => `${skill} entfernen`,

    // Optional Information
    optionalInfo: "Optionale Informationen",
    optionalInfoDesc: "Zusätzliche Details fr Ihren Lebenslauf",
    professionalObjective: "Berufliches Ziel",
    objectivePlaceholder: "Kurze Laufbahnzusammenfassung oder Ziel...",
    certifications: "Zertifikate und Schulungen",
    certificationsPlaceholder: "Gabelstapler-Zertifikat, OSHA-Schulung, etc.",
    languages: "Sprachen",
    languagesPlaceholder: "Deutsch, Englisch, etc.",
    address: "Adresse",
    addressPlaceholder: "Stadt, Bundesland",

    // Actions
    generateResume: "Lebenslauf Generieren",
    generating: "Generierung...",
    downloadPDF: "PDF Herunterladen",
    selectTemplate: "Vorlage Auswhlen",
    templateModern: "Modern",
    templateClassic: "Klassisch",
    templateProfessional: "Professionell",

    // Preview
    resumePreview: "Lebenslauf-Vorschau",
    resumePreviewDesc: (hasResume: boolean) => hasResume ? "Ihr generierter Lebenslauf" : "Fllen Sie das Formular aus zu generieren",
    noResumeYet: "Noch kein Lebenslauf generiert",
    fillRequiredFields: "Fllen Sie die Pflichtfelder aus und klicken Sie auf Generieren",

    // Modal
    resetFormTitle: "Formular Zurcksetzen?",
    resetFormDesc: "Dadurch werden alle eingegebenen Informationen gelscht. Diese Aktion kann nicht rckgngig gemacht werden.",
    cancel: "Abbrechen",
    reset: "Zurcksetzen",

    // Validation Messages
    nameRequired: "Name ist erforderlich",
    nameMinLength: "Der Name muss mindestens 2 Zeichen lang sein",
    contactRequired: "Kontaktinformationen sind erforderlich",
    contactInvalid: "Bitte geben Sie eine gltige E-Mail oder Telefonnummer ein",
    experienceRequired: "Mindestens eine Berufserfahrung ist erforderlich",
    educationRequired: "Mindestens eine Bildungsangabe ist erforderlich",
    skillsRequired: "Mindestens eine Fhigkeit ist erforderlich",

    // Toast Messages
    formReset: "Formular wurde zurckgesetzt",
    fixErrors: "Bitte beheben Sie alle Fehler vor dem Generieren",
    resumeGenerated: "Lebenslauf erfolgreich generiert!",
    generateFailed: "Fehler beim Generieren des Lebenslaufs",
    unknownError: "Ein unbekannter Fehler ist aufgetreten",
    connectionError: "Verbindung zum Server fehlgeschlagen",
    generateFirst: "Bitte generieren Sie zuerst einen Lebenslauf",
    pdfDownloaded: "PDF erfolgreich heruntergeladen!",

    // Footer
    footerText: "Wir speichern Ihre persnlichen Informationen nicht. Alle Daten werden nur zum Generieren von Lebenslufen verwendet.",

    // Character Counter
    remaining: "verbleibend"
  }
};

const MAX_CHARS = {
  name: 50,
  contact: 100,
  objective: 500,
  certifications: 500,
  languages: 200,
  address: 200
} as const;

export default function Home() {
  // Language state
  const [language, setLanguage] = useState<Language>("en");

  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contact: "",
    experienceList: [{ id: 1, text: "" }],
    educationList: [{ id: 1, text: "" }],
    skills: [],
    skillInput: "",
    objective: "",
    certifications: "",
    languages: "",
    address: ""
  });

  // UI state
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "classic" | "professional">("modern");
  const [lastGenerateTime, setLastGenerateTime] = useState(0);
  const GENERATE_COOLDOWN = 3000; // 3 seconds cooldown between requests
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    contact: "",
    experience: "",
    education: "",
    skills: ""
  });
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  // Toast management
  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Language management
  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.language) as Language | null;
    const browserLang = navigator.language.split('-')[0] as Language;
    const supportedLanguages: Language[] = ["en", "es", "fr", "de"];
    const detectedLang = supportedLanguages.includes(browserLang) ? browserLang : "en";
    setLanguage(savedLanguage || detectedLang);
  }, []);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.language, lang);
  }, []);

  // Get translations for current language
  const t = translations[language];

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEYS.theme, darkMode ? "dark" : "light");
  }, [darkMode]);

  // Load saved form data (only run once on mount)
  useEffect(() => {
    const savedName = localStorage.getItem(STORAGE_KEYS.name);
    const savedContact = localStorage.getItem(STORAGE_KEYS.contact);
    const savedSkills = localStorage.getItem(STORAGE_KEYS.skills);
    const savedSkillInput = localStorage.getItem(STORAGE_KEYS.skillInput);
    const savedObjective = localStorage.getItem(STORAGE_KEYS.objective);
    const savedCertifications = localStorage.getItem(STORAGE_KEYS.certifications);
    const savedLanguages = localStorage.getItem(STORAGE_KEYS.languages);
    const savedAddress = localStorage.getItem(STORAGE_KEYS.address);
    const savedExperience = localStorage.getItem(STORAGE_KEYS.experience);
    const savedEducation = localStorage.getItem(STORAGE_KEYS.education);
    const savedResume = localStorage.getItem(STORAGE_KEYS.resume);
    const savedTemplate = localStorage.getItem(STORAGE_KEYS.template) as "modern" | "classic" | "professional" | null;

    // Parse skills safely
    let parsedSkills: string[] = [];
    if (savedSkills) {
      try {
        const parsed = JSON.parse(savedSkills);
        parsedSkills = Array.isArray(parsed) ? parsed.filter((s: unknown) => typeof s === 'string' && s.trim() !== '') : [];
      } catch {
        parsedSkills = [];
      }
    }

    // Parse experience safely
    let parsedExperience: Entry[] = [{ id: 1, text: "" }];
    if (savedExperience) {
      try {
        const parsed = JSON.parse(savedExperience);
        parsedExperience = Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ id: 1, text: "" }];
      } catch {
        parsedExperience = [{ id: 1, text: "" }];
      }
    }

    // Parse education safely
    let parsedEducation: Entry[] = [{ id: 1, text: "" }];
    if (savedEducation) {
      try {
        const parsed = JSON.parse(savedEducation);
        parsedEducation = Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ id: 1, text: "" }];
      } catch {
        parsedEducation = [{ id: 1, text: "" }];
      }
    }

    setFormData({
      name: savedName || "",
      contact: savedContact || "",
      skills: parsedSkills,
      skillInput: savedSkillInput || "",
      objective: savedObjective || "",
      certifications: savedCertifications || "",
      languages: savedLanguages || "",
      address: savedAddress || "",
      experienceList: parsedExperience,
      educationList: parsedEducation
    });

    // Restore saved resume and template
    if (savedResume) {
      setResume(savedResume);
    }
    if (savedTemplate && ["modern", "classic", "professional"].includes(savedTemplate)) {
      setSelectedTemplate(savedTemplate);
    }
  }, []);

  // Save form data to localStorage (batched for better performance)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.name, formData.name);
    localStorage.setItem(STORAGE_KEYS.contact, formData.contact);
    localStorage.setItem(STORAGE_KEYS.skillInput, formData.skillInput);
    localStorage.setItem(STORAGE_KEYS.objective, formData.objective);
    localStorage.setItem(STORAGE_KEYS.certifications, formData.certifications);
    localStorage.setItem(STORAGE_KEYS.languages, formData.languages);
    localStorage.setItem(STORAGE_KEYS.address, formData.address);
  }, [formData.name, formData.contact, formData.skillInput, formData.objective,
      formData.certifications, formData.languages, formData.address]);

  // Save arrays to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.skills, JSON.stringify(formData.skills));
      localStorage.setItem(STORAGE_KEYS.experience, JSON.stringify(formData.experienceList));
      localStorage.setItem(STORAGE_KEYS.education, JSON.stringify(formData.educationList));
    }, 100);
    return () => clearTimeout(timer);
  }, [formData.skills, formData.experienceList, formData.educationList]);

  // Save resume and template to localStorage
  useEffect(() => {
    if (resume) {
      localStorage.setItem(STORAGE_KEYS.resume, resume);
    } else {
      localStorage.removeItem(STORAGE_KEYS.resume);
    }
    localStorage.setItem(STORAGE_KEYS.template, selectedTemplate);
  }, [resume, selectedTemplate]);

  // Auto-resize textarea
  const autoResizeTextarea = useCallback((key: string, textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textareaRefs.current[key] = textarea;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  // Validation functions
  const validateName = useCallback((value: string): string => {
    if (!value.trim()) return t.nameRequired;
    if (value.trim().length < 2) return t.nameMinLength;
    return "";
  }, [t]);

  const validateContact = useCallback((value: string): string => {
    if (!value.trim()) return t.contactRequired;
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    const digitsOnly = value.replace(/\D/g, "");
    if (!emailRegex.test(value) && !phoneRegex.test(value) && digitsOnly.length < 7) {
      return t.contactInvalid;
    }
    return "";
  }, [t]);

  const validateExperience = useCallback((list: Entry[]): string => {
    const hasContent = list.some(e => e.text.trim() !== "");
    if (!hasContent) return t.experienceRequired;
    return "";
  }, [t]);

  const validateEducation = useCallback((list: Entry[]): string => {
    const hasContent = list.some(e => e.text.trim() !== "");
    if (!hasContent) return t.educationRequired;
    return "";
  }, [t]);

  const validateSkills = useCallback((skills: string[], input: string): string => {
    if (skills.length === 0 && !input.trim()) return t.skillsRequired;
    return "";
  }, [t]);

  // Real-time validation
  useEffect(() => {
    if (touched.has("name")) {
      setErrors(prev => ({ ...prev, name: validateName(formData.name) }));
    }
  }, [formData.name, touched, validateName]);

  useEffect(() => {
    if (touched.has("contact")) {
      setErrors(prev => ({ ...prev, contact: validateContact(formData.contact) }));
    }
  }, [formData.contact, touched, validateContact]);

  // Form handlers
  const handleFieldBlur = useCallback((field: string) => {
    setTouched(prev => new Set(prev).add(field));
  }, []);

  const addExperience = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      experienceList: [...prev.experienceList, { id: Date.now(), text: "" }]
    }));
  }, []);

  const addEducation = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      educationList: [...prev.educationList, { id: Date.now(), text: "" }]
    }));
  }, []);

  const updateExperience = useCallback((id: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      experienceList: prev.experienceList.map(e => e.id === id ? { ...e, text } : e)
    }));
  }, []);

  const updateEducation = useCallback((id: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      educationList: prev.educationList.map(e => e.id === id ? { ...e, text } : e)
    }));
  }, []);

  const removeEntry = useCallback((id: number, type: "experience" | "education") => {
    setFormData(prev => ({
      ...prev,
      [type === "experience" ? "experienceList" : "educationList"]:
        prev[type === "experience" ? "experienceList" : "educationList"].filter(e => e.id !== id)
    }));
  }, []);

  const addSkill = useCallback((e?: React.KeyboardEvent<HTMLInputElement>) => {
    const trimmedSkill = formData.skillInput.trim();
    if ((e?.key === "Enter" || !e) && trimmedSkill) {
      // Don't add duplicate skills
      setFormData(prev => {
        const alreadyExists = prev.skills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase());
        if (alreadyExists) {
          return { ...prev, skillInput: "" };
        }
        return {
          ...prev,
          skills: [...prev.skills, trimmedSkill],
          skillInput: ""
        };
      });
      if (e) e.preventDefault();
    }
  }, [formData.skillInput]);

  const removeSkill = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index)
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      contact: "",
      experienceList: [{ id: 1, text: "" }],
      educationList: [{ id: 1, text: "" }],
      skills: [],
      skillInput: "",
      objective: "",
      certifications: "",
      languages: "",
      address: ""
    });
    setResume("");
    setErrors({ name: "", contact: "", experience: "", education: "", skills: "" });
    setTouched(new Set());
    setShowResetConfirm(false);

    // Clear all localStorage items
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    addToast(t.formReset, "success");
  }, [addToast, t]);

  const handleGenerate = useCallback(async () => {
    // Mark all fields as touched
    setTouched(new Set(["name", "contact", "experience", "education", "skills"]));

    // Validate all fields
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      contact: validateContact(formData.contact),
      experience: validateExperience(formData.experienceList),
      education: validateEducation(formData.educationList),
      skills: validateSkills(formData.skills, formData.skillInput)
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) {
      addToast(t.fixErrors, "error");
      return;
    }

    // Check cooldown to prevent duplicate requests
    const now = Date.now();
    const timeSinceLastGenerate = now - lastGenerateTime;
    if (timeSinceLastGenerate < GENERATE_COOLDOWN) {
      const remainingTime = Math.ceil((GENERATE_COOLDOWN - timeSinceLastGenerate) / 1000);
      addToast(`Please wait ${remainingTime} second${remainingTime > 1 ? 's' : ''} before generating again.`, "error");
      return;
    }

    setLastGenerateTime(now);

    // Generate resume
    const finalSkills = [...formData.skills];
    if (formData.skillInput.trim()) {
      finalSkills.push(formData.skillInput.trim());
    }

    setLoading(true);
    setResume("");

    try {
      const experienceText = formData.experienceList
        .filter(e => e.text.trim())
        .map(e => `- ${e.text}`)
        .join("\n");

      const educationText = formData.educationList
        .filter(e => e.text.trim())
        .map(e => `- ${e.text}`)
        .join("\n");

      const skillsText = finalSkills.join(", ");

      const prompt = `Generate a professional warehouse worker resume using the following information:

Name: ${formData.name}
Contact: ${formData.contact}
Experience:
${experienceText}
Education:
${educationText}
Skills: ${skillsText}
Objective: ${formData.objective || "N/A"}
Certifications: ${formData.certifications || "N/A"}
Languages: ${formData.languages || "N/A"}
Address: ${formData.address || "N/A"}
`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      if (data.resume) {
        setResume(data.resume);
        setFormData(prev => ({ ...prev, skills: finalSkills, skillInput: "" }));
        addToast(t.resumeGenerated, "success");
      } else if (data.error) {
        addToast(data.message || t.generateFailed, "error");
      } else {
        addToast(t.unknownError, "error");
      }
    } catch (err) {
      console.error("Frontend fetch error:", err);
      addToast(t.connectionError, "error");
    } finally {
      setLoading(false);
    }
  }, [formData, addToast, validateName, validateContact, validateExperience, validateEducation, validateSkills, t, lastGenerateTime, GENERATE_COOLDOWN]);

  const handleExportPDF = useCallback(() => {
    if (!resume) {
      addToast(t.generateFirst, "error");
      return;
    }
    downloadResumePDF({ name: formData.name, resume }, { template: selectedTemplate });
    addToast(t.pdfDownloaded, "success");
  }, [resume, formData.name, selectedTemplate, addToast, t]);

  // Character count component
  const CharCounter = ({ current, max }: { current: number; max: number }) => {
    const remaining = max - current;
    const isNearLimit = remaining < max * 0.1;
    return (
      <span className={`text-xs ${isNearLimit ? "text-red-500" : "text-slate-400"}`}>
        {remaining} {t.remaining}
      </span>
    );
  };

  // Memoized values
  const isFormValid = useMemo(() => {
    return formData.name.trim() !== "" &&
           formData.contact.trim() !== "" &&
           formData.experienceList.some(e => e.text.trim() !== "") &&
           formData.educationList.some(e => e.text.trim() !== "") &&
           (formData.skills.length > 0 || formData.skillInput.trim() !== "");
  }, [formData]);

  return (
    <main className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${darkMode ? "bg-indigo-500" : "bg-indigo-600"}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {t.appTitle}
                </h1>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as Language)}
                  className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  aria-label="Select language"
                >
                  <option value="en">{t.languageNames.en}</option>
                  <option value="es">{t.languageNames.es}</option>
                  <option value="fr">{t.languageNames.fr}</option>
                  <option value="de">{t.languageNames.de}</option>
                </select>
                <div className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => setShowResetConfirm(true)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}
                aria-label={t.resetForm}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? "bg-slate-700 text-yellow-400 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                aria-label={darkMode ? t.switchToLight : t.switchToDark}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-6 space-y-6">
            {/* Personal Information Card */}
            <div className={`rounded-2xl shadow-sm border transition-all duration-200 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="px-4 py-3 border-b transition-colors duration-200">
                <h2 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {t.personalInfo}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {t.personalInfoDesc}
                </p>
              </div>

              <div className="p-4 space-y-3">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {t.fullName} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    onBlur={() => handleFieldBlur("name")}
                    maxLength={MAX_CHARS.name}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none
                      ${errors.name && touched.has("name")
                        ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-slate-200 focus:border-indigo-500 " + (darkMode ? "bg-slate-700 focus:bg-slate-600" : "bg-white focus:bg-slate-50")
                      }`}
                    aria-invalid={errors.name !== "" && touched.has("name")}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.name && touched.has("name") && (
                      <p id="name-error" className="text-sm text-red-500">{errors.name}</p>
                    )}
                    <span className={`ml-auto text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      <CharCounter current={formData.name.length} max={MAX_CHARS.name} />
                    </span>
                  </div>
                </div>

                {/* Contact Field */}
                <div>
                  <label htmlFor="contact" className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {t.emailOrPhone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact"
                    type="text"
                    placeholder={t.emailOrPhonePlaceholder}
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    onBlur={() => handleFieldBlur("contact")}
                    maxLength={MAX_CHARS.contact}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none
                      ${errors.contact && touched.has("contact")
                        ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-slate-200 focus:border-indigo-500 " + (darkMode ? "bg-slate-700 focus:bg-slate-600" : "bg-white focus:bg-slate-50")
                      }`}
                    aria-invalid={errors.contact !== "" && touched.has("contact")}
                    aria-describedby={errors.contact ? "contact-error" : undefined}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.contact && touched.has("contact") && (
                      <p id="contact-error" className="text-sm text-red-500">{errors.contact}</p>
                    )}
                    <span className={`ml-auto text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      <CharCounter current={formData.contact.length} max={MAX_CHARS.contact} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience Card */}
            <div className={`rounded-2xl shadow-sm border transition-all duration-200 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="px-4 py-3 border-b transition-colors duration-200 flex items-center justify-between">
                <div>
                  <h2 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {t.workExperience}
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {t.workExperienceDesc}
                  </p>
                </div>
                {errors.experience && (
                  <span className="text-sm text-red-500">{errors.experience}</span>
                )}
              </div>

              <div className="p-4 space-y-3">
                {formData.experienceList.map((exp, idx) => (
                  <div key={exp.id} className="relative group">
                    <textarea
                      placeholder={t.workExperiencePlaceholder(idx)}
                      value={exp.text}
                      onChange={(e) => updateExperience(exp.id, e.target.value)}
                      ref={(ref) => autoResizeTextarea(`exp-${exp.id}`, ref)}
                      rows={2}
                      className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none resize-none overflow-hidden
                        ${darkMode ? "bg-slate-700 border-slate-600 focus:border-indigo-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-indigo-500 focus:bg-slate-50"}
                      `}
                      style={{ minHeight: "60px" }}
                    />
                    {formData.experienceList.length > 1 && (
                      <button
                        onClick={() => removeEntry(exp.id, "experience")}
                        className="absolute right-2 top-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 hover:bg-red-200"
                        aria-label={t.removeExperience}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t.addAnotherExperience}
                </button>
              </div>
            </div>

            {/* Education Card */}
            <div className={`rounded-2xl shadow-sm border transition-all duration-200 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="px-4 py-3 border-b transition-colors duration-200 flex items-center justify-between">
                <div>
                  <h2 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {t.education}
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {t.educationDesc}
                  </p>
                </div>
                {errors.education && (
                  <span className="text-sm text-red-500">{errors.education}</span>
                )}
              </div>

              <div className="p-4 space-y-3">
                {formData.educationList.map((edu, idx) => (
                  <div key={edu.id} className="relative group">
                    <textarea
                      placeholder={t.educationPlaceholder(idx)}
                      value={edu.text}
                      onChange={(e) => updateEducation(edu.id, e.target.value)}
                      ref={(ref) => autoResizeTextarea(`edu-${edu.id}`, ref)}
                      rows={2}
                      className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none resize-none overflow-hidden
                        ${darkMode ? "bg-slate-700 border-slate-600 focus:border-indigo-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-indigo-500 focus:bg-slate-50"}
                      `}
                      style={{ minHeight: "60px" }}
                    />
                    {formData.educationList.length > 1 && (
                      <button
                        onClick={() => removeEntry(edu.id, "education")}
                        className="absolute right-2 top-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 hover:bg-red-200"
                        aria-label={t.removeEducation}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t.addAnotherEducation}
                </button>
              </div>
            </div>

            {/* Skills Card */}
            <div className={`rounded-2xl shadow-sm border transition-all duration-200 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="px-4 py-3 border-b transition-colors duration-200">
                <h2 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {t.skills}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {t.skillsDesc}
                </p>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill, i) => {
                    // Skip empty skills
                    if (!skill.trim()) return null;
                    return (
                      <span
                        key={`${skill}-${i}`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${darkMode ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-indigo-100 text-indigo-700 border border-indigo-200"}`}
                      >
                        <span>{skill.trim()}</span>
                        <button
                          onClick={() => removeSkill(i)}
                          className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                          aria-label={t.removeSkill(skill)}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder={t.skillPlaceholder}
                    value={formData.skillInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, skillInput: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    className={`w-full px-4 py-2.5 pr-12 rounded-xl border-2 transition-all duration-200 outline-none
                      ${darkMode ? "bg-slate-700 border-slate-600 focus:border-indigo-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-indigo-500 focus:bg-slate-50"}
                    `}
                  />
                  <button
                    onClick={() => addSkill()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${darkMode ? "bg-indigo-500 text-white hover:bg-indigo-400" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                    aria-label={t.addSkill}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {errors.skills && touched.has("skills") && (
                  <p className="text-sm text-red-500 mt-2">{errors.skills}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Optional Fields Card */}
            <div className={`rounded-2xl shadow-sm border transition-all duration-200 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <button
                onClick={() => setShowOptional(!showOptional)}
                className="w-full px-4 py-3 flex items-center justify-between transition-colors duration-200"
              >
                <div className="text-left">
                  <h2 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {t.optionalInfo}
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {t.optionalInfoDesc}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${showOptional ? "rotate-180" : ""} ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showOptional && (
              <div className="p-4 space-y-3 border-t transition-colors duration-200">
                {/* Objective */}
                <div>
                  <label htmlFor="objective" className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {t.professionalObjective}
                  </label>
                  <textarea
                    id="objective"
                    placeholder={t.objectivePlaceholder}
                    value={formData.objective}
                    onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                    ref={(ref) => autoResizeTextarea("objective", ref)}
                    rows={2}
                    maxLength={MAX_CHARS.objective}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none resize-none overflow-hidden ${darkMode ? "bg-slate-700 border-slate-600 focus:border-indigo-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-indigo-500 focus:bg-slate-50"}`}
                    style={{ minHeight: "60px" }}
                  />
                  <div className={`text-right text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <CharCounter current={formData.objective.length} max={MAX_CHARS.objective} />
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label htmlFor="certifications" className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {t.certifications}
                  </label>
                  <textarea
                    id="certifications"
                    placeholder={t.certificationsPlaceholder}
                    value={formData.certifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                    ref={(ref) => autoResizeTextarea("certifications", ref)}
                    rows={2}
                    maxLength={MAX_CHARS.certifications}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none resize-none overflow-hidden ${darkMode ? "bg-slate-700 border-slate-600 focus:border-indigo-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-indigo-500 focus:bg-slate-50"}`}
                    style={{ minHeight: "60px" }}
                  />
                  <div className={`text-right text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <CharCounter current={formData.certifications.length} max={MAX_CHARS.certifications} />
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label htmlFor="languages" className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {t.languages}
                  </label>
                  <input
                    id="languages"
                    type="text"
                    placeholder={t.languagesPlaceholder}
                    value={formData.languages}
                    onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                    maxLength={MAX_CHARS.languages}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none ${darkMode ? "bg-slate-700 border-slate-600 focus:border-indigo-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-indigo-500 focus:bg-slate-50"}`}
                  />
                  <div className={`text-right text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <CharCounter current={formData.languages.length} max={MAX_CHARS.languages} />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {t.address}
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder={t.addressPlaceholder}
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    maxLength={MAX_CHARS.address}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none ${darkMode ? "bg-slate-700 border-slate-600 focus:border-indigo-500 focus:bg-slate-600" : "bg-white border-slate-200 focus:border-indigo-500 focus:bg-slate-50"}`}
                  />
                  <div className={`text-right text-xs mt-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <CharCounter current={formData.address.length} max={MAX_CHARS.address} />
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Action Card */}
            <div className={`rounded-2xl shadow-sm border transition-all duration-200 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="p-6 space-y-4">
                {/* Template Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {t.selectTemplate}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["modern", "classic", "professional"] as const).map((template) => (
                      <button
                        key={template}
                        onClick={() => setSelectedTemplate(template)}
                        disabled={loading}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                          selectedTemplate === template
                            ? darkMode
                              ? "border-indigo-500 bg-indigo-500/20 text-indigo-400"
                              : "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : darkMode
                              ? "border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                              : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-600"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {template === "modern" && t.templateModern}
                        {template === "classic" && t.templateClassic}
                        {template === "professional" && t.templateProfessional}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading || !isFormValid}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2
                    ${loading || !isFormValid
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 shadow-lg hover:shadow-xl active:scale-[0.98]"
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t.generating}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t.generateResume}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Card */}
            <div className={`rounded-2xl shadow-sm border transition-all duration-200 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <div className="px-6 py-4 border-b transition-colors duration-200">
                <h2 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {t.resumePreview}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {t.resumePreviewDesc(!!resume)}
                </p>
              </div>

              <div className="p-6">
                {loading ? (
                  <LoadingSkeleton />
                ) : resume ? (
                  <>
                    {/* Show current template badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        Template: <span className="capitalize">{selectedTemplate}</span>
                      </span>
                      <button
                        onClick={() => setSelectedTemplate(
                          selectedTemplate === "modern" ? "classic" :
                          selectedTemplate === "classic" ? "professional" : "modern"
                        )}
                        className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${darkMode ? "text-indigo-400 hover:bg-indigo-500/20" : "text-indigo-600 hover:bg-indigo-50"}`}
                      >
                        Switch Template
                      </button>
                    </div>

                    {/* Resume Preview with Template Styles */}
                    <div className={`
                      rounded-xl max-h-96 overflow-y-auto transition-all duration-300
                      ${selectedTemplate === "modern"
                        ? "p-5 bg-white text-slate-800 border-l-4 border-blue-600"
                        : selectedTemplate === "classic"
                          ? "p-6 bg-stone-50 text-stone-900 border-2 border-stone-200"
                          : "p-5 bg-slate-50 text-slate-800 border border-slate-200"
                      }
                    `}>
                      <div className={`
                        whitespace-pre-wrap leading-relaxed
                        ${selectedTemplate === "modern"
                          ? "font-sans text-sm"
                          : selectedTemplate === "classic"
                            ? "font-serif text-base"
                            : "font-sans text-sm"
                        }
                      `}>
                        {resume.split("\n").map((line, idx) => {
                          const isSectionHeader = /^[A-Z][A-Z\s]{4,}:?$/.test(line);
                          const isJobTitle = /^[A-Z]/.test(line) && line.length < 60 && !line.includes(":") && !line.startsWith("-");
                          const isBullet = line.trim().startsWith("-");
                          const content = isBullet ? line.trim().substring(1).trim() : line;
                          if (!content && !isSectionHeader) return <br key={idx} />;

                          // Modern Template Style
                          if (selectedTemplate === "modern") {
                            if (isSectionHeader) {
                              return (
                                <div key={idx} className="mt-3 mb-2">
                                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 inline-block px-2 py-1 rounded">
                                    {line.replace(/:/g, "")}
                                  </div>
                                </div>
                              );
                            }
                            if (isJobTitle) {
                              return (
                                <div key={idx} className="mt-2 mb-1">
                                  <div className="font-semibold text-slate-800">{line}</div>
                                </div>
                              );
                            }
                            return (
                              <div key={idx} className={isBullet ? "ml-4 mb-1 flex items-start gap-2" : "mb-1"}>
                                {isBullet && <span className="mt-0.5 text-blue-500 text-sm">▸</span>}
                                <span className="text-slate-700">{content}</span>
                              </div>
                            );
                          }

                          // Classic Template Style
                          if (selectedTemplate === "classic") {
                            if (isSectionHeader) {
                              return (
                                <div key={idx} className="mt-4 mb-2 text-center">
                                  <div className="text-sm font-bold text-stone-800 uppercase tracking-widest border-b-2 border-stone-400 pb-1 inline-block min-w-full">
                                    {line.replace(/:/g, "")}
                                  </div>
                                </div>
                              );
                            }
                            if (isJobTitle) {
                              return (
                                <div key={idx} className="mt-3 mb-1 text-center">
                                  <div className="font-serif font-bold text-stone-900 text-base">{line}</div>
                                </div>
                              );
                            }
                            return (
                              <div key={idx} className={isBullet ? "ml-6 mb-1 text-center" : "mb-1 text-center"}>
                                {isBullet && <span className="text-stone-500 mr-2">♦</span>}
                                <span className="text-stone-700">{content}</span>
                              </div>
                            );
                          }

                          // Professional Template Style
                          if (isSectionHeader) {
                            return (
                              <div key={idx} className="mt-3 mb-2 flex items-center gap-2">
                                <div className="flex-shrink-0 w-1 h-5 bg-slate-700 rounded-full"></div>
                                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                  {line.replace(/:/g, "")}
                                </div>
                              </div>
                            );
                          }
                          if (isJobTitle) {
                            return (
                              <div key={idx} className="mt-2 mb-1">
                                <div className="font-bold text-slate-900 text-sm">{line}</div>
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className={isBullet ? "ml-5 mb-1 flex items-start gap-2" : "mb-1"}>
                              {isBullet && <span className="flex-shrink-0 mt-0.5 w-1.5 h-1.5 bg-slate-500 rounded-full"></span>}
                              <span className="text-slate-600 text-xs">{content}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      onClick={handleExportPDF}
                      className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
                        ${darkMode
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                        } shadow-md hover:shadow-lg`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t.downloadPDF}
                    </button>
                  </>
                ) : (
                  <div className={`text-center py-12 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">{t.noResumeYet}</p>
                    <p className="text-sm mt-1">{t.fillRequiredFields}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-12 py-6 border-t transition-colors duration-200 text-center ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {t.footerText}
          </p>
        </footer>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`rounded-2xl shadow-xl max-w-md w-full p-6 transition-all duration-200 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
              {t.resetFormTitle}
            </h3>
            <p className={`mb-6 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t.resetFormDesc}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${darkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                {t.cancel}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                {t.reset}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-3/4 dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-full dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-5/6 dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-full dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-2/3 dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-3/4 dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-full dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-1/2 dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-5/6 dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-3/4 dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-full dark:bg-slate-700" />
      <div className="h-4 bg-slate-200 rounded w-2/3 dark:bg-slate-700" />
    </div>
  );
}
