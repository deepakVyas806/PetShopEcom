"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { api, qs } from "@/lib/api";
import { SkStatCard } from "@/components/ui";
import { fmt } from "@/lib/currency";
import StatCards    from "./Components/StatCards";
import CalendarView from "./Components/CalendarView";
import DaySchedule  from "./Components/DaySchedule";

const TODAY       = new Date();
const TODAY_DAY   = TODAY.getDate();
const TODAY_MONTH = TODAY.getMonth() + 1;
const TODAY_YEAR  = TODAY.getFullYear();

function toUiAppt(a) {
  return {
    id:          String(a._id),
    service:     a.serviceName,
    serviceIcon: a.serviceIcon ?? "🐾",
    pet:         { name: a.petName, type: a.petType ?? "" },
    owner:       a.userId?.name ?? "—",
    time:        a.timeSlot,
    duration:    "—",
    groomer:     a.groomer ?? "—",
    amount:      fmt(a.amount ?? 0),
    status:      a.status,
  };
}

export default function AppointmentsContainer() {
  const [byDay,       setByDay]       = useState({});
  const [stats,       setStats]       = useState({ todayCount: 0, pendingCount: 0 });
  const [loading,     setLoading]     = useState(true);
  const [selectedDay, setSelectedDay] = useState(TODAY_DAY);
  const [viewYear,    setViewYear]    = useState(TODAY_YEAR);
  const [viewMonth,   setViewMonth]   = useState(TODAY_MONTH);

  const fetchAppointments = useCallback(async (year, month) => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/appointments${qs({ year, month, limit: 200 })}`);
      const grouped = {};
      (data.appointments ?? []).forEach(a => {
        const day = parseInt((a.date ?? "").split("-")[2] ?? "0");
        if (!day) return;
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(toUiAppt(a));
      });
      setByDay(grouped);
      if (data.stats) setStats(data.stats);
    } catch {
      setByDay({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(viewYear, viewMonth);
  }, [viewYear, viewMonth, fetchAppointments]);

  const handlePrev = useCallback(() => {
    setViewMonth(m => { if (m === 1) { setViewYear(y => y - 1); return 12; } return m - 1; });
    setSelectedDay(null);
  }, []);

  const handleNext = useCallback(() => {
    setViewMonth(m => { if (m === 12) { setViewYear(y => y + 1); return 1; } return m + 1; });
    setSelectedDay(null);
  }, []);

  const handleDaySelect = useCallback((day) => {
    setSelectedDay(prev => prev === day ? null : day);
  }, []);

  const dayAppointments = useMemo(
    () => selectedDay ? (byDay[selectedDay] ?? []) : [],
    [selectedDay, byDay],
  );

  const isInitial = loading && Object.keys(byDay).length === 0;

  return (
    <div className="space-y-5">
      {isInitial ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkStatCard key={i} />)}
        </div>
      ) : (
        <StatCards stats={stats} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5">
          {isInitial ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <div className="w-24 h-4 rounded-lg bg-on-surface/8 animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-on-surface/8 animate-pulse" />
                  <div className="w-7 h-7 rounded-lg bg-on-surface/8 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-on-surface/8 animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <CalendarView
              viewYear={viewYear}
              viewMonth={viewMonth}
              selectedDay={selectedDay}
              onDaySelect={handleDaySelect}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </div>
        <div className="lg:col-span-7">
          {isInitial ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-xl bg-on-surface/8 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-on-surface/8 animate-pulse" />
                    <div className="h-2.5 w-24 rounded bg-on-surface/8 animate-pulse" />
                  </div>
                  <div className="w-16 h-5 rounded-full bg-on-surface/8 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <DaySchedule
              appointments={dayAppointments}
              selectedDay={selectedDay}
              viewMonth={viewMonth}
              viewYear={viewYear}
            />
          )}
        </div>
      </div>
    </div>
  );
}
