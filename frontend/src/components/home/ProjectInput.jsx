import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useProject } from "../../hooks/useProject";
import { useToast } from "../../hooks/useToast";

import api from "../../services/api";
import { questions as defaultQuestions } from "../../data/questions";

function ProjectInput() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { projectIdea, setProjectIdea, setQuestions, setAnswers } =
    useProject();

  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    const trimmedIdea = projectIdea.trim();

    if (trimmedIdea.length < 3) {
      showToast("Please describe your project idea in a few words.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/questions/generate", {
        project: trimmedIdea,
      });

      const generatedQuestions =
        response.data?.questions?.length > 0
          ? response.data.questions
          : defaultQuestions;

      if (response.data?.source === "fallback") {
        showToast(
          "Using standard questions for this project (AI question generation was unavailable)."
        );
      }

      setQuestions(generatedQuestions);
      setAnswers({});

      navigate("/questions");
    } catch (error) {
      console.error("Question generation failed:", error);

      setQuestions(defaultQuestions);
      setAnswers({});

      showToast(
        "Couldn't reach the AI service, so we're using standard questions instead."
      );

      navigate("/questions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-6 py-4 text-white outline-none transition focus:border-indigo-500"
          placeholder="Example: Build a Smart Hospital Management System"
          value={projectIdea}
          onChange={(e) => setProjectIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAnalyze();
            }
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="rounded-xl bg-indigo-600 px-8 py-4 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "✨ Analyze Project"}
        </button>
      </div>
    </div>
  );
}

export default ProjectInput;