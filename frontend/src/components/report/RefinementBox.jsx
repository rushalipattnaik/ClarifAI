import { useState } from "react";

import api from "../../services/api";
import { useToast } from "../../hooks/useToast";

function RefinementBox({ project, report, reportId, onUpdate }) {
  const { showToast } = useToast();

  const [instruction, setInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  async function handleRefine() {
    const trimmedInstruction = instruction.trim();

    if (trimmedInstruction.length < 3) {
      showToast("Describe the change you'd like in a few words.");
      return;
    }

    setIsRefining(true);

    try {
      const response = await api.post("/clarify/refine", {
        project: project,
        report: report,
        instruction: trimmedInstruction,
      });

      const updatedReport = response.data?.report;

      if (typeof updatedReport !== "string" || updatedReport.length === 0) {
        throw new Error("Invalid refined report received from backend.");
      }

      if (reportId) {
        try {
          await api.put(`/reports/${reportId}`, {
            report: updatedReport,
          });
        } catch (persistError) {
          console.error("Failed to persist refinement:", persistError);

          showToast(
            "Change applied, but couldn't be saved to your report history.",
            "error"
          );
        }
      }

      onUpdate(updatedReport);
      setInstruction("");

      showToast("Report updated.");
    } catch (error) {
      console.error("Refinement failed:", error);

      showToast(
        error.response?.data?.detail ||
          "Couldn't apply that change. Please try again.",
        "error"
      );
    } finally {
      setIsRefining(false);
    }
  }

  return (
    <div className="mb-8 rounded-xl border border-slate-700 bg-slate-900 p-5">
      <p className="mb-3 text-sm font-medium text-slate-300">
        Want to change something? Describe it in plain language.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isRefining) {
              handleRefine();
            }
          }}
          placeholder="e.g. Add a requirement about mobile support"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
        />

        <button
          onClick={handleRefine}
          disabled={isRefining}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRefining ? "Applying..." : "Refine"}
        </button>
      </div>
    </div>
  );
}

export default RefinementBox;