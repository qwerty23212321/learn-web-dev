from dataclasses import dataclass


@dataclass
class Master:
    master_id: int
    name: str


@dataclass
class Service:
    service_id: int
    name: str
    price: int


class Appointment:
    """Запись клиента на услугу к мастеру."""

    def __init__(
        self,
        appointment_id: int,
        client_name: str,
        master_id: int,
        service_id: int,
        time: str,
    ) -> None:
        self.id = appointment_id
        self.appointment_id = appointment_id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

    def __repr__(self) -> str:
        return (
            f"Appointment(id={self.id}, client_name={self.client_name!r}, "
            f"master_id={self.master_id}, service_id={self.service_id}, time={self.time!r})"
        )


# Алиас на случай обращения по имени из текста задания
Appoinment = Appointment

WORK_START_MINUTES = 8 * 60   # 08:00
WORK_END_MINUTES = 20 * 60    # 20:00

masters: list[Master] = [
    Master(master_id=1, name="Александр Воронов"),
    Master(master_id=2, name="Дмитрий Соколов"),
]

services: list[Service] = [
    Service(service_id=1, name="Мужская стрижка", price=1800),
    Service(service_id=2, name="Моделирование бороды", price=1200),
]

appointments: list[Appointment] = []


def get_master(master_id: int) -> Master | None:
    """Возвращает мастера по ID или None, если мастер не найден."""
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Service | None:
    """Возвращает услугу по ID или None, если услуга не найдена."""
    for service in services:
        if service.service_id == service_id:
            return service
    return None


def is_working_hours(time: str) -> bool:
    """Проверяет, что время корректного формата ЧЧ:ММ и входит в часы работы (08:00–20:00)."""
    if not isinstance(time, str):
        return False

    parts = time.strip().split(":")
    if len(parts) != 2:
        return False

    hours_str, minutes_str = parts
    if not (hours_str.isdigit() and minutes_str.isdigit()):
        return False
    if len(hours_str) != 2 or len(minutes_str) != 2:
        return False

    hours = int(hours_str)
    minutes = int(minutes_str)
    if not (0 <= hours <= 23 and 0 <= minutes <= 59):
        return False

    total_minutes = hours * 60 + minutes
    return WORK_START_MINUTES <= total_minutes <= WORK_END_MINUTES


def is_time_free(time: str) -> bool:
    """Проверяет, что на указанное время ещё нет другой записи."""
    return all(existing.time != time for existing in appointments)


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appointment | None:
    """Создаёт объект Appointment, если заполнены все поля и время допустимо."""
    if not isinstance(client_name, str) or not client_name.strip():
        return None
    if not isinstance(time, str) or not time.strip():
        return None
    if master_id is None or service_id is None:
        return None

    clean_name = client_name.strip()
    clean_time = time.strip()

    if not is_working_hours(clean_time):
        return None
    if not is_time_free(clean_time):
        return None

    master = get_master(master_id)
    service = get_service(service_id)
    if master is None or service is None:
        return None

    appointment = Appointment(
        appointment_id=len(appointments) + 1,
        client_name=clean_name,
        master_id=master.master_id,
        service_id=service.service_id,
        time=clean_time,
    )
    appointments.append(appointment)
    return appointment


if __name__ == "__main__":
    # Проверка 1: создание корректных записей
    appointments.clear()
    first_appointment = create_appointment("Иванова А.А.", 1, 1, "10:00")
    second_appointment = create_appointment("Петрова А.А.", 1, 1, "11:00")
    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    # Проверка 2: пустое имя (не заполнены все поля)
    appointments.clear()
    no_correct_appointment = create_appointment("", 1, 1, "12:00")
    print("После попытки создать запись с пустым именем:", len(appointments))

    # Проверка 3: некорректное время вне часов работы салона (08:00–20:00)
    appointments.clear()
    no_correct_time_appointment = create_appointment("Сидорова А.А.", 1, 1, "00:00")
    print("После попытки создать запись на 00:00:", len(appointments))
