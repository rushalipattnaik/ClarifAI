from app.services.prompt_builder import (
    build_prompt,
    build_questions_prompt,
    build_refine_prompt,
)
from app.services.gemini_client import generate_text
from app.services.formatter import clean_markdown, parse_questions


def generate_report(project, answers):

    prompt = build_prompt(project, answers)

    response = generate_text(prompt)

    return clean_markdown(response)


def generate_questions(project):

    prompt = build_questions_prompt(project)

    response = generate_text(prompt)

    return parse_questions(response)


def refine_report(project, current_report, instruction):

    prompt = build_refine_prompt(project, current_report, instruction)

    response = generate_text(prompt)

    return clean_markdown(response)