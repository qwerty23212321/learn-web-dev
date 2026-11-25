# Backend — Задание 2

Реализация эндпоинтов категорий услуг на **FastAPI** в [main.py](main.py):

- `GET /categories` — возвращает список всех категорий услуг с количеством услуг (`servicesCount`) в каждой.
- `GET /categories/{category_id}` — возвращает информацию о конкретной категории (`200 OK`) или ошибку `404` (`Category not found`), если категория не найдена.

## Установка и запуск

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
