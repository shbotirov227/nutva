"use client";

import { useBuy } from "@/context/BuyContext";
import { Button } from "@/components/ui/button";
import { FormModal } from "@/components/FormModal";
import { useEffect, useState } from "react";

export default function BuyModalContainer() {
  const { buyModalOpen, productId, quantity, color, closeBuyModal } = useBuy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !buyModalOpen || !productId) return null;

  return (
    <FormModal
      products={[{ productId, quantity }]}
      btnColor={color}
      onClose={closeBuyModal}
    >
      <Button
        size="lg"
        onClick={closeBuyModal}
        style={{ backgroundColor: color }}
        className="w-full text-white text-lg font-semibold rounded-lg"
      >
        Tasdiqlash
      </Button>
    </FormModal>
  );
}
