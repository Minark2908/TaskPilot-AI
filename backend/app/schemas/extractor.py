from pydantic import BaseModel, Field, field_validator

class ExtractionRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=10,
        description="Unstructured meeting notes or task description to extract tasks from."
    )

    @field_validator("text", mode="before")
    @classmethod
    def text_must_not_be_whitespace(cls, v: str) -> str:
        stripped = v.strip() if isinstance(v, str) else v
        if not stripped or len(stripped) < 10:
            raise ValueError(
                "Text must contain at least 10 non-whitespace characters."
            )
        return stripped
