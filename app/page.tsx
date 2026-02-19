"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { downloadResumePDF, PDFOptions } from "./lib/pdf-generator";
import { ToastContainer } from "./components/Toast";
import { Hero } from "./components/Hero";
import { FinalCTA } from "./components/FinalCTA";
import { ResumeExamplesPreviewHome } from "./components/ResumeExamplesPreviewHome";
import { useTheme } from "./contexts/ThemeContext";
import { Step1_PersonalInfo } from "./components/wizard/steps/Step1_PersonalInfo";
import { Step2_WorkExperience } from "./components/wizard/steps/Step2_WorkExperience";
import { Step3_Skills } from "./components/wizard/steps/Step3_Skills";
import { Step4_Generate } from "./components/wizard/steps/Step4_Generate";
import { WizardNavigation } from "./components/wizard/WizardNavigation";
import { PricingSection } from "./components/pricing/PricingSection";
import { SocialShare } from "./components/social/SocialShare";
import { EmailCapture } from "./components/email/EmailCapture";
import { FullPageLoader } from "./components/ui/LoadingSpinner";
import { FormWizard } from "./components/wizard/FormWizard";
import { UpgradeModal } from "./components/UpgradeModal";
import { LoginModal } from "./components/LoginModal";
// Types
type Language = "en" | "es";

interface ExperienceEntry {
  id: number;
  text: string;
  description?: string;
}

interface EducationEntry {
  id: number;
  text: string;
}

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

// Translations
const translations = {
  en: {
    appTitle: "Warehouse Worker Resume Generator",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    formReset: "Form has been reset",
    fixErrors: "Please fix all errors before generating",
    resumeGenerated: "Resume generated successfully!",
    generateFailed: "Failed to generate resume",
    connectionError: "Failed to connect to the server",
    generateFirst: "Please generate a resume first",
    pdfDownloaded: "PDF downloaded successfully!",
    footerText: "We do not store your personal information. All data is used only for generating resumes.",
    nameRequired: "Name is required",
    nameMinLength: "Name must be at least 2 characters",
    contactRequired: "Contact is required",
    contactInvalid: "Please enter a valid email or phone",
    experienceRequired: "At least one work experience is required",
    skillsRequired: "At least one skill is required",
    educationRequired: "At least one education entry is required"
  },
  es: {
    appTitle: "Generador de Currículums para Trabajadores de Almacén",
    switchToLight: "Cambiar a modo claro",
    switchToDark: "Cambiar a modo oscuro",
    formReset: "El formulario se ha restablecido",
    fixErrors: "Corrija todos los errores antes de generar",
    resumeGenerated: "¡Currículum generado con éxito!",
    generateFailed: "Error al generar el currículo",
    connectionError: "Error al conectar con el servidor",
    generateFirst: "Genere un currículo primero",
    pdfDownloaded: "¡PDF descargado con éxito!",
    footerText: "No almacenamos su información personal. Todos los datos se usan solo para generar currículos.",
    nameRequired: "El nombre es obligatorio",
    nameMinLength: "El nombre debe tener al menos 2 caracteres",
    contactRequired: "El contacto es obligatorio",
    contactInvalid: "Ingrese un correo o teléfono válido",
    experienceRequired: "Se requiere al menos una experiencia laboral",
    skillsRequired: "Se requiere al menos una habilidad",
    educationRequired: "Se requiere al menos una educación"
  }
};

export default function Home() {
  // Language & Theme from global context
  const { darkMode, language } = useTheme();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state - Step 1
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Form state - Step 2
  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([
    { id: 1, text: "", description: "" }
  ]);

  // Form state - Step 3
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [educationList, setEducationList] = useState<EducationEntry[]>([
    { id: 1, text: "" }
  ]);
  const [certifications, setCertifications] = useState("");

  // UI state
  const [resume, setResume] = useState("");
  const [generating, setGenerating] = useState(false);
  const wizardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "classic" | "professional">("modern");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  // Quota & Upgrade state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'monthly_limit_exceeded' | 'template_limit' | 'watermark'>('monthly_limit_exceeded');
  const [userPlan, setUserPlan] = useState<'free' | 'basic' | 'premium'>('free');
  const [remainingResumes, setRemainingResumes] = useState(1);
  const [canDownloadPDF, setCanDownloadPDF] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Toast management
  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Show email capture after 30 seconds
  useEffect(() => {
    const emailShown = localStorage.getItem("wr_email_shown");
    if (!emailShown) {
      const timer = setTimeout(() => {
        setShowEmailCapture(true);
        localStorage.setItem("wr_email_shown", "true");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Validation functions
  const validateStep1 = useCallback((): boolean => {
    const t = translations[language];
    const newErrors: { name?: string; contact?: string } = {};

    if (!name.trim()) {
      newErrors.name = t.nameRequired;
    } else if (name.trim().length < 2) {
      newErrors.name = t.nameMinLength;
    }

    if (!contact.trim()) {
      newErrors.contact = t.contactRequired;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
      if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
        newErrors.contact = t.contactInvalid;
      }
    }

    setErrors(newErrors);
    setTouched(new Set(["name", "contact"]));
    return Object.keys(newErrors).length === 0;
  }, [name, contact, language]);

  const validateStep2 = useCallback((): boolean => {
    const t = translations[language];
    const hasExperience = experienceList.some(e => e.text.trim());
    if (!hasExperience) {
      addToast(t.experienceRequired, "error");
      return false;
    }
    return true;
  }, [experienceList, language, addToast]);

  const validateStep3 = useCallback((): boolean => {
    const t = translations[language];
    if (skills.length === 0) {
      addToast(t.skillsRequired, "error");
      return false;
    }
    const hasEducation = educationList.some(e => e.text.trim());
    if (!hasEducation) {
      addToast(t.educationRequired, "error");
      return false;
    }
    return true;
  }, [skills, educationList, language, addToast]);

  // Step navigation
  const handleNext = useCallback(() => {
    let isValid = true;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, validateStep1, validateStep2, validateStep3]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  // Experience handlers
  const handleAddExperience = useCallback(() => {
    setExperienceList(prev => [...prev, { id: Date.now(), text: "", description: "" }]);
  }, []);

  const handleUpdateExperience = useCallback((id: number, field: string, value: string) => {
    setExperienceList(prev =>
      prev.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  }, []);

  const handleRemoveExperience = useCallback((id: number) => {
    setExperienceList(prev => prev.filter(e => e.id !== id));
  }, []);

  // Education handlers
  const handleAddEducation = useCallback(() => {
    setEducationList(prev => [...prev, { id: Date.now(), text: "" }]);
  }, []);

  const handleUpdateEducation = useCallback((id: number, value: string) => {
    setEducationList(prev =>
      prev.map(e => e.id === id ? { ...e, text: value } : e)
    );
  }, []);

  const handleRemoveEducation = useCallback((id: number) => {
    setEducationList(prev => prev.filter(e => e.id !== id));
  }, []);

  // Skill handlers
  const handleAddSkill = useCallback(() => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput("");
    }
  }, [skillInput, skills]);

  const handleRemoveSkill = useCallback((index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Generate resume
  const handleGenerate = useCallback(async () => {
    const t = translations[language];

    // 免费用户必须登录才能生成
    if (!userEmail && userPlan === 'free') {
      setShowLoginModal(true);
      return;
    }

    setGenerating(true);
    setResume("");

    try {
      const experienceText = experienceList
        .filter(e => e.text.trim())
        .map(e => `- ${e.text}${e.description ? `\n  ${e.description}` : ""}`)
        .join("\n");

      const educationText = educationList
        .filter(e => e.text.trim())
        .map(e => `- ${e.text}`)
        .join("\n");

      const skillsText = skills.join(", ");

      const prompt = `Generate a professional warehouse worker resume:

Name: ${name}
Contact: ${contact}
Experience:
${experienceText}

Education:
${educationText}

Skills: ${skillsText}
Certifications: ${certifications || "N/A"}
`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          template: selectedTemplate
        })
      });

      const data = await res.json();

      if (data.resume) {
        setResume(data.resume);
        addToast(t.resumeGenerated, "success");

        // 记录 token 使用情况（如果可��）
        if (data.metadata?.tokensUsed) {
          console.log(`Tokens used: ${data.metadata.tokensUsed}`);
        }
      } else {
        // 显示更友好的错误消息
        const errorMessage = data.details || data.message || t.generateFailed;
        const isRetryable = data.retryable !== undefined ? data.retryable : true;

        addToast(errorMessage, "error");

        // 如果错误不可重试，记录日志
        if (!isRetryable) {
          console.error("Non-retryable error:", data);
        }
      }
    } catch (err) {
      console.error("Frontend fetch error:", err);
      addToast(t.connectionError, "error");
    } finally {
      setGenerating(false);
    }
  }, [name, contact, experienceList, educationList, skills, certifications, selectedTemplate, language, addToast]);

  // Download PDF with quota checking
  const handleDownloadPDF = useCallback(async () => {
    const t = translations[language];
    if (!resume) {
      addToast(t.generateFirst, "error");
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);

    try {
      // 1. 检查用户配额
      const email = contact.includes('@') ? contact : `${name}@example.com`;
      const quotaRes = await fetch('/api/quota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const quotaData = await quotaRes.json();

      if (!quotaData.success) {
        addToast("Failed to check quota", "error");
        return;
      }

      if (!quotaData.allowed) {
        // 配额用尽，显示升级弹窗
        setShowUpgradeModal(true);
        setUpgradeReason('monthly_limit_exceeded');
        return;
      }

      // 2. 记录本次使用
      const recordRes = await fetch('/api/quota', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const recordData = await recordRes.json();

      if (!recordData.success) {
        addToast("Monthly limit exceeded", "error");
        setShowUpgradeModal(true);
        return;
      }

      // 更新状态
      setRemainingResumes(recordData.remaining || 0);
      setUserPlan(recordData.plan || 'free');
      setCanDownloadPDF(recordData.canDownloadPDF || false);

      // 3. 检查是否可以下载 PDF（免费用户不能下载）
      if (!recordData.canDownloadPDF) {
        // 免费用户不能下载，直接显示升级弹窗
        setShowUpgradeModal(true);
        setUpgradeReason('monthly_limit_exceeded');
        addToast("Free users cannot download PDF. Upgrade to Basic or Premium!", "error");
        return;
      }

      // 4. 生成 PDF（带或不带水印）
      const options: PDFOptions = {
        template: selectedTemplate,
        watermark: recordData.hasWatermark
      };

      downloadResumePDF({ name, resume }, options);
      addToast(recordData.hasWatermark ? "PDF downloaded with watermark" : t.pdfDownloaded, "success");

      // 如果有水印且用户是免费用户，询问是否升级
      if (recordData.hasWatermark && recordData.plan === 'free') {
        setTimeout(() => {
          setShowUpgradeModal(true);
          setUpgradeReason('watermark');
        }, 2000);
      }

    } catch (error) {
      console.error("Download error:", error);
      addToast("Failed to download PDF", "error");
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  }, [resume, name, contact, selectedTemplate, language, addToast]);

  return (
    <main className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 via-white to-slate-50"}`}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Hero Section */}
      <Hero language={language} onStart={() => {
        setCurrentStep(1);
        wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }} darkMode={darkMode} />

      {/* Real Warehouse Resume Examples - Featured Examples */}
      <ResumeExamplesPreviewHome darkMode={darkMode} />

      {/* Wizard Section - Main Functionality */}
      <div ref={wizardRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FormWizard currentStep={currentStep} totalSteps={totalSteps}>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <Step1_PersonalInfo
              formData={{ name, contact }}
              onChange={(field, value) => {
                if (field === "name") setName(value);
                if (field === "contact") setContact(value);
              }}
              errors={errors}
              touched={touched}
              onFieldBlur={(field) => setTouched(prev => new Set(prev).add(field))}
              darkMode={darkMode}
            />
          )}

          {/* Step 2: Work Experience */}
          {currentStep === 2 && (
            <Step2_WorkExperience
              experienceList={experienceList}
              onUpdate={handleUpdateExperience}
              onAdd={handleAddExperience}
              onRemove={handleRemoveExperience}
              darkMode={darkMode}
            />
          )}

          {/* Step 3: Skills & Education */}
          {currentStep === 3 && (
            <Step3_Skills
              skills={skills}
              skillInput={skillInput}
              educationList={educationList}
              certifications={certifications}
              onSkillsChange={setSkills}
              onSkillInputChange={setSkillInput}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
              onEducationUpdate={handleUpdateEducation}
              onAddEducation={handleAddEducation}
              onRemoveEducation={handleRemoveEducation}
              onCertificationsChange={setCertifications}
              darkMode={darkMode}
            />
          )}

          {/* Step 4: Generate */}
          {currentStep === 4 && (
            <Step4_Generate
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
              resume={resume}
              loading={generating}
              onGenerate={handleGenerate}
              onDownloadPDF={handleDownloadPDF}
              darkMode={darkMode}
              onUnlockPremium={() => {
                setShowUpgradeModal(true);
                setUpgradeReason('template_limit');
              }}
              userPlan={userPlan}
              canDownloadPDF={canDownloadPDF}
            />
          )}

          {/* Navigation */}
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrev}
            onNext={currentStep === 4 ? handleGenerate : handleNext}
            isNextLoading={generating}
            nextLabel={currentStep === 4 ? "Generate" : undefined}
            darkMode={darkMode}
          />
        </FormWizard>
      </div>

      {/* Pricing Section */}
      <div className={`py-16 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
        <PricingSection
          darkMode={darkMode}
          onSelectPlan={(plan) => {
            addToast(`${plan} plan - Coming soon!`, "error");
          }}
        />
      </div>

      {/* ⑤ Final CTA - Last Conversion Push */}
      <FinalCTA
        darkMode={darkMode}
        onStart={() => {
          setCurrentStep(1);
          wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      {/* Social Sharing */}
      {resume && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`rounded-2xl shadow-lg border-2 p-8 text-center ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
              Share Your Resume
            </h2>
            <p className={`mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Share your professional resume with the world
            </p>
            <SocialShare darkMode={darkMode} />
          </div>
        </div>
      )}

      {/* Email Capture Modal */}
      {showEmailCapture && (
        <EmailCapture
          darkMode={darkMode}
          onSubmit={async (email) => {
            try {
              await fetch("/api/email/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
              });
              addToast("Thank you for subscribing!", "success");
            } catch {
              addToast("Failed to subscribe. Please try again.", "error");
            }
            setShowEmailCapture(false);
          }}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason}
        currentPlan={userPlan}
        remaining={remainingResumes}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(email) => setUserEmail(email)}
      />

      {/* Full Page Loader */}
      {generating && (
        <FullPageLoader text="Generating your professional resume..." darkMode={darkMode} />
      )}
      {downloading && (
        <FullPageLoader
          text="Preparing your PDF download..."
          darkMode={darkMode}
          progress={downloadProgress}
        />
      )}
    </main>
  );
}

// Export Language type for other components
export type { Language };
