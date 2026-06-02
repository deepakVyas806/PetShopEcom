"use client";

import React from "react";
import Link from "next/link";


export default function ProductCard({ 
  product, 
  isFavorite, 
  onToggleFavorite, 
  isAdded, 
  onAddToCart 
}) {
  // Render stars helper
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span 
            key={i} 
            className="material-symbols-outlined text-[10px]" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span 
            key={i} 
            className="material-symbols-outlined text-[10px]" 
            style={{ fontVariationSettings: "'FILL' 0.5" }}
          >
            star_half
          </span>
        );
      } else {
        stars.push(
          <span 
            key={i} 
            className="material-symbols-outlined text-[10px]"
          >
            star
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <article className="product-card-hover group bg-surface-container-lowest border border-[#F3E8FF] rounded-xl overflow-hidden transition-all duration-300 flex flex-col text-left">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-surface-container-low overflow-hidden">
        <Link href={`/marketplace/${product.id}`} className="block w-full h-full">
          <img 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            src={product.image} 
          />
        </Link>
        
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider text-white shadow-sm ${
              product.badge.toLowerCase().includes("sale") 
                ? "bg-primary" 
                : "bg-secondary"
            }`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur shadow-sm rounded-full text-primary hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer active:scale-95 flex items-center justify-center border-none outline-none"
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <span 
            className="material-symbols-outlined text-lg" 
            style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Product Details Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Rating and review counts */}
        <div className="flex items-center gap-1 mb-2 select-none">
          <div className="flex text-yellow-400">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm text-on-surface mb-1 group-hover:text-primary transition-colors leading-snug font-bold">
          <Link href={`/marketplace/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h4>

        {/* Description */}
        <p className="text-xs text-on-surface-variant mb-4 flex-1 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Cart Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/10">
          <div className="flex flex-col">
            <span className="text-sm text-primary font-extrabold">
              ${product.price.toFixed(2)}
            </span>
            {product.mrp && (
              <span className="text-xs text-on-surface-variant line-through font-medium leading-none mt-0.5">
                ${product.mrp.toFixed(2)}
              </span>
            )}
          </div>

          <button 
            onClick={() => onAddToCart(product)}
            className={`p-2 rounded-lg hover:shadow-md transition-all active:scale-90 cursor-pointer flex items-center justify-center border-none outline-none ${
              isAdded 
                ? "bg-primary text-white" 
                : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-white"
            }`}
            title={isAdded ? "Added to Cart" : "Add to Cart"}
          >
            <span className="material-symbols-outlined text-sm">
              {isAdded ? "check" : "shopping_basket"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
