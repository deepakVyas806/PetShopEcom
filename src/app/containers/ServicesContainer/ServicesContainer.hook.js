"use client";

import { useState } from "react";
import { IconInfinity, IconGroom, IconMedical, IconTraining, IconHome } from "@/lib/icons";

const SERVICES = [
  {
    id: 1,
    title: "Signature ArtGrooming",
    category: "grooming",
    badge: "Popular",
    rating: "4.9",
    reviewCount: "120+",
    duration: "90 - 120 mins",
    price: "85.00",
    description:
      "A complete spa experience including deep conditioning, artistic styling, nail buffing, and ear cleaning. Perfect for all breeds.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGTBSh2BJuvp2Hf8shV8z9MmZQ4UXQ3vSscx9jDsQwr4oh6SYowH7gRQL9JMLUs67yhcmXcaZWzk-8Dzp0_9rAUf1zwSoUqxriilz9ApTenm5tUXuBL0Tbu1wzxht7bchGoUTZnz8baG9jOLffisNQlhl-CtRG1yzEG8BppZh7uS_W4yEWEWs5-LFmvSgFN7R5lKiDLGPwJtuM_klM1zqRGPpHAZQTFo9VGIYaBXeYnHEK96NmQfLNLYGB24p6Qziqee7d_ilVfDDt",
    petTypes: ["dogs", "cats"],
  },
  {
    id: 2,
    title: "Wellness Examination",
    category: "veterinary",
    badge: null,
    rating: "5.0",
    reviewCount: "45",
    duration: "30 - 45 mins",
    price: "65.00",
    description:
      "Comprehensive nose-to-tail checkup to ensure your pet's long-term health. Includes weight check and nutrition consultation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASnOgWLzTExTa05mipWT_nBphSAyrrh0Q2a12yqAJ3v1dikOu88YbR9oQ0UTg7rCIdjVAX7eRRbfwuTmiBZnXFVkPO1VdLF9DdUPxKMrTSIOWfjmlbOYFMrWtxbVrFN1DZV5X9FXzmzrdKArIsRSuOCxS-0VofPkWbB3go5J-jZvbuunUYHJqLQ3WjEU1-lTc2CZOniKzHzgdvlYPhH1abH29HAlkea5WQx21KZV-Jwp_S0DIkU8HnNexbVHVvI-62uJ4Q_FNG1ZNx",
    petTypes: ["dogs", "cats", "small_pets"],
  },
  {
    id: 3,
    title: "Positive Puppy Training",
    category: "training",
    badge: null,
    rating: "4.8",
    reviewCount: "89",
    duration: "60 mins",
    price: "120.00",
    description:
      "Individualized behavior training focusing on core commands and social skills. Modern techniques based on positive reinforcement.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDOefR9ENF5BF2BaZqOIfGnaYX0cqA8nNAFjYl6oRV_ezlRQAFjx2yYxQJsFTdTNjnp1TRkxvc4c640bhBlS1PHJX9qi3WtusFqUr3jU215FL_WXfAYTyHNEuzrF_y70NpNWc43HMg5yCcCvsNOQvVmYvXwlV7LtrOq8DmdVwc8ev1JDd1AZfz-SwTbAg_WP8fCc60NUi0yovya69QzQM9EFzoriWWAbPSVFC1tI-Vg1h-rWZvERUcrUgaq24KIBH6xChZyazRBgaKL",
    petTypes: ["dogs"],
  },
  {
    id: 4,
    title: "Luxury Overnight Sitting",
    category: "sitting",
    badge: null,
    rating: "4.7",
    reviewCount: "62",
    duration: "Per Night",
    price: "95.00",
    description:
      "In-home pet care that maintains your pet's routine. Includes feeding, walking, and lots of personalized affection.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaT68dKQ3-hPoL2eNGD0m2XSDWAwNDQ1q5arCEOskYCqyoxRStPAV-b_b2rQi7cZ-nl_9XG0rG3PnKzFY5cvMqOXGG_981a0DSY2YicBAvsMKwIW4moLNxfYmzMFTzCoBpIhPefmEI2jJ5eaBo1oTmihva5HAm0Vjv6gb4ss1PbsZ4ReZ645ecdn8z0aQo0VNVHe81IAMCmkkmCLddN9CfLZ6F2tGIVoXbbaLCdve4RzVUqD5AFgbFaNkZGS8iL4D5WHNA7iul_T8T",
    petTypes: ["dogs", "cats", "small_pets"],
  },
];

export const CATEGORIES = [
  { key: "all",        label: "All Services", Icon: IconInfinity },
  { key: "grooming",   label: "Grooming",     Icon: IconGroom    },
  { key: "veterinary", label: "Veterinary",   Icon: IconMedical  },
  { key: "training",   label: "Training",     Icon: IconTraining },
  { key: "sitting",    label: "Pet Sitting",  Icon: IconHome     },
];

export default function useServices() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [priceRange, setPriceRange] = useState(500);
  const [location, setLocation] = useState("");
  const [inlineSearch, setInlineSearch] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePetTypeChange = (type) => {
    setSelectedPetTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleReset = () => {
    setSelectedPetTypes([]);
    setPriceRange(500);
    setLocation("");
    setActiveCategory("all");
  };

  const services = SERVICES.filter((s) => {
    if (activeCategory !== "all" && s.category !== activeCategory) return false;
    if (selectedPetTypes.length > 0 && !selectedPetTypes.some((t) => s.petTypes.includes(t))) return false;
    if (parseFloat(s.price) > priceRange) return false;
    if (inlineSearch.trim()) {
      const q = inlineSearch.toLowerCase();
      if (!s.title.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return {
    CATEGORIES,
    services,
    totalCount: services.length,
    activeCategory,
    inlineSearch,
    setInlineSearch,
    setActiveCategory,
    selectedPetTypes,
    handlePetTypeChange,
    priceRange,
    setPriceRange,
    location,
    setLocation,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    handleReset,
    currentPage,
    setCurrentPage,
  };
}
