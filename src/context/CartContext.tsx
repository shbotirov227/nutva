"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  // useMemo,
  useState,
} from "react";
import { GetOneProductType } from "@/types/products/getOneProduct";
// import { useDiscount } from "@/hooks/useDiscount";
// import { useTranslated } from "@/hooks/useTranslated";

const STORAGE_KEY = "cart-data";

type RawCartItem = GetOneProductType & { quantity: number };

type CartContextType = {
  cart: RawCartItem[];
  addToCart: (item: RawCartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
  totalElements: number;
};

const RawCartContext = createContext<CartContextType | undefined>(undefined);

export const RawCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<RawCartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem(STORAGE_KEY);
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (err) {
        console.error("❌ Cart JSON parse error:", err);
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (item: RawCartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const removeAll = () => setCart([]);

  const totalElements = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  return (
    <RawCartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, removeAll, totalElements }}
    >
      {isMounted ? children : null}
    </RawCartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(RawCartContext);
  if (!context)
    throw new Error("useRawCart must be used within RawCartProvider");
  return context;
};
