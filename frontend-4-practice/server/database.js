// «Сегодня» в имитационной базе (month — 0-индексный: 10 = ноябрь)
export const TODAY = {
  day: 26,
  month: 10,
  year: 2026,
};

// Несколько наборов слотов (чередуются в зависимости от выбранного дня)
export const SLOT_SETS = [
  [
    { time: '10:00', available: true, group: 'УТРО' },
    { time: '11:30', available: false, group: 'УТРО' },
    { time: '13:00', available: true, group: 'ДЕНЬ' },
    { time: '14:30', available: true, group: 'ДЕНЬ' },
    { time: '16:00', available: true, group: 'ДЕНЬ', wide: true },
    { time: '17:30', available: false, group: 'ВЕЧЕР' },
    { time: '19:00', available: true, group: 'ВЕЧЕР' },
  ],
  [
    { time: '10:00', available: true, group: 'УТРО' },
    { time: '11:30', available: true, group: 'УТРО' },
    { time: '13:00', available: false, group: 'ДЕНЬ' },
    { time: '14:30', available: true, group: 'ДЕНЬ' },
    { time: '16:00', available: true, group: 'ДЕНЬ', wide: true },
    { time: '17:30', available: true, group: 'ВЕЧЕР' },
    { time: '19:00', available: false, group: 'ВЕЧЕР' },
  ],
  [
    { time: '10:00', available: true, group: 'УТРО' },
    { time: '11:30', available: true, group: 'УТРО' },
    { time: '13:00', available: true, group: 'ДЕНЬ' },
    { time: '14:30', available: true, group: 'ДЕНЬ' },
    { time: '16:00', available: true, group: 'ДЕНЬ', wide: true },
    { time: '17:30', available: false, group: 'ВЕЧЕР' },
    { time: '19:00', available: false, group: 'ВЕЧЕР' },
  ],
];

export function getSlotsByDate(day, month) {
  const index = Math.abs(day + month) % SLOT_SETS.length;
  return SLOT_SETS[index];
}
