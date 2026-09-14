import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useProject } from "../hooks/useProject";
import { useToast } from "../hooks/useToast";

import MarkdownRenderer from "../components/MarkdownRenderer";

import ReportHeader from "../components/report/ReportHeader";
import ReportToolbar from "../components/report/ReportToolbar";

function Report() {
  const { report } = useProject();
  const { showToast } = useToast();

  const reportRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const downloadPDF = async () => {
    if (!reportRef.current || isGeneratingPDF) {
      return;
    }

    try {
      setIsGeneratingPDF(true);

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a",
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;

      const contentWidth = pdfWidth - margin * 2;

      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(
        imgData,
        "PNG",
        margin,
        position,
        contentWidth,
        contentHeight
      );

      heightLeft -= pdfHeight - margin * 2;

      while (heightLeft > 0) {
        position = margin - (contentHeight - heightLeft);

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          position,
          contentWidth,
          contentHeight
        );

        heightLeft -= pdfHeight - margin * 2;
      }

      pdf.save("ClarifAI-SRS.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);

      showToast("Unable to generate the PDF. Please try again.", "error");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-red-400">
            No Report Available
          </h2>

          <p className="mt-4 text-slate-300">
            Please complete the questionnaire first.
          </p>

          <Link
            to="/questions"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 transition hover:bg-indigo-500"
          >
            Create Report
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <ReportHeader />

        <ReportToolbar
          report={report}
          onDownloadPDF={downloadPDF}
          isGeneratingPDF={isGeneratingPDF}
        />

        <div
          ref={reportRef}
          className="rounded-xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
        >
          <MarkdownRenderer content={report} />
        </div>
      </div>
    </div>
  );
}

export default Report;