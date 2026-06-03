"use client";

export default function StarRating({ rating, size = 18 }) {
  return (
    <div className="flex text-primary">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rating >= i;
        const half   = !filled && rating >= i - 0.5;
        return (
          <span
            key={i}
            className="material-symbols-outlined leading-none"
            style={{
              fontSize: size,
              fontVariationSettings: filled || half ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {half ? "star_half" : "star"}
          </span>
        );
      })}
    </div>
  );
}
