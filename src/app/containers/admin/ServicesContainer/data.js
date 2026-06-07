import { fmt } from "@/lib/currency";

// ── Filter / display categories (list page) ──────────────────────────────────
export const SERVICE_CATEGORIES = ["All", "Spa", "Training", "Health", "Daycare"];

// ── Form categories (create / edit page) ─────────────────────────────────────
export const FORM_CATEGORIES = ["Spa", "Training", "Health", "Daycare", "Boarding", "Walking"];

export const CATEGORY_STYLES = {
  Spa:      { bg: "bg-tertiary-fixed",            text: "text-on-tertiary-fixed" },
  Training: { bg: "bg-primary-fixed",             text: "text-on-primary-fixed" },
  Health:   { bg: "bg-secondary-fixed",           text: "text-on-secondary-fixed" },
  Daycare:  { bg: "bg-surface-container-highest", text: "text-on-surface-variant" },
  Boarding: { bg: "bg-surface-container-high",    text: "text-on-surface-variant" },
  Walking:  { bg: "bg-surface-container",         text: "text-on-surface-variant" },
};

export const AVAILABILITY_OPTS = {
  instant:     { dot: "bg-green-500",  label: "Instant Book"   },
  waitlist:    { dot: "bg-orange-500", label: "Waitlist Only"  },
  unavailable: { dot: "bg-gray-400",   label: "Unavailable"    },
};

// ── Form select options ───────────────────────────────────────────────────────
export const TARGET_PETS = ["Dogs", "Cats", "Small Animals", "Birds", "Reptiles", "All Pets"];

export const DURATION_OPTS = [
  "30 min", "45 min", "60 min", "90 min", "120 min",
  "3 hr", "4 hr", "Full Day (8 hr)", "2 Days", "Weekly",
];

export const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

export const SERVICE_TAG_SUGGESTIONS = [
  "dogs", "cats", "premium", "grooming", "wellness",
  "puppy", "senior", "all-pets", "training", "boarding", "luxury", "spa",
];

// ── Mock services ─────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: "SRV-001",
    name: "Full Spa Grooming",
    subtitle: "Standard breeds",
    category: "Spa",
    targetPets: "Dogs",
    description: "A full-body spa treatment including bath, blow-dry, nail trim, ear clean, and a finishing spritz of pet-safe cologne. Our groomers are certified and use only premium, hypoallergenic products.",
    priceRaw: 7500,
    price: fmt(7500),
    duration: "90 min",
    capacity: 4,
    availability: "instant",
    featured: true,
    active: true,
    visibility: "public",
    tags: ["dogs", "premium", "spa"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNXxF1no6gVkbfmlrwZDew3O-L44H_1T8fIYZm4856DNndnwunJrX8f_71OY6_TIg-7i4pS4I5GgPawGo9EZypFrPD0hczM4Px94zqJNkfQl4DHVClysdS3fGZKMrUdqUn47H8GyWnpPpT7kZZRZXNwGCr1lrUyiS3mW_VWujLuHk0lE3_uw5HOeuigQOUieI2DmMDhy8tBUBOE2cb7FpONqWu6F180R20VkGKdn-LcZnu_JGaTzy_KGJyMjlDa16Np0RLJINNc0MS",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNXxF1no6gVkbfmlrwZDew3O-L44H_1T8fIYZm4856DNndnwunJrX8f_71OY6_TIg-7i4pS4I5GgPawGo9EZypFrPD0hczM4Px94zqJNkfQl4DHVClysdS3fGZKMrUdqUn47H8GyWnpPpT7kZZRZXNwGCr1lrUyiS3mW_VWujLuHk0lE3_uw5HOeuigQOUieI2DmMDhy8tBUBOE2cb7FpONqWu6F180R20VkGKdn-LcZnu_JGaTzy_KGJyMjlDa16Np0RLJINNc0MS",
      "", "", "",
    ],
    operatingHours: [
      { id: 1, day: "Monday",    start: "09:00", end: "17:00" },
      { id: 2, day: "Wednesday", start: "09:00", end: "17:00" },
      { id: 3, day: "Friday",    start: "10:00", end: "16:00" },
      { id: 4, day: "Saturday",  start: "10:00", end: "15:00" },
    ],
  },
  {
    id: "SRV-002",
    name: "Behavioral Basics",
    subtitle: "Puppy foundation",
    category: "Training",
    targetPets: "Dogs",
    description: "A structured 4-week foundation course covering sit, stay, recall, and leash manners. Suitable for puppies 8 weeks and older. Small batch classes of max 5 dogs.",
    priceRaw: 10000,
    price: fmt(10000),
    duration: "60 min",
    capacity: 5,
    availability: "waitlist",
    featured: false,
    active: true,
    visibility: "public",
    tags: ["dogs", "training", "puppy"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXE5Q6N3xA6RFJLqgMHYltAl8jJVWB3nkR9hYBlVw65wgkQCR7jbvTxx3L12DFDHNPfIkp9WCPGAIBzaotyM2tesG7qazCRz3QBPbf--iCXouwCHwNBriBuibvRhP0hryTuX5DguEAP6pSbWpZ8GgQsurOo-dkdhVjB_861mrq-u7jpNkwy4m2JHHxelnDWejJgBInO5l1ooIvZ8adPZdtB16d6lIGBxKEXAddSm9npmDX6ybbiwZ6oYakjobaqQOIYB_j3elpH76Y",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXE5Q6N3xA6RFJLqgMHYltAl8jJVWB3nkR9hYBlVw65wgkQCR7jbvTxx3L12DFDHNPfIkp9WCPGAIBzaotyM2tesG7qazCRz3QBPbf--iCXouwCHwNBriBuibvRhP0hryTuX5DguEAP6pSbWpZ8GgQsurOo-dkdhVjB_861mrq-u7jpNkwy4m2JHHxelnDWejJgBInO5l1ooIvZ8adPZdtB16d6lIGBxKEXAddSm9npmDX6ybbiwZ6oYakjobaqQOIYB_j3elpH76Y",
      "", "", "",
    ],
    operatingHours: [
      { id: 1, day: "Tuesday",  start: "10:00", end: "13:00" },
      { id: 2, day: "Thursday", start: "10:00", end: "13:00" },
    ],
  },
  {
    id: "SRV-003",
    name: "Wellness Exam",
    subtitle: "Annual check-up",
    category: "Health",
    targetPets: "All Pets",
    description: "Comprehensive annual health examination including weight check, dental scoring, coat assessment, and parasite screening. Comes with a detailed health report.",
    priceRaw: 4500,
    price: fmt(4500),
    duration: "30 min",
    capacity: 8,
    availability: "instant",
    featured: true,
    active: true,
    visibility: "public",
    tags: ["wellness", "health", "all-pets"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuByfdZvvrWWC0YIpduPKUOl2nc38rgvrEbUobk0rId016WxhaMB4u8B1ZiYfgrZEtyQeBT_2bEY83YuY6A9XKkFMFi4pYDPc5TvwS_M4TdjGkeAIypGK6x4pEg02loKqEmORulVIXLtMFGh5bugxZ0Y1yFO-Bju9EdZutgOvMR5oSZoOOV1fsiI--yIyvGqtJJmhoNoDUB-1crHTXtDI7bka7XGfbbpAsxZU0Sml4CGKb9bgKRFK81IjHiDd5L2glbztLSzjZ65Dpfn",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByfdZvvrWWC0YIpduPKUOl2nc38rgvrEbUobk0rId016WxhaMB4u8B1ZiYfgrZEtyQeBT_2bEY83YuY6A9XKkFMFi4pYDPc5TvwS_M4TdjGkeAIypGK6x4pEg02loKqEmORulVIXLtMFGh5bugxZ0Y1yFO-Bju9EdZutgOvMR5oSZoOOV1fsiI--yIyvGqtJJmhoNoDUB-1crHTXtDI7bka7XGfbbpAsxZU0Sml4CGKb9bgKRFK81IjHiDd5L2glbztLSzjZ65Dpfn",
      "", "", "",
    ],
    operatingHours: [
      { id: 1, day: "Monday",    start: "09:00", end: "18:00" },
      { id: 2, day: "Tuesday",   start: "09:00", end: "18:00" },
      { id: 3, day: "Wednesday", start: "09:00", end: "18:00" },
      { id: 4, day: "Thursday",  start: "09:00", end: "18:00" },
      { id: 5, day: "Friday",    start: "09:00", end: "17:00" },
    ],
  },
  {
    id: "SRV-004",
    name: "VIP Daycare",
    subtitle: "Daily pass",
    category: "Daycare",
    targetPets: "Dogs",
    description: "A full day of supervised play, socialization, and rest in our climate-controlled facility. Includes two meals, midday walk, and a photo update to your phone.",
    priceRaw: 3750,
    price: fmt(3750),
    duration: "Full Day (8 hr)",
    capacity: 10,
    availability: "instant",
    featured: false,
    active: true,
    visibility: "public",
    tags: ["dogs", "daycare"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwAKwzzziHxri7x558AHmwn34OYPQUpcIj4_mV3nN_iNU9gM_nIn4FsxkHD3bGXo7vnmHcn11fMAQMo0OCg6OBl23sqcfD95zDxyUCcTz0dJUPX-33l0RlMR9XWRjkp-WmPK-5nF6gKgMnz1-MYJAzR-uTgt0pcE9RTYiz223_CIQkOJ1JQZ1tk9eBDLaDjZpcqi0whmoqus-7BP-2o-_Thj-mDKDKD-Soi302J8tREsIPKRxJpdEr6umJblSGJmNLf4IPkNCYExfo",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwAKwzzziHxri7x558AHmwn34OYPQUpcIj4_mV3nN_iNU9gM_nIn4FsxkHD3bGXo7vnmHcn11fMAQMo0OCg6OBl23sqcfD95zDxyUCcTz0dJUPX-33l0RlMR9XWRjkp-WmPK-5nF6gKgMnz1-MYJAzR-uTgt0pcE9RTYiz223_CIQkOJ1JQZ1tk9eBDLaDjZpcqi0whmoqus-7BP-2o-_Thj-mDKDKD-Soi302J8tREsIPKRxJpdEr6umJblSGJmNLf4IPkNCYExfo",
      "", "", "",
    ],
    operatingHours: [
      { id: 1, day: "Monday",    start: "07:00", end: "19:00" },
      { id: 2, day: "Tuesday",   start: "07:00", end: "19:00" },
      { id: 3, day: "Wednesday", start: "07:00", end: "19:00" },
      { id: 4, day: "Thursday",  start: "07:00", end: "19:00" },
      { id: 5, day: "Friday",    start: "07:00", end: "19:00" },
    ],
  },
  {
    id: "SRV-005",
    name: "Puppy Starter Pack",
    subtitle: "8-week program",
    category: "Training",
    targetPets: "Dogs",
    description: "An 8-week foundational program designed for puppies aged 8–16 weeks. Covers bite inhibition, name recognition, socialization, and basic commands.",
    priceRaw: 18000,
    price: fmt(18000),
    duration: "45 min",
    capacity: 5,
    availability: "waitlist",
    featured: true,
    active: true,
    visibility: "public",
    tags: ["dogs", "training", "puppy", "premium"],
    image: null,
    images: ["", "", "", ""],
    operatingHours: [
      { id: 1, day: "Saturday", start: "09:00", end: "14:00" },
      { id: 2, day: "Sunday",   start: "09:00", end: "14:00" },
    ],
  },
  {
    id: "SRV-006",
    name: "Deep Clean Bath",
    subtitle: "All sizes",
    category: "Spa",
    targetPets: "All Pets",
    description: "A thorough de-shedding bath using premium shampoo and conditioner, followed by blow-dry and brush-out. Suitable for all breeds and coat types.",
    priceRaw: 3500,
    price: fmt(3500),
    duration: "60 min",
    capacity: 6,
    availability: "instant",
    featured: false,
    active: true,
    visibility: "public",
    tags: ["grooming", "spa", "all-pets"],
    image: null,
    images: ["", "", "", ""],
    operatingHours: [
      { id: 1, day: "Monday",  start: "09:00", end: "17:00" },
      { id: 2, day: "Tuesday", start: "09:00", end: "17:00" },
      { id: 3, day: "Friday",  start: "09:00", end: "17:00" },
    ],
  },
  {
    id: "SRV-007",
    name: "Dental Cleaning",
    subtitle: "Tartar & plaque removal",
    category: "Health",
    targetPets: "Dogs",
    description: "Professional dental scaling and polishing to remove plaque and tartar build-up. Helps prevent periodontal disease and bad breath. No anesthesia required.",
    priceRaw: 3500,
    price: fmt(3500),
    duration: "45 min",
    capacity: 4,
    availability: "instant",
    featured: false,
    active: true,
    visibility: "public",
    tags: ["health", "dogs", "wellness"],
    image: null,
    images: ["", "", "", ""],
    operatingHours: [
      { id: 1, day: "Wednesday", start: "10:00", end: "16:00" },
      { id: 2, day: "Saturday",  start: "10:00", end: "15:00" },
    ],
  },
  {
    id: "SRV-008",
    name: "Weekend Boarding",
    subtitle: "Fri–Sun stay",
    category: "Daycare",
    targetPets: "Dogs",
    description: "A cosy 2-night stay (Friday to Sunday) in our boutique boarding facility. Private sleeping pods, 3 walks daily, and a bedtime snack included.",
    priceRaw: 8000,
    price: fmt(8000),
    duration: "2 Days",
    capacity: 6,
    availability: "instant",
    featured: true,
    active: true,
    visibility: "public",
    tags: ["boarding", "dogs", "premium"],
    image: null,
    images: ["", "", "", ""],
    operatingHours: [
      { id: 1, day: "Friday",   start: "14:00", end: "20:00" },
      { id: 2, day: "Saturday", start: "00:00", end: "23:59" },
      { id: 3, day: "Sunday",   start: "07:00", end: "14:00" },
    ],
  },
];

export const PROMO_EVENTS = [
  { title: "Winter Spa Day",  desc: "20% off grooming",   dates: "JAN 15–30", theme: "primary" },
  { title: "Spring Training", desc: "Free 1st session",   dates: "MAR 01–15", theme: "tertiary" },
  { title: "Health Week",     desc: "Free wellness scan", dates: "APR 10–17", theme: "secondary" },
];

export const STAFF_AVATARS = [
  {
    alt: "Staff 1",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6qn1CUrCCGVflUy-HVPDwnsJu07UumMhmxlkLyMaQCnxTAY-FQozQ_a9NmpHbK-Kkyv2Rag43L7mV9Exl-au_bBYWuE6p1bORjGio6cgWSY6HjIWxCq78LcjzbZHnNT36jyuYTmJCO4oBAgljaEd--X15oxDsCgOXpPjN4rNYaiJGmEc62uT5eKnLT2I1nb10APUFb48Fcv7IwAvX2wY5h28H13fSWD4_B6xYG_sLXjr8Hyl05kdGshfoeddIbKCcWPW2QN1Lb7jv",
  },
  {
    alt: "Staff 2",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1pmCH4aCRqerdWslxTSsduU2ebxG4LEQ7py5cyjGL8WN9cTcPFvLMVLJbdJTqonX2qiEhm9BNxqqNmzuncozs_V5FEQz3bDwvIfRd9OuwxyYnojcfLX4kOz73hiosSqYne6IN1jtxEF7k8mVgCttdtf3ilMEbRqAqLxkW8Qm8sFA_VGR5VeDJ0GJkskY0lXz6GY2vD-EXhwXW2cebsZeE1lOZUFjdEpU88Phje_-mYt8UIvECs0yAX14CkeemoKQ7yjI6kTCkOJXR",
  },
];

export const AVG_TICKET    = fmt(7800);
export const CAPACITY_UTIL = "88%";
