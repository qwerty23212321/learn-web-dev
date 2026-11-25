from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
import uvicorn

from database import Base, SessionLocal, engine, get_db
from models import Master
from schemas import MasterOut

INITIAL_MASTERS = [
    {"id": 1, "name": "Анна", "specialization": "Парикмахер"},
    {"id": 2, "name": "Мария", "specialization": "Визажист"},
    {"id": 3, "name": "Ольга", "specialization": "Парикмахер"},
    {"id": 4, "name": "Елена", "specialization": "Мастер маникюра"},
]


def init_db() -> None:
    """Создаёт таблицы и заполняет masters начальными данными, если таблица пуста."""
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        has_masters = db.scalar(select(Master.id).limit(1))
        if has_masters is None:
            db.add_all(Master(**item) for item in INITIAL_MASTERS)
            db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="Salon Masters API", lifespan=lifespan)


@app.get("/masters", response_model=list[MasterOut])
def get_masters(
    specialization: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Master]:
    """Возвращает всех мастеров или фильтрует их по специализации."""
    stmt = select(Master).order_by(Master.id)
    if specialization is not None and specialization.strip():
        stmt = stmt.where(Master.specialization == specialization.strip())
    return list(db.scalars(stmt).all())


@app.get("/masters/{master_id}", response_model=MasterOut)
def get_master(master_id: int, db: Session = Depends(get_db)) -> Master:
    """Возвращает одного мастера по id или ошибку 404."""
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
