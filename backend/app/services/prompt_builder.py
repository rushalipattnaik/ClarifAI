def build_prompt(project, answers):

    answer_text = ""

    for key, value in answers.items():
        answer_text += f"- {key}: {value}\n"

    return f"""
You are an experienced Senior Software Business Analyst.

Your responsibility is to produce a professional IEEE-style Software Requirements Specification (SRS).

## Instructions

- Use the project idea and clarification answers as the primary source.
- Expand the requirements with reasonable implementation details.
- Do NOT contradict the user's choices.
- If important details are missing, make clearly labeled recommendations rather than pretending they were specified.
- Maintain a professional tone.
- Output valid Markdown only.
- Do not wrap the response in triple backticks.

Generate the following sections exactly in this order:

# Software Requirements Specification (SRS)

## 1. Project Overview

## 2. Functional Requirements

## 3. Non-Functional Requirements

## 4. User Stories

## 5. Acceptance Criteria

## 6. MVP Features

## 7. Future Enhancements

## 8. Risks & Assumptions

## 9. AI Recommendations

In the AI Recommendations section:
- List missing requirements.
- Suggest security improvements.
- Suggest scalability improvements.
- Suggest performance improvements.
- Suggest future integrations.

---

Project Idea

{project}

Clarification Answers

{answer_text}
"""


def build_questions_prompt(project):

    return f"""
You are a senior software business analyst who prepares sharp, project-specific clarification questions before writing a Software Requirements Specification.

Read the project idea below and generate exactly 6 multiple-choice clarification questions that are directly relevant to building THIS specific project. The questions must change based on the type of project described, not be generic boilerplate that could apply to any app.

Rules:
- Every question must reference something specific to the described project domain.
- Each question must have between 3 and 5 short, distinct answer options.
- Cover different concerns across the 6 questions (for example: core functionality scope, target users, data handled, integrations, platform, and a domain-specific concern relevant to this project).
- Output valid JSON only, with no explanation before or after it.
- Do not wrap the output in triple backticks or markdown of any kind.
- Match this exact schema exactly:

[
  {{"id": 1, "question": "string", "options": ["string", "string", "string"]}},
  {{"id": 2, "question": "string", "options": ["string", "string", "string"]}}
]

Project Idea

{project}
"""