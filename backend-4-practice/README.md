# Backend — Задание 4 (Pydantic + SQLAlchemy + FastAPI)

Реализация Pydantic-модели `ServiceCreate` с валидацией полей и эндпоинта `POST /services` для сохранения услуг в SQLite БД через SQLAlchemy:

- [schemas.py](schemas.py) — Pydantic-модели `ServiceCreate` (ограничения на длину `title`/`desc` 1–100 символов, `duration` 30–180 минут, `price > 0`) и `ServiceOut`.
- [models.py](models.py) — SQLAlchemy-модели `Category`, `Service`, `Master`.
- [database.py](database.py) — подключение к `SQLite` (`salon.db`) и зависимость `get_db`.
- [main.py](main.py) — инициализация БД, начальные категории и эндпоинты `POST /services`, `GET /services`, `GET /categories`.

## Установка и запуск

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
