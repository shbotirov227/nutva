"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import NoImage from "@/assets/images/noimage.webp";
import { useTranslated } from "@/hooks/useTranslated";
import { GetOneProductType } from "@/types/products/getOneProduct";

export default function CartItem({ item }: { item: GetOneProductType & { quantity: number } }) {
  const { removeFromCart, updateQuantity } = useCart();
  const localized = useTranslated(item); // bu yerda name, description chiqadi

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 border rounded-xl shadow-md bg-white">
      <div className="w-full md:w-1/4 flex justify-center">
        <Image
          src={item.imageUrls?.[0] || NoImage}
          alt={`Image of ${localized.name}`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full max-w-[150px] h-36 object-contain rounded-md"
        />
      </div>

      <div className="w-full md:w-3/4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{localized.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">
            Price: {item.price.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Subtotal: {(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={item.quantity}
            min={1}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            className="w-20"
          />
          <Button
            variant="destructive"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
