"use client";

import { useState } from "react";
import useSavedAddressesContainer from "./SavedAddressesContainer.hook";
import AddressesHeader  from "./Components/AddressesHeader";
import AddressCard      from "./Components/AddressCard";
import AddNewCard       from "./Components/AddNewCard";
import AddressFormModal from "./Components/AddressFormModal";

export default function SavedAddressesContainer() {
  const { addresses, loading, setAsDefault, deleteAddress, addAddress, updateAddress } =
    useSavedAddressesContainer();

  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const openAdd  = ()     => { setEditingAddress(null);    setModalOpen(true); };
  const openEdit = (addr) => { setEditingAddress(addr);    setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); };

  const handleSave = async (form) => {
    if (editingAddress) {
      const id = editingAddress._id ?? editingAddress.id;
      await updateAddress(id, form);
    } else {
      await addAddress(form);
    }
  };

  return (
    <div className="py-2 space-y-0">

      <AddressesHeader onAdd={openAdd} />

      {/* Address grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {loading
          ? [0, 1].map(i => <div key={i} className="h-48 rounded-2xl animate-shimmer" />)
          : addresses.map((addr) => (
              <AddressCard
                key={addr._id ?? addr.id}
                address={addr}
                onSetDefault={setAsDefault}
                onDelete={deleteAddress}
                onEdit={openEdit}
              />
            ))
        }
        {!loading && <AddNewCard onClick={openAdd} />}
      </div>

      <AddressFormModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        address={editingAddress}
      />
    </div>
  );
}
