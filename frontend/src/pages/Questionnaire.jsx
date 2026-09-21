import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import ProgressBar from "../components/questionnaire/ProgressBar";
import QuestionCard from "../components/questionnaire/QuestionCard";
import NavigationButtons from "../components/questionnaire/NavigationButtons";

import { useProject } from "../hooks/useProject";

function Questionnaire() {
  const navigate = useNavigate();

  const {
    projectIdea,
    questions,
    answers,
    setAnswers,
    setReport,
    setReportId,
  } = useProject();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate("/");
    }
  }, [questions, navigate]);

  if (!questions || questions.length === 0) {
    return null;
  }

  function selectAnswer(answer) {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: answer,
    });

    setError("");
  }

  async function nextQuestion() {
    const currentId = questions[currentQuestion].id;

    if (!answers[currentId]) {
      setError("Please select an answer before continuing.");
      return;
    }

    setError("");

    if (currentQuestion === questions.length - 1) {
      try {
        setIsGenerating(true);

        const response = await api.post("/clarify/", {
          project: projectIdea,
          answers: answers,
        });

        if (!response.data || typeof response.data.report !== "string") {
          throw new Error("Invalid report received from backend.");
        }

        const generatedReport = response.data.report;

        const saveResponse = await api.post("/reports/", {
          project: projectIdea,
          answers: answers,
          report: generatedReport,
        });

        setReport(generatedReport);
        setReportId(saveResponse.data?.report_id ?? null);

        navigate("/report");
      } catch (err) {
        console.error("Report generation failed:", err);

        if (err.response?.data?.detail) {
          const detail = err.response.data.detail;

          if (Array.isArray(detail)) {
            setError(detail.map((item) => item.msg).join(", "));
          } else {
            setError(detail);
          }
        } else if (err.request) {
          setError(
            "Unable to connect to the ClarifAI backend. Please make sure FastAPI is running."
          );
        } else {
          setError(
            err.message ||
              "Something went wrong while generating the report."
          );
        }
      } finally {
        setIsGenerating(false);
      }

      return;
    }

    setCurrentQuestion(currentQuestion + 1);
  }

  function previousQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setError("");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-8 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-4xl font-bold">Clarify Your Requirements</h1>

        <p className="mb-10 text-slate-400">
          Project:
          <span className="ml-2 text-indigo-400">{projectIdea}</span>
        </p>

        <ProgressBar current={currentQuestion + 1} total={questions.length} />

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        <QuestionCard
          question={questions[currentQuestion]}
          selectedAnswer={answers[questions[currentQuestion].id]}
          onSelect={selectAnswer}
        />

        <NavigationButtons
          onNext={nextQuestion}
          onPrevious={previousQuestion}
          isFirst={currentQuestion === 0}
          isLast={currentQuestion === questions.length - 1}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}

export default Questionnaire;