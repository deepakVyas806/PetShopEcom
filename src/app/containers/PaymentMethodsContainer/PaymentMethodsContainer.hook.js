import { useState } from "react";

const INITIAL_CARDS = [
  {
    id:        "c1",
    label:     "Primary Card",
    network:   "Visa",
    logo:      "https://lh3.googleusercontent.com/aida-public/AB6AXuCO2UQ3NfDu8eIskzaunBNkCzH_2joLKqof21ILYSpyw4FBPgy7AHN5M4Ygpp8QLCCGA0YKkhFfbOy8tpwOr0uxH7KUO67oCOUvHjpy2z1ryaPeL2HCeOa98_vnaq6SkUUa41JnwCpwSD0gjtd53VNBFvg5_gY1sR62wnk-HxMGHyZA666zasznuong66ANbtOFJlsTMwLZry9m_WW4yGqgA7YsSU6uynali3V1JMYAT-LVYSm33azbpgn0YTt3W7pzew9JxSV5-PWB",
    last4:     "4242",
    holder:    "ALEX RIVERA",
    expiry:    "12/26",
    isDefault: true,
  },
  {
    id:        "c2",
    label:     "Secondary",
    network:   "Mastercard",
    logo:      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcJtt7nO-U-cH3i-ZbbBxsFr6tsD--WXJpzurFbXgyVduDrRvTEKL_rvmAynoWYBVSY9CBNt-moCtvzdNRtHaGshbALL1lwZzCaeY381S6Vvj4zXXLUYzxz2JgwK9yvu1awakDsIHHY3Z7l3-HXusaW6GveTbpIwd-w3fF5LsBFkN9btGsxw7WPx-vTdkCdh7rf6zuDRdDH58WjaOnAZrkto7xTe45MHTW0kuaLDdzxA77VrC4Qbdvy5Uq8lLk0MKu3JFQ3uwVkCRn",
    last4:     "8812",
    holder:    "ALEX RIVERA",
    expiry:    "08/25",
    isDefault: false,
  },
];

export const PAYPAL = {
  email: "alex.rivera@example.com",
  logo:  "https://lh3.googleusercontent.com/aida-public/AB6AXuBEcHSfMkgN24Tol_z3Eb3Hb6GK3P0wTGY_oIjHoRMsPoJuaZMKmw_rF76_mUzoyL3HrOxCLMc-M7XaJVUxALZPn2k-G7Kle4xWFVspIagExay3j8mEuKDA6H24Lpj5HQIwW3_QFsx0_yLL9tXsb_c-oubcGAnjwNfZR10dte9ePuGaTXq93_pRCAzQ0lWIZ5EI-JTRtyaFp1WWVVkM-UpZZhSu2J7EM7KNr_bQtyO0X1qsJa2F0s6OcOLO0jXRFqBmk_jFiMdebCgv",
};

export default function usePaymentMethodsContainer() {
  const [cards, setCards] = useState(INITIAL_CARDS);

  const setDefault = (id) =>
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));

  const deleteCard = (id) =>
    setCards((prev) => prev.filter((c) => c.id !== id));

  return { cards, setDefault, deleteCard };
}
