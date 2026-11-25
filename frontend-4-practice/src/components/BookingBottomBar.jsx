import { formatFullDate } from '../data/date.js';

export function BookingBottomBar({
  selectedYear,
  selectedMonth,
  selectedDay,
  selectedTime,
  confirmed,
  disabled,
  onContinue,
}) {
  const formattedDate = formatFullDate(selectedYear, selectedMonth, selectedDay);

  return (
    <>
      <div className="booking-actions">
        <p className={selectedTime ? 'booking-hint' : 'booking-hint booking-hint--empty'}>
          {selectedTime
            ? `${formattedDate} • ${selectedTime}`
            : `${formattedDate} • выберите время`}
        </p>
        <button
          type="button"
          className="btn-primary"
          disabled={disabled || !selectedTime}
          onClick={onContinue}
        >
          Продолжить
        </button>
      </div>

      {confirmed && selectedTime && (
        <p className="booking-feedback" role="status" aria-live="polite">
          Выбраны дата и время: {formattedDate} • {selectedTime}. Можно переходить к следующему шагу.
        </p>
      )}
    </>
  );
}
