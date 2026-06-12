import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export const PAYPAL = {
  email: "",
  logo:  "https://lh3.googleusercontent.com/aida-public/AB6AXuBEcHSfMkgN24Tol_z3Eb3Hb6GK3P0wTGY_oIjHoRMsPoJuaZMKmw_rF76_mUzoyL3HrOxCLMc-M7XaJVUxALZPn2k-G7Kle4xWFVspIagExay3j8mEuKDA6H24Lpj5HQIwW3_QFsx0_yLL9tXsb_c-oubcGAnjwNfZR10dte9ePuGaTXq93_pRCAzQ0lWIZ5EI-JTRtyaFp1WWVVkM-UpZZhSu2J7EM7KNr_bQtyO0X1qsJa2F0s6OcOLO0jXRFqBmk_jFiMdebCgv",
};

export default function usePaymentMethodsContainer() {
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/payment-methods")
      .then(data => setCards(data.cards ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setDefault = async (id) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: (c._id ?? c.id) === id })));
    try { await api.put(`/payment-methods/${id}/default`); } catch { /* optimistic */ }
  };

  const deleteCard = async (id) => {
    setCards(prev => prev.filter(c => (c._id ?? c.id) !== id));
    try { await api.delete(`/payment-methods/${id}`); } catch { /* optimistic */ }
  };

  return { cards, loading, setDefault, deleteCard };
}
