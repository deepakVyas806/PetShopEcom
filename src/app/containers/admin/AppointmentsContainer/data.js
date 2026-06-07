import { fmt } from "@/lib/currency";

export const CALENDAR_TODAY = { year: 2026, month: 6, day: 7 };

const GROOMERS = [
  "Dr. Priya Sharma",
  "Rahul Mehta",
  "Anita Joshi",
  "Dr. Suresh Kumar",
  "Deepika Nair",
];

export const STATUS_META = {
  confirmed: { label: "Confirmed", bg: "bg-primary/10",   text: "text-primary",     dot: "bg-primary",     stripe: "bg-primary"     },
  pending:   { label: "Pending",   bg: "bg-amber-50",     text: "text-amber-600",   dot: "bg-amber-400",   stripe: "bg-amber-400"   },
  completed: { label: "Completed", bg: "bg-emerald-50",   text: "text-emerald-700", dot: "bg-emerald-500", stripe: "bg-emerald-500" },
  cancelled: { label: "Cancelled", bg: "bg-error/10",     text: "text-error",       dot: "bg-error",       stripe: "bg-error"       },
};

const RAW = [
  // Days 1-6: completed
  { id:"APT-001", day:1,  time:"10:00", customer:"Meera Nair",     initials:"MN", pet:"Buddy",    petType:"Dog", service:"Grooming",         serviceIcon:"groom",    gi:0, dur:60, amt:12, status:"completed" },
  { id:"APT-002", day:1,  time:"11:30", customer:"Arun Sharma",    initials:"AS", pet:"Whiskers", petType:"Cat", service:"Vet Checkup",      serviceIcon:"vet",      gi:3, dur:30, amt:18, status:"completed" },
  { id:"APT-003", day:1,  time:"14:00", customer:"Priya Patel",    initials:"PP", pet:"Max",      petType:"Dog", service:"Bath & Brush",     serviceIcon:"paw",      gi:1, dur:45, amt:8,  status:"completed" },
  { id:"APT-004", day:2,  time:"09:30", customer:"Rohan Das",      initials:"RD", pet:"Luna",     petType:"Cat", service:"Dental Care",      serviceIcon:"medical",  gi:3, dur:40, amt:15, status:"completed" },
  { id:"APT-005", day:3,  time:"11:00", customer:"Sneha Joshi",    initials:"SJ", pet:"Charlie",  petType:"Dog", service:"Training Session", serviceIcon:"training", gi:2, dur:90, amt:20, status:"completed" },
  { id:"APT-006", day:4,  time:"10:30", customer:"Kavya Reddy",    initials:"KR", pet:"Mochi",    petType:"Cat", service:"Grooming",         serviceIcon:"groom",    gi:0, dur:60, amt:12, status:"completed" },
  { id:"APT-007", day:5,  time:"09:00", customer:"Ananya Rao",     initials:"AR", pet:"Simba",    petType:"Dog", service:"Vet Checkup",      serviceIcon:"vet",      gi:3, dur:30, amt:18, status:"completed" },
  { id:"APT-008", day:5,  time:"15:00", customer:"Vikas Singh",    initials:"VS", pet:"Bruno",    petType:"Dog", service:"Nail Trimming",    serviceIcon:"groom",    gi:4, dur:20, amt:5,  status:"completed" },
  { id:"APT-009", day:6,  time:"11:00", customer:"Deepak Iyer",    initials:"DI", pet:"Coco",     petType:"Cat", service:"Bath & Brush",     serviceIcon:"paw",      gi:1, dur:45, amt:8,  status:"completed" },
  { id:"APT-010", day:6,  time:"14:30", customer:"Riya Verma",     initials:"RV", pet:"Rocky",    petType:"Dog", service:"Grooming",         serviceIcon:"groom",    gi:0, dur:60, amt:12, status:"completed" },
  // Day 7 (today): mix
  { id:"APT-011", day:7,  time:"09:00", customer:"Arjun Mehta",    initials:"AM", pet:"Lily",     petType:"Cat", service:"Dental Care",      serviceIcon:"medical",  gi:3, dur:40, amt:15, status:"confirmed" },
  { id:"APT-012", day:7,  time:"10:30", customer:"Sonal Kapoor",   initials:"SK", pet:"Oscar",    petType:"Dog", service:"Grooming",         serviceIcon:"groom",    gi:0, dur:60, amt:12, status:"confirmed" },
  { id:"APT-013", day:7,  time:"12:00", customer:"Nikhil Rao",     initials:"NR", pet:"Bella",    petType:"Dog", service:"Bath & Brush",     serviceIcon:"paw",      gi:1, dur:45, amt:8,  status:"pending"   },
  { id:"APT-014", day:7,  time:"14:00", customer:"Pooja Singh",    initials:"PS", pet:"Tiger",    petType:"Dog", service:"Training Session", serviceIcon:"training", gi:2, dur:90, amt:20, status:"confirmed" },
  { id:"APT-015", day:7,  time:"16:00", customer:"Rahul Khanna",   initials:"RK", pet:"Milo",     petType:"Dog", service:"Vet Checkup",      serviceIcon:"vet",      gi:3, dur:30, amt:18, status:"pending"   },
  // Upcoming
  { id:"APT-016", day:8,  time:"10:00", customer:"Ritika Bhatt",   initials:"RB", pet:"Fluffy",   petType:"Cat", service:"Grooming",         serviceIcon:"groom",    gi:4, dur:60, amt:10, status:"confirmed" },
  { id:"APT-017", day:8,  time:"13:00", customer:"Aditya Kumar",   initials:"AK", pet:"Max",      petType:"Dog", service:"Nail Trimming",    serviceIcon:"groom",    gi:4, dur:20, amt:5,  status:"confirmed" },
  { id:"APT-018", day:9,  time:"11:30", customer:"Sheetal Menon",  initials:"SM", pet:"Zara",     petType:"Cat", service:"Vet Checkup",      serviceIcon:"vet",      gi:3, dur:30, amt:18, status:"pending"   },
  { id:"APT-019", day:10, time:"09:00", customer:"Vinay Pillai",   initials:"VP", pet:"Shadow",   petType:"Dog", service:"Grooming",         serviceIcon:"groom",    gi:0, dur:60, amt:12, status:"confirmed" },
  { id:"APT-020", day:10, time:"14:00", customer:"Deepa Nambiar",  initials:"DN", pet:"Oreo",     petType:"Cat", service:"Bath & Brush",     serviceIcon:"paw",      gi:1, dur:45, amt:8,  status:"confirmed" },
  { id:"APT-021", day:12, time:"10:00", customer:"Amit Gupta",     initials:"AG", pet:"Rex",      petType:"Dog", service:"Training Session", serviceIcon:"training", gi:2, dur:90, amt:20, status:"pending"   },
  { id:"APT-022", day:14, time:"11:00", customer:"Leela Krishnan", initials:"LK", pet:"Pearl",    petType:"Cat", service:"Dental Care",      serviceIcon:"medical",  gi:3, dur:40, amt:15, status:"confirmed" },
  { id:"APT-023", day:15, time:"09:30", customer:"Suresh Pillai",  initials:"SP", pet:"Brownie",  petType:"Dog", service:"Grooming",         serviceIcon:"groom",    gi:0, dur:60, amt:12, status:"confirmed" },
  { id:"APT-024", day:15, time:"15:00", customer:"Kiran Jain",     initials:"KJ", pet:"Whisky",   petType:"Dog", service:"Vet Checkup",      serviceIcon:"vet",      gi:3, dur:30, amt:18, status:"pending"   },
  { id:"APT-025", day:18, time:"10:30", customer:"Meena Sharma",   initials:"MS", pet:"Ginger",   petType:"Cat", service:"Nail Trimming",    serviceIcon:"groom",    gi:4, dur:20, amt:5,  status:"confirmed" },
  { id:"APT-026", day:20, time:"11:00", customer:"Tarun Verma",    initials:"TV", pet:"Spike",    petType:"Dog", service:"Bath & Brush",     serviceIcon:"paw",      gi:1, dur:45, amt:8,  status:"confirmed" },
  { id:"APT-027", day:22, time:"14:00", customer:"Anjali Patel",   initials:"AP", pet:"Cookie",   petType:"Cat", service:"Grooming",         serviceIcon:"groom",    gi:0, dur:60, amt:10, status:"pending"   },
  { id:"APT-028", day:25, time:"09:00", customer:"Ravi Shankar",   initials:"RS", pet:"Duke",     petType:"Dog", service:"Training Session", serviceIcon:"training", gi:2, dur:90, amt:20, status:"pending"   },
  { id:"APT-029", day:28, time:"11:30", customer:"Nisha Reddy",    initials:"NR", pet:"Snowball", petType:"Cat", service:"Vet Checkup",      serviceIcon:"vet",      gi:3, dur:30, amt:18, status:"pending"   },
  { id:"APT-030", day:30, time:"10:00", customer:"Prakash Nair",   initials:"PN", pet:"Rusty",    petType:"Dog", service:"Grooming",         serviceIcon:"groom",    gi:0, dur:60, amt:12, status:"pending"   },
];

export const APPOINTMENTS = RAW.map((a) => ({
  ...a,
  groomer:    GROOMERS[a.gi],
  amount:     fmt(a.amt),
  statusMeta: STATUS_META[a.status],
}));

export const BY_DAY = APPOINTMENTS.reduce((acc, a) => {
  (acc[a.day] = acc[a.day] || []).push(a);
  return acc;
}, {});

const completed = APPOINTMENTS.filter((a) => a.status === "completed");
export const STATS = {
  todayCount:     APPOINTMENTS.filter((a) => a.day === CALENDAR_TODAY.day).length,
  monthCount:     APPOINTMENTS.length,
  pendingCount:   APPOINTMENTS.filter((a) => a.status === "pending").length,
  revenue:        fmt(completed.reduce((s, a) => s + a.amt, 0)),
};
