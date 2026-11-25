# Backend — Задание 3 (SQLite + SQLAlchemy)

Хранение мастеров салона в базе данных **SQLite** через **SQLAlchemy** и API на **FastAPI**:

- [models.py](models.py) — модель `Master` (`id`, `name`, `specialization`) и таблица `masters`.
- [database.py](database.py) — подключение SQLite, фабрика сессий `SessionLocal` и зависимость `get_db`.
- [schemas.py](schemas.py) — Pydantic-схема `MasterOut`.
- [main.py](main.py) — инициализация БД, первичное наполнение `masters` и эндпоинты:
  - `GET /masters` — список всех мастеров;
  - `GET /masters?specialization=...` — фильтрация мастеров по специализации;
  - `GET /masters/{master_id}` — получение одного мастера по `id` (или `404 Not Found`).

## Установка и запуск

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
