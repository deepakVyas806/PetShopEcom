"use client";

import { useState, useMemo } from "react";

const SERVICES_MAP = {
  "1": {
    title: "Signature ArtGrooming", duration: "90 - 120 mins", price: 85.00, category: "Grooming",
    description: "A complete spa experience including deep conditioning, artistic styling, nail buffing, and ear cleaning. Perfect for all breeds.",
    petTypes: "Dogs & Cats", includes: "Bath, trim, nail buff, ear clean",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGTBSh2BJuvp2Hf8shV8z9MmZQ4UXQ3vSscx9jDsQwr4oh6SYowH7gRQL9JMLUs67yhcmXcaZWzk-8Dzp0_9rAUf1zwSoUqxriilz9ApTenm5tUXuBL0Tbu1wzxht7bchGoUTZnz8baG9jOLffisNQlhl-CtRG1yzEG8BppZh7uS_W4yEWEWs5-LFmvSgFN7R5lKiDLGPwJtuM_klM1zqRGPpHAZQTFo9VGIYaBXeYnHEK96NmQfLNLYGB24p6Qziqee7d_ilVfDDt",
  },
  "2": {
    title: "Wellness Examination", duration: "30 - 45 mins", price: 65.00, category: "Veterinary",
    description: "Comprehensive nose-to-tail checkup to ensure your pet's long-term health. Includes weight check and nutrition consultation.",
    petTypes: "Dogs, Cats & Small Pets", includes: "Physical exam, dental & nutrition check",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASnOgWLzTExTa05mipWT_nBphSAyrrh0Q2a12yqAJ3v1dikOu88YbR9oQ0UTg7rCIdjVAX7eRRbfwuTmiBZnXFVkPO1VdLF9DdUPxKMrTSIOWfjmlbOYFMrWtxbVrFN1DZV5X9FXzmzrdKArIsRSuOCxS-0VofPkWbB3go5J-jZvbuunUYHJqLQ3WjEU1-lTc2CZOniKzHzgdvlYPhH1abH29HAlkea5WQx21KZV-Jwp_S0DIkU8HnNexbVHVvI-62uJ4Q_FNG1ZNx",
  },
  "3": {
    title: "Positive Puppy Training", duration: "60 mins", price: 120.00, category: "Training",
    description: "Individualized behavior training focusing on core commands and social skills using modern positive reinforcement techniques.",
    petTypes: "Dogs", includes: "Commands, leash manners, socialisation",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOefR9ENF5BF2BaZqOIfGnaYX0cqA8nNAFjYl6oRV_ezlRQAFjx2yYxQJsFTdTNjnp1TRkxvc4c640bhBlS1PHJX9qi3WtusFqUr3jU215FL_WXfAYTyHNEuzrF_y70NpNWc43HMg5yCcCvsNOQvVmYvXwlV7LtrOq8DmdVwc8ev1JDd1AZfz-SwTbAg_WP8fCc60NUi0yovya69QzQM9EFzoriWWAbPSVFC1tI-Vg1h-rWZvERUcrUgaq24KIBH6xChZyazRBgaKL",
  },
  "4": {
    title: "Luxury Overnight Sitting", duration: "Per Night", price: 95.00, category: "Pet Sitting",
    description: "In-home pet care that maintains your pet's routine. Includes feeding, walking, and lots of personalized affection.",
    petTypes: "Dogs, Cats & Small Pets", includes: "Feeding, walks, photo updates, playtime",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaT68dKQ3-hPoL2eNGD0m2XSDWAwNDQ1q5arCEOskYCqyoxRStPAV-b_b2rQi7cZ-nl_9XG0rG3PnKzFY5cvMqOXGG_981a0DSY2YicBAvsMKwIW4moLNxfYmzMFTzCoBpIhPefmEI2jJ5eaBo1oTmihva5HAm0Vjv6gb4ss1PbsZ4ReZ645ecdn8z0aQo0VNVHe81IAMCmkkmCLddN9CfLZ6F2tGIVoXbbaLCdve4RzVUqD5AFgbFaNkZGS8iL4D5WHNA7iul_T8T",
  },
};

const DEFAULT_SERVICE = SERVICES_MAP["1"];

export const TIME_SLOTS = {
  morning:   { icon: "wb_sunny",  label: "Morning",   slots: ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM"] },
  afternoon: { icon: "light_mode", label: "Afternoon", slots: ["01:00 PM", "02:30 PM", "03:00 PM", "04:30 PM"] },
  evening:   { icon: "bedtime",   label: "Evening",   slots: ["06:00 PM", "07:00 PM"] },
};

// Slots that are already booked / unavailable
const UNAVAILABLE = new Set(["03:00 PM"]);

export default function useBookAppointment(serviceId) {
  const service = SERVICES_MAP[serviceId] || DEFAULT_SERVICE;

  const todayRaw = new Date();
  todayRaw.setHours(0, 0, 0, 0);
  const today = todayRaw;

  const [viewDate, setViewDate]     = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthLabel     = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth    = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isDisabled = (day) => new Date(year, month, day) < today;

  const isSelected = (day) =>
    !!selectedDate &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month &&
    selectedDate.getDate() === day;

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

  const isSlotUnavailable = (slot) => UNAVAILABLE.has(slot);

  return {
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
    selectedDate,
    selectedDateLabel,
    selectedTime,
    setSelectedTime,
    isSlotUnavailable,
  };
}
