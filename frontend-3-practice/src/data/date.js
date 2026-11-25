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

const BASE_TIME_GROUPS = [
  {
    label: 'УТРО',
    times: ['10:00', '11:30'],
  },
  {
    label: 'ДЕНЬ',
    times: ['13:00', '14:30', '16:00'],
  },
  {
    label: 'ВЕЧЕР',
    times: ['17:30', '19:00'],
  },
];

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
 * Возвращает группы слотов времени для выбранной даты.
 */
export function getSlotsForDate(year, month, day) {
  const pattern = (day + month) % 3;
  let busyTimes;

  if (pattern === 0) {
    busyTimes = new Set(['11:30', '17:30']);
  } else if (pattern === 1) {
    busyTimes = new Set(['13:00', '19:00']);
  } else {
    busyTimes = new Set(['17:30', '19:00']);
  }

  return BASE_TIME_GROUPS.map((group) => ({
    label: group.label,
    slots: group.times.map((time, index) => ({
      time,
      available: !busyTimes.has(time),
      wide: group.times.length % 2 === 1 && index === group.times.length - 1,
    })),
  }));
}

/**
 * Возвращает первый свободный слот из сгруппированного списка.
 */
export function findFirstAvailableTime(slotGroups) {
  for (const group of slotGroups) {
    for (const slot of group.slots) {
      if (slot.available) {
        return slot.time;
      }
    }
  }
  return null;
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
