"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import PageHeader from "@/components/common/PageHeader";
import { IconChevronRight } from "@/lib/icons";

export default function ProductHeader({ product }) {
  return (
    <>
      {/* Shared page header with breadcrumb */}
      <PageHeader
        breadcrumbs={[
          { label: "Home",              href: "/"            },
          { label: product.category,    href: "/marketplace" },
          { label: product.name                              },
        ]}
        title={product.name}
      />

      {/* Product image + rating strip */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-center">
        <div className="md:col-span-2">
          <div className="rounded-xl overflow-hidden aspect-square border border-outline-variant/30 w-20 md:w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StarRating rating={product.rating} size={14} />
            <span className="text-xs font-bold text-on-surface">{product.rating} out of 5</span>
            <Link href="/reviews" className="text-xs text-primary font-semibold hover:underline">
              ({product.reviewCount?.toLocaleString()} reviews)
            </Link>
            <span className="text-outline-variant/60">·</span>
            <Link href="/reviews" className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5">
              See all reviews
              <IconChevronRight size={13} className="leading-none" weight="regular" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
