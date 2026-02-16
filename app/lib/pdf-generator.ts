import jsPDF from "jspdf";

export interface ResumeData {
  name: string;
  resume: string;
}

export interface PDFOptions {
  template?: "modern" | "classic" | "professional";
  color?: string;
  fontSize?: number;
  lineHeight?: number;
  margin?: number;
}

interface ResumeSection {
  title: string;
  content: string[];
}

const COLORS = {
  modern: { primary: [41, 98, 255], secondary: [241, 245, 249], accent: [30, 64, 175] }, // Blue
  classic: { primary: [31, 41, 55], secondary: [248, 250, 252], accent: [15, 23, 42] }, // Dark Gray
  professional: { primary: [0, 71, 119], secondary: [240, 248, 255], accent: [0, 50, 100] } // Navy Blue
};

/**
 * Parse resume text into structured sections
 */
function parseResume(text: string): ResumeSection[] {
  const sections: ResumeSection[] = [];
  const lines = text.split("\n");
  let currentSection: ResumeSection | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect section headers (ALL CAPS with colon)
    if (/^[A-Z\s]+:$/.test(trimmed) && trimmed.length > 3) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        currentSection.content = currentContent;
        sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        title: trimmed.replace(/:/g, ""),
        content: []
      };
      currentContent = [];
    } else if (trimmed) {
      currentContent.push(trimmed);
    }
  }

  // Add last section
  if (currentSection && currentContent.length > 0) {
    currentSection.content = currentContent;
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Generate a professional modern resume PDF
 */
export function generateModernResume(data: ResumeData, options: PDFOptions = {}): jsPDF {
  const colorScheme = COLORS[options.template as keyof typeof COLORS] || COLORS.modern;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = options.margin || 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Add colored header bar
  doc.setFillColor(...colorScheme.primary);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Add name in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(data.name.toUpperCase(), margin, 25);

  // Parse resume sections
  const sections = parseResume(data.resume);

  y = 55;

  // Process each section
  for (const section of sections) {
    // Check if we need a new page
    if (y > pageHeight - 50) {
      doc.addPage();
      y = margin;
    }

    // Section header with colored background
    doc.setFillColor(...colorScheme.secondary);
    doc.rect(margin, y, contentWidth, 10, "F");

    doc.setTextColor(...colorScheme.primary);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin + 3, y + 7);
    y += 14;

    // Section content
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    for (const line of section.content) {
      // Check for job title (short, starts with capital, not a bullet)
      if (line.length < 60 &&
          /^[A-Z]/.test(line) &&
          !line.startsWith("-") &&
          !line.includes("|") &&
          !line.includes("(")) {

        // Sub-header
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colorScheme.accent);

        // Check for page break
        if (y > pageHeight - 20) {
          doc.addPage();
          y = margin;
        }

        doc.text(line, margin + 2, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
      } else {
        // Regular content or bullet
        const isBullet = line.startsWith("-");
        const text = isBullet ? line.substring(1).trim() : line;

        // Word wrap
        const maxWidth = contentWidth - (isBullet ? 8 : 0);
        const lines = doc.splitTextToSize(text, maxWidth);

        for (const wrappedLine of lines) {
          if (y > pageHeight - 15) {
            doc.addPage();
            y = margin;
          }

          const x = isBullet ? margin + 5 : margin + 2;
          const prefix = isBullet ? "• " : "";
          doc.text(prefix + wrappedLine, x, y);
          y += 5;
        }
      }
    }

    y += 8; // Section spacing
  }

  // Add page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  return doc;
}

/**
 * Generate a classic professional resume PDF
 */
export function generateClassicResume(data: ResumeData, options: PDFOptions = {}): jsPDF {
  const colorScheme = COLORS[options.template as keyof typeof COLORS] || COLORS.classic;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = options.margin || 15;
  let y = margin;

  // Classic header - centered name with lines
  doc.setFontSize(20);
  doc.setFont("times", "bold");
  doc.setTextColor(...colorScheme.primary);
  doc.text(data.name.toUpperCase(), pageWidth / 2, 20, { align: "center" });

  // Decorative lines
  doc.setDrawColor(...colorScheme.primary);
  doc.setLineWidth(0.5);
  doc.line(margin, 28, pageWidth - margin, 28);

  doc.setLineWidth(2);
  doc.line(margin, 30, pageWidth - margin, 30);
  doc.line(margin, 32, pageWidth - margin, 32);

  y = 45;

  // Parse resume sections
  const sections = parseResume(data.resume);

  for (const section of sections) {
    // Page break check
    if (y > pageHeight - 40) {
      doc.addPage();
      y = margin;
    }

    // Section header - uppercase, centered
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.setTextColor(...colorScheme.primary);
    doc.text(section.title.toUpperCase(), pageWidth / 2, y, { align: "center" });

    // Underline for section
    doc.setLineWidth(1);
    doc.line(margin, y + 3, pageWidth - margin, y + 3);
    y += 12;

    // Section content
    doc.setFontSize(11);
    doc.setFont("times", "roman");
    doc.setTextColor(40, 40, 40);

    for (const line of section.content) {
      if (y > pageHeight - 15) {
        doc.addPage();
        y = margin;
      }

      const isBullet = line.startsWith("-");
      const text = isBullet ? line.substring(1).trim() : line;

      // Detect job titles
      if (line.length < 70 &&
          /^[A-Z]/.test(line) &&
          !isBullet &&
          !line.includes("|")) {
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.text(text, pageWidth / 2, y, { align: "center" });
        doc.setFont("times", "roman");
        y += 6;
      } else {
        const maxWidth = contentWidth - 10;
        const lines = doc.splitTextToSize(text, maxWidth);

        for (const wrappedLine of lines) {
          if (y > pageHeight - 15) {
            doc.addPage();
            y = margin;
          }

          const x = isBullet ? margin + 15 : (pageWidth - contentWidth) / 2;
          const align = isBullet ? "left" : "center";
          const prefix = isBullet ? "♦ " : "";
          doc.setFontSize(10);
          doc.text(prefix + wrappedLine, x, y, { align });
          y += 5;
        }
      }
    }

    y += 10;
  }

  // Footer with page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("times", "italic");
    doc.text(`- ${i} -`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  return doc;
}

/**
 * Generate a professional minimalist resume PDF
 */
export function generateProfessionalResume(data: ResumeData, options: PDFOptions = {}): jsPDF {
  const colorScheme = COLORS[options.template as keyof typeof COLORS] || COLORS.professional;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const leftColumn = 60;
  let y = margin;

  // Header - name centered
  doc.setFillColor(...colorScheme.primary);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(data.name.toUpperCase(), pageWidth / 2, 22, { align: "center" });

  y = 50;

  // Parse resume sections
  const sections = parseResume(data.resume);

  for (const section of sections) {
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
    }

    // Section header - left aligned bar
    doc.setFillColor(...colorScheme.primary);
    doc.rect(margin, y, 3, 12, "F");

    doc.setTextColor(...colorScheme.primary);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(section.title.toUpperCase(), margin + 8, y + 8);
    y += 16;

    // Content
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    for (const line of section.content) {
      if (y > pageHeight - 15) {
        doc.addPage();
        y = margin;
      }

      const isBullet = line.startsWith("-");
      const text = isBullet ? line.substring(1).trim() : line;

      // Job titles in bold
      if (!isBullet && line.length < 65 && /^[A-Z]/.test(line) && !line.includes("|")) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colorScheme.accent);
        doc.text(text, leftColumn, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        y += 5;
      } else {
        const maxWidth = pageWidth - leftColumn - margin - 5;
        const lines = doc.splitTextToSize(text, maxWidth);

        for (const wrappedLine of lines) {
          if (y > pageHeight - 15) {
            doc.addPage();
            y = margin;
          }

          doc.text(isBullet ? "▪ " + wrappedLine : wrappedLine,
                  isBullet ? leftColumn : leftColumn - 3, y);
          y += 4.5;
        }
      }
    }

    y += 8;
  }

  // Page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${i}`, pageWidth / 2, pageHeight - 8, { align: "center" });
  }

  return doc;
}

/**
 * Main PDF generation function with template selection
 */
export function generateResumePDF(data: ResumeData, options: PDFOptions = {}): jsPDF {
  const template = options.template || "modern";

  switch (template) {
    case "classic":
      return generateClassicResume(data, options);
    case "professional":
      return generateProfessionalResume(data, options);
    default:
      return generateModernResume(data, options);
  }
}

/**
 * Download the resume as a PDF file
 */
export function downloadResumePDF(data: ResumeData, options: PDFOptions = {}): void {
  const doc = generateResumePDF(data, options);
  const template = options.template || "modern";
  const filename = `${data.name.replace(/\s+/g, "_")}_resume_${template}.pdf`;
  doc.save(filename);
}

/**
 * Generate PDF as a data URL for preview
 */
export function generatePDFDataURL(data: ResumeData, options: PDFOptions = {}): string {
  const doc = generateResumePDF(data, options);
  return doc.output("dataurlstring");
}
