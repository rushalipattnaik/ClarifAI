import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import api from "../services/api";
import { useToast } from "../hooks/useToast";

import MarkdownRenderer from "../components/MarkdownRenderer";
import ReportHeader from "../components/report/ReportHeader";
import ReportToolbar from "../components/report/ReportToolbar";

function ReportView() {
  const { reportId } = useParams();
  const { showToast } = useToast();

  const [report, setReport] = useState(null);
  const [project, setProject] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const reportRef = useRef(null);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/reports/${reportId}`);

        setReport(response.data.report);
        setProject(response.data.project);
        setCreatedAt(response.data.created_at);
      } catch (err) {
        console.error("Failed to load report:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load this report."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [reportId]);

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

      const contentHeight =
        (canvas.height * contentWidth) / canvas.width;

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-xl font-semibold">
            Loading report...
          </p>

          <p className="mt-2 text-slate-400">
            Retrieving your saved SRS report.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-lg rounded-xl border border-red-900 bg-slate-900 p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-red-400">
            Unable to Load Report
          </h1>

          <p className="mt-4 text-slate-300">
            {error}
          </p>

          <Link
            to="/history"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-medium transition hover:bg-indigo-500"
          >
            Back to Report History
          </Link>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="rounded-xl bg-slate-900 p-8">
          <h2 className="text-2xl font-bold text-red-400">
            Report Not Available
          </h2>

          <p className="mt-4 text-slate-300">
            The requested report could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-6">
          <Link
            to="/history"
            className="text-sm text-indigo-400 transition hover:text-indigo-300"
          >
            ← Back to Report History
          </Link>
        </div>

        <ReportHeader
          project={project}
          createdAt={createdAt}
        />

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

export default ReportView;