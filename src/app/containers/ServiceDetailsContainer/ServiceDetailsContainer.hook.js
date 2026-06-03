"use client";

import { useState, useMemo } from "react";

const SERVICES_DATA = {
  "1": {
    id: "1",
    title: "Signature ArtGrooming",
    category: "grooming",
    badge: "Popular",
    rating: 4.9,
    reviewsCount: 120,
    duration: "90 - 120 mins",
    price: 85.00,
    description:
      "A complete spa experience including deep conditioning, artistic styling, nail buffing, and ear cleaning. Perfect for all breeds.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGTBSh2BJuvp2Hf8shV8z9MmZQ4UXQ3vSscx9jDsQwr4oh6SYowH7gRQL9JMLUs67yhcmXcaZWzk-8Dzp0_9rAUf1zwSoUqxriilz9ApTenm5tUXuBL0Tbu1wzxht7bchGoUTZnz8baG9jOLffisNQlhl-CtRG1yzEG8BppZh7uS_W4yEWEWs5-LFmvSgFN7R5lKiDLGPwJtuM_klM1zqRGPpHAZQTFo9VGIYaBXeYnHEK96NmQfLNLYGB24p6Qziqee7d_ilVfDDt",
    perks: ["Certified Groomer", "All Breeds Welcome", "Cruelty-Free Products", "Post-Service Report"],
    included: [
      "Full bath & blow-dry",
      "Artistic breed-specific styling",
      "Nail trim & buffing",
      "Ear cleaning & checking",
      "Teeth brushing",
      "Spritz & finishing spray",
    ],
    ratingDistribution: [
      { star: "5", pct: 78 },
      { star: "4", pct: 13 },
      { star: "3", pct: 5 },
      { star: "2", pct: 3 },
      { star: "1", pct: 1 },
    ],
  },
  "2": {
    id: "2",
    title: "Wellness Examination",
    category: "veterinary",
    badge: null,
    rating: 5.0,
    reviewsCount: 45,
    duration: "30 - 45 mins",
    price: 65.00,
    description:
      "Comprehensive nose-to-tail checkup to ensure your pet's long-term health. Includes weight check and nutrition consultation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASnOgWLzTExTa05mipWT_nBphSAyrrh0Q2a12yqAJ3v1dikOu88YbR9oQ0UTg7rCIdjVAX7eRRbfwuTmiBZnXFVkPO1VdLF9DdUPxKMrTSIOWfjmlbOYFMrWtxbVrFN1DZV5X9FXzmzrdKArIsRSuOCxS-0VofPkWbB3go5J-jZvbuunUYHJqLQ3WjEU1-lTc2CZOniKzHzgdvlYPhH1abH29HAlkea5WQx21KZV-Jwp_S0DIkU8HnNexbVHVvI-62uJ4Q_FNG1ZNx",
    perks: ["Licensed Vet", "USDA Accredited", "Digital Records", "Follow-up Included"],
    included: [
      "Full physical examination",
      "Weight & body condition score",
      "Dental health check",
      "Ear & eye assessment",
      "Nutrition consultation",
      "Health certificate",
    ],
    ratingDistribution: [
      { star: "5", pct: 90 },
      { star: "4", pct: 8 },
      { star: "3", pct: 2 },
      { star: "2", pct: 0 },
      { star: "1", pct: 0 },
    ],
  },
  "3": {
    id: "3",
    title: "Positive Puppy Training",
    category: "training",
    badge: null,
    rating: 4.8,
    reviewsCount: 89,
    duration: "60 mins",
    price: 120.00,
    description:
      "Individualized behavior training focusing on core commands and social skills. Modern techniques based on positive reinforcement.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDOefR9ENF5BF2BaZqOIfGnaYX0cqA8nNAFjYl6oRV_ezlRQAFjx2yYxQJsFTdTNjnp1TRkxvc4c640bhBlS1PHJX9qi3WtusFqUr3jU215FL_WXfAYTyHNEuzrF_y70NpNWc43HMg5yCcCvsNOQvVmYvXwlV7LtrOq8DmdVwc8ev1JDd1AZfz-SwTbAg_WP8fCc60NUi0yovya69QzQM9EFzoriWWAbPSVFC1tI-Vg1h-rWZvERUcrUgaq24KIBH6xChZyazRBgaKL",
    perks: ["CCPDT Certified Trainer", "Positive Reinforcement Only", "Progress Report", "Home Tips Included"],
    included: [
      "One-on-one training session",
      "Core command foundations (sit, stay, come)",
      "Leash manners basics",
      "Socialisation exercises",
      "Owner coaching",
      "Written progress summary",
    ],
    ratingDistribution: [
      { star: "5", pct: 70 },
      { star: "4", pct: 20 },
      { star: "3", pct: 6 },
      { star: "2", pct: 3 },
      { star: "1", pct: 1 },
    ],
  },
  "4": {
    id: "4",
    title: "Luxury Overnight Sitting",
    category: "sitting",
    badge: null,
    rating: 4.7,
    reviewsCount: 62,
    duration: "Per Night",
    price: 95.00,
    description:
      "In-home pet care that maintains your pet's routine. Includes feeding, walking, and lots of personalized affection.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaT68dKQ3-hPoL2eNGD0m2XSDWAwNDQ1q5arCEOskYCqyoxRStPAV-b_b2rQi7cZ-nl_9XG0rG3PnKzFY5cvMqOXGG_981a0DSY2YicBAvsMKwIW4moLNxfYmzMFTzCoBpIhPefmEI2jJ5eaBo1oTmihva5HAm0Vjv6gb4ss1PbsZ4ReZ645ecdn8z0aQo0VNVHe81IAMCmkkmCLddN9CfLZ6F2tGIVoXbbaLCdve4RzVUqD5AFgbFaNkZGS8iL4D5WHNA7iul_T8T",
    perks: ["Background-Checked Sitter", "GPS Updates", "Pet Insurance Covered", "24/7 Support"],
    included: [
      "Overnight stay (7pm – 8am)",
      "Feeding per your schedule",
      "Morning & evening walks",
      "Playtime & enrichment",
      "Photo updates via app",
      "Emergency vet contact",
    ],
    ratingDistribution: [
      { star: "5", pct: 65 },
      { star: "4", pct: 22 },
      { star: "3", pct: 8 },
      { star: "2", pct: 4 },
      { star: "1", pct: 1 },
    ],
  },
};

const EXTRA_GALLERY = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAo_kONBapSdtdQXN1iLIqsgx81li30cgDA8cva9ckyj2KHwArvefh5AM2c3bwpoBQlq5TiztOFHXfRJZ7Z9yuvgCWM1R53ZwYQBJYUeLTqs6gBqbi7TGx4TGkxtwFjWjYUDq89Fnm6WgiUlSuxpXGF6YPAjHwJarKlVHWypZYySsUQ2puKX-OKbnf-JObiIhwJ6c1svFAvF3gVlucdV6Q5GEXRSeCRkaS_hSDDgRiKcHf44h-V1AbnpGvFaiB3t3HCMZPPpPFdvrSs",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCyKqrQDsfTBVnfdpYiJ9byCrZYFmQxDJpu21vwvmrTnUZ3lwn107dDmqbZ5eQKQI318xXxpgqDApPosbXxZ2ge_TR-JwK8stbnnntYh9pw-os5vagAqLGBa8bKQAvoWJUcmf3cK4V997P3E3oDH4nkvEMD1k9jdqn5wqmrCHSihwdpuiB2Ywt4oYYOI09CufqG1TBjHoV_RsLq9Mai8lsgNVSIgNIDFGuy36gRFAGuop-6mArpNaURIt861Z8s_8_xNM1BsMFKtVyi",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC3cxMdHKlvGIzLolFR5MWFHZ0fsWa5_jmD6MDohMGRVL6jBGfOLOa2iCxJPk4iW7RNOvmHiv7o7PPeg7ByBCehAGg8EHTT_0Ck90uiOfALAuoIbIPH7GvnqlUqcl_I9UGYoDo-R-uQLh5t1fM_CsDnAzgggAVKXiJtt0UAxbjnY-t74VThfKTfkoALjkDToiGSy6NYQvbRDnmZfuKVBMQ7SvW7DoQ5DbDNbbk9nww-XHCn1k6VfC2l5MppY4C_JwswZtm65mbEkQw1",
];

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "Sarah Jenkins",
    initials: "SJ",
    avatarBg: "bg-purple-100",
    avatarFg: "text-purple-700",
    rating: 5,
    verified: true,
    date: "May 12, 2025",
    title: "Absolutely transformed my dog!",
    body: "My Labrador came out looking and smelling amazing. The groomer was so gentle and patient. Will definitely book again!",
    photos: [],
  },
  {
    id: "r2",
    name: "Mark Thompson",
    initials: "MT",
    avatarBg: "bg-blue-100",
    avatarFg: "text-blue-700",
    rating: 4,
    verified: true,
    date: "Apr 28, 2025",
    title: "Great experience overall",
    body: "Very professional staff. My cat was a little nervous but they handled her with care. Slight wait time but worth it.",
    photos: [],
  },
  {
    id: "r3",
    name: "Emily Chen",
    initials: "EC",
    avatarBg: "bg-green-100",
    avatarFg: "text-green-700",
    rating: 5,
    verified: true,
    date: "Apr 10, 2025",
    title: "Best grooming service in the city",
    body: "I've tried several places and this is by far the best. The attention to detail is incredible and the results speak for themselves.",
    photos: [],
  },
];

export default function useServiceDetails(serviceId) {
  const service = SERVICES_DATA[serviceId] || SERVICES_DATA["1"];

  const gallery = useMemo(
    () => [service.image, ...EXTRA_GALLERY],
    [service.image]
  );

  const [activeImage, setActiveImage] = useState(service.image);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [booked, setBooked] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState({ r1: 14, r2: 8, r3: 21 });
  const [votedIds, setVotedIds] = useState(new Set());

  const toggleHelpful = (id) => {
    const isVoted = votedIds.has(id);
    setVotedIds((prev) => {
      const next = new Set(prev);
      isVoted ? next.delete(id) : next.add(id);
      return next;
    });
    setHelpfulCounts((c) => ({ ...c, [id]: c[id] + (isVoted ? -1 : 1) }));
  };

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return {
    service,
    gallery,
    activeImage,
    setActiveImage,
    activeTab,
    setActiveTab,
    TIME_SLOTS,
    selectedTime,
    setSelectedTime,
    booked,
    handleBook,
    reviews: MOCK_REVIEWS,
    helpfulCounts,
    votedIds,
    toggleHelpful,
  };
}
