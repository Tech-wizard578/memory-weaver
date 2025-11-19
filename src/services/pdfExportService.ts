import { jsPDF } from "jspdf";
import { Memory } from "@/types/memory";
import { format } from "date-fns";

export const exportMemoryBookPDF = async (memories: Memory[]) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Title page
  pdf.setFillColor(229, 115, 83); // Primary color
  pdf.rect(0, 0, pageWidth, 60, "F");
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.text("Memory Book", pageWidth / 2, 35, { align: "center" });
  
  pdf.setFontSize(14);
  pdf.text(
    `${memories.length} Precious Memories`,
    pageWidth / 2,
    50,
    { align: "center" }
  );

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text(
    `Generated on ${format(new Date(), "MMMM d, yyyy")}`,
    pageWidth / 2,
    80,
    { align: "center" }
  );

  // Process each memory
  for (let i = 0; i < memories.length; i++) {
    const memory = memories[i];
    pdf.addPage();

    let yPosition = margin;

    // Date and location header
    pdf.setFontSize(11);
    pdf.setTextColor(123, 165, 145); // Secondary color
    const headerText = format(memory.date, "MMMM d, yyyy");
    const locationText = memory.location ? ` • ${memory.location}` : "";
    pdf.text(headerText + locationText, margin, yPosition);
    yPosition += 10;

    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text(memory.title, margin, yPosition);
    yPosition += 12;

    // Add image if available
    if (memory.photos[0]?.url && !memory.photos[0].url.includes("placeholder")) {
      try {
        // Note: In production, you'd need to handle image loading properly
        // For now, we'll skip images that are placeholders
        yPosition += 10;
      } catch (error) {
        console.error("Error adding image to PDF:", error);
      }
    }

    // Narrative
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    const narrativeLines = pdf.splitTextToSize(memory.narrative, contentWidth);
    pdf.text(narrativeLines, margin, yPosition);
    yPosition += narrativeLines.length * 7;

    // User notes if available
    if (memory.userNotes) {
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setTextColor(123, 165, 145);
      pdf.text("Your Notes:", margin, yPosition);
      yPosition += 7;

      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      const notesLines = pdf.splitTextToSize(memory.userNotes, contentWidth);
      pdf.text(notesLines, margin, yPosition);
      yPosition += notesLines.length * 6;
    }

    // Emotions tags
    if (memory.emotions && memory.emotions.length > 0) {
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Emotions: ${memory.emotions.join(", ")}`, margin, yPosition);
    }

    // Page number
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `${i + 1} of ${memories.length}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  pdf.save(`memory-book-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};
