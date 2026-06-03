"use client";

import Link from "next/link";
import useServiceDetails from "./ServiceDetailsContainer.hook";
import { fmt } from "@/lib/currency";
import ReviewCard from "@/app/containers/ReviewsContainer/Components/ReviewCard";
import RatingSummary from "@/app/containers/ReviewsContainer/Components/RatingSummary";
import StarRating from "@/app/containers/ReviewsContainer/Components/StarRating";

export default function ServiceDetailsContainer({ serviceId }) {
  const {
    service,
    gallery,
    activeImage,
    setActiveImage,
    activeTab,
    setActiveTab,
    reviews,
    helpfulCounts,
    votedIds,
    toggleHelpful,
  } = useServiceDetails(serviceId);

  const TABS = ["Overview", "What to Expect", "Policies"];

  const PERK_ICONS = {
    "Certified Groomer": "verified",
    "All Breeds Welcome": "pets",
    "Cruelty-Free Products": "eco",
    "Post-Service Report": "receipt_long",
    "Licensed Vet": "medical_services",
    "USDA Accredited": "verified_user",
    "Digital Records": "folder_shared",
    "Follow-up Included": "event_repeat",
    "CCPDT Certified Trainer": "school",
    "Positive Reinforcement Only": "favorite",
    "Progress Report": "bar_chart",
    "Home Tips Included": "home",
    "Background-Checked Sitter": "shield_person",
    "GPS Updates": "location_on",
    "Pet Insurance Covered": "health_and_safety",
    "24/7 Support": "support_agent",
  };

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">

        {/* Breadcrumbs */}
        <nav className="flex items-center flex-wrap gap-1.5 text-on-surface-variant mb-stack-md text-xs select-none">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="capitalize text-on-surface-variant">{service.category}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold truncate max-w-[200px] sm:max-w-xs">{service.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            {/* Main Image */}
            <div className="flex-1 relative aspect-square bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden group">
              <img
                src={activeImage}
                alt={service.title}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 ease-out group-hover:scale-105 cursor-zoom-in"
              />
              {service.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-tight shadow-sm">
                  {service.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 max-h-[500px]">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white active:scale-95 transition-all cursor-pointer ${
                    activeImage === img
                      ? "border-2 border-primary shadow-sm"
                      : "border border-outline-variant/30 hover:border-primary"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Service Info */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="space-y-2">
              {service.badge && (
                <span className="inline-block bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {service.badge}
                </span>
              )}
              <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-extrabold leading-tight">
                {service.title}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-2 flex-wrap select-none">
                <StarRating rating={service.rating} size={14} />
                <span className="text-xs text-on-surface-variant font-medium">{service.rating}</span>
                <Link href="/reviews" className="text-xs text-primary font-semibold hover:underline">
                  ({service.reviewsCount} reviews)
                </Link>
                <span className="text-outline-variant/60">·</span>
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {service.duration}
                </span>
              </div>
            </div>

            {/* Booking Box */}
            <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
              {/* Price row */}
              <div className="flex items-baseline gap-2">
                <span className="text-on-surface-variant text-xs">from</span>
                <span className="text-2xl md:text-3xl font-extrabold text-primary">
                  {fmt(service.price)}
                </span>
                <span className="text-xs text-on-surface-variant">· {service.duration}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-3">
                {service.description}
              </p>

              {/* Key highlights */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "schedule",       label: service.duration          },
                  { icon: "location_on",    label: "artPetShop Studio"       },
                  { icon: "pets",           label: "All breeds welcome"      },
                  { icon: "event_available",label: "Mon – Sat, 9 AM – 5 PM"  },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm shrink-0">{icon}</span>
                    <span className="text-[10px] text-on-surface-variant leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Book Now */}
              <Link
                href={`/services/book?serviceId=${service.id}`}
                className="w-full h-10 rounded-full font-bold text-xs bg-primary text-on-primary hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 hover:shadow-md"
              >
                <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>calendar_today</span>
                Book Now
              </Link>
            </div>

            {/* Perks Grid */}
            <div className="grid grid-cols-2 gap-3">
              {service.perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2.5 p-3 bg-white dark:bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
                  <div className="bg-primary/10 p-1.5 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-base">
                      {PERK_ICONS[perk] || "check_circle"}
                    </span>
                  </div>
                  <span className="font-bold text-xs text-on-surface leading-tight">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Included */}
        <section className="mt-8">
          <h2 className="text-xs font-bold mb-3 flex items-center gap-1.5 text-on-surface">
            <span className="material-symbols-outlined text-primary text-base">checklist</span>
            What's Included
          </h2>
          <div className="bg-surface-container/50 p-4 rounded-xl border border-outline-variant/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.included.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-green-600 text-base flex-shrink-0">check_circle</span>
                  <span className="text-xs text-on-surface">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="mt-8">
          <div className="flex border-b border-outline-variant/30 mb-4 select-none overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Left Pane */}
            <div className="bg-white dark:bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-on-surface mb-1">
                {activeTab === "Overview" && "Service Details"}
                {activeTab === "What to Expect" && "Your Session"}
                {activeTab === "Policies" && "Booking Policies"}
              </h3>

              {activeTab === "Overview" && (
                <div className="space-y-2.5">
                  {[
                    ["Category", service.category.charAt(0).toUpperCase() + service.category.slice(1)],
                    ["Duration", service.duration],
                    ["Starting Price", fmt(service.price)],
                    ["Pet Types", "Dogs, Cats, Small Pets"],
                    ["Location", "In-store & Home Visit"],
                    ["Availability", "Mon – Sat, 9 AM – 5 PM"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between border-b border-outline-variant/10 pb-1.5 text-xs">
                      <span className="text-on-surface-variant">{label}</span>
                      <span className="text-on-surface font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "What to Expect" && (
                <div className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                  <p>Your pet will be greeted by a dedicated professional who will walk you through the session plan.</p>
                  <p>We assess your pet's needs before beginning, ensuring we tailor the experience to their comfort and health requirements.</p>
                  <p className="font-bold text-on-surface">Sessions are calm, unhurried, and focused entirely on your pet's wellbeing.</p>
                </div>
              )}

              {activeTab === "Policies" && (
                <div className="space-y-2.5 text-xs text-on-surface-variant leading-relaxed">
                  <p>Cancellations made more than 24 hours in advance receive a full refund.</p>
                  <p>Same-day cancellations are subject to a 50% service fee.</p>
                  <p className="font-bold text-on-surface">No-shows forfeit the full booking amount. Please arrive 5 minutes early.</p>
                </div>
              )}
            </div>

            {/* Right Pane: Key Benefits */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-on-surface">Why Choose Us</h3>
              <ul className="space-y-2.5">
                {[
                  { icon: "star", title: "5-Star Rated Professionals", desc: "Every expert is vetted, trained, and holds industry certifications." },
                  { icon: "favorite", title: "Pet-First Philosophy", desc: "Sessions are paced entirely around your pet's comfort — never rushed." },
                  { icon: "shield", title: "Fully Insured & Safe", desc: "All services are covered under our comprehensive pet-care liability policy." },
                ].map(({ icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-green-600 mt-0.5 text-base">{icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-on-surface">{title}</h4>
                      <p className="text-on-surface-variant text-[11px] leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Reviews Section — reuses ReviewsContainer components */}
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 gap-3">
            <div>
              <h2 className="text-xs font-bold text-on-surface">Customer Stories</h2>
              <p className="text-on-surface-variant text-xs">See what other pet parents are saying</p>
            </div>
            <button className="bg-white dark:bg-surface-container-lowest border-2 border-primary text-primary font-bold text-xs px-4 py-1.5 rounded-full hover:bg-primary/5 active:scale-95 transition-all cursor-pointer">
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Rating summary sidebar */}
            <aside className="lg:col-span-4">
              <RatingSummary product={service} />
            </aside>

            {/* Review cards */}
            <div className="lg:col-span-8 space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  helpfulCount={helpfulCounts[review.id]}
                  isVoted={votedIds.has(review.id)}
                  onHelpful={() => toggleHelpful(review.id)}
                />
              ))}

              <div className="flex justify-center pt-4">
                <Link
                  href="/reviews"
                  className="text-primary font-bold text-xs hover:underline flex items-center gap-0.5"
                >
                  View All Reviews
                  <span className="material-symbols-outlined leading-none" style={{ fontSize: 16 }}>chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
