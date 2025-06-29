"use client";

import React, { createContext, useContext, useState } from "react";

interface BuyContextProps {
  buyModalOpen: boolean;
  productId: string | null;
  quantity: number;
  color: string;
  openBuyModal: (productId: string, quantity: number, color: string) => void;
  closeBuyModal: () => void;
}

const BuyContext = createContext<BuyContextProps | undefined>(undefined);

export const BuyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [color, setColor] = useState<string>("");

  const openBuyModal = (productId: string, quantity: number, color: string) => {
    setProductId(productId);
    setQuantity(quantity);
    setColor(color);
    setBuyModalOpen(true);
  };

  const closeBuyModal = () => {
    setBuyModalOpen(false);
    setProductId(null);
    setQuantity(1);
    setColor("");
  };

  return (
    <BuyContext.Provider
      value={{ buyModalOpen, productId, quantity, color, openBuyModal, closeBuyModal }}
    >
      {children}
    </BuyContext.Provider>
  );
};

export const useBuy = () => {
  const context = useContext(BuyContext);
  if (!context) {
    throw new Error("useBuy must be used within a BuyProvider");
  }
  return context;
};
