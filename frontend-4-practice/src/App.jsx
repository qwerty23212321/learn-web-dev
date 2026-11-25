import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSlots, fetchToday } from './api.js';
import { Header } from './components/Header.jsx';
import { ProgressSteps } from './components/ProgressSteps.jsx';
import { CalendarHeader } from './components/CalendarHeader.jsx';
import { CalendarGrid } from './components/CalendarGrid.jsx';
import { TimeSlots } from './components/TimeSlots.jsx';
import { BookingBottomBar } from './components/BookingBottomBar.jsx';
import { Footer } from './components/Footer.jsx';
import './styles/booking.css';

export default function App() {
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2026);

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsRetryKey, setSlotsRetryKey] = useState(0);

  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const isFirstSlotsLoad = useRef(true);

  const loadToday = useCallback(async () => {
    setTodayLoading(true);
    setTodayError(null);
    try {
      const data = await fetchToday();
      const todayDate = new Date(data.year, data.month, data.day);
      setToday(todayDate);
      setCurrentMonth(data.month);
      setCurrentYear(data.year);
      setSelectedDay(data.day);
      setSelectedMonth(data.month);
      setSelectedYear(data.year);
    } catch (err) {
      setTodayError(err instanceof Error ? err.message : 'Не удалось загрузить данные с сервера');
    } finally {
      setTodayLoading(false);
    }
  }, []);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  useEffect(() => {
    if (!today) return undefined;

    let cancelled = false;
    setSlotsLoading(true);
    setSlotsError(null);

    fetchSlots({ day: selectedDay, month: selectedMonth, year: selectedYear })
      .then((data) => {
        if (cancelled) return;
        if (
          !data.date ||
          data.date.day !== selectedDay ||
          data.date.month !== selectedMonth ||
          data.date.year !== selectedYear
        ) {
          return;
        }

        const loadedSlots = Array.isArray(data.slots) ? data.slots : [];
        setSlots(loadedSlots);

        if (isFirstSlotsLoad.current) {
          isFirstSlotsLoad.current = false;
          const firstAvailable = loadedSlots.find((slot) => slot.available);
          if (firstAvailable) {
            setSelectedTime(firstAvailable.time);
          }
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setSlots([]);
        setSlotsError(err instanceof Error ? err.message : 'Не удалось загрузить слоты времени');
      })
      .finally(() => {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [today, selectedDay, selectedMonth, selectedYear, slotsRetryKey]);

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  }

  function handleSelectDay(day) {
    if (
      day === selectedDay &&
      currentMonth === selectedMonth &&
      currentYear === selectedYear
    ) {
      return;
    }

    isFirstSlotsLoad.current = false;
    setSelectedDay(day);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setSelectedTime(null);
    setConfirmed(false);
  }

  function handleSelectTime(time) {
    setSelectedTime(time);
    setConfirmed(false);
  }

  function handleContinue() {
    if (!selectedTime) return;
    setConfirmed(true);
  }

  return (
    <>
      <Header />
      <ProgressSteps currentStep={3} />

      <main className="booking-main">
        <div className="container">
          <div className="page-intro">
            <p className="eyebrow">БРОНИРОВАНИЕ</p>
            <h1 className="page-title">Выберите дату и время</h1>
            <p className="page-subtitle">
              Выберите удобный день и слот — мы сохраним место в календаре барбера.
            </p>
          </div>

          {todayLoading && (
            <div className="status-box status-box--page" role="status" aria-live="polite">
              <span className="status-spinner" aria-hidden="true" />
              <p className="status-text">Загрузка…</p>
            </div>
          )}

          {!todayLoading && todayError && (
            <div className="status-box status-box--page status-box--error" role="alert">
              <p className="status-text status-text--error">{todayError}</p>
              <button type="button" className="btn-retry" onClick={loadToday}>
                Повторить
              </button>
            </div>
          )}

          {!todayLoading && !todayError && today && (
            <>
              <div className="booking-grid">
                <section className="card calendar-card" aria-label="Выбор даты">
                  <CalendarHeader
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                  />
                  <CalendarGrid
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    selectedDay={selectedDay}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    today={today}
                    onSelectDay={handleSelectDay}
                  />
                </section>

                <TimeSlots
                  slots={slots}
                  selectedTime={selectedTime}
                  loading={slotsLoading}
                  error={slotsError}
                  onSelectTime={handleSelectTime}
                  onRetry={() => setSlotsRetryKey((key) => key + 1)}
                />
              </div>

              <BookingBottomBar
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDay={selectedDay}
                selectedTime={selectedTime}
                confirmed={confirmed}
                disabled={slotsLoading || Boolean(slotsError)}
                onContinue={handleContinue}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
