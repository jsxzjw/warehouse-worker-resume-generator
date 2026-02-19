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
  watermark?: boolean;
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

// Helper function to set fill/text/draw color from RGB array
function setColor(doc: jsPDF, color: number[], type: 'fill' | 'text' | 'draw' = 'fill'): void {
  const method = type === 'fill' ? 'setFillColor' : type === 'text' ? 'setTextColor' : 'setDrawColor';
  // @ts-ignore - jsPDF accepts 3 number arguments
  doc[method](color[0], color[1], color[2]);
}

/**
 * Sanitize filename - remove special characters and normalize spaces
 */
function sanitizeFilename(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 50); // Limit length
}

/**
 * Smart text wrapping with better line breaks
 */
function wrapTextSmart(doc: jsPDF, text: string, maxWidth: number): string[] {
  const lines = doc.splitTextToSize(text, maxWidth);

  // Post-process to avoid breaking words when possible
  const processed: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // If line ends with a hyphenated word, try to move it to next line
    if (line.endsWith('-') && i < lines.length - 1) {
      processed.push(line.slice(0, -1) + lines[i + 1]);
      i++; // Skip next line as we merged it
    } else {
      processed.push(line);
    }
  }

  return processed;
}

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
  setColor(doc, colorScheme.primary, 'fill');
  doc.rect(0, 0, pageWidth, 40, "F");

  // Add name in header
  setColor(doc, [255, 255, 255], 'text');
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
    setColor(doc, colorScheme.secondary, 'fill');
    doc.rect(margin, y, contentWidth, 10, "F");

    setColor(doc, colorScheme.primary, 'text');
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
        setColor(doc, colorScheme.accent, 'text');

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

        // Smart word wrap with better line breaks
        const maxWidth = contentWidth - (isBullet ? 8 : 0);
        const lines = wrapTextSmart(doc, text, maxWidth);

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

  // Add watermark for free users
  if (options.watermark) {
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.saveGraphicsState();

      // Set watermark style
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");

      // Rotate and center watermark
      doc.text(
        "FREE VERSION",
        pageWidth / 2,
        pageHeight / 2,
        {
          align: "center",
          angle: 45,
          renderingMode: "fill"
        }
      );

      doc.setFontSize(20);
      doc.text(
        "Upgrade to remove watermark",
        pageWidth / 2,
        pageHeight / 2 + 25,
        {
          align: "center",
          angle: 45,
          renderingMode: "fill"
        }
      );

      doc.restoreGraphicsState();
    }
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
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Classic header - centered name with lines
  doc.setFontSize(20);
  doc.setFont("times", "bold");
  setColor(doc, colorScheme.primary, 'text');
  doc.text(data.name.toUpperCase(), pageWidth / 2, 20, { align: "center" });

  // Decorative lines
  setColor(doc, colorScheme.primary, 'draw');
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
    setColor(doc, colorScheme.primary, 'text');
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
        const lines = wrapTextSmart(doc, text, maxWidth);

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

  // Add watermark for free users
  if (options.watermark) {
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.saveGraphicsState();

      // Set watermark style
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");

      // Rotate and center watermark
      doc.text(
        "FREE VERSION",
        pageWidth / 2,
        pageHeight / 2,
        {
          align: "center",
          angle: 45,
          renderingMode: "fill"
        }
      );

      doc.setFontSize(20);
      doc.text(
        "Upgrade to remove watermark",
        pageWidth / 2,
        pageHeight / 2 + 25,
        {
          align: "center",
          angle: 45,
          renderingMode: "fill"
        }
      );

      doc.restoreGraphicsState();
    }
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
  setColor(doc, colorScheme.primary, 'fill');
  doc.rect(0, 0, pageWidth, 35, "F");

  setColor(doc, [255, 255, 255], 'text');
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
    setColor(doc, colorScheme.primary, 'fill');
    doc.rect(margin, y, 3, 12, "F");

    setColor(doc, colorScheme.primary, 'text');
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(section.title.toUpperCase(), margin + 8, y + 8);
    y += 16;

    // Content
    setColor(doc, [50, 50, 50], 'text');
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
        setColor(doc, colorScheme.accent, 'text');
        doc.text(text, leftColumn, y);
        doc.setFont("helvetica", "normal");
        setColor(doc, [80, 80, 80], 'text');
        y += 5;
      } else {
        const maxWidth = pageWidth - leftColumn - margin - 5;
        const lines = wrapTextSmart(doc, text, maxWidth);

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

  // Add watermark for free users
  if (options.watermark) {
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.saveGraphicsState();

      // Set watermark style
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");

      // Rotate and center watermark
      doc.text(
        "FREE VERSION",
        pageWidth / 2,
        pageHeight / 2,
        {
          align: "center",
          angle: 45,
          renderingMode: "fill"
        }
      );

      doc.setFontSize(20);
      doc.text(
        "Upgrade to remove watermark",
        pageWidth / 2,
        pageHeight / 2 + 25,
        {
          align: "center",
          angle: 45,
          renderingMode: "fill"
        }
      );

      doc.restoreGraphicsState();
    }
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
 * Download the resume as a PDF file with improved filename
 */
export function downloadResumePDF(data: ResumeData, options: PDFOptions = {}): void {
  const doc = generateResumePDF(data, options);
  const template = options.template || "modern";

  // Sanitize filename and include user name
  const sanitizedName = sanitizeFilename(data.name);
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `${sanitizedName}_resume_${template}_${date}.pdf`;

  doc.save(filename);
}

/**
 * Generate PDF as a data URL for preview
 */
export function generatePDFDataURL(data: ResumeData, options: PDFOptions = {}): string {
  const doc = generateResumePDF(data, options);
  return doc.output("dataurlstring");
}

/**
 * Generate PDF with progress callback for async operation simulation
 */
export async function downloadResumePDFWithProgress(
  data: ResumeData,
  options: PDFOptions = {},
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    // Simulate progress for better UX
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (onProgress) onProgress(Math.min(progress, 90));

      if (progress >= 100) {
        clearInterval(interval);
        downloadResumePDF(data, options);
        if (onProgress) onProgress(100);
        resolve();
      }
    }, 100);
  });
}
