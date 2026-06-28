"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";

const EXTRA_GALLERY = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAo_kONBapSdtdQXN1iLIqsgx81li30cgDA8cva9ckyj2KHwArvefh5AM2c3bwpoBQlq5TiztOFHXfRJZ7Z9yuvgCWM1R53ZwYQBJYUeLTqs6gBqbi7TGx4TGkxtwFjWjYUDq89Fnm6WgiUlSuxpXGF6YPAjHwJarKlVHWypZYySsUQ2puKX-OKbnf-JObiIhwJ6c1svFAvF3gVlucdV6Q5GEXRSeCRkaS_hSDDgRiKcHf44h-V1AbnpGvFaiB3t3HCMZPPpPFdvrSs",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCyKqrQDsfTBVnfdpYiJ9byCrZYFmQxDJpu21vwvmrTnUZ3lwn107dDmqbZ5eQKQI318xXxpgqDApPosbXxZ2ge_TR-JwK8stbnnntYh9pw-os5vagAqLGBa8bKQAvoWJUcmf3cK4V997P3E3oDH4nkvEMD1k9jdqn5wqmrCHSihwdpuiB2Ywt4oYYOI09CufqG1TBjHoV_RsLq9Mai8lsgNVSIgNIDFGuy36gRFAGuop-6mArpNaURIt861Z8s_8_xNM1BsMFKtVyi",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC3cxMdHKlvGIzLolFR5MWFHZ0fsWa5_jmD6MDohMGRVL6jBGfOLOa2iCxJPk4iW7RNOvmHiv7o7PPeg7ByBCehAGg8EHTT_0Ck90uiOfALAuoIbIPH7GvnqlUqcl_I9UGYoDo-R-uQLh5t1fM_CsDnAzgggAVKXiJtt0UAxbjnY-t74VThfKTfkoALjkDToiGSy6NYQvbRDnmZfuKVBMQ7SvW7DoQ5DbDNbbk9nww-XHCn1k6VfC2l5MppY4C_JwswZtm65mbEkQw1",
];

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function useServiceDetails(serviceId) {
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;
    Promise.all([
      api.get(`/services/${serviceId}`),
      api.get(`/services/${serviceId}/reviews?limit=10`).catch(() => ({ reviews: [] })),
    ])
      .then(([svcData, revData]) => {
        setService(svcData.service);
        setReviews(revData.reviews ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [serviceId]);

  const gallery = useMemo(
    () => (service?.image ? [service.image, ...EXTRA_GALLERY] : EXTRA_GALLERY),
    [service?.image]
  );

  const [activeImage, setActiveImage] = useState(null);
  useEffect(() => { if (service?.image) setActiveImage(service.image); }, [service]);

  const [activeTab,    setActiveTab]    = useState("Overview");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [booked,       setBooked]       = useState(false);

  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [votedIds,      setVotedIds]      = useState(new Set());

  useEffect(() => {
    const initial = {};
    reviews.forEach(r => { initial[r._id ?? r.id] = r.helpfulVotes?.length ?? 0; });
    setHelpfulCounts(initial);
  }, [reviews]);

  const toggleHelpful = async (id) => {
    const isVoted = votedIds.has(id);
    setVotedIds(prev => { const next = new Set(prev); isVoted ? next.delete(id) : next.add(id); return next; });
    setHelpfulCounts(c => ({ ...c, [id]: (c[id] ?? 0) + (isVoted ? -1 : 1) }));
    try { await api.put(`/reviews/${id}/helpful`); } catch { /* optimistic, ignore */ }
  };

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  return {
    service, loading,
    gallery, activeImage, setActiveImage,
    activeTab, setActiveTab,
    TIME_SLOTS, selectedTime, setSelectedTime,
    booked, handleBook,
    reviews, helpfulCounts, votedIds, toggleHelpful,
  };
}
