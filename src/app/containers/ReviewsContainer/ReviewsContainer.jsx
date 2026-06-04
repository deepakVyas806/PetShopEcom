"use client";

import useReviewsContainer  from "./ReviewsContainer.hook";
import ProductHeader         from "./Components/ProductHeader";
import RatingSummary         from "./Components/RatingSummary";
import CustomerPhotos        from "./Components/CustomerPhotos";
import ReviewFilters         from "./Components/ReviewFilters";
import ReviewCard            from "./Components/ReviewCard";
import Pagination            from "@/components/common/Pagination";

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

  return (
    <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-stack-lg">

      {/* Breadcrumb + product header */}
      <ProductHeader product={product} />

      {/* Two-column bento layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-4">
          <RatingSummary product={product} />
          <CustomerPhotos photos={product.customerPhotos} />
        </aside>

        {/* Reviews list */}
        <section className="lg:col-span-8 space-y-4">
          <ReviewFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {visibleReviews.length === 0 ? (
            <div className="py-12 text-center text-xs text-on-surface-variant">
              No reviews match the selected filter.
            </div>
          ) : (
            visibleReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                helpfulCount={helpfulCounts[review.id]}
                isVoted={votedIds.has(review.id)}
                onHelpful={() => toggleHelpful(review.id)}
              />
            ))
          )}

          {/* Load more */}
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
