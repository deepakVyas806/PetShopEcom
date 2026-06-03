"use client";

import Link from "next/link";

export default function MiniMap() {
  return (
    <Link href="/track-order" className="block rounded-xl overflow-hidden h-28 relative group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW-kKmwARcl1TbDe5Nt8LSJijDQcqYKnp-wGbNqh8WpQWeLV4MT_gTR4s2PQKLEZbTQUJpsAKI9SSipIhUdsVAUCTIAJc21iWRr2lEkHmtQsK5qHa0O747wzGYyaHuyLXRZ9qCSBx-7Cq8D0WcDePwN8thY3oXrdwDhji-j9CvAe-aneXoorZCD3QYwDXd9BEGtZCawE6H0eowQD9ajTK6mDQXzjUNUSsVwXQ3PkivcdJ_99ffewho7DMsG5avAKRdhJyCv1Xl6ZpY"
        alt="Delivery route map"
        className="w-full h-full object-cover"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="bg-white/90 px-3 py-1 rounded-full text-primary text-[10px] font-bold shadow-sm">
          View full tracking map
        </span>
      </div>
    </Link>
  );
}
