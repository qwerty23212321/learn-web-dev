import {
  DAYS_OF_WEEK,
  MONTHS_GENITIVE,
  WEEKDAYS_SHORT,
  buildCalendarGrid,
  isDateSelectable,
} from '../data/date.js';

export function CalendarGrid({
  currentMonth,
  currentYear,
  selectedDay,
  selectedMonth,
  selectedYear,
  today,
  onSelectDay,
}) {
  const weeks = buildCalendarGrid(currentYear, currentMonth);
  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const isoDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  return (
    <>
      <div className="calendar-weekdays" aria-hidden="true">
        {WEEKDAYS_SHORT.map((label) => (
          <span key={label} className="weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="calendar-days" role="grid" aria-label="Календарь">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            if (day === null) {
              if (weekIndex === 0) {
                return (
                  <span
                    key={`empty-${weekIndex}-${dayIndex}`}
                    className="day-cell day-cell--empty"
                    aria-hidden="true"
                  />
                );
              }
              return null;
            }

            const selectable = isDateSelectable(day, currentMonth, currentYear, today);
            const isSelected =
              day === selectedDay &&
              currentMonth === selectedMonth &&
              currentYear === selectedYear;

            const classes = ['day-cell'];
            if (!selectable) classes.push('day-cell--disabled');
            if (isSelected) classes.push('day-cell--selected');

            return (
              <button
                key={`day-${currentYear}-${currentMonth}-${day}`}
                type="button"
                className={classes.join(' ')}
                disabled={!selectable}
                aria-pressed={isSelected}
                onClick={() => onSelectDay(day)}
              >
                {day}
              </button>
            );
          })
        )}
      </div>

      <div className="selected-date-box">
        <span className="selected-date-badge" aria-hidden="true">
          {selectedDay}
        </span>
        <div className="selected-date-info">
          <time className="selected-date-title" dateTime={isoDate}>
            {selectedDay} {MONTHS_GENITIVE[selectedMonth]}
          </time>
          <span className="selected-date-weekday">
            {DAYS_OF_WEEK[selectedDateObj.getDay()]}
          </span>
        </div>
      </div>
    </>
  );
}
