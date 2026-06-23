/**
 * Seed script — upserts products and services into MongoDB.
 * Run with:  npm run seed   (from /backend directory)
 * Re-running is safe — existing docs are updated with latest field values.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { Service } from "../models/Service";
import { Order }   from "../models/Order";
import { User }    from "../models/User";

const MONGO_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/artpetshop";

// ─── Products ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name: "Royal Canin Adult Dog Dry Food",
    sku: "RC-DOG-001",
    category: "Dog Food",
    brand: "Royal Canin",
    price: 1899,
    mrp: 2199,
    stock: 48,
    maxStock: 100,
    status: "In Stock",
    description:
      "Balanced nutrition formula for adult dogs aged 1–7 years. Supports digestive health and ideal body weight with precise nutrient balance and highly digestible proteins.",
    bullets: [
      "Supports healthy skin & coat with Omega-3 & Omega-6",
      "Optimal stool quality and digestive health",
      "Exclusive kibble shape for medium breed dogs",
    ],
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
      "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400",
    ],
    petTypes: ["Dogs"],
    lifeStage: "Adult",
    weight: "3 kg",
    dimensions: "30x20x10 cm",
    rating: 4.5,
    reviewsCount: 238,
    featured: true,
    active: true,
    visibility: "public",
    tags: ["Dog Food", "Premium", "Dry Food"],
    urlSlug: "royal-canin-adult-dog-dry-food",
    metaTitle: "Royal Canin Adult Dog Dry Food | ArtPetShop",
    metaDescription: "Balanced nutrition for adult dogs. Supports digestion and ideal body weight.",
    nutritionFacts: {
      crudeProtein: "26.0%",
      crudeFat:     "16.0%",
      crudeFiber:   "3.3%",
      omega3:       "0.78%",
      omega6:       "3.2%",
      moisture:     "8.5%",
    },
    sourcing:
      "Royal Canin sources premium proteins from certified European farms. Chicken and rice ingredients are fully traceable from farm to bag, with every facility ISO-certified and independently audited.\n\nWe partner with sustainable fisheries and verified poultry farms to ensure highest quality while meeting our environmental commitments.\n\n100% traceable supply chain — from ingredient origin to your pet's bowl.",
    variants: [
      { name: "3 kg",  price: 1899, stock: 48 },
      { name: "8 kg",  price: 4299, stock: 22 },
      { name: "15 kg", price: 7499, stock: 10 },
    ],
  },
  {
    name: "Whiskas Kitten Wet Food Pouches",
    sku: "WK-CAT-002",
    category: "Cat Food",
    brand: "Whiskas",
    price: 349,
    mrp: 420,
    stock: 120,
    maxStock: 200,
    status: "In Stock",
    description:
      "Delicious wet food pouches specially formulated for kittens under 1 year. Rich in taurine for healthy heart and vision development.",
    bullets: [
      "Rich in taurine for heart and vision",
      "No artificial flavours or colours",
      "12 pouches of 85g each",
    ],
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
    images: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
    ],
    petTypes: ["Cats"],
    lifeStage: "Kitten",
    weight: "1.02 kg (12 x 85g)",
    dimensions: "20x15x8 cm",
    rating: 4.3,
    reviewsCount: 182,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Cat Food", "Wet Food", "Kitten"],
    urlSlug: "whiskas-kitten-wet-food-pouches",
    metaTitle: "Whiskas Kitten Wet Food Pouches | ArtPetShop",
    metaDescription: "Specially formulated wet food pouches for kittens under 1 year.",
    nutritionFacts: {
      crudeProtein: "10.5%",
      crudeFat:     "4.8%",
      crudeFiber:   "0.5%",
      omega3:       "0.24%",
      omega6:       "1.1%",
      moisture:     "79.0%",
    },
    sourcing:
      "Whiskas sources quality fish and poultry from approved suppliers who meet strict welfare and sustainability standards. All ingredients undergo full traceability checks back to the source farm or fishery.\n\n100% responsibly sourced protein — no artificial preservatives or flavour enhancers.",
    variants: [
      { name: "12 Pouches", price: 349, stock: 120 },
      { name: "24 Pouches", price: 649, stock: 55  },
    ],
  },
  {
    name: "Kong Classic Dog Chew Toy",
    sku: "KONG-DOG-003",
    category: "Toys",
    brand: "Kong",
    price: 599,
    mrp: 799,
    stock: 65,
    maxStock: 150,
    status: "In Stock",
    description:
      "The KONG Classic chew toy satisfies dogs' natural instinct to chew. Stuffable with treats to keep your dog engaged for hours. Made from natural rubber.",
    bullets: [
      "Natural rubber — safe for aggressive chewers",
      "Stuffable with treats or kibble",
      "Helps with anxiety and boredom",
    ],
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    ],
    petTypes: ["Dogs"],
    lifeStage: "All Stages",
    weight: "180 g",
    dimensions: "9x9x12 cm",
    rating: 4.8,
    reviewsCount: 412,
    featured: true,
    active: true,
    visibility: "public",
    tags: ["Toy", "Chew", "Interactive"],
    urlSlug: "kong-classic-dog-chew-toy",
    metaTitle: "Kong Classic Dog Chew Toy | ArtPetShop",
    metaDescription: "Stuffable natural rubber toy. Keeps dogs engaged and reduces anxiety.",
    sourcing:
      "KONG toys are manufactured in the USA using natural, non-toxic rubber sourced from responsibly managed rubber plantations in Southeast Asia.\n\nAll materials are BPA-free and tested to EN 71 toy safety standards. KONG has been manufacturing pet toys since 1976 and holds ISO 9001 quality certification.",
    variants: [
      { name: "Small (S)",  price: 449, stock: 30 },
      { name: "Medium (M)", price: 599, stock: 65 },
      { name: "Large (L)",  price: 749, stock: 20 },
      { name: "XL",         price: 899, stock: 12 },
    ],
  },
  {
    name: "Pedigree Dentastix Daily Dental Chews",
    sku: "PDG-DNS-004",
    category: "Treats",
    brand: "Pedigree",
    price: 279,
    mrp: 320,
    stock: 95,
    maxStock: 200,
    status: "In Stock",
    description:
      "Dentastix is the #1 vet-recommended dental treat. The unique X-shape reaches deep between teeth to help reduce tartar build-up by up to 80%.",
    bullets: [
      "Reduces tartar build-up up to 80%",
      "Unique X-shape cleans hard-to-reach areas",
      "Low in fat — suitable for daily feeding",
    ],
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    ],
    petTypes: ["Dogs"],
    lifeStage: "Adult",
    weight: "270 g (7 sticks)",
    dimensions: "22x14x4 cm",
    rating: 4.6,
    reviewsCount: 573,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Dental", "Treats", "Oral Care"],
    urlSlug: "pedigree-dentastix-dental-chews",
    metaTitle: "Pedigree Dentastix Daily Dental Chews | ArtPetShop",
    metaDescription: "Vet-recommended dental treats. Reduces tartar build-up by up to 80%.",
    nutritionFacts: {
      crudeProtein: "9.0%",
      crudeFat:     "5.5%",
      crudeFiber:   "2.0%",
      moisture:     "14.0%",
    },
    sourcing:
      "Pedigree sources cereal grains and meat derivatives from audited European and North American suppliers. All Dentastix products are manufactured under strict quality controls with microbiological and nutritional testing on every batch.\n\nPedigree is committed to responsible sourcing and reducing packaging waste across all product lines.",
    variants: [],
  },
  {
    name: "Himalaya Erina EP Dog Shampoo",
    sku: "HIM-SHP-005",
    category: "Grooming",
    brand: "Himalaya",
    price: 189,
    mrp: 225,
    stock: 72,
    maxStock: 150,
    status: "In Stock",
    description:
      "Herbal shampoo that cleanses, conditions and deodorises your pet's coat. Contains Neem and Silk Proteins for a shiny, tangle-free coat.",
    bullets: [
      "Neem extract — natural antimicrobial",
      "Silk proteins for silky smooth coat",
      "pH balanced — gentle on skin",
    ],
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=400",
    images: [
      "https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=400",
    ],
    petTypes: ["Dogs", "Cats"],
    lifeStage: "All Stages",
    weight: "400 ml",
    dimensions: "7x7x18 cm",
    rating: 4.2,
    reviewsCount: 164,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Shampoo", "Herbal", "Grooming"],
    urlSlug: "himalaya-erina-ep-dog-shampoo",
    metaTitle: "Himalaya Erina EP Dog Shampoo | ArtPetShop",
    metaDescription: "Herbal shampoo with Neem and Silk Proteins for a shiny, clean coat.",
    sourcing:
      "Himalaya sources Neem extract from organic farms in South India certified under NPOP (National Programme for Organic Production). Silk proteins are ethically sourced from certified sericulture farms.\n\nAll Himalaya products are manufactured in GMP and ISO 9001-certified facilities. Cruelty-free and free from SLS, parabens and artificial colours.",
    variants: [
      { name: "200 ml", price: 109, stock: 40 },
      { name: "400 ml", price: 189, stock: 72 },
    ],
  },
  {
    name: "PetFed Stainless Steel Dog Bowl Set",
    sku: "PF-BOWL-006",
    category: "Accessories",
    brand: "PetFed",
    price: 349,
    mrp: 450,
    stock: 88,
    maxStock: 150,
    status: "In Stock",
    description:
      "Durable stainless steel double bowl set with non-slip rubber base. Dishwasher safe and rust-proof. Suitable for food and water.",
    bullets: [
      "Food-grade stainless steel",
      "Non-slip silicone base prevents spills",
      "Set of 2 bowls — 600ml each",
    ],
    image: "https://images.unsplash.com/photo-1601758177266-bc599de87707?w=400",
    images: [
      "https://images.unsplash.com/photo-1601758177266-bc599de87707?w=400",
    ],
    petTypes: ["Dogs", "Cats"],
    lifeStage: "All Stages",
    weight: "320 g",
    dimensions: "28x14x6 cm",
    rating: 4.4,
    reviewsCount: 92,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Bowl", "Steel", "Accessories"],
    urlSlug: "petfed-stainless-steel-dog-bowl-set",
    metaTitle: "PetFed Stainless Steel Dog Bowl Set | ArtPetShop",
    metaDescription: "Durable stainless steel double bowl set with non-slip rubber base.",
    sourcing:
      "PetFed uses food-grade 304 stainless steel sourced from certified Indian steel mills. Silicone bases are made from FDA-approved food-safe silicone.\n\nAll bowls are tested for heavy metals and comply with BIS and food-contact safety standards. Manufactured and quality-controlled in India.",
    variants: [
      { name: "Small (300 ml each)",  price: 249, stock: 35 },
      { name: "Medium (600 ml each)", price: 349, stock: 88 },
      { name: "Large (1 L each)",     price: 449, stock: 20 },
    ],
  },
  {
    name: "Trixie Cat Scratching Post with Toy",
    sku: "TRX-CAT-007",
    category: "Cat Accessories",
    brand: "Trixie",
    price: 899,
    mrp: 1100,
    stock: 34,
    maxStock: 80,
    status: "In Stock",
    description:
      "Sturdy sisal scratching post with an interactive dangling toy ball. Helps cats maintain healthy claws while keeping them entertained.",
    bullets: [
      "Natural sisal rope scratching surface",
      "Weighted base for stability",
      "Dangling toy ball for extra engagement",
    ],
    image: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400",
    images: [
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400",
    ],
    petTypes: ["Cats"],
    lifeStage: "All Stages",
    weight: "1.2 kg",
    dimensions: "25x25x45 cm",
    rating: 4.1,
    reviewsCount: 78,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Scratching Post", "Cat Toy", "Sisal"],
    urlSlug: "trixie-cat-scratching-post-toy",
    metaTitle: "Trixie Cat Scratching Post with Toy | ArtPetShop",
    metaDescription: "Sisal scratching post with dangling toy ball for cats.",
    sourcing:
      "Trixie sources natural sisal rope from certified agave farms in Mexico and East Africa, where sisal is a sustainable, fast-growing crop requiring minimal pesticides.\n\nAll wood components are FSC-certified. Trixie is committed to reducing plastic packaging and uses recycled cardboard for all product boxes.",
    variants: [],
  },
  {
    name: "Drools Focus Puppy Super Premium Food",
    sku: "DRL-PUP-008",
    category: "Dog Food",
    brand: "Drools",
    price: 949,
    mrp: 1099,
    stock: 55,
    maxStock: 120,
    status: "In Stock",
    description:
      "Super premium puppy food with DHA for brain development, Calcium and Phosphorus for strong bones. Made with real chicken, no artificial preservatives.",
    bullets: [
      "DHA for brain and eye development",
      "Calcium & Phosphorus for strong bones",
      "No artificial preservatives or colours",
    ],
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    ],
    petTypes: ["Dogs"],
    lifeStage: "Puppy",
    weight: "3 kg",
    dimensions: "28x18x10 cm",
    rating: 4.5,
    reviewsCount: 299,
    featured: true,
    active: true,
    visibility: "public",
    tags: ["Puppy Food", "Premium", "Chicken"],
    urlSlug: "drools-focus-puppy-super-premium-food",
    metaTitle: "Drools Focus Puppy Super Premium Dog Food | ArtPetShop",
    metaDescription: "Super premium puppy food with DHA for brain development and real chicken.",
    nutritionFacts: {
      crudeProtein: "30.0%",
      crudeFat:     "12.0%",
      crudeFiber:   "4.5%",
      omega3:       "0.6%",
      omega6:       "2.4%",
      moisture:     "10.0%",
    },
    sourcing:
      "Drools sources real chicken from FSSAI-certified farms across India. No imported by-products or meat meal fillers — only whole-muscle chicken.\n\nManufactured under GMP-certified facilities in India with full batch traceability. Every bag is tested for nutritional compliance and heavy metals before release.\n\nProudly made in India — supporting local farmers and the domestic pet nutrition industry.",
    variants: [
      { name: "1.2 kg", price: 449,  stock: 80 },
      { name: "3 kg",   price: 949,  stock: 55 },
      { name: "10 kg",  price: 2699, stock: 18 },
    ],
  },
  {
    name: "Pet-In-India Adjustable No-Pull Dog Harness",
    sku: "PII-HRN-009",
    category: "Accessories",
    brand: "Pet-In-India",
    price: 499,
    mrp: 649,
    stock: 42,
    maxStock: 100,
    status: "In Stock",
    description:
      "No-pull step-in harness with reflective strips for night walks. Easy one-click buckle with four adjustment points for a perfect fit.",
    bullets: [
      "No-pull design reduces leash pressure on neck",
      "Reflective strips for low-light visibility",
      "4-point adjustment for perfect fit",
    ],
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400",
    images: [
      "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400",
    ],
    petTypes: ["Dogs"],
    lifeStage: "All Stages",
    weight: "150 g",
    dimensions: "Adjustable",
    rating: 4.3,
    reviewsCount: 147,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Harness", "Walk", "Accessories"],
    urlSlug: "pet-in-india-no-pull-dog-harness",
    metaTitle: "Pet-In-India Adjustable No-Pull Dog Harness | ArtPetShop",
    metaDescription: "No-pull step-in harness with reflective strips and 4-point adjustment.",
    sourcing:
      "Pet-In-India designs and manufactures harnesses entirely within India using high-tensile nylon webbing from certified Indian textile mills. Reflective strips comply with EN 13356 visibility standards.\n\nAll metal hardware is zinc-alloy, rust-resistant and load-tested to 3× the rated weight. Supporting Indian manufacturing and local craftsmanship.",
    variants: [
      { name: "Small",   price: 399, stock: 25 },
      { name: "Medium",  price: 499, stock: 42 },
      { name: "Large",   price: 599, stock: 18 },
      { name: "X-Large", price: 699, stock: 8  },
    ],
  },
  {
    name: "Iams Proactive Health Senior Cat Food",
    sku: "IAMS-CAT-010",
    category: "Cat Food",
    brand: "Iams",
    price: 1249,
    mrp: 1499,
    stock: 30,
    maxStock: 80,
    status: "In Stock",
    description:
      "Specially formulated for cats 7+ years. Supports kidney health with controlled phosphorus, joint health with Glucosamine, and immunity with antioxidants.",
    bullets: [
      "Controlled phosphorus for kidney health",
      "Glucosamine for joint support",
      "L-carnitine to maintain healthy weight",
    ],
    image: "https://images.unsplash.com/photo-1574144113084-b6f450cc5e5e?w=400",
    images: [
      "https://images.unsplash.com/photo-1574144113084-b6f450cc5e5e?w=400",
    ],
    petTypes: ["Cats"],
    lifeStage: "Senior",
    weight: "2 kg",
    dimensions: "24x16x8 cm",
    rating: 4.4,
    reviewsCount: 88,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Cat Food", "Senior", "Premium"],
    urlSlug: "iams-proactive-health-senior-cat-food",
    metaTitle: "Iams Proactive Health Senior Cat Food | ArtPetShop",
    metaDescription: "Formulated for cats 7+. Supports kidney health, joint health, and immunity.",
    nutritionFacts: {
      crudeProtein: "33.0%",
      crudeFat:     "13.0%",
      crudeFiber:   "3.0%",
      omega3:       "0.5%",
      omega6:       "2.6%",
      moisture:     "8.0%",
    },
    sourcing:
      "Iams sources proteins from North American and European farms certified to the highest animal welfare standards. Real chicken is the #1 ingredient, sourced from audited free-range poultry farms.\n\nAll formulas are co-developed with board-certified veterinary nutritionists and manufactured in ISO 9001-certified facilities with third-party quality audits.",
    variants: [
      { name: "2 kg",    price: 1249, stock: 30 },
      { name: "7.26 kg", price: 3799, stock: 10 },
    ],
  },
  {
    name: "Beaphar Anti-Tick & Flea Spray",
    sku: "BPH-FLT-011",
    category: "Health & Wellness",
    brand: "Beaphar",
    price: 449,
    mrp: 549,
    stock: 60,
    maxStock: 120,
    status: "In Stock",
    description:
      "Fast-acting spray that kills ticks, fleas and lice on contact. Safe for dogs and cats from 6 months. Provides 8 weeks of protection per application.",
    bullets: [
      "Kills ticks, fleas and lice on contact",
      "8 weeks protection per application",
      "Alcohol-free formula — gentle on skin",
    ],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    ],
    petTypes: ["Dogs", "Cats"],
    lifeStage: "Adult",
    weight: "400 ml",
    dimensions: "6x6x20 cm",
    rating: 4.2,
    reviewsCount: 203,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Anti-Tick", "Flea", "Health"],
    urlSlug: "beaphar-anti-tick-flea-spray",
    metaTitle: "Beaphar Anti-Tick & Flea Spray | ArtPetShop",
    metaDescription: "Fast-acting spray for ticks, fleas and lice. 8 weeks of protection.",
    sourcing:
      "Beaphar is a Dutch company that sources active pharmaceutical ingredients from certified EU GMP suppliers. All compounds are registered with the European Medicines Agency and are stringently tested for safety and efficacy.\n\nBeaphar operates an alcohol-free, eco-friendly manufacturing process. Products are registered in India as veterinary formulations under CDSCO guidelines.",
    variants: [],
  },
  {
    name: "Ferplast Rabbit Cage Grande Vision",
    sku: "FPL-RBT-012",
    category: "Small Animal Supplies",
    brand: "Ferplast",
    price: 3499,
    mrp: 4299,
    stock: 12,
    maxStock: 30,
    status: "Low Stock",
    description:
      "Spacious rabbit cage with transparent side panels for 360-degree visibility. Includes water bottle, food dish and removable plastic base for easy cleaning.",
    bullets: [
      "Large 80x50x45 cm interior space",
      "Removable base for easy cleaning",
      "Includes bottle, bowl and wooden chew toy",
    ],
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400",
    images: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400",
    ],
    petTypes: ["Small Animals"],
    lifeStage: "All Stages",
    weight: "3.8 kg",
    dimensions: "80x50x45 cm",
    rating: 4.0,
    reviewsCount: 45,
    featured: false,
    active: true,
    visibility: "public",
    tags: ["Cage", "Rabbit", "Small Animals"],
    urlSlug: "ferplast-rabbit-cage-grande-vision",
    metaTitle: "Ferplast Grande Vision Rabbit Cage | ArtPetShop",
    metaDescription: "Spacious rabbit cage with 360-degree visibility and easy-clean removable base.",
    sourcing:
      "Ferplast has manufactured pet products in Italy since 1966. All metal wire is galvanised steel sourced from EU-certified mills and treated to be rust-proof and non-toxic. Plastic components are made from virgin HDPE free from BPA and phthalates.\n\nFerplast holds ISO 9001 and ISO 14001 (environmental management) certifications.",
    variants: [],
  },
];

// ─── Services ────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    name: "Full Grooming Package — Dogs",
    title: "Full Grooming Package for Dogs",
    category: "Grooming",
    price: 799,
    duration: "90 min",
    capacity: 6,
    description:
      "Our signature full grooming service includes a luxurious bath with premium shampoo and conditioner, blow-dry, breed-specific haircut, nail clipping, ear cleaning, and finishing spritz.",
    includes: "Bath, Blow-dry, Haircut, Nail clip, Ear clean, Spritz",
    specialist: "Certified Master Groomer",
    badge: "grooming",
    image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400",
    images: [
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400",
    ],
    petTypes: ["Dogs"],
    targetPets: "Dogs",
    availability: "instant",
    featured: true,
    active: true,
    visibility: "public",
    rating: 4.8,
    reviewCount: 312,
    tags: ["Grooming", "Bath", "Haircut"],
    operatingHours: [
      { day: "Monday",    start: "09:00", end: "18:00" },
      { day: "Tuesday",   start: "09:00", end: "18:00" },
      { day: "Wednesday", start: "09:00", end: "18:00" },
      { day: "Thursday",  start: "09:00", end: "18:00" },
      { day: "Friday",    start: "09:00", end: "18:00" },
      { day: "Saturday",  start: "10:00", end: "17:00" },
    ],
  },
  {
    name: "Cat Grooming & Deshedding",
    title: "Cat Grooming & Deshedding Session",
    category: "Grooming",
    price: 599,
    duration: "60 min",
    capacity: 4,
    description:
      "Gentle grooming session tailored for cats. Includes a calming bath with cat-specific shampoo, deshedding treatment, nail trim, and ear inspection.",
    includes: "Bath, Deshedding, Nail trim, Ear inspection",
    specialist: "Feline Grooming Specialist",
    badge: "cat",
    image: "https://images.unsplash.com/photo-1574144113084-b6f450cc5e5e?w=400",
    images: [
      "https://images.unsplash.com/photo-1574144113084-b6f450cc5e5e?w=400",
    ],
    petTypes: ["Cats"],
    targetPets: "Cats",
    availability: "instant",
    featured: false,
    active: true,
    visibility: "public",
    rating: 4.6,
    reviewCount: 145,
    tags: ["Cat Grooming", "Deshedding"],
    operatingHours: [
      { day: "Tuesday",  start: "10:00", end: "17:00" },
      { day: "Thursday", start: "10:00", end: "17:00" },
      { day: "Saturday", start: "10:00", end: "16:00" },
    ],
  },
  {
    name: "Veterinary Consultation",
    title: "In-Clinic Veterinary Consultation",
    category: "Veterinary",
    price: 499,
    duration: "30 min",
    capacity: 12,
    description:
      "One-on-one consultation with our experienced veterinarians. Covers general health check-up, vaccination advice, dietary guidance and prescription if required.",
    includes: "Health check, Vaccination advice, Diet counselling, Prescription",
    specialist: "Registered Veterinarian (BVSc & AH)",
    badge: "vet",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400",
    images: [
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400",
    ],
    petTypes: ["Dogs", "Cats", "Small Animals"],
    targetPets: "All Pets",
    availability: "instant",
    featured: true,
    active: true,
    visibility: "public",
    rating: 4.9,
    reviewCount: 528,
    tags: ["Vet", "Health Check", "Consultation"],
    operatingHours: [
      { day: "Monday",    start: "09:00", end: "20:00" },
      { day: "Tuesday",   start: "09:00", end: "20:00" },
      { day: "Wednesday", start: "09:00", end: "20:00" },
      { day: "Thursday",  start: "09:00", end: "20:00" },
      { day: "Friday",    start: "09:00", end: "20:00" },
      { day: "Saturday",  start: "09:00", end: "17:00" },
      { day: "Sunday",    start: "10:00", end: "14:00" },
    ],
  },
  {
    name: "Pet Boarding — Overnight Stay",
    title: "Overnight Pet Boarding",
    category: "Boarding",
    price: 999,
    duration: "24 hours",
    capacity: 10,
    description:
      "Safe and comfortable overnight boarding for your dog or cat. Trained staff provide personalised care, playtime, meals and medication if needed. CCTV-monitored 24/7.",
    includes: "Cosy kennel, 2 meals, Playtime, Medication, CCTV monitoring",
    specialist: "Trained Pet Care Staff",
    badge: "boarding",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    ],
    petTypes: ["Dogs", "Cats"],
    targetPets: "Dogs & Cats",
    availability: "instant",
    featured: false,
    active: true,
    visibility: "public",
    rating: 4.5,
    reviewCount: 189,
    tags: ["Boarding", "Overnight", "Stay"],
    operatingHours: [
      { day: "Monday",    start: "08:00", end: "20:00" },
      { day: "Tuesday",   start: "08:00", end: "20:00" },
      { day: "Wednesday", start: "08:00", end: "20:00" },
      { day: "Thursday",  start: "08:00", end: "20:00" },
      { day: "Friday",    start: "08:00", end: "20:00" },
      { day: "Saturday",  start: "08:00", end: "20:00" },
      { day: "Sunday",    start: "09:00", end: "18:00" },
    ],
  },
  {
    name: "Puppy Basic Obedience Training",
    title: "Puppy Basic Obedience Training Course",
    category: "Training",
    price: 1499,
    duration: "60 min",
    capacity: 5,
    description:
      "8-session puppy training course covering sit, stay, down, come, leash walking and socialisation. Positive reinforcement only. Certificate awarded on completion.",
    includes: "8 sessions, Training kit, Completion certificate",
    specialist: "Certified Dog Trainer (CPDT-KA)",
    badge: "training",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
    ],
    petTypes: ["Dogs"],
    targetPets: "Puppies (8 weeks to 6 months)",
    availability: "waitlist",
    featured: true,
    active: true,
    visibility: "public",
    rating: 4.9,
    reviewCount: 97,
    tags: ["Training", "Puppy", "Obedience"],
    operatingHours: [
      { day: "Wednesday", start: "10:00", end: "16:00" },
      { day: "Saturday",  start: "09:00", end: "15:00" },
      { day: "Sunday",    start: "09:00", end: "15:00" },
    ],
  },
  {
    name: "Dental Scaling & Polishing",
    title: "Pet Dental Scaling & Polishing",
    category: "Dental Care",
    price: 1199,
    duration: "45 min",
    capacity: 8,
    description:
      "Professional dental cleaning under safe sedation. Removes tartar, plaque and stains. Includes full oral exam, scaling, polishing and fluoride treatment.",
    includes: "Oral exam, Scaling, Polishing, Fluoride treatment, Report",
    specialist: "Veterinary Dentist",
    badge: "dental",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400",
    images: [
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400",
    ],
    petTypes: ["Dogs", "Cats"],
    targetPets: "Dogs & Cats",
    availability: "instant",
    featured: false,
    active: true,
    visibility: "public",
    rating: 4.7,
    reviewCount: 63,
    tags: ["Dental", "Scaling", "Oral Health"],
    operatingHours: [
      { day: "Monday",    start: "10:00", end: "17:00" },
      { day: "Wednesday", start: "10:00", end: "17:00" },
      { day: "Friday",    start: "10:00", end: "17:00" },
    ],
  },
  {
    name: "Pet Spa & Aromatherapy",
    title: "Luxury Pet Spa & Aromatherapy",
    category: "Spa",
    price: 1299,
    duration: "120 min",
    capacity: 3,
    description:
      "The ultimate pampering experience. Aromatherapy bath with essential oil infusion, hot-towel wrap, blueberry facial, pawdicure and finishing coat serum.",
    includes: "Aromatherapy bath, Hot towel, Blueberry facial, Pawdicure, Coat serum",
    specialist: "Senior Pet Spa Therapist",
    badge: "spa",
    image: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=400",
    images: [
      "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=400",
    ],
    petTypes: ["Dogs"],
    targetPets: "Dogs",
    availability: "instant",
    featured: true,
    active: true,
    visibility: "public",
    rating: 4.8,
    reviewCount: 44,
    tags: ["Spa", "Luxury", "Aromatherapy"],
    operatingHours: [
      { day: "Thursday", start: "10:00", end: "18:00" },
      { day: "Friday",   start: "10:00", end: "18:00" },
      { day: "Saturday", start: "10:00", end: "17:00" },
    ],
  },
  {
    name: "Puppy Vaccination Package",
    title: "Puppy Vaccination & Health Package",
    category: "Veterinary",
    price: 1899,
    duration: "40 min",
    capacity: 15,
    description:
      "Complete puppy vaccination covering DHPP, Leptospirosis and Rabies. Includes health record booklet, deworming and microchip option.",
    includes: "DHPP vaccine, Leptospira, Rabies, Health booklet, Deworming",
    specialist: "Registered Veterinarian",
    badge: "vaccination",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400",
    images: [
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400",
    ],
    petTypes: ["Dogs"],
    targetPets: "Puppies (6 to 16 weeks)",
    availability: "instant",
    featured: false,
    active: true,
    visibility: "public",
    rating: 4.9,
    reviewCount: 231,
    tags: ["Vaccination", "Puppy", "Health"],
    operatingHours: [
      { day: "Monday",    start: "09:00", end: "18:00" },
      { day: "Wednesday", start: "09:00", end: "18:00" },
      { day: "Friday",    start: "09:00", end: "18:00" },
      { day: "Saturday",  start: "09:00", end: "16:00" },
    ],
  },
];

// ─── Run ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Connecting to MongoDB:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("Connected\n");

  // Products — upsert by SKU so re-running picks up new fields
  console.log("Upserting products...");
  let pInserted = 0, pUpdated = 0;
  for (const p of PRODUCTS) {
    const result = await Product.updateOne({ sku: p.sku }, { $set: p }, { upsert: true });
    if (result.upsertedCount > 0) {
      console.log(`  inserted: ${p.name}`);
      pInserted++;
    } else {
      console.log(`  updated:  ${p.name}`);
      pUpdated++;
    }
  }

  // Services — upsert by name
  console.log("\nUpserting services...");
  let sInserted = 0, sUpdated = 0;
  for (const s of SERVICES) {
    const result = await Service.updateOne({ name: s.name }, { $set: s }, { upsert: true });
    if (result.upsertedCount > 0) {
      console.log(`  inserted: ${s.name}`);
      sInserted++;
    } else {
      console.log(`  updated:  ${s.name}`);
      sUpdated++;
    }
  }

  console.log(`\nDone. Products: ${pInserted} inserted, ${pUpdated} updated. Services: ${sInserted} inserted, ${sUpdated} updated.`);

  // ── Demo orders ────────────────────────────────────────────────────────────
  // Fetch seeded products to get real _ids
  const prods = await Product.find({}, "_id name image price sku").lean();
  const byIdx = (i: number) => prods[i % prods.length];

  // Find or use the admin user as the order owner
  const admin = await User.findOne({ role: "admin" }).lean();
  const userId = admin?._id ?? new mongoose.Types.ObjectId();

  const dummyAddress = {
    name: "Demo Customer", line1: "123 Pet Lane", city: "Mumbai",
    state: "Maharashtra", country: "India", pincode: "400001", phone: "9876543210",
  };

  const now = new Date();
  const ago = (days: number, hours = 0) =>
    new Date(now.getTime() - (days * 86400 + hours * 3600) * 1000);

  // Each entry: [orderId, createdAt, items: [productIndex, qty]]
  const DEMO_ORDERS: [string, Date, [number, number][]][] = [
    // ── Today ──────────────────────────────────────────────────────────────
    ["SEED-T-001", ago(0, 2),  [[0, 3], [2, 2]]],
    ["SEED-T-002", ago(0, 4),  [[0, 2], [3, 4]]],
    ["SEED-T-003", ago(0, 6),  [[1, 5], [4, 1]]],
    ["SEED-T-004", ago(0, 8),  [[2, 3], [5, 2]]],
    // ── This Week (2–6 days ago) ───────────────────────────────────────────
    ["SEED-W-001", ago(2),     [[0, 4], [1, 3]]],
    ["SEED-W-002", ago(3),     [[2, 5], [3, 2]]],
    ["SEED-W-003", ago(4),     [[0, 3], [4, 3], [6, 1]]],
    ["SEED-W-004", ago(5),     [[1, 4], [3, 2]]],
    ["SEED-W-005", ago(6),     [[2, 2], [5, 3], [7, 2]]],
    // ── This Month (8–25 days ago) ─────────────────────────────────────────
    ["SEED-M-001", ago(8),     [[0, 5], [2, 4]]],
    ["SEED-M-002", ago(10),    [[3, 6], [1, 2]]],
    ["SEED-M-003", ago(13),    [[4, 3], [0, 2], [5, 1]]],
    ["SEED-M-004", ago(17),    [[2, 4], [6, 3]]],
    ["SEED-M-005", ago(20),    [[0, 3], [3, 5]]],
    ["SEED-M-006", ago(24),    [[1, 6], [7, 2], [4, 2]]],
    // ── All Time (30–90 days ago) ──────────────────────────────────────────
    ["SEED-A-001", ago(31),    [[0, 8], [2, 3]]],
    ["SEED-A-002", ago(40),    [[3, 7], [4, 4]]],
    ["SEED-A-003", ago(48),    [[1, 5], [0, 4]]],
    ["SEED-A-004", ago(55),    [[2, 6], [5, 3]]],
    ["SEED-A-005", ago(63),    [[0, 6], [3, 4], [6, 2]]],
    ["SEED-A-006", ago(72),    [[4, 5], [1, 3], [7, 1]]],
    ["SEED-A-007", ago(80),    [[2, 7], [0, 3]]],
    ["SEED-A-008", ago(88),    [[3, 8], [5, 2], [8, 1]]],
  ];

  console.log("\nUpserting demo orders...");
  let oInserted = 0, oSkipped = 0;
  for (const [orderId, createdAt, itemDefs] of DEMO_ORDERS) {
    const items = itemDefs.map(([idx, qty]) => {
      const p = byIdx(idx);
      return { productId: p._id, name: p.name, image: p.image ?? "", price: p.price, quantity: qty, sku: p.sku ?? "" };
    });
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax      = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 999 ? 0 : 99;
    const total    = subtotal + tax + shipping;
    const statuses = ["Pending","Confirmed","Processing","Shipped","Delivered"] as const;
    const status   = statuses[Math.floor(Math.random() * statuses.length)];

    // Use raw collection to set createdAt explicitly (bypasses Mongoose timestamps)
    const result = await Order.collection.updateOne(
      { orderId },
      { $setOnInsert: { orderId, userId, items, subtotal, tax, shipping, discount: 0, total, shippingAddress: dummyAddress, paymentMethod: "Cash on Delivery", status, createdAt, updatedAt: createdAt } },
      { upsert: true }
    );
    if (result.upsertedCount > 0) { console.log(`  inserted: ${orderId}`); oInserted++; }
    else { oSkipped++; }
  }
  console.log(`  Orders: ${oInserted} inserted, ${oSkipped} already existed.`);

  console.log("\nAll done.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
