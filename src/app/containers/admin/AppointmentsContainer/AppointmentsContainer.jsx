"use client";
import { useState, useMemo, useCallback } from "react";
import { BY_DAY, CALENDAR_TODAY } from "./data";
import StatCards    from "./Components/StatCards";
import CalendarView from "./Components/CalendarView";
import DaySchedule  from "./Components/DaySchedule";

export default function AppointmentsContainer() {
  const [selectedDay, setSelectedDay] = useState(CALENDAR_TODAY.day);
  const [viewYear,    setViewYear]    = useState(CALENDAR_TODAY.year);
  const [viewMonth,   setViewMonth]   = useState(CALENDAR_TODAY.month);

  const handlePrev = useCallback(() => {
    setViewMonth((m) => {
      if (m === 1) { setViewYear((y) => y - 1); return 12; }
      return m - 1;
    });
    setSelectedDay(null);
  }, []);

  const handleNext = useCallback(() => {
    setViewMonth((m) => {
      if (m === 12) { setViewYear((y) => y + 1); return 1; }
      return m + 1;
    });
    setSelectedDay(null);
  }, []);

  const handleDaySelect = useCallback((day) => {
    setSelectedDay((prev) => (prev === day ? null : day));
  }, []);

  const isDataMonth = viewYear === CALENDAR_TODAY.year && viewMonth === CALENDAR_TODAY.month;

  const dayAppointments = useMemo(
    () => (selectedDay && isDataMonth ? BY_DAY[selectedDay] || [] : []),
    [selectedDay, isDataMonth],
  );

  return (
    <div className="space-y-5">
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Calendar */}
        <div className="lg:col-span-5">
          <CalendarView
            viewYear={viewYear}
            viewMonth={viewMonth}
            selectedDay={isDataMonth ? selectedDay : null}
            onDaySelect={handleDaySelect}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>

        {/* Day schedule */}
        <div className="lg:col-span-7">
          <DaySchedule
            appointments={dayAppointments}
            selectedDay={isDataMonth ? selectedDay : null}
            viewMonth={viewMonth}
            viewYear={viewYear}
          />
        </div>
      </div>
    </div>
  );
}
