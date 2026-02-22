from pydantic import BaseModel, Field, field_validator
from typing import Literal

class GenerateRequest(BaseModel):
    product_title: str = Field("", max_length=100)
    product_category: str = Field("", max_length=50)
    intent: str = Field(..., min_length=3, max_length=200)

class TimerSuggestion(BaseModel):
    timer_type: Literal["fixed", "evergreen"]
    duration_hours: float = Field(..., gt=0, le=720)
    headline: str = Field(..., max_length=60)
    supporting_text: str = Field("", max_length=120)

    @field_validator("headline", "supporting_text")
    @classmethod
    def strip_html(cls, v: str) -> str:
        import html
        return html.escape(v.strip())