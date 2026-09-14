import { useContext } from "react";
import { ProjectContext } from "../context/project-context";

export function useProject() {
  return useContext(ProjectContext);
}