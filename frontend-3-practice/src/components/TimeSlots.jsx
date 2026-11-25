export function TimeSlots({ slots, selectedTime, onSelectTime }) {
  return (
    <section className="card time-card" aria-label="Выбор времени">
      <h2 className="card-title time-card-title">Время</h2>
      <div className="time-groups">
        {slots.map((group) => (
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
    </section>
  );
}
