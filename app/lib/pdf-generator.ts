import jsPDF from "jspdf";

export interface ResumeData {
  name: string;
  resume: string;
}

export interface PDFOptions {
  fontSize?: number;
  lineHeight?: number;
  margin?: number;
  font?: string;
}

const DEFAULT_OPTIONS: Required<PDFOptions> = {
  fontSize: 11,
  lineHeight: 5,
  margin: 15,
  font: "helvetica"
};

/**
 * Generate a professional PDF from resume text
 */
export function generateResumePDF(data: ResumeData, options: PDFOptions = {}): jsPDF {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - opts.margin * 2;
  let cursorY = opts.margin;

  // Helper to add a section header with underline
  const addSectionHeader = (text: string) => {
    // Check if we need a new page
    if (cursorY + opts.fontSize + 10 > pageHeight - opts.margin) {
      doc.addPage();
      cursorY = opts.margin;
    }

    doc.setFont(opts.font, "bold");
    doc.setFontSize(12);
    doc.text(text.toUpperCase(), opts.margin, cursorY);

    // Add underline
    const textWidth = doc.getTextWidth(text.toUpperCase());
    doc.line(
      opts.margin,
      cursorY + 2,
      opts.margin + textWidth,
      cursorY + 2
    );

    cursorY += opts.fontSize + opts.lineHeight + 4;
  };

  // Helper to add regular text with word wrap
  const addText = (text: string, isBullet: boolean = false) => {
    const lines = doc.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      // Check if we need a new page
      if (cursorY + opts.fontSize > pageHeight - opts.margin) {
        doc.addPage();
        cursorY = opts.margin;
      }

      doc.setFont(opts.font, "normal");
      doc.setFontSize(opts.fontSize);

      const x = isBullet ? opts.margin + 5 : opts.margin;
      const prefix = isBullet ? "\u2022 " : "";

      doc.text(prefix + line, x, cursorY);
      cursorY += opts.fontSize + opts.lineHeight;
    }
  };

  // Parse the resume text and format it
  const lines = data.resume.split("\n");
  let currentSection = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      cursorY += opts.lineHeight / 2;
      continue;
    }

    // Detect section headers (all caps lines)
    const isSectionHeader = /^[A-Z][A-Z\s]{5,}$/.test(line) ||
                           line.includes(":") && line === line.toUpperCase();

    if (isSectionHeader) {
      currentSection = line.replace(/:/g, "").trim();
      addSectionHeader(currentSection);
    } else if (line.startsWith("-") || line.startsWith("\u2022")) {
      // Bullet point
      addText(line.substring(1).trim(), true);
    } else if (line.match(/^\d+\./)) {
      // Numbered list
      addText(line, false);
    } else {
      // Regular text
      // Check if this might be a sub-header
      if (line.length < 50 && /^[A-Z]/.test(line) && !line.includes(".")) {
        doc.setFont(opts.font, "bold");
        doc.setFontSize(opts.fontSize);
        doc.text(line, opts.margin, cursorY);
        cursorY += opts.fontSize + opts.lineHeight;
      } else {
        addText(line, false);
      }
    }
  }

  // Add footer with page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont(opts.font, "normal");
    doc.setTextColor(128, 128, 128);

    const footerText = `Page ${i} of ${totalPages}`;
    const textWidth = doc.getTextWidth(footerText);
    doc.text(
      footerText,
      pageWidth - opts.margin - textWidth,
      pageHeight - 10
    );
  }

  return doc;
}

/**
 * Download the resume as a PDF file
 */
export function downloadResumePDF(data: ResumeData, options: PDFOptions = {}): void {
  const doc = generateResumePDF(data, options);
  const filename = `${data.name.replace(/\s+/g, "_")}_resume.pdf`;
  doc.save(filename);
}

/**
 * Generate PDF as a data URL for preview
 */
export function generatePDFDataURL(data: ResumeData, options: PDFOptions = {}): string {
  const doc = generateResumePDF(data, options);
  return doc.output("dataurlstring");
}
