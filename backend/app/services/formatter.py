import json
import re


def clean_markdown(markdown: str):

    if markdown is None:
        return ""

    markdown = markdown.replace("\r\n", "\n")

    markdown = re.sub(r"\n{3,}", "\n\n", markdown)

    markdown = markdown.strip()

    return markdown


def parse_questions(raw_text: str):

    if not raw_text:
        raise ValueError("Empty response from Gemini.")

    cleaned = raw_text.strip()

    cleaned = re.sub(r"^```(json)?", "", cleaned).strip()

    cleaned = re.sub(r"```$", "", cleaned).strip()

    data = json.loads(cleaned)

    if not isinstance(data, list) or len(data) == 0:
        raise ValueError("Unexpected question format from Gemini.")

    questions = []

    for index, item in enumerate(data, start=1):

        if not isinstance(item, dict):
            continue

        question_text = item.get("question")

        options = item.get("options")

        if not question_text or not isinstance(options, list) or len(options) < 2:
            continue

        questions.append(
            {
                "id": index,
                "question": str(question_text),
                "options": [str(option) for option in options][:6],
            }
        )

    if not questions:
        raise ValueError("No valid questions parsed from Gemini response.")

    return questions