"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import useBookAppointment, { TIME_SLOTS } from "./BookAppointmentContainer.hook";
import { fmt } from "@/lib/currency";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function BookAppointmentContainer() {
  const params = useSearchParams();
  const router = useRouter();
  const serviceId = params.get("serviceId") || "1";

  const {
    service,
    monthLabel,
    firstDayOffset,
    daysInMonth,
    prevMonth,
    nextMonth,
    isDisabled,
    isSelected,
    isToday,
    selectDate,
    selectedDateLabel,
    selectedTime,
    setSelectedTime,
    isSlotUnavailable,
  } = useBookAppointment(serviceId);

  return (
    <div className="w-full bg-background text-on-background min-h-screen">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4">

        <div className="mb-4">
          <h1 className="text-sm font-bold text-on-surface">Schedule Your Appointment</h1>
          <p className="text-xs text-on-surface-variant">Pick a date and time that works for you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

          {/* Left: Calendar + Time Slots */}
          <div className="lg:col-span-8 space-y-6">

            {/* Calendar */}
            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-sm font-bold text-on-surface">Select Date</h1>
                  <p className="text-xs text-on-surface-variant">When would you like to visit us?</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-secondary-container/30 transition-colors cursor-pointer border-none outline-none">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <span className="text-sm font-bold text-on-surface min-w-[130px] text-center">{monthLabel}</span>
                  <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-secondary-container/30 transition-colors cursor-pointer border-none outline-none">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 gap-0.5 text-center mb-4">
                {DAY_LABELS.map((d) => (
                  <div key={d} className="text-[10px] font-bold text-on-surface-variant py-1">{d}</div>
                ))}

                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const disabled = isDisabled(day);
                  const selected = isSelected(day);
                  const todayDay = isToday(day);
                  return (
                    <div key={day} className="flex items-center justify-center py-0.5">
                      <button
                        onClick={() => selectDate(day)}
                        disabled={disabled}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-all cursor-pointer border-none outline-none flex flex-col items-center justify-center relative ${
                          selected
                            ? "bg-primary text-white font-bold shadow-sm"
                            : disabled
                            ? "text-outline opacity-30 cursor-not-allowed"
                            : "hover:bg-primary/10 text-on-surface"
                        }`}
                      >
                        {day}
                        {todayDay && !selected && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-error rounded-full" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-5 pt-3 border-t border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs text-on-surface-variant">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-error" />
                  <span className="text-xs text-on-surface-variant">Today</span>
                </div>
              </div>
            </section>

            {/* Time Slots */}
            <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-3 shadow-sm">
              <h2 className="text-sm font-bold text-on-surface mb-3">Available Time Slots</h2>
              <div className="space-y-4">
                {Object.entries(TIME_SLOTS).map(([key, group]) => (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-primary text-base">{group.icon}</span>
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{group.label}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {group.slots.map((slot) => {
                        const unavailable = isSlotUnavailable(slot);
                        const active = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            disabled={unavailable}
                            onClick={() => !unavailable && setSelectedTime(slot)}
                            className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer border outline-none ${
                              unavailable
                                ? "opacity-40 bg-surface-container-high border-outline-variant cursor-not-allowed"
                                : active
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "border-outline-variant text-on-surface hover:border-primary hover:bg-primary/5"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Booking Summary */}
          <aside className="lg:col-span-4 sticky top-24">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-lg">
              <div className="p-5 bg-primary text-white">
                <h2 className="text-sm font-bold">Booking Summary</h2>
              </div>

              <div className="p-5 space-y-4">
                {/* Service image + title */}
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high overflow-hidden flex-shrink-0">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-on-surface leading-tight">{service.title}</h3>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{service.category}</span>
                    <p className="text-xs text-primary font-bold mt-1">{service.duration} · {fmt(service.price)}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant leading-relaxed">{service.description}</p>

                <div className="h-px bg-outline-variant/30" />

                {/* Details grid */}
                <div className="space-y-2">
                  {[
                    ["Pet Types", service.petTypes],
                    ["What's Included", service.includes],
                    ["Location", "artPetShop Studio"],
                    ["Cancellation", "Free up to 24h before"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-2">
                      <span className="text-[10px] text-on-surface-variant shrink-0">{label}</span>
                      <span className="text-[10px] font-semibold text-on-surface text-right">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-outline-variant/30" />

                {/* Schedule */}
                <div className="bg-surface-container rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Date</span>
                    <span className="text-xs font-semibold text-on-surface">{selectedDateLabel || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">Time</span>
                    <span className="text-xs font-semibold text-on-surface">{selectedTime || "—"}</span>
                  </div>
                </div>

                <div className="h-px bg-outline-variant/30" />

                {/* Total */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-on-surface font-medium">Service Total</span>
                    <span className="text-sm font-extrabold text-on-surface">{fmt(service.price)}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant">Excl. taxes and optional gratuity</p>
                </div>

                {/* Proceed to Checkout */}
                <button
                  disabled={!selectedDateLabel || !selectedTime}
                  onClick={() => {
                    if (!selectedDateLabel || !selectedTime) return;
                    router.push(
                      `/checkout?type=service&serviceId=${serviceId}&date=${encodeURIComponent(selectedDateLabel)}&time=${encodeURIComponent(selectedTime)}`
                    );
                  }}
                  className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow-md hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer border-none outline-none flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
