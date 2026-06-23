"use client";

const glassCard = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid #F3E8FF",
};

export default function CustomerPhotos({ photos }) {
  if (!photos?.length) return null;
  return (
    <div className="p-4 rounded-xl overflow-hidden" style={glassCard}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Customer Photos
        </h3>
        <button className="text-xs text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer p-0">
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {photos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`Customer photo ${i + 1}`}
            className="rounded-lg h-20 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
        ))}
      </div>
    </div>
  );
}
