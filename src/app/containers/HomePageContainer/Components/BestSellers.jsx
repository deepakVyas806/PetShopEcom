"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";

export default function BestSellers({ premiumShowcase, addedItems, handleAddToCart }) {
  return (
    <section className="bg-surface-container-low py-12 border-y border-outline-variant/20 transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface text-left">Best Sellers</h2>
          <Link 
            href="/marketplace" 
            className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <span className="text-xs">→</span>
          </Link>
        </div>

        {/* Scrollable Products Row */}
        <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
          {premiumShowcase.map((product) => {
            const isAdded = addedItems[product.id];
            
            return (
              <div 
                key={product.id}
                className="min-w-[280px] w-[280px] bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant/25 rounded-xl p-4 group hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  {/* Image container */}
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 relative bg-surface-container-low border border-outline-variant/10">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={product.name}
                      src={product.image} 
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Category */}
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 leading-snug line-clamp-2 min-h-[44px]">
                    {product.name}
                  </h3>
                  <p className="text-on-surface-variant font-body-sm text-body-sm mb-3">
                    {product.description}
                  </p>
                </div>

                {/* Pricing & CTA */}
                <div className="flex justify-between items-center border-t border-outline-variant/15 pt-3 mt-1">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                      isAdded 
                        ? "bg-green-600 text-white" 
                        : "bg-secondary-container text-on-secondary-container hover:bg-primary hover:text-white"
                    }`}
                    title={isAdded ? "Added to Cart" : "Add to Cart"}
                  >
                    {isAdded ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
