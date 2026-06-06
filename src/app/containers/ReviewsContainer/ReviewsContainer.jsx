"use client";

import { useState } from "react";
import useReviewsContainer from "./ReviewsContainer.hook";
import ProductHeader       from "./Components/ProductHeader";
import RatingSummary       from "./Components/RatingSummary";
import CustomerPhotos      from "./Components/CustomerPhotos";
import ReviewFilters       from "./Components/ReviewFilters";
import ReviewCard          from "./Components/ReviewCard";
import Pagination          from "@/components/common/Pagination";
import InlineReviewForm    from "@/components/common/InlineReviewForm";

/* ── Main container ─────────────────────────────────────────────────────── */
export default function ReviewsContainer() {
  const {
    product,
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
  } = useReviewsContainer();

  const [showForm,      setShowForm]      = useState(false);
  const [localReviews,  setLocalReviews]  = useState([]);

  const handleWriteReview = () => {
    setShowForm(true);
    // Scroll to the form after a tick so it's rendered
    setTimeout(() => {
      document.getElementById("review-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleSubmitReview = ({ rating, title, body }) => {
    const newReview = {
      id:        `local-${Date.now()}`,
      name:      "You",
      initials:  "ME",
      avatarBg:  "bg-primary/10",
      avatarFg:  "text-primary",
      rating,
      verified:  false,
      date:      "Just now",
      title,
      body,
      photos:    [],
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    setShowForm(false);
  };

  const allReviews = [...localReviews, ...visibleReviews];

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg">

      {/* Breadcrumb + product header */}
      <ProductHeader product={product} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-4 sticky top-24 self-start">
          <RatingSummary product={product} onWriteReview={handleWriteReview} />
          <CustomerPhotos photos={product.customerPhotos} />
        </aside>

        {/* Reviews list */}
        <section className="lg:col-span-8 space-y-4">

          {/* Scroll anchor */}
          <div id="review-form-anchor" />

          {/* Inline review form — shared InlineReviewForm component */}
          {showForm && (
            <InlineReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => setShowForm(false)}
              context="product"
            />
          )}

          <ReviewFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {allReviews.length === 0 ? (
            <div className="py-12 text-center text-xs text-on-surface-variant">
              No reviews match the selected filter.
            </div>
          ) : (
            allReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                helpfulCount={helpfulCounts[review.id] ?? 0}
                isVoted={votedIds.has(review.id)}
                onHelpful={() => toggleHelpful(review.id)}
              />
            ))
          )}

          <Pagination
            variant="load-more"
            hasMore={hasMore}
            onLoadMore={loadMore}
            label="Load More Reviews"
          />
        </section>
      </div>
    </main>
  );
}
