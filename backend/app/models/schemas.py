from typing import List

from pydantic import BaseModel, EmailStr, Field


class QuestionItem(BaseModel):
    id: int
    question: str
    options: List[str]


class GenerateQuestionsRequest(BaseModel):
    project: str = Field(..., min_length=3, max_length=300)


class GenerateQuestionsResponse(BaseModel):
    questions: List[QuestionItem]
    source: str


class ClarifyRequest(BaseModel):
    project: str = Field(..., min_length=3, max_length=300)
    answers: dict


class RefineReportRequest(BaseModel):
    project: str = Field(..., min_length=3, max_length=300)
    report: str = Field(..., min_length=10, max_length=20000)
    instruction: str = Field(..., min_length=3, max_length=300)


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class CreateReportRequest(BaseModel):
    project: str = Field(..., min_length=3, max_length=300)
    answers: dict
    report: str


class UpdateReportRequest(BaseModel):
    report: str = Field(..., min_length=10, max_length=20000)


class ReportResponse(BaseModel):
    id: int
    project: str
    answers: dict
    report: str
    created_at: str