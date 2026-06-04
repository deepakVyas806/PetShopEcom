import { useState } from "react";

const INITIAL = [
  {
    id:        "a1",
    name:      "Alex Harrington",
    type:      "Home",
    label:     "Shipping & Billing",
    icon:      "location_on",
    line1:     "1242 Whiskers Way, Apt 4B",
    line2:     "Los Angeles, CA 90034",
    country:   "United States",
    phone:     "+1 (555) 902-3421",
    isDefault: true,
  },
  {
    id:        "a2",
    name:      "Alex Harrington",
    type:      "Work",
    label:     "Office Address",
    icon:      "business",
    line1:     "88 Creative Plaza, Suite 200",
    line2:     "Santa Monica, CA 90401",
    country:   "United States",
    phone:     "+1 (555) 321-4567",
    isDefault: false,
  },
  {
    id:        "a3",
    name:      "Eleanor Harrington",
    type:      "Family",
    label:     "Family Home",
    icon:      "home",
    line1:     "45 Maple Avenue",
    line2:     "Portland, OR 97205",
    country:   "United States",
    phone:     "+1 (503) 123-9876",
    isDefault: false,
  },
];

export default function useSavedAddressesContainer() {
  const [addresses, setAddresses] = useState(INITIAL);

  const setAsDefault = (id) =>
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );

  const deleteAddress = (id) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  return { addresses, setAsDefault, deleteAddress };
}
