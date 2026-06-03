"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";

const SERVICES_MAP = {
  "1": { id: "1", title: "Signature ArtGrooming", duration: "90 - 120 mins", price: 85.00, category: "Grooming", description: "Complete spa: deep conditioning, styling, nail buffing & ear cleaning.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGTBSh2BJuvp2Hf8shV8z9MmZQ4UXQ3vSscx9jDsQwr4oh6SYowH7gRQL9JMLUs67yhcmXcaZWzk-8Dzp0_9rAUf1zwSoUqxriilz9ApTenm5tUXuBL0Tbu1wzxht7bchGoUTZnz8baG9jOLffisNQlhl-CtRG1yzEG8BppZh7uS_W4yEWEWs5-LFmvSgFN7R5lKiDLGPwJtuM_klM1zqRGPpHAZQTFo9VGIYaBXeYnHEK96NmQfLNLYGB24p6Qziqee7d_ilVfDDt" },
  "2": { id: "2", title: "Wellness Examination", duration: "30 - 45 mins", price: 65.00, category: "Veterinary", description: "Nose-to-tail checkup including weight assessment and nutrition consultation.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuASnOgWLzTExTa05mipWT_nBphSAyrrh0Q2a12yqAJ3v1dikOu88YbR9oQ0UTg7rCIdjVAX7eRRbfwuTmiBZnXFVkPO1VdLF9DdUPxKMrTSIOWfjmlbOYFMrWtxbVrFN1DZV5X9FXzmzrdKArIsRSuOCxS-0VofPkWbB3go5J-jZvbuunUYHJqLQ3WjEU1-lTc2CZOniKzHzgdvlYPhH1abH29HAlkea5WQx21KZV-Jwp_S0DIkU8HnNexbVHVvI-62uJ4Q_FNG1ZNx" },
  "3": { id: "3", title: "Positive Puppy Training", duration: "60 mins", price: 120.00, category: "Training", description: "Positive reinforcement training for core commands and social skills.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOefR9ENF5BF2BaZqOIfGnaYX0cqA8nNAFjYl6oRV_ezlRQAFjx2yYxQJsFTdTNjnp1TRkxvc4c640bhBlS1PHJX9qi3WtusFqUr3jU215FL_WXfAYTyHNEuzrF_y70NpNWc43HMg5yCcCvsNOQvVmYvXwlV7LtrOq8DmdVwc8ev1JDd1AZfz-SwTbAg_WP8fCc60NUi0yovya69QzQM9EFzoriWWAbPSVFC1tI-Vg1h-rWZvERUcrUgaq24KIBH6xChZyazRBgaKL" },
  "4": { id: "4", title: "Luxury Overnight Sitting", duration: "Per Night", price: 95.00, category: "Pet Sitting", description: "In-home care maintaining your pet's routine with feeding, walks & updates.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaT68dKQ3-hPoL2eNGD0m2XSDWAwNDQ1q5arCEOskYCqyoxRStPAV-b_b2rQi7cZ-nl_9XG0rG3PnKzFY5cvMqOXGG_981a0DSY2YicBAvsMKwIW4moLNxfYmzMFTzCoBpIhPefmEI2jJ5eaBo1oTmihva5HAm0Vjv6gb4ss1PbsZ4ReZ645ecdn8z0aQo0VNVHe81IAMCmkkmCLddN9CfLZ6F2tGIVoXbbaLCdve4RzVUqD5AFgbFaNkZGS8iL4D5WHNA7iul_T8T" },
};

const fallbackCartItems = [
  { product: { id: "checkout-dog-food", name: "Wild Frontier Bison Kibble", price: 54.99,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlywf4SdV4Byu2059GF2Yho4jB3VdMojjH7tI2kTNmDmy_jSHDL3CKANR02xUhuPpHhK90UmVuotzqtZ18Kj4JL1Pmnn1lJCv_eF5DUHw_F-gO9owaKraaWlU_7x4-u9Omz2_V1pAG-O7Qvt3CCUovdDwmoh_Nmv5Dsl26BkmrMfWO6HuZ_s1NGLKORMstMln_ikJKpqac5o0AGvQCmRTF13OIJCdEZdPpPPGOe534qzkyvXS29vBXOGzKjWaUqm_HXQ61w-MbSbnU" }, quantity: 1 },
  { product: { id: "checkout-chew-toy", name: "Duraflex Braided Chew Toy", price: 12.23,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRCUMKpcRV-3523lhcMNzfPV9BtkqEhISkl-RgrHS61hB9yNUFRTH-pPVQ_MIBkrKXndWIbX6rqmqR8lQnlRes7onOTYjZUW8bIRqcEgCaUtC5ceysxut_VIa6zlbpXt96msw97vU9d449MZPpSH5hva3sW4BOmdz8Uz-I3lwbVofA_qUGP9h8lR2NR_QyiG2gVLVoUu4jipdt-ioerUFZpyFEvZ5rJ5yCUMViO_uiYWiBmRCkKqwd02wJL4pO4bfZmdHrLCt9jkeY" }, quantity: 2 },
];

export default function useCheckoutContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, placeOrder } = useStore();

  // Detect mode from URL
  const isService = searchParams.get("type") === "service";
  const serviceId  = searchParams.get("serviceId") || "1";
  const bookingDate = searchParams.get("date") || "";
  const bookingTime = searchParams.get("time") || "";
  const service = SERVICES_MAP[serviceId] || SERVICES_MAP["1"];

  // Service mode: 2 steps (Contact + Payment). Cart mode: 3 steps.
  const steps = isService ? ["Contact", "Payment"] : ["Shipping", "Delivery", "Payment"];

  const [activeStep, setActiveStep] = useState(1);
  const [couponCode, setCouponCode] = useState("");

  // Items for cart mode
  const cartItems = cart.length > 0 ? cart : fallbackCartItems;

  const subtotal = useMemo(() => {
    if (isService) return service.price;
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [isService, service, cartItems]);

  const shipping = isService ? null : (activeStep >= 2 ? 0 : null);
  const tax = +(subtotal * 0.06).toFixed(2);
  const total = subtotal + (shipping || 0) + tax;

  const goToStep = (step) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = () => {
    if (!isService && cart.length > 0) {
      placeOrder({ address: "124 Golden Retriever Lane, West Hills, CA 90210", paymentMethod: "Credit / Debit Card" });
    }
    router.push("/order-confirmation");
  };

  return {
    isService,
    service,
    bookingDate,
    bookingTime,
    steps,
    activeStep,
    goToStep,
    couponCode,
    setCouponCode,
    cartItems,
    subtotal,
    shipping,
    tax,
    total,
    handlePay,
  };
}
