"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

const fallbackItems = [
  {
    product: {
      id: "checkout-dog-food",
      name: "Wild Frontier Bison Kibble",
      price: 54.99,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAlywf4SdV4Byu2059GF2Yho4jB3VdMojjH7tI2kTNmDmy_jSHDL3CKANR02xUhuPpHhK90UmVuotzqtZ18Kj4JL1Pmnn1lJCv_eF5DUHw_F-gO9owaKraaWlU_7x4-u9Omz2_V1pAG-O7Qvt3CCUovdDwmoh_Nmv5Dsl26BkmrMfWO6HuZ_s1NGLKORMstMln_ikJKpqac5o0AGvQCmRTF13OIJCdEZdPpPPGOe534qzkyvXS29vBXOGzKjWaUqm_HXQ61w-MbSbnU",
    },
    quantity: 1,
  },
  {
    product: {
      id: "checkout-chew-toy",
      name: "Duraflex Braided Chew Toy",
      price: 12.23,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDRCUMKpcRV-3523lhcMNzfPV9BtkqEhISkl-RgrHS61hB9yNUFRTH-pPVQ_MIBkrKXndWIbX6rqmqR8lQnlRes7onOTYjZUW8bIRqcEgCaUtC5ceysxut_VIa6zlbpXt96msw97vU9d449MZPpSH5hva3sW4BOmdz8Uz-I3lwbVofA_qUGP9h8lR2NR_QyiG2gVLVoUu4jipdt-ioerUFZpyFEvZ5rJ5yCUMViO_uiYWiBmRCkKqwd02wJL4pO4bfZmdHrLCt9jkeY",
    },
    quantity: 2,
  },
];

export default function useCheckoutContainer() {
  const router = useRouter();
  const { cart, placeOrder } = useStore();
  const [activeStep, setActiveStep] = useState(1);
  const [couponCode, setCouponCode] = useState("");

  const checkoutItems = cart.length > 0 ? cart : fallbackItems;

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }, [checkoutItems]);

  const shipping = activeStep >= 2 ? 0 : null;
  const tax = 5;
  const total = subtotal + (shipping || 0) + tax;

  const goToStep = (step) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = () => {
    if (cart.length > 0) {
      placeOrder({
        address: "124 Golden Retriever Lane, West Hills, CA 90210",
        paymentMethod: "Credit / Debit Card",
      });
    }
    router.push("/order-confirmation");
  };

  return {
    activeStep,
    goToStep,
    couponCode,
    setCouponCode,
    checkoutItems,
    subtotal,
    shipping,
    tax,
    total,
    handlePay,
  };
}
