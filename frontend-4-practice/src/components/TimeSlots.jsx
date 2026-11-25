import { groupSlotsByPeriod } from '../data/date.js';

export function TimeSlots({ slots, selectedTime, loading, error, onSelectTime, onRetry }) {
  const groups = groupSlotsByPeriod(slots);

  return (
    <section className="card time-card" aria-label="Выбор времени">
      <h2 className="card-title time-card-title">Время</h2>

      {loading && (
        <div className="status-box" role="status" aria-live="polite">
          <span className="status-spinner" aria-hidden="true" />
          <p className="status-text">Загрузка слотов…</p>
        </div>
      )}

      {!loading && error && (
        <div className="status-box status-box--error" role="alert">
          <p className="status-text status-text--error">{error}</p>
          <button type="button" className="btn-retry" onClick={onRetry}>
            Повторить
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="time-groups">
          {groups.map((group) => (
            <div key={group.label} className="time-group">
              <h3 className="time-group-label">{group.label}</h3>
              <div className="time-slots">
                {group.slots.map((slot) => {
                  const isSelected = slot.available && slot.time === selectedTime;
                  const classes = ['time-slot'];
                  if (slot.wide) classes.push('time-slot--wide');
                  if (!slot.available) classes.push('time-slot--busy');
                  if (isSelected) classes.push('time-slot--selected');

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      className={classes.join(' ')}
                      disabled={!slot.available}
                      title={slot.available ? undefined : 'Слот занят'}
                      aria-pressed={isSelected}
                      onClick={() => onSelectTime(slot.time)}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
