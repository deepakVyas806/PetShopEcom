import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

const STATS = [
  { icon: "calendar_today", iconBg: "bg-primary-container",   iconClr: "text-on-primary-container",   label: "Next Session",    value: "—" },
  { icon: "pets",           iconBg: "bg-secondary-container", iconClr: "text-on-secondary-container", label: "Active Pets",     value: "—" },
  { icon: "workspace_premium", iconBg: "bg-tertiary-container", iconClr: "text-on-tertiary-container", label: "Loyalty Points", value: "—" },
];

export default function useAppointmentsContainer() {
  const [upcoming, setUpcoming] = useState([]);
  const [past,     setPast]     = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get("/appointments");
      setUpcoming(data.upcoming ?? []);
      setPast(data.past ?? []);
    } catch {
      setUpcoming([]); setPast([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch { /* toast error */ }
  };

  // Build dynamic stats from data
  const nextUpcoming = upcoming[0];
  const stats = [
    { ...STATS[0], value: nextUpcoming ? `${nextUpcoming.date} ${nextUpcoming.timeSlot}` : "None scheduled" },
    { ...STATS[1], value: `${upcoming.length} scheduled` },
    { ...STATS[2], value: `${past.filter(a => a.status === "Completed").length * 100} pts` },
  ];

  return { upcoming, past, stats, loading, handleCancel };
}
