"use client";

import Link from "next/link";
import { IconArrowRight, IconClock } from "@/lib/icons";

const ARTICLES = [
  {
    id:       1,
    category: "Dog Care",
    catColor: "bg-orange-100 text-orange-700",
    title:    "10 Signs Your Dog Needs More Exercise (And How to Help)",
    excerpt:  "Learn to read your dog's body language and discover fun ways to keep them active, healthy, and happy every day.",
    readTime: "4 min",
    author:   "Dr. Priya Sharma",
    avatar:   "PS",
    avatarBg: "#F97316",
    image:    "https://images.unsplash.com/photo-1607696442638-93393692197a?fm=jpg&q=80&w=600&h=360&fit=crop",
  },
  {
    id:       2,
    category: "Nutrition",
    catColor: "bg-green-100 text-green-700",
    title:    "Raw vs Kibble: What's Really Best for Your Pet?",
    excerpt:  "Our vets break down the pros and cons of each diet so you can make the best choice for your companion.",
    readTime: "6 min",
    author:   "Dr. Ankit Mehta",
    avatar:   "AM",
    avatarBg: "#16A34A",
    image:    "https://images.unsplash.com/photo-1565674244283-993fb27a215f?fm=jpg&q=80&w=600&h=360&fit=crop",
  },
  {
    id:       3,
    category: "Cat Health",
    catColor: "bg-purple-100 text-purple-700",
    title:    "Why Cats Hide Their Pain — 7 Subtle Warning Signs",
    excerpt:  "Cats are masters at concealing illness. Here's what to watch for so you can catch problems early.",
    readTime: "5 min",
    author:   "Dr. Sneha Rao",
    avatar:   "SR",
    avatarBg: "#7C3AED",
    image:    "https://images.unsplash.com/photo-1504198146285-9aba0ff6292d?fm=jpg&q=80&w=600&h=360&fit=crop",
  },
  {
    id:       4,
    category: "Training",
    catColor: "bg-blue-100 text-blue-700",
    title:    "Positive Reinforcement 101: Train Any Dog in 7 Days",
    excerpt:  "Science-backed techniques that work with your dog's natural instincts — no punishment or harsh methods needed.",
    readTime: "7 min",
    author:   "Rahul Kapoor",
    avatar:   "RK",
    avatarBg: "#1D4ED8",
    image:    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?fm=jpg&q=80&w=600&h=360&fit=crop",
  },
];

export default function BlogTipsSection() {
  const [featured, ...rest] = ARTICLES;

  return (
    <section className="py-6 px-4 md:px-6 max-w-container-max mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-on-surface">Pet Care Tips &amp; Stories</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Expert advice from our vets &amp; community</p>
        </div>
        <Link href="/blog" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
          All Articles <IconArrowRight size={13} weight="bold" />
        </Link>
      </div>

      {/* Layout: featured left (large) + 3 small cards right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* Featured article — spans 1 col on mobile, 1 wider col on desktop */}
        <Link
          href="/blog"
          className="group relative rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/20 shadow-card-sm hover:shadow-card-lg transition-all duration-200 md:col-span-1 flex flex-col"
        >
          <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className={`absolute top-3 left-3 text-[9px] font-black px-2 py-0.5 rounded-full ${featured.catColor}`}>
              {featured.category}
            </span>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-sm font-bold text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
              {featured.title}
            </h3>
            <p className="text-[10px] text-on-surface-variant leading-relaxed line-clamp-2 flex-1">
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-outline-variant/10">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white flex-shrink-0"
                  style={{ background: featured.avatarBg }}
                >
                  {featured.avatar}
                </div>
                <span className="text-[9px] text-on-surface-variant font-medium">{featured.author}</span>
              </div>
              <span className="text-[9px] text-on-surface-variant flex items-center gap-0.5">
                <IconClock size={9} weight="regular" />
                {featured.readTime} read
              </span>
            </div>
          </div>
        </Link>

        {/* 3 smaller cards stacked */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3">
          {rest.map((article) => (
            <Link
              key={article.id}
              href="/blog"
              className="group rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/20 shadow-card-sm hover:shadow-card-lg transition-all duration-200 flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: 130 }}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded-full ${article.catColor}`}>
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-[11px] font-bold text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1 flex-1">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/10">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black text-white flex-shrink-0"
                      style={{ background: article.avatarBg }}
                    >
                      {article.avatar}
                    </div>
                    <span className="text-[8px] text-on-surface-variant truncate max-w-[70px]">{article.author}</span>
                  </div>
                  <span className="text-[8px] text-on-surface-variant flex items-center gap-0.5 flex-shrink-0">
                    <IconClock size={8} weight="regular" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
