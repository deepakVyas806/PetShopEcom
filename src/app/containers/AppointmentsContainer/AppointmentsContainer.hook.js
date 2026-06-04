import { useMemo } from "react";

export const APPOINTMENTS = [
  {
    id:             "a1",
    petName:        "Luna",
    petImage:       "https://lh3.googleusercontent.com/aida-public/AB6AXuCLiKwJbTbZtRaHlvly8VINNv96Jga9jUDB3sRbFIvdECURJFUdw9WawZ0fHBNanjSrarW-g-GVNYLgTOJspVrk1ARZtKSlX08n2kCNqF05YYDnQAjtB4I7wlLRhC_4b-IUAErPJQ5ezgMNaAoFVgYyPIg6Sixtv_EqAFiumbITAul49EBplQaaIr8xZf3F8G-BU3y7_mZwW58c9Ir-_EFzZybLpfprge0BqPhYoXfXV-FFVtGCizh9r70V78UCiQhdEihdSH4eQ7f8",
    service:        "Signature ArtGrooming & Spa",
    serviceIcon:    "content_cut",
    serviceIconBg:  "bg-primary-container",
    serviceIconClr: "text-on-primary-container",
    date:           "Oct 24, 2024",
    time:           "10:00 AM",
    status:         "upcoming",
  },
  {
    id:             "a2",
    petName:        "Max",
    petImage:       "https://lh3.googleusercontent.com/aida-public/AB6AXuD702cnMlDlQWfnMT45tbj3aE6m8fQUEYq2vGeK5KMbByG12jtkHB5pEHks6G3EWp-9cpiM9uOeUJmSq4LATlkbz999RyZ7Jxty0YhledPueRoR9l7zSAjfWFxf_Br_ou-XZuYE-1xMZvuAdpPTmp8aQbcAX072mVieOhInoJunavCZ9lt9DwPS2DWrPzhZt6Dk_dYyGgm7ZwyStnOCmSeutljUkRLEiQ1xrZ3qerEsMpZEaPoA2dfzyGVcobYa11hLCCfLrbNqmEdX",
    service:        "Advanced Obedience Daycare",
    serviceIcon:    "school",
    serviceIconBg:  "bg-secondary-container",
    serviceIconClr: "text-on-secondary-container",
    date:           "Oct 27, 2024",
    time:           "08:30 AM",
    status:         "upcoming",
  },
  {
    id:             "a3",
    petName:        "Bella",
    petImage:       "https://lh3.googleusercontent.com/aida-public/AB6AXuCBW5ho3Vpnp8rMIxyy9a9ITfg1jCgF7TZHDlJ_IyshEzDKQ55hsMskLHBHOIYODpIC0uSMWid0Na6g-V2bQma7kg-UET30IzcD9vDuRDkCh7-gC6_0LZrxvvy63HgZUuTWiPSxygyOuPmjlUxaE-PUlJogvBJvw8w0XD9ARR7AEcyoBB7x9ohK-g-C91gadsDOrD2WAmOW2vPzujCm343MiD2OWgSEeOJAyPRWomQQ57ebzDWlCiBsIdeSAw2Qp6pyTKZHikPYovqv",
    service:        "Wellness Check-up",
    serviceIcon:    "medical_services",
    serviceIconBg:  "bg-tertiary-container",
    serviceIconClr: "text-on-tertiary-container",
    date:           "Oct 12, 2024",
    time:           "02:00 PM",
    status:         "completed",
  },
  {
    id:             "a4",
    petName:        "Luna",
    petImage:       "https://lh3.googleusercontent.com/aida-public/AB6AXuD5KPSNVt_lOeYqGt7O8EWgHvlgGdUIbEz0rDTm-L8S3GoOPrEGCnggm2ROXHFuiIC573JIR3KrrV7QPapWh085rKx7bEefjxyKB5KxkJYoK9tvAeXwMFPi5ElSPS8eoho2f-4ZDadWuzQs81K3dzNuBxtqLux03k6wBscqSxg67VupJ7qgMac9o7UFii7EkDCKc7qqN_mSIqONJbzz8tGuIF1qbhPGfx7-LyB5MJdD3Ndj2UTeVHnVljV-o0Lb1OhiKo_m8n1RRz6U",
    service:        "Nail Trim & Paw Balm",
    serviceIcon:    "content_cut",
    serviceIconBg:  "bg-surface-container",
    serviceIconClr: "text-on-surface-variant",
    date:           "Oct 05, 2024",
    time:           "11:30 AM",
    status:         "cancelled",
  },
];

const STATS = [
  {
    icon:    "calendar_today",
    iconBg:  "bg-primary-container",
    iconClr: "text-on-primary-container",
    label:   "Next Session",
    value:   "Tomorrow, 10 AM",
  },
  {
    icon:    "pets",
    iconBg:  "bg-secondary-container",
    iconClr: "text-on-secondary-container",
    label:   "Active Pets",
    value:   "3 Scheduled",
  },
  {
    icon:    "workspace_premium",
    iconBg:  "bg-tertiary-container",
    iconClr: "text-on-tertiary-container",
    label:   "Loyalty Points",
    value:   "1,240 pts",
  },
];

export default function useAppointmentsContainer() {
  const upcoming = useMemo(
    () => APPOINTMENTS.filter((a) => a.status === "upcoming"),
    []
  );
  const past = useMemo(
    () => APPOINTMENTS.filter((a) => a.status !== "upcoming"),
    []
  );

  return { upcoming, past, stats: STATS };
}
