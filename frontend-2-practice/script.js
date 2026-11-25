'use strict';

/* ==========================================================================
   1. Данные
   ========================================================================== */

const MONTHS_NOMINATIVE = [
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

const MONTHS_GENITIVE = [
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

const DAYS_OF_WEEK = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

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

/* ==========================================================================
   2. Состояние
   ========================================================================== */

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const state = {
  currentYear: today.getFullYear(),
  currentMonth: today.getMonth(),
  selectedYear: today.getFullYear(),
  selectedMonth: today.getMonth(),
  selectedDay: today.getDate(),
  selectedTime: null,
  slots: [],
};

/* ==========================================================================
   3. Чистые функции
   ========================================================================== */

/**
 * Сравнивает две даты (без учёта времени).
 * Возвращает -1, если date1 < date2; 0, если равны; 1, если date1 > date2.
 */
function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();

  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Проверяет, можно ли выбрать указанный день (не раньше «сегодня»).
 */
function isDateSelectable(day, month, year, referenceToday) {
  const targetDate = new Date(year, month, day);
  return compareDates(targetDate, referenceToday) >= 0;
}

/**
 * Строит сетку календаря (массив недель по 7 ячеек, неделя начинается с Пн).
 */
function buildCalendarGrid(year, month) {
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
 * Возвращает группы слотов для выбранной даты.
 * Занятые слоты зависят от даты, чтобы при смене дня список обновлялся.
 */
function getSlotsForDate(year, month, day) {
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
 * Возвращает первый свободный слот из сгруппированного списка слотов.
 */
function findFirstAvailableTime(slotGroups) {
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
function formatFullDate(year, month, day) {
  const dateObj = new Date(year, month, day);
  const weekday = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];
  return `${weekday}, ${day} ${monthName} ${year}`;
}

/* ==========================================================================
   4. Рендер
   ========================================================================== */

function renderCalendar() {
  const monthTitleEl = document.querySelector('#calendar-month-title');
  const daysContainer = document.querySelector('#calendar-days');

  monthTitleEl.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;

  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
  let html = '';

  weeks.forEach((week, weekIndex) => {
    week.forEach((day) => {
      if (day === null) {
        if (weekIndex === 0) {
          html += '<span class="day-cell day-cell--empty" aria-hidden="true"></span>';
        }
        return;
      }

      const selectable = isDateSelectable(day, state.currentMonth, state.currentYear, today);
      const isSelected =
        day === state.selectedDay &&
        state.currentMonth === state.selectedMonth &&
        state.currentYear === state.selectedYear;

      const classes = ['day-cell'];
      if (!selectable) classes.push('day-cell--disabled');
      if (isSelected) classes.push('day-cell--selected');

      const disabledAttr = selectable ? '' : ' disabled';
      const pressedAttr = isSelected ? ' aria-pressed="true"' : ' aria-pressed="false"';

      html += `<button type="button" class="${classes.join(' ')}" data-day="${day}"${disabledAttr}${pressedAttr}>${day}</button>`;
    });
  });

  daysContainer.innerHTML = html;

  const dayButtons = daysContainer.querySelectorAll('.day-cell[data-day]:not(:disabled)');
  dayButtons.forEach((button) => {
    button.addEventListener('click', onDayClick);
  });

  renderSelectedDateCard();
}

function renderSelectedDateCard() {
  const badgeEl = document.querySelector('#selected-date-badge');
  const titleEl = document.querySelector('#selected-date-title');
  const weekdayEl = document.querySelector('#selected-date-weekday');

  const dateObj = new Date(state.selectedYear, state.selectedMonth, state.selectedDay);
  const isoMonth = String(state.selectedMonth + 1).padStart(2, '0');
  const isoDay = String(state.selectedDay).padStart(2, '0');

  badgeEl.textContent = String(state.selectedDay);
  titleEl.textContent = `${state.selectedDay} ${MONTHS_GENITIVE[state.selectedMonth]}`;
  titleEl.setAttribute('datetime', `${state.selectedYear}-${isoMonth}-${isoDay}`);
  weekdayEl.textContent = DAYS_OF_WEEK[dateObj.getDay()];
}

function renderTimeSlots() {
  const container = document.querySelector('#time-groups');
  let html = '';

  state.slots.forEach((group) => {
    html += `<div class="time-group">`;
    html += `<h3 class="time-group-label">${group.label}</h3>`;
    html += `<div class="time-slots">`;

    group.slots.forEach((slot) => {
      const classes = ['time-slot'];
      if (slot.wide) classes.push('time-slot--wide');
      if (!slot.available) classes.push('time-slot--busy');
      if (slot.available && slot.time === state.selectedTime) {
        classes.push('time-slot--selected');
      }

      const disabledAttr = slot.available ? '' : ' disabled title="Слот занят"';
      const pressedAttr =
        slot.available && slot.time === state.selectedTime
          ? ' aria-pressed="true"'
          : ' aria-pressed="false"';

      html += `<button type="button" class="${classes.join(' ')}" data-time="${slot.time}"${disabledAttr}${pressedAttr}>${slot.time}</button>`;
    });

    html += `</div>`;
    html += `</div>`;
  });

  container.innerHTML = html;

  const slotButtons = container.querySelectorAll('.time-slot[data-time]:not(:disabled)');
  slotButtons.forEach((button) => {
    button.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  const summaryEl = document.querySelector('#booking-summary');
  const continueBtn = document.querySelector('#continue-btn');
  const formattedDate = formatFullDate(state.selectedYear, state.selectedMonth, state.selectedDay);

  if (state.selectedTime) {
    summaryEl.textContent = `${formattedDate} • ${state.selectedTime}`;
    summaryEl.classList.remove('booking-hint--empty');
    continueBtn.disabled = false;
  } else {
    summaryEl.textContent = `${formattedDate} • выберите время`;
    summaryEl.classList.add('booking-hint--empty');
    continueBtn.disabled = true;
  }
}

/* ==========================================================================
   5. Обработчики событий
   ========================================================================== */

function clearFeedback() {
  const feedbackEl = document.querySelector('#booking-feedback');
  feedbackEl.hidden = true;
  feedbackEl.textContent = '';
}

function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);

  state.selectedYear = state.currentYear;
  state.selectedMonth = state.currentMonth;
  state.selectedDay = day;
  state.selectedTime = null;
  state.slots = getSlotsForDate(state.selectedYear, state.selectedMonth, state.selectedDay);

  clearFeedback();
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  const selectedTime = event.currentTarget.dataset.time;
  state.selectedTime = selectedTime;

  clearFeedback();
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  const prevBtn = document.querySelector('#prev-month-btn');
  const nextBtn = document.querySelector('#next-month-btn');

  prevBtn.addEventListener('click', () => {
    if (state.currentMonth === 0) {
      state.currentMonth = 11;
      state.currentYear -= 1;
    } else {
      state.currentMonth -= 1;
    }
    renderCalendar();
  });

  nextBtn.addEventListener('click', () => {
    if (state.currentMonth === 11) {
      state.currentMonth = 0;
      state.currentYear += 1;
    } else {
      state.currentMonth += 1;
    }
    renderCalendar();
  });
}

function setupContinueButton() {
  const continueBtn = document.querySelector('#continue-btn');
  const feedbackEl = document.querySelector('#booking-feedback');

  continueBtn.addEventListener('click', () => {
    if (!state.selectedTime) return;
    const formattedDate = formatFullDate(state.selectedYear, state.selectedMonth, state.selectedDay);
    feedbackEl.textContent = `Выбраны дата и время: ${formattedDate} • ${state.selectedTime}. Можно переходить к следующему шагу.`;
    feedbackEl.hidden = false;
  });
}

/* ==========================================================================
   6. Инициализация
   ========================================================================== */

function init() {
  state.slots = getSlotsForDate(state.selectedYear, state.selectedMonth, state.selectedDay);
  state.selectedTime = findFirstAvailableTime(state.slots);

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
  setupContinueButton();
}

document.addEventListener('DOMContentLoaded', init);
