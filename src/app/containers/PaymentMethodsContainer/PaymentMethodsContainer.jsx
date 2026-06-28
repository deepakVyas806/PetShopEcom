"use client";

import usePaymentMethodsContainer from "./PaymentMethodsContainer.hook";
import PaymentHeader               from "./Components/PaymentHeader";
import PaymentCard                 from "./Components/PaymentCard";
import WalletCard                  from "./Components/WalletCard";
import PayPalCard                  from "./Components/PayPalCard";
import SecurityBanner              from "./Components/SecurityBanner";

export default function PaymentMethodsContainer() {
  const { cards, loading, setDefault, deleteCard } = usePaymentMethodsContainer();

  return (
    <div className="py-2 space-y-5">

      <PaymentHeader />

      {/* Card grid: 1 col mobile, 2 col sm, 3 col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading
          ? [0, 1, 2].map(i => <div key={i} className="h-40 rounded-2xl animate-shimmer" />)
          : cards.map((card) => (
              <PaymentCard
                key={card._id ?? card.id}
                card={card}
                onSetDefault={setDefault}
                onDelete={deleteCard}
              />
            ))
        }

        {/* Apple Pay wallet */}
        <WalletCard />

        {/* PayPal — spans full row */}
        <PayPalCard />
      </div>

      <SecurityBanner />
    </div>
  );
}
