"use client";

import React from "react";
import Link from "next/link";

export default function CartItemRow({ item, onUpdateQuantity, onRemoveItem }) {
  return (
    <div className="bg-white dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-[0_4px_12px_rgba(124,58,237,0.05)] transition-all duration-300 group text-left">
      
      {/* Thumbnail Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 self-center">
        <img 
          alt={item.product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={item.product.image} 
        />
      </div>

      {/* Item Description Info */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xs font-bold text-on-surface leading-tight hover:text-primary transition-colors">
              <Link href={`/marketplace/${item.product.id}`}>
                {item.product.name}
              </Link>
            </h3>
            <span className="text-xs font-bold text-primary flex-shrink-0">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
          
          <p className="text-on-surface-variant text-[11px] mt-1 select-none">
            Category: <span className="capitalize">{item.product.category}</span> | Brand: {item.product.brand || "Premium Choice"}
          </p>

          {/* Stock Status indicator */}
          <div className="flex items-center mt-1 text-green-600 text-[10px] font-bold select-none">
            <span className="material-symbols-outlined text-xs mr-0.5">check_circle</span>
            In Stock
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between mt-3 gap-3 pt-2 border-t border-outline-variant/5">
          
          {/* Unified Height Minimal Qty Box */}
          <div className="flex items-center bg-surface-container-low rounded-full px-1.5 py-0.5 border border-outline-variant/30 h-7 select-none">
            <button 
              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
              className="w-5.5 h-5.5 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer text-xs font-bold border-none outline-none bg-transparent"
              type="button"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-bold text-on-surface">
              {item.quantity}
            </span>
            <button 
              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              className="w-5.5 h-5.5 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer text-xs font-bold border-none outline-none bg-transparent"
              type="button"
            >
              +
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 select-none">
            <button 
              className="flex items-center text-primary hover:underline text-[10px] font-bold cursor-pointer transition-all border-none outline-none bg-transparent"
              type="button"
            >
              <span className="material-symbols-outlined text-xs mr-0.5">bookmark</span>
              Save for later
            </button>
            <button 
              onClick={() => onRemoveItem(item.product.id)}
              className="flex items-center text-error hover:opacity-85 text-[10px] font-bold cursor-pointer transition-all border-none outline-none bg-transparent"
              type="button"
            >
              <span className="material-symbols-outlined text-xs mr-0.5">delete</span>
              Remove
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
