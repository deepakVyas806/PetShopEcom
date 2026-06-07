import { fmt } from "@/lib/currency";

export const CATEGORIES = [
  "All Categories",
  "Premium Kibble",
  "Bedding",
  "Grooming",
  "Toys",
  "Accessories",
  "Healthcare",
];

export const BRANDS = ["All Brands", "WildBite", "ZenDog", "EcoTail", "artPetShop", "Royal Paws"];

export const PRODUCTS = [
  {
    id: "APS-FD-001",
    name: "Artisan Salmon & Kelp Mix",
    variant: "Weight: 5kg",
    sku: "APS-FD-001",
    category: "Premium Kibble",
    brand: "WildBite",
    price: fmt(3500),
    priceRaw: 3500,
    stock: 142,
    maxStock: 200,
    status: "In Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt-nGzc_MPWMCNAK_1kx2yT5PCSByJQbQppfkYHtu03xDL8q38ddFZb5Nzi5PncbJlw4CNX3PJL8FDSYgoV98sNbf6fArh3odnVTttgsnvGyrh4_s1xhVNunQPStsTf4soNIrjry94_1JO7FHntGBpHeKlYH6LTo1J3CKbVhIPewMjgDPMQc8YZwJS55Ytbt0y4r5owTHgJbU11bFusvWyPSEoqY43NU000wzt_mX998oMdbxatbgH_DMNnZxSQzXCf-G08Ovcks_W",
  },
  {
    id: "APS-BD-024",
    name: "Velvet Cloud Orthopedic Bed",
    variant: "Size: Large / Grey",
    sku: "APS-BD-024",
    category: "Bedding",
    brand: "ZenDog",
    price: fmt(10800),
    priceRaw: 10800,
    stock: 8,
    maxStock: 60,
    status: "Low Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkAKCQHBO1_t_gv1WB5BcPE7x4VIqqD0rJ-wtrcWNrR4N7u8_-888UQypRqmci8_B72-VG77MtDy1kaEkXTBWi64tQ5ZtvAgzNWQ3w7ESCssfQkzUkBRjhRL4hP13bcf66Yf6spdSjAXk6JOgTemLdjiFZOHSUaEydwj7CYtAcYBMadSrHfhvVC-CSbgTIfop9I1HaBxmx32587n3cPbW7TWkfcJgFoJ8M8GhIWu9eIGVnHnCvdqtT40PbCAExobhV7r0k-aEUHa4s",
  },
  {
    id: "APS-GR-089",
    name: "Bamboo Sleek Grooming Kit",
    variant: "Material: Sustainable Bamboo",
    sku: "APS-GR-089",
    category: "Grooming",
    brand: "EcoTail",
    price: fmt(2850),
    priceRaw: 2850,
    stock: 24,
    maxStock: 60,
    status: "In Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNg237o0vndeqMPmT8gohfVARvuSj5tq8F5qInEOsDDTYmi7YvUYKBSNL0qQ9Czdl_qYsTyRJzRqIqESCrRQ0HZ9l0TxCG7TWk1glj0Z6yKuM7l9sItNHpGs4oK9KTvqXv7HsSRwQKZyk3imF8Acodq8CC2Skazs66lEymOuWrer2mQ-RdKfV55_iJP9zAxBiBVGX8t4qrTHfEljjEiXvtfRoSAupT4uZJB-SeJmPubuTpGvv4Tc_l_E8_M_F3-VV1Om3llQdni6Ba",
  },
  {
    id: "APS-TY-112",
    name: "SmartPaws Interactive Puzzle",
    variant: "Difficulty: Level 2",
    sku: "APS-TY-112",
    category: "Toys",
    brand: "artPetShop",
    price: fmt(1650),
    priceRaw: 1650,
    stock: 512,
    maxStock: 550,
    status: "In Stock",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA684svTGgJhbBcbFuVavor5NLaMQwd9RIe0E5AMNeSq_yFtWQLB-dtmunQ9D-rxGk6Y0Q4R6ShaqzUO0RiSRTT_GAmf7YztwqgX6UV-lYEeiN2ow9vPG9Q0Qwq9hIQwiMzATbwgms4YjmXFg7L6_u1Cx8iASDtfS2lmY-ifWEAgcY8OzsPIrHuVW2YeUaa355n-Aj_13Y0xTNjTl4J_tHcF5GlxlIuRKer7ThxSoqbzgt4ioxtBuN-3_FyqjCBHzVFwf2H6eKl1_Ki",
  },
  {
    id: "APS-AC-201",
    name: "Premium Leather Pet Collar",
    variant: "Size: Medium / Brown",
    sku: "APS-AC-201",
    category: "Accessories",
    brand: "Royal Paws",
    price: fmt(1999),
    priceRaw: 1999,
    stock: 0,
    maxStock: 80,
    status: "Out of Stock",
    image: null,
  },
  {
    id: "APS-HC-305",
    name: "Advanced Dental Care Kit",
    variant: "Pack of 3",
    sku: "APS-HC-305",
    category: "Healthcare",
    brand: "EcoTail",
    price: fmt(850),
    priceRaw: 850,
    stock: 5,
    maxStock: 120,
    status: "Low Stock",
    image: null,
  },
];

export const PRODUCT_STATUS_STYLES = {
  "In Stock":     { bg: "bg-green-100",  text: "text-green-700" },
  "Low Stock":    { bg: "bg-error/10",   text: "text-error" },
  "Out of Stock": { bg: "bg-gray-100",   text: "text-gray-600" },
  "Discontinued": { bg: "bg-secondary-container", text: "text-on-secondary-container" },
};

export const TOTAL_INVENTORY  = 1284;
export const LOW_STOCK_ALERTS = 12;

export const ANIMAL_TYPES = ["Dog", "Cat", "Fish", "Bird", "Rabbit", "Small Animals"];
export const LIFE_STAGES  = ["Puppy/Kitten", "Adult", "Senior", "All Stages"];
