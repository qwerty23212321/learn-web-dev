from pydantic import BaseModel, ConfigDict, Field, field_validator


class ServiceCreate(BaseModel):
    """Pydantic-модель для создания новой услуги с валидацией ограничений."""

    categoryId: int = Field(..., gt=0, description="Идентификатор категории услуги")
    title: str = Field(..., min_length=1, max_length=100, description="Название услуги")
    desc: str = Field(..., min_length=1, max_length=100, description="Описание услуги")
    duration: int = Field(
        ..., ge=30, le=180, description="Продолжительность услуги в минутах (30–180)"
    )
    price: float = Field(..., gt=0, description="Стоимость услуги (больше 0)")

    @field_validator("title", "desc")
    @classmethod
    def validate_non_empty_text(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Поле не может быть пустым")
        if len(stripped) > 100:
            raise ValueError("Максимальная длина строки — 100 символов")
        return stripped


class ServiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    categoryId: int
    title: str
    desc: str
    duration: int
    price: float


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
