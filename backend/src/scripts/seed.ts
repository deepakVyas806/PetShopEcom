/**
 * Seed script — populates MongoDB with initial products, services, and an admin user.
 * Run: cd backend && npm run seed
 */
import "dotenv/config";
import mongoose from "mongoose";
import { env } from "../config/env";
import { Product } from "../models/Product";
import { Service } from "../models/Service";
import { User } from "../models/User";
import { Coupon } from "../models/Coupon";

async function main() {
  await mongoose.connect(env.mongoUri, { maxPoolSize: 5 });
  console.log("✅ Connected to MongoDB");

  // ── Clear existing seed data ───────────────────────────────────────────────
  await Promise.all([
    Product.deleteMany({}),
    Service.deleteMany({}),
    Coupon.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing products, services, coupons");

  // ── Admin user (upsert so we don't duplicate on re-seed) ──────────────────
  await User.findOneAndUpdate(
    { email: "admin@artpetshop.in" },
    { name: "Admin Chief", email: "admin@artpetshop.in", password: "admin123", role: "admin" },
    { upsert: true, new: true }
  );
  console.log("👑 Admin user ready: admin@artpetshop.in / admin123");

  // ── Products ──────────────────────────────────────────────────────────────
  const products = [
    { name: "Royal Canin Adult Maxi", price: 2499, mrp: 2999, rating: 4.8, reviewsCount: 1240, category: "dogs", badge: "BESTSELLER", image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400", description: "Complete nutrition for large breed adult dogs.", bullets: ["30kg bag", "Chicken & rice formula", "Joint support formula"], brand: "Royal Canin", sku: "RC-ADM-001", stock: 85, maxStock: 200, petTypes: ["dogs"], featured: true, tags: ["nutrition","large-breed"] },
    { name: "Whiskas Tuna Adult", price: 349, mrp: 399, rating: 4.6, reviewsCount: 876, category: "cats", badge: "POPULAR", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400", description: "Tender tuna bites in jelly for adult cats.", bullets: ["12 × 85g pouches", "Ocean tuna", "Added taurine"], brand: "Whiskas", sku: "WH-TNA-001", stock: 220, maxStock: 500, petTypes: ["cats"], featured: true, tags: ["wet-food","tuna"] },
    { name: "Pedigree Puppy Chicken", price: 899, mrp: 1099, rating: 4.7, reviewsCount: 2340, category: "dogs", badge: "BESTSELLER", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", description: "DHA-enriched puppy food for healthy brain development.", bullets: ["3kg bag", "Real chicken & milk", "Brain & vision support"], brand: "Pedigree", sku: "PD-PUP-001", stock: 165, maxStock: 400, petTypes: ["dogs"], featured: true, tags: ["puppy","chicken"] },
    { name: "Drools Ocean Fish Adult Cat", price: 599, mrp: 749, rating: 4.5, reviewsCount: 540, category: "cats", badge: "SMART", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400", description: "High-protein cat food with ocean fish.", bullets: ["1.2kg bag", "No artificial colours", "Omega-3 for coat health"], brand: "Drools", sku: "DR-OCF-001", stock: 130, maxStock: 300, petTypes: ["cats"], tags: ["ocean-fish","coat-care"] },
    { name: "Taiyo Goldfish Flakes", price: 149, mrp: 179, rating: 4.4, reviewsCount: 320, category: "fish", badge: "POPULAR", image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400", description: "Premium flake food for goldfish and koi.", bullets: ["100g tub", "Color enhancing formula", "Easy to digest"], brand: "Taiyo", sku: "TY-GFF-001", stock: 400, maxStock: 800, petTypes: ["fish"], tags: ["flakes","goldfish"] },
    { name: "Versele-Laga Budgie Seed Mix", price: 299, mrp: 349, rating: 4.6, reviewsCount: 210, category: "birds", badge: "ARTISANAL", image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400", description: "Premium seed mix for budgerigars.", bullets: ["1kg bag", "13 natural seeds", "Vitamin fortified"], brand: "Versele-Laga", sku: "VL-BDG-001", stock: 75, maxStock: 200, petTypes: ["birds"], tags: ["seeds","budgie"] },
    { name: "Himalaya Erina-EP Tick Shampoo", price: 189, mrp: 220, rating: 4.7, reviewsCount: 1850, category: "dogs", badge: "BESTSELLER", image: "https://images.unsplash.com/photo-1621091503139-e3d61e01d6e7?w=400", description: "Anti-tick & flea shampoo with neem extracts.", bullets: ["200ml bottle", "Kills ticks & fleas", "Gentle on skin"], brand: "Himalaya", sku: "HM-SHP-001", stock: 310, maxStock: 600, petTypes: ["dogs","cats"], tags: ["grooming","anti-tick"] },
    { name: "Kong Classic Chew Toy", price: 799, mrp: 999, rating: 4.9, reviewsCount: 3200, category: "dogs", badge: "BESTSELLER", image: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=400", description: "Durable rubber chew toy — stuff with treats for enrichment.", bullets: ["Large size", "Natural red rubber", "Dishwasher safe"], brand: "Kong", sku: "KG-CLS-001", stock: 95, maxStock: 250, petTypes: ["dogs"], featured: true, tags: ["toy","enrichment"] },
  ];

  await Product.insertMany(products);
  console.log(`🛍️  Seeded ${products.length} products`);

  // ── Services ──────────────────────────────────────────────────────────────
  const services = [
    { name: "Full Grooming Spa", title: "Full Grooming Spa", subtitle: "Bath, haircut & nail trim", category: "grooming", badge: "Popular", rating: 4.9, reviewCount: 856, duration: "90 - 120 mins", price: 1499, description: "Complete grooming package including bath, blow-dry, haircut, ear cleaning, nail trim, and paw balm application.", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", petTypes: ["dogs","cats"], targetPets: "Dogs & Cats", featured: true, active: true, availability: "instant", capacity: 8, tags: ["bath","haircut","nails"] },
    { name: "Veterinary Consultation", title: "Vet Consultation", subtitle: "Online & in-clinic available", category: "veterinary", badge: "Essential", rating: 4.8, reviewCount: 1240, duration: "30 - 45 mins", price: 599, description: "Board-certified veterinarian consultation for health checkups, vaccinations, and medical advice.", image: "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?w=400", petTypes: ["dogs","cats","birds","fish"], targetPets: "All Pets", featured: true, active: true, availability: "instant", capacity: 15, tags: ["health","checkup","vaccination"] },
    { name: "Puppy Training Class", title: "Puppy Training", subtitle: "Obedience & socialisation", category: "training", badge: "Popular", rating: 4.7, reviewCount: 430, duration: "60 mins", price: 899, description: "8-week obedience and socialisation programme for puppies aged 8–16 weeks.", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400", petTypes: ["dogs"], targetPets: "Dogs (8–16 weeks)", active: true, availability: "instant", capacity: 6, tags: ["training","puppy","obedience"] },
    { name: "Pet Boarding", title: "Premium Pet Boarding", subtitle: "5-star overnight stay", category: "boarding", rating: 4.8, reviewCount: 310, duration: "Per Night", price: 799, description: "Cosy private rooms, 3 meals a day, playtime and bedtime stories. Your pet will love it.", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400", petTypes: ["dogs","cats"], targetPets: "Dogs & Cats", active: true, availability: "instant", capacity: 12, tags: ["boarding","overnight"] },
    { name: "Dog Walking", title: "Daily Dog Walking", subtitle: "30 or 60-minute walks", category: "sitting", rating: 4.6, reviewCount: 210, duration: "30 - 60 mins", price: 299, description: "GPS-tracked walks with certified dog walkers. Real-time updates sent to your phone.", image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400", petTypes: ["dogs"], targetPets: "Dogs", active: true, availability: "instant", capacity: 4, tags: ["walking","exercise"] },
    { name: "Dental Cleaning", title: "Pet Dental Cleaning", subtitle: "Professional teeth cleaning", category: "health", rating: 4.7, reviewCount: 185, duration: "45 - 60 mins", price: 1199, description: "Professional dental scaling and polishing to prevent plaque and gum disease.", image: "https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=400", petTypes: ["dogs","cats"], targetPets: "Dogs & Cats", active: true, availability: "instant", capacity: 5, tags: ["dental","health"] },
  ];

  await Service.insertMany(services);
  console.log(`💆  Seeded ${services.length} services`);

  // ── Coupons ───────────────────────────────────────────────────────────────
  const now = new Date();
  const future = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const coupons = [
    { name: "New Pet Welcome", code: "NEWPET10", description: "10% off your first order", discountType: "percent", value: 10, minOrder: 0, usageLimit: 0, startDate: now, endDate: future, status: "active" },
    { name: "Flash Sale", code: "FLASH20", description: "₹200 off on orders above ₹999", discountType: "fixed", value: 200, minOrder: 999, usageLimit: 500, startDate: now, endDate: future, status: "active" },
  ];

  await Coupon.insertMany(coupons);
  console.log(`🎟️  Seeded ${coupons.length} coupons`);

  await mongoose.disconnect();
  console.log("\n🎉  Seed complete! Your database is ready.\n");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
