import { useState, useMemo } from "react";

// ─── Static product data ──────────────────────────────────────────────────────
export const PRODUCT = {
  name: "Artisan Wild Salmon Kibble",
  category: "Dog Food",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIqyluSmPRp-0WnoMTROgwhcslUi-DbgoIqGMcyHaYjckr4Qh_KwmYQqHnweyJmb5NL8SwNbm67YvMCcwzO5WJ6hx9riZvLTNOk6pGNDjtVSqcXTX9x35cLy0jqr7WTqZFvi837z9LopGA8I59_RGf09H_e-DlUnHQWBi1x3fbfqo4TJ5-JEANvNRCYv_al86b5vKPzUiRGTcnF-UEo04liiF03Gkt4OfmlvsoSa-RodZMncPZIBD9TDPB5NAsb92yoEaxj7tl8x1F",
  rating: 4.8,
  reviewCount: 1248,
  ratingDistribution: [
    { star: 5, pct: 82 },
    { star: 4, pct: 12 },
    { star: 3, pct: 4  },
    { star: 2, pct: 1  },
    { star: 1, pct: 1  },
  ],
  customerPhotos: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDwu9ceTe9x4tVQCE-VXb7uPAcYH14lahhgowD3WrseqTzIWV458NSLpFIvmn5LnPKlNFsI-R9vOUh96z1dtFY-xDdz_90i6K8dyYUyCnPXfdLr-lwSHqiZr5ZVvC_n_RPbwcDyzuUt6WxWxeImPLhGpveLZdR0a46e4UCEYq5Lzx4aT80Aub8XJ5HttROvb6KCu-OD4FLMFdNAjzjGAzLkymFMGPydl8kATvFrXxGztorjgJL-o49boV-PGvmQU_cPUkyPby9-MOVh",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAuyE98LGjHSJTC_9HYyGsdN6e38DqoWr2ShyRzUElbyZQU0WH5DaMSgRpLopMYvA4NgU-TZpQIEPIJCzjOWTwRTRryskgNCeD_OdP5Ddj9953RSI34vtZKmdTU72_T6tGcQLN0tfdGIGVXEC3pXwyR9V-PQvEF1IjHpR62d28DvOvAGHemgMkW3HF_maph4nM4f5WKf9UZgQnN6MWVfNlidIxIOll3OTltBnQhWBCwtOI6kb5yF4kmrCxTRCahRSxnLyNGjaZM7AEk",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDjCkIhbmTR6mvzrJmtvWFyemRHz-RA-mF-LjgX05Y2Cwgx3vjRYrfCznJoopit-E5GcyXDSYYJru8ijAA2Zw0tswhouiGwh8HZdcAYLIWyFekscVlXj7Qz5h2syTb4ZKCukVAypdMyyKFTrFptWqGPACjRIxY53mTMxJ7D1jPujVqJTDbM-eIIKtQGQsMvt1CYhArs2yGeKvfTU6kWhRCEeN0yWZhK7t-FHqxB0DdSQYBF94am2LvaDfEpoieAvsAo0BfHoeDmkrCP",
  ],
};

// ─── Mock reviews ─────────────────────────────────────────────────────────────
const REVIEWS_DATA = [
  {
    id: "r1",
    initials: "SD",
    name: "Sarah D.",
    avatarBg: "bg-tertiary-container",
    avatarFg: "text-on-tertiary-container",
    rating: 5,
    verified: true,
    date: "October 24, 2023",
    title: "My dog's coat is shining!",
    body: "I've tried numerous brands for my allergic Golden, but this Salmon Kibble is a game changer. Within 3 weeks, his constant itching stopped and his coat looks like he just came from the groomer. It actually smells like real fish, not processed waste!",
    photos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3EmyLAdyPO_jP_hCogKdNAdw7yXyelkNO_-0RycNCrYhoU1csNI_n07f0iHFhDKLVuCmQJB2kleubukHXXA1DSGAoFpollAfBHGOCS4cgjIOoXsv598K-ZxVPjirE5OiBEayj172e3MEhdVNB6v77K32TSDac8ipe_LZynMemXxsOi5T24ef2cDon7xKXzpzgcrNaaZ8RPuM_H8xKSxTiPbBWKW-Y1SsgMmpP25FcOhWljVhSReiMW_Ol1ILBr5BmdWFYxTQNqOFe",
    ],
    helpfulCount: 42,
  },
  {
    id: "r2",
    initials: "JM",
    name: "James Miller",
    avatarBg: "bg-secondary-container",
    avatarFg: "text-on-secondary-container",
    rating: 4,
    verified: true,
    date: "September 12, 2023",
    title: "Great quality, but strong scent",
    body: "The ingredients list is impressive and my dog loves the taste. My only caveat is that it definitely smells like salmon — which the dog loves, but it's quite noticeable when you open the bin. Keep it in a sealed container! Quality is 10/10 though.",
    photos: [],
    helpfulCount: 15,
  },
  {
    id: "r3",
    initials: "LK",
    name: "Lisa K.",
    avatarBg: "bg-primary/10",
    avatarFg: "text-primary",
    rating: 5,
    verified: true,
    date: "August 5, 2023",
    title: "Best for sensitive stomachs",
    body: "My Labrador has always had digestive issues with standard kibble. After switching to this salmon formula, no more upset stomach. The transition was smooth and she's been thriving on it for two months now. Will never switch again.",
    photos: [],
    helpfulCount: 28,
  },
  {
    id: "r4",
    initials: "MP",
    name: "Marcus P.",
    avatarBg: "bg-surface-container-high",
    avatarFg: "text-on-surface-variant",
    rating: 3,
    verified: false,
    date: "July 20, 2023",
    title: "Good product, average packaging",
    body: "The food itself is excellent and my dogs genuinely love it. Nutrition panel checks out beautifully. Knocking off two stars because the resealable zip is flimsy and broke on the first bag, which forced me to decant into a container anyway.",
    photos: [],
    helpfulCount: 9,
  },
  {
    id: "r5",
    initials: "EW",
    name: "Emma W.",
    avatarBg: "bg-tertiary/10",
    avatarFg: "text-tertiary",
    rating: 5,
    verified: true,
    date: "June 18, 2023",
    title: "Worth every penny",
    body: "Premium price but you absolutely get what you pay for. My vet noticed an improvement in my Border Collie's weight and coat at her annual checkup and specifically asked what I'd changed in her diet. This was the only change. Speaks for itself.",
    photos: [],
    helpfulCount: 37,
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
export default function useReviewsContainer() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy,       setSortBy]       = useState("recent");
  const [visibleCount, setVisibleCount] = useState(3);
  const [votedIds,     setVotedIds]     = useState(new Set());
  const [helpfulCounts, setHelpfulCounts] = useState(
    () => Object.fromEntries(REVIEWS_DATA.map((r) => [r.id, r.helpfulCount]))
  );

  const filteredReviews = useMemo(() => {
    let list = [...REVIEWS_DATA];
    if (activeFilter === "photos")   list = list.filter((r) => r.photos.length > 0);
    if (activeFilter === "verified") list = list.filter((r) => r.verified);
    if (sortBy === "rating")  list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "helpful") list.sort((a, b) => helpfulCounts[b.id] - helpfulCounts[a.id]);
    return list;
  }, [activeFilter, sortBy, helpfulCounts]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore        = visibleCount < filteredReviews.length;

  const loadMore = () => setVisibleCount((n) => n + 3);

  const toggleHelpful = (id) => {
    if (votedIds.has(id)) {
      setVotedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setHelpfulCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    } else {
      setVotedIds((prev) => new Set([...prev, id]));
      setHelpfulCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    }
  };

  return {
    product: PRODUCT,
    visibleReviews,
    hasMore,
    helpfulCounts,
    votedIds,
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    loadMore,
    toggleHelpful,
  };
}
