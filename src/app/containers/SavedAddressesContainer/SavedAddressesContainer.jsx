"use client";

import useSavedAddressesContainer from "./SavedAddressesContainer.hook";
import AddressesHeader             from "./Components/AddressesHeader";
import AddressCard                 from "./Components/AddressCard";
import AddNewCard                  from "./Components/AddNewCard";
import PromoBanner                 from "./Components/PromoBanner";

export default function SavedAddressesContainer() {
  const { addresses, setAsDefault, deleteAddress } = useSavedAddressesContainer();

  return (
    <div className="py-2 space-y-0">

      <AddressesHeader />

      {/* Address grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onSetDefault={setAsDefault}
            onDelete={deleteAddress}
          />
        ))}
        <AddNewCard />
      </div>

      <PromoBanner />
    </div>
  );
}
