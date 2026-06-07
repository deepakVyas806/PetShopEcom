"use client";
import { memo, useMemo } from "react";
import { IconChevronLeft, IconChevronRight } from "@/lib/icons";
import { BY_DAY, STATUS_META, CALENDAR_TODAY } from "../data";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

// Tomohiko Sakamoto algorithm — returns 0=Mon … 6=Sun (European layout)
function firstDayOffset(year, month) {
  const t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  let y = year;
  if (month < 3) y--;
  const dow = (y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + t[month - 1] + 1) % 7;
  return (dow + 6) % 7; // 0=Mon
}

function daysInMonth(year, month) {
  const d = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) return 29;
  return d[month];
}

function getDots(day, year, month) {
  const isData = year === CALENDAR_TODAY.year && month === CALENDAR_TODAY.month;
  if (!isData) return [];
  const apts = BY_DAY[day] || [];
  const seen = new Set();
  const dots = [];
  for (const a of apts) {
    if (!seen.has(a.status)) { seen.add(a.status); dots.push(STATUS_META[a.status].dot); }
    if (dots.length >= 3) break;
  }
  return dots;
}

export default memo(function CalendarView({ viewYear, viewMonth, selectedDay, onDaySelect, onPrev, onNext }) {
  const { offset, days } = useMemo(
    () => ({ offset: firstDayOffset(viewYear, viewMonth), days: daysInMonth(viewYear, viewMonth) }),
    [viewYear, viewMonth],
  );
  const totalCells = Math.ceil((days + offset) / 7) * 7;
  const isCurrentData = viewYear === CALENDAR_TODAY.year && viewMonth === CALENDAR_TODAY.month;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
        <button
          onClick={onPrev}
          className="w-7 h-7 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer bg-transparent border-none"
        >
          <IconChevronLeft size={13} weight="bold" />
        </button>
        <span className="text-xs font-bold text-on-surface">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button
          onClick={onNext}
          className="w-7 h-7 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer bg-transparent border-none"
        >
          <IconChevronRight size={13} weight="bold" />
        </button>
      </div>

      <div className="p-3">
        {/* Week-day headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEK_DAYS.map((d) => (
            <p key={d} className="text-center text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider py-1">
              {d}
            </p>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-px">
          {Array.from({ length: totalCells }, (_, i) => {
            const day = i - offset + 1;
            const valid = day >= 1 && day <= days;
            if (!valid) return <div key={i} className="aspect-square" />;

            const isToday  = isCurrentData && day === CALENDAR_TODAY.day;
            const isSel    = isCurrentData && day === selectedDay;
            const dots     = getDots(day, viewYear, viewMonth);
            const hasApts  = dots.length > 0;

            return (
              <button
                key={i}
                onClick={() => isCurrentData && onDaySelect(day)}
                className={[
                  "aspect-square flex flex-col items-center justify-center rounded-xl text-[11px] font-semibold transition-all border-none",
                  isCurrentData ? "cursor-pointer" : "cursor-default",
                  isSel
                    ? "bg-primary text-on-primary shadow-sm"
                    : isToday
                    ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                    : hasApts
                    ? "text-on-surface hover:bg-surface-container-high"
                    : "text-on-surface-variant/40 hover:bg-surface-container-high",
                ].join(" ")}
              >
                <span className="leading-none">{day}</span>
                {/* Status dots */}
                {dots.length > 0 && (
                  <div className="flex gap-[2px] mt-[2px]">
                    {dots.map((cls, di) => (
                      <span
                        key={di}
                        className={`w-[3px] h-[3px] rounded-full ${isSel ? "bg-white/70" : cls}`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 pt-1 border-t border-outline-variant/10 flex items-center gap-4 flex-wrap">
        {Object.entries(STATUS_META).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <span className="text-[9px] text-on-surface-variant">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
