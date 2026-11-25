from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Master(Base):
    """SQLAlchemy-модель мастера салона."""

    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    specialization: Mapped[str] = mapped_column(String, nullable=False)
