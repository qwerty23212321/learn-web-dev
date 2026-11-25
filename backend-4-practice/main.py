from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
import uvicorn

from database import Base, SessionLocal, engine, get_db
from models import Category, Master, Service
from schemas import CategoryOut, ServiceCreate, ServiceOut

INITIAL_CATEGORIES = [
    {"id": 1, "name": "Стрижки и укладки"},
    {"id": 2, "name": "Маникюр и педикюр"},
    {"id": 3, "name": "Брови и ресницы"},
    {"id": 4, "name": "Спа-процедуры"},
]

INITIAL_MASTERS = [
    {"id": 1, "name": "Анна", "specialization": "Парикмахер"},
    {"id": 2, "name": "Мария", "specialization": "Визажист"},
]


def to_service_out(service: Service) -> ServiceOut:
    return ServiceOut(
        id=service.id,
        categoryId=service.category_id,
        title=service.title,
        desc=service.desc,
        duration=service.duration,
        price=service.price,
    )


def init_db() -> None:
    """Создаёт таблицы и заполняет начальные категории и мастеров."""
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.scalar(select(Category.id).limit(1)) is None:
            db.add_all(Category(**item) for item in INITIAL_CATEGORIES)
            db.commit()
        if db.scalar(select(Master.id).limit(1)) is None:
            db.add_all(Master(**item) for item in INITIAL_MASTERS)
            db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="Salon Services API", lifespan=lifespan)


@app.get("/categories", response_model=list[CategoryOut])
def get_categories(db: Session = Depends(get_db)) -> list[Category]:
    """Возвращает список всех категорий."""
    return list(db.scalars(select(Category).order_by(Category.id)).all())


@app.get("/services", response_model=list[ServiceOut])
def get_services(db: Session = Depends(get_db)) -> list[ServiceOut]:
    """Возвращает список всех услуг из БД."""
    services = db.scalars(select(Service).order_by(Service.id)).all()
    return [to_service_out(service) for service in services]


@app.post(
    "/services",
    response_model=ServiceOut,
    status_code=status.HTTP_201_CREATED,
)
def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
) -> ServiceOut:
    """Создаёт новую услугу в БД после валидации через ServiceCreate."""
    category = db.get(Category, service_data.categoryId)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    new_service = Service(
        category_id=service_data.categoryId,
        title=service_data.title,
        desc=service_data.desc,
        duration=service_data.duration,
        price=service_data.price,
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return to_service_out(new_service)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
