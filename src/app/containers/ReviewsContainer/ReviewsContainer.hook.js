import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";

export default function useReviewsContainer(productId) {
  const [product,   setProduct]   = useState(null);
  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy,       setSortBy]       = useState("recent");
  const [visibleCount, setVisibleCount] = useState(3);
  const [votedIds,     setVotedIds]     = useState(new Set());
  const [helpfulCounts, setHelpfulCounts] = useState({});

  useEffect(() => {
    if (!productId) return;
    Promise.all([
      api.get(`/products/${productId}`),
      api.get(`/products/${productId}/reviews`),
    ])
      .then(([pData, rData]) => {
        setProduct(pData.product);
        const revs = rData.reviews ?? [];
        setReviews(revs);
        const initial = {};
        revs.forEach(r => { initial[r._id ?? r.id] = r.helpfulVotes?.length ?? 0; });
        setHelpfulCounts(initial);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (activeFilter === "photos")   list = list.filter(r => (r.photos?.length ?? 0) > 0);
    if (activeFilter === "verified") list = list.filter(r => r.verified);
    if (sortBy === "rating")  list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "helpful") list.sort((a, b) => (helpfulCounts[b._id ?? b.id] ?? 0) - (helpfulCounts[a._id ?? a.id] ?? 0));
    return list;
  }, [reviews, activeFilter, sortBy, helpfulCounts]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore        = visibleCount < filteredReviews.length;
  const loadMore       = () => setVisibleCount(n => n + 3);

  const toggleHelpful = async (id) => {
    const isVoted = votedIds.has(id);
    setVotedIds(prev => { const n = new Set(prev); isVoted ? n.delete(id) : n.add(id); return n; });
    setHelpfulCounts(prev => ({ ...prev, [id]: (prev[id] ?? 0) + (isVoted ? -1 : 1) }));
    try { await api.put(`/reviews/${id}/helpful`); } catch { /* optimistic */ }
  };

  return {
    product, loading,
    visibleReviews, hasMore,
    helpfulCounts, votedIds,
    activeFilter, setActiveFilter,
    sortBy, setSortBy,
    loadMore, toggleHelpful,
  };
}
