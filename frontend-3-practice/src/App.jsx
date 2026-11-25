import { useState } from 'react';
import { Header } from './components/Header.jsx';
import { ProgressSteps } from './components/ProgressSteps.jsx';
import { CalendarHeader } from './components/CalendarHeader.jsx';
import { CalendarGrid } from './components/CalendarGrid.jsx';
import { TimeSlots } from './components/TimeSlots.jsx';
import { BookingBottomBar } from './components/BookingBottomBar.jsx';
import { Footer } from './components/Footer.jsx';
import { findFirstAvailableTime, getSlotsForDate } from './data/date.js';
import './styles/booking.css';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const initialSlots = getSlotsForDate(today.getFullYear(), today.getMonth(), today.getDate());

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [slots, setSlots] = useState(initialSlots);
  const [selectedTime, setSelectedTime] = useState(() => findFirstAvailableTime(initialSlots));
  const [confirmed, setConfirmed] = useState(false);

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
    setSelectedDay(day);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setSelectedTime(null);
    setSlots(getSlotsForDate(currentYear, currentMonth, day));
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
              onSelectTime={handleSelectTime}
            />
          </div>

          <BookingBottomBar
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            confirmed={confirmed}
            onContinue={handleContinue}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
