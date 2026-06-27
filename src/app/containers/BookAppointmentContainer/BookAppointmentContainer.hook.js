"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export const TIME_SLOTS = {
  morning:   { icon: "wb_sunny",   label: "Morning",   slots: ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM"] },
  afternoon: { icon: "light_mode", label: "Afternoon", slots: ["01:00 PM", "02:30 PM", "03:00 PM", "04:30 PM"] },
  evening:   { icon: "bedtime",    label: "Evening",   slots: ["06:00 PM", "07:00 PM"] },
};

export default function useBookAppointment(serviceId) {
  const router = useRouter();

  const [service,         setService]         = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [booked,          setBooked]          = useState(false);
  const [error,           setError]           = useState(null);
  const [serviceOffers,   setServiceOffers]   = useState([]);

  useEffect(() => {
    if (!serviceId) return;
    api.get(`/services/${serviceId}`)
      .then(d => setService(d.service))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [serviceId]);

  // Fetch service-scoped offers once serviceId is known
  useEffect(() => {
    if (!serviceId) return;
    api.get(`/coupons/applicable?serviceId=${serviceId}`)
      .then(d => setServiceOffers(d.coupons ?? []))
      .catch(() => {});
  }, [serviceId]);

  const todayRaw = new Date();
  todayRaw.setHours(0, 0, 0, 0);
  const today = todayRaw;

  const [viewDate,      setViewDate]      = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate,  setSelectedDate]  = useState(null);
  const [selectedTime,  setSelectedTime]  = useState(null);
  const [petName,       setPetName]       = useState("");
  const [submitting,    setSubmitting]    = useState(false);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthLabel     = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth    = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isDisabled = (day) => new Date(year, month, day) < today;
  const isSelected = (day) =>
    !!selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;
  const isToday = (day) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const selectDate = (day) => {
    if (isDisabled(day)) return;
    setSelectedDate(new Date(year, month, day));
    setSelectedTime(null);
  };

  const selectedDateLabel = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !serviceId) return;
    setSubmitting(true);
    setError(null);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      await api.post("/appointments", {
        serviceId,
        date:     dateStr,
        timeSlot: selectedTime,
        petName:  petName || undefined,
      });
      setBooked(true);
      // Navigate to checkout or confirmation
      const params = new URLSearchParams({ type: "service", serviceId, date: dateStr, time: selectedTime });
      router.push(`/checkout?${params}`);
    } catch (err) {
      setError(err.message ?? "Booking failed. Please try another slot.");
    } finally {
      setSubmitting(false);
    }
  };

  // Slots unavailable — ideally fetched per day from API; placeholder set for now
  const isSlotUnavailable = () => false;

  return {
    service, loading,
    monthLabel, firstDayOffset, daysInMonth,
    prevMonth, nextMonth,
    isDisabled, isSelected, isToday, selectDate,
    selectedDate, selectedDateLabel,
    selectedTime, setSelectedTime,
    petName, setPetName,
    isSlotUnavailable,
    booked, error, submitting, handleBook,
    serviceOffers,
  };
}
