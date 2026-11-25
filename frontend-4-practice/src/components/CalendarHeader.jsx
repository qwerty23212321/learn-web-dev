import { MONTHS_NOMINATIVE } from '../data/date.js';

export function CalendarHeader({ currentMonth, currentYear, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar-header">
      <h2 className="card-title">
        {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
      </h2>
      <div className="calendar-nav">
        <button
          type="button"
          className="calendar-nav-btn"
          aria-label="Предыдущий месяц"
          onClick={onPrevMonth}
        >
          <svg className="icon-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="calendar-nav-btn"
          aria-label="Следующий месяц"
          onClick={onNextMonth}
        >
          <svg className="icon-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
