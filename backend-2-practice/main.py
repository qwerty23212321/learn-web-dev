from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn


class CategoryOut(BaseModel):
    id: int
    name: str
    servicesCount: int


app = FastAPI(title="Salon Booking API")

categories = [
    {"id": 1, "name": "Стрижки и укладки"},
    {"id": 2, "name": "Маникюр и педикюр"},
    {"id": 3, "name": "Брови и ресницы"},
    {"id": 4, "name": "Спа-процедуры"},
]

services = [
    {"id": 1, "category_id": 1, "name": "Мужская стрижка", "price": 1800},
    {"id": 2, "category_id": 1, "name": "Женская стрижка", "price": 2500},
    {"id": 3, "category_id": 1, "name": "Укладка волос", "price": 1500},
    {"id": 4, "category_id": 1, "name": "Детская стрижка", "price": 1200},
    {"id": 5, "category_id": 1, "name": "Стрижка бороды и усов", "price": 1100},
    {"id": 6, "category_id": 2, "name": "Классический маникюр", "price": 1400},
    {"id": 7, "category_id": 2, "name": "Аппаратный маникюр", "price": 1600},
    {"id": 8, "category_id": 2, "name": "Покрытие гель-лак", "price": 1300},
    {"id": 9, "category_id": 2, "name": "Классический педикюр", "price": 2200},
    {"id": 10, "category_id": 2, "name": "Спа-уход для рук", "price": 1000},
    {"id": 11, "category_id": 3, "name": "Коррекция бровей", "price": 800},
    {"id": 12, "category_id": 3, "name": "Окрашивание бровей", "price": 900},
    {"id": 13, "category_id": 3, "name": "Ламинирование бровей", "price": 1900},
    {"id": 14, "category_id": 3, "name": "Наращивание ресниц", "price": 2800},
    {"id": 15, "category_id": 4, "name": "Расслабляющий массаж", "price": 3200},
    {"id": 16, "category_id": 4, "name": "Обёртывание", "price": 2900},
    {"id": 17, "category_id": 4, "name": "Пилинг тела", "price": 2400},
    {"id": 18, "category_id": 4, "name": "Стоун-терапия", "price": 3500},
]


def build_category_item(category: dict) -> CategoryOut:
    """Формирует объект категории с подсчитанным количеством услуг."""
    services_count = sum(
        1 for service in services if service["category_id"] == category["id"]
    )
    return CategoryOut(
        id=category["id"],
        name=category["name"],
        servicesCount=services_count,
    )


@app.get("/categories", response_model=list[CategoryOut])
def get_categories() -> list[CategoryOut]:
    """Возвращает список всех категорий услуг с количеством услуг в каждой."""
    return [build_category_item(category) for category in categories]


@app.get("/categories/{category_id}", response_model=CategoryOut)
def get_category(category_id: int) -> CategoryOut:
    """Возвращает информацию о категории по ID или ошибку 404."""
    for category in categories:
        if category["id"] == category_id:
            return build_category_item(category)
    raise HTTPException(status_code=404, detail="Category not found")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
