export async function fetchToday() {
  const response = await fetch('/api/booking/today');
  if (!response.ok) {
    throw new Error(`Ошибка загрузки календаря (${response.status})`);
  }
  return response.json();
}

export async function fetchSlots({ day, month, year }) {
  const params = new URLSearchParams({
    day: String(day),
    month: String(month),
    year: String(year),
  });
  const response = await fetch(`/api/slots?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки слотов времени (${response.status})`);
  }
  return response.json();
}
