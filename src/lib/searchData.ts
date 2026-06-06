/**
 * Unified search index — single source of truth for all searchable items.
 * Extend this as products/services grow; replace static arrays with API calls.
 */

export type SearchType = "product" | "service";

export interface SearchItem {
  id:       string;
  type:     SearchType;
  title:    string;
  subtitle: string;
  category: string;
  href:     string;
  image:    string;
  price:    number;
  rating?:  number;
  keywords: string[];
}

export const SEARCH_PRODUCTS: SearchItem[] = [
  {
    id: "f1", type: "product",
    title: "Royal Canin Puppy Formula",
    subtitle: "Complete nutrition for large breed puppies",
    category: "Dogs", href: "/marketplace/f1", price: 45.99, rating: 5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDESXKFifTmdMr8tiaLJ-_wu8GPNoxAv0-lu0_i6OYBAwwEibAJ7533mwcvmHvdbb5AykHnK3QEx6W9d3sO42b2Fq-R_moL9sde-5ayXwTyeyiEhqNaTg0aKcOScwiIS1YBd75eYxORnreF2JN75d41DSL9JRQ4DWBuIznWTcR060IrVnHYRABX-7JCykqHG49gtEiTqNCcQbmaK19kYdAnTgL9zPRHg2Gl3JLmuNZS6wBP-aXLh70y3MWuO7ecGn-jahRpuYHTGS5Y",
    keywords: ["royal canin", "puppy", "dog food", "kibble", "nutrition", "formula"],
  },
  {
    id: "f2", type: "product",
    title: "Purina Pro Plan Adult",
    subtitle: "High protein salmon & rice for skin and coat",
    category: "Cats", href: "/marketplace/f2", price: 32.50, rating: 4.5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWYaupJ7kQhPDsZrgyeKyYwqVxUVePftwZa-siB4kbV5tGP9dcTFQIZj_cON-8NWF4h5-_UwTDvLsTFR0200R4lfPEy8HaY_KRVd3EpLeZAHlV_DV3HVskf1WVmqi9v-AWN1n6VYln4OZJH7SvESGB_KrgALmoCw_YpS3ybPbTUwk7wVoEvbQThCDhp9SKrpBW5G7LYqYcWbAHPN4cnMy7IT5l_BwCQOkVFtGrm_-r7WAn5tWyD7A9mFo_dQ2qHLCKqunPQR2cwi",
    keywords: ["purina", "pro plan", "adult", "salmon", "cat food", "protein"],
  },
  {
    id: "f3", type: "product",
    title: "Hill's Science Active",
    subtitle: "For working dogs requiring extra energy",
    category: "Dogs", href: "/marketplace/f3", price: 62.00, rating: 4,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrHVKfbTfyQoNGJF3E_P7PiK--ZdvGEZR-wUs_X00ZmaZZ-t0E5cBqhbx9wdSi36r7l77KvNs9wYE7u9AiRKn1W-iHV55fsy-XXxhvJvjOlbi3Kc_f-MkAeKVHgI9kdOYRaL1b4my0V6ko5I_PDv5ebLANDJRuSdr4TawV8TUfmuy-JUznb5AdjKDH7Wr84UOtdMQ4pRadI9ijAVhpWSO-FZQxTQ6Sy7ijaLRxkFmpu-FSDUTFA1KReQ3G5tYEy2byA5_eriEteUQq",
    keywords: ["hills", "science", "active", "working dog", "energy", "joint"],
  },
  {
    id: "f4", type: "product",
    title: "Blue Buffalo Small Bite",
    subtitle: "Premium small-bite formula for small breeds",
    category: "Small Pets", href: "/marketplace/f4", price: 28.99, rating: 5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwEIOmLvyjCqeRLLDHScTpzhpl6unFx-yMD7dCuId2b0XRAy7NwTcvmnbLb4z6q7mK0fKL_5eWP7jBIQbLGSKK_CRGv7u00fz-Gby_mRhpGzfyrFGjmb0RKHY_KaYoRJByEIOG6CytFGx9SvD_x6Pue8tjR7D-d6lMpSPs7FgCVp-XUpUqpUVsy-_pZRll1upPTqlFsmrNdpMDpVK8fcxNR3M-JfGKbTE6-NS8l5aSHZDs0YSRH-TB2k-2",
    keywords: ["blue buffalo", "small bite", "small breed", "lifesource", "bits"],
  },
  {
    id: "p1", type: "product",
    title: "Organic Peak Nutrition",
    subtitle: "Grain-free holistic formula for optimal health",
    category: "Dogs", href: "/marketplace/p1", price: 64.99, rating: 4.8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD70Kuyk3R9WwQXyzo70SUTPGtcqUQxpXBcXJ374A6ronVEN-vdBKwBP0A-9xNW_sdGWQGzIgIywkrhwo3H-yPRX_ZCDgmlFmQtSP19NRggmZccEiOg62KFnnOJLPsPS75ytdvf_u5Zx0k9DNKa2F7yh1KSBN8rTdUWec2AMIH1LO3xj8wOyrmUPmO9F3tdE6i57zbWNiRrhOYqH1ObQsyl-acULNVEbk9vpKTLDbDKqaHzOegQLqrjTb8h6LIkRqwqNqEQd-Lk-qHM",
    keywords: ["organic", "grain free", "holistic", "nutrition", "premium", "kibble"],
  },
  {
    id: "p2", type: "product",
    title: "Traveler Luxe Carrier",
    subtitle: "Vegan leather, breathable mesh, airline approved",
    category: "Cats", href: "/marketplace/p2", price: 130.00, rating: 4.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjzAKqRLPz3ra9DhOyNaODCoVF4uC3Jjctr4Y3Por5WqmNjgWX5gWeX81CTamiP_6xC4Izl2qOq507F_TwWSW0PLzS_QM4LQ903WXszoOJ7ETxM5Q9b8-TDdHl94ArAkGMLWxhbGva_ozf7JiwSmpKovzGLGW5mUBs9vj0rSgv7M8X02ULVYnUvn159ndbem-J_acfFvEaw44Mt-V_4YLB3nvBk6nvYgWng6rJ6wmLFt5ZaaK-tb4kOtiPNSJ_codMK4DXREGJlKKr",
    keywords: ["carrier", "travel", "bag", "airline", "luxury", "cat carrier", "dog carrier"],
  },
  {
    id: "p3", type: "product",
    title: "Guardian Smart Collar",
    subtitle: "Real-time GPS tracking and health telemetry",
    category: "Dogs", href: "/marketplace/p3", price: 90.00, rating: 4.7,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf6oPbKOadpfy_JcybTehdbDijIECYyi_Ircy3hA2rp45yni0pXkJXp8nDtlOd9bZ_BSrz_VtY1bmxVMG-2ebIFhIxVsprRo5fD0rLqlwVAwfuby7JM279HeF6fJmtwEqmuYcfGTlm8iXxle7r17QCUFQAk1ljM22UScXHaLhxBgBKw7RJ_gGb74A_zz7bz0IpiPVlEulyeFRBDYqc0OTjKt5dw4dYavMJtetig1w-fZmQy7vFK3dINPN20VFY3-EatC6X3G0jwvk-",
    keywords: ["collar", "smart", "gps", "tracker", "health", "monitor", "wearable"],
  },
  {
    id: "p4", type: "product",
    title: "Artisan Ceramic Bowl",
    subtitle: "Hand-glazed stoneware, dishwasher safe",
    category: "Cats", href: "/marketplace/p4", price: 35.00, rating: 4.8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiWV3Gaum1af5SRf2ID9IhHSNzZUImNNnkspXr9nxcm8PANw5wilPJ5o0idb4sqMKKLhCw16llDd3xJcH22LZXbn6HTW9W2vNDx2VZJebOM6G2CJN4eXdKW5w4NnXXtiQvoerGY8FzsHC9iF8exMy7hsnxWdEQ2FjEHJt-7VwIBLn2EFX6ABlkuXL19JqUamLXcFNyeVFEyzhsGlxUhFn3hK5uldKlWiwk2_aaiCfpTX9fOKXsr6LLiULfaWRidIYDdGhE1hTzdAz3",
    keywords: ["bowl", "ceramic", "artisan", "stoneware", "food bowl", "water bowl"],
  },
];

export const SEARCH_SERVICES: SearchItem[] = [
  {
    id: "1", type: "service",
    title: "Signature ArtGrooming",
    subtitle: "Full spa: bath, trim, nail buff & ear clean",
    category: "Grooming", href: "/services/1", price: 85, rating: 4.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGTBSh2BJuvp2Hf8shV8z9MmZQ4UXQ3vSscx9jDsQwr4oh6SYowH7gRQL9JMLUs67yhcmXcaZWzk-8Dzp0_9rAUf1zwSoUqxriilz9ApTenm5tUXuBL0Tbu1wzxht7bchGoUTZnz8baG9jOLffisNQlhl-CtRG1yzEG8BppZh7uS_W4yEWEWs5-LFmvSgFN7R5lKiDLGPwJtuM_klM1zqRGPpHAZQTFo9VGIYaBXeYnHEK96NmQfLNLYGB24p6Qziqee7d_ilVfDDt",
    keywords: ["grooming", "groom", "bath", "spa", "trim", "nail", "haircut", "styling"],
  },
  {
    id: "2", type: "service",
    title: "Wellness Examination",
    subtitle: "Nose-to-tail checkup + nutrition consultation",
    category: "Veterinary", href: "/services/2", price: 65, rating: 5.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASnOgWLzTExTa05mipWT_nBphSAyrrh0Q2a12yqAJ3v1dikOu88YbR9oQ0UTg7rCIdjVAX7eRRbfwuTmiBZnXFVkPO1VdLF9DdUPxKMrTSIOWfjmlbOYFMrWtxbVrFN1DZV5X9FXzmzrdKArIsRSuOCxS-0VofPkWbB3go5J-jZvbuunUYHJqLQ3WjEU1-lTc2CZOniKzHzgdvlYPhH1abH29HAlkea5WQx21KZV-Jwp_S0DIkU8HnNexbVHVvI-62uJ4Q_FNG1ZNx",
    keywords: ["vet", "veterinary", "checkup", "health", "wellness", "examination", "doctor"],
  },
  {
    id: "3", type: "service",
    title: "Positive Puppy Training",
    subtitle: "Commands, leash manners & socialisation",
    category: "Training", href: "/services/3", price: 120, rating: 4.8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOefR9ENF5BF2BaZqOIfGnaYX0cqA8nNAFjYl6oRV_ezlRQAFjx2yYxQJsFTdTNjnp1TRkxvc4c640bhBlS1PHJX9qi3WtusFqUr3jU215FL_WXfAYTyHNEuzrF_y70NpNWc43HMg5yCcCvsNOQvVmYvXwlV7LtrOq8DmdVwc8ev1JDd1AZfz-SwTbAg_WP8fCc60NUi0yovya69QzQM9EFzoriWWAbPSVFC1tI-Vg1h-rWZvERUcrUgaq24KIBH6xChZyazRBgaKL",
    keywords: ["training", "train", "puppy", "obedience", "commands", "behaviour", "positive"],
  },
  {
    id: "4", type: "service",
    title: "Luxury Overnight Sitting",
    subtitle: "Feeding, walks, photo updates & playtime",
    category: "Pet Sitting", href: "/services/4", price: 95, rating: 4.7,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaT68dKQ3-hPoL2eNGD0m2XSDWAwNDQ1q5arCEOskYCqyoxRStPAV-b_b2rQi7cZ-nl_9XG0rG3PnKzFY5cvMqOXGG_981a0DSY2YicBAvsMKwIW4moLNxfYmzMFTzCoBpIhPefmEI2jJ5eaBo1oTmihva5HAm0Vjv6gb4ss1PbsZ4ReZ645ecdn8z0aQo0VNVHe81IAMCmkkmCLddN9CfLZ6F2tGIVoXbbaLCdve4RzVUqD5AFgbFaNkZGS8iL4D5WHNA7iul_T8T",
    keywords: ["sitting", "pet sitter", "boarding", "overnight", "care", "walking", "daycare"],
  },
];

export const ALL_SEARCH_ITEMS: SearchItem[] = [...SEARCH_PRODUCTS, ...SEARCH_SERVICES];

/** Score a search item against a query (higher = better match) */
export function scoreItem(item: SearchItem, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (item.title.toLowerCase().startsWith(q))   score += 10;
  if (item.title.toLowerCase().includes(q))      score += 5;
  if (item.subtitle.toLowerCase().includes(q))   score += 3;
  if (item.category.toLowerCase().includes(q))   score += 2;
  if (item.keywords.some((k) => k.includes(q)))  score += 4;
  if (item.keywords.some((k) => q.includes(k)))  score += 3;
  return score;
}

/** Return top suggestions split by type */
export function getSuggestions(query: string, maxPerType = 4) {
  if (query.trim().length < 2) return { products: [], services: [] };
  const q = query.toLowerCase();

  const scored = ALL_SEARCH_ITEMS
    .map((item) => ({ item, score: scoreItem(item, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const products = scored.filter((s) => s.item.type === "product").slice(0, maxPerType).map((s) => s.item);
  const services = scored.filter((s) => s.item.type === "service").slice(0, maxPerType).map((s) => s.item);
  return { products, services };
}
