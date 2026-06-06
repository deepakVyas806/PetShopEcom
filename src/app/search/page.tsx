import { Suspense } from "react";
import SearchContainer from "@/app/containers/SearchContainer/SearchContainer";

export function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return searchParams.then(({ q }) => ({
    title: q ? `"${q}" — Search | artPetShop` : "Search | artPetShop",
  }));
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center text-xs text-on-surface-variant">
        Searching…
      </div>
    }>
      <SearchContainer />
    </Suspense>
  );
}
