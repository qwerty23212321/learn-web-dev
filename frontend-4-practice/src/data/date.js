export const MONTHS_NOMINATIVE = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

export const DAYS_OF_WEEK = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/**
 * Сравнивает две даты (без учёта времени).
 * Возвращает -1, если date1 < date2; 0, если равны; 1, если date1 > date2.
 */
export function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();

  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Проверяет, можно ли выбрать указанный день (не раньше «сегодня»).
 */
export function isDateSelectable(day, month, year, today) {
  const targetDate = new Date(year, month, day);
  return compareDates(targetDate, today) >= 0;
}

/**
 * Строит сетку календаря (массив недель по 7 ячеек, неделя начинается с Пн).
 */
export function buildCalendarGrid(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const weeks = [];
  let currentWeek = [];

  for (let i = 0; i < startOffset; i += 1) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Форматирует дату в строку вида «Четверг, 26 ноября 2026».
 */
export function formatFullDate(year, month, day) {
  const dateObj = new Date(year, month, day);
  const weekday = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];
  return `${weekday}, ${day} ${monthName} ${year}`;
}

/**
 * Группирует плоский массив слотов { time, available, group? } по периодам дня.
 */
export function groupSlotsByPeriod(slots) {
  const groupsOrder = ['УТРО', 'ДЕНЬ', 'ВЕЧЕР'];
  const grouped = new Map();

  slots.forEach((slot) => {
    let period = slot.group;
    if (!period) {
      const hour = Number(slot.time.split(':')[0]);
      if (hour < 12) period = 'УТРО';
      else if (hour < 17) period = 'ДЕНЬ';
      else period = 'ВЕЧЕР';
    }

    if (!grouped.has(period)) {
      grouped.set(period, []);
    }
    grouped.get(period).push(slot);
  });

  return groupsOrder
    .filter((label) => grouped.has(label))
    .map((label) => ({
      label,
      slots: grouped.get(label),
    }));
}
