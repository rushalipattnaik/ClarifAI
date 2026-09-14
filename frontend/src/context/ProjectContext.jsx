import { useState } from "react";

import { ProjectContext } from "./project-context";

export function ProjectProvider({ children }) {
  const [projectIdea, setProjectIdea] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState(null);

  return (
    <ProjectContext.Provider
      value={{
        projectIdea,
        setProjectIdea,
        questions,
        setQuestions,
        answers,
        setAnswers,
        report,
        setReport,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}