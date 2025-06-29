"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/CartItem";
import Container from "@/components/Container";

export default function CartPage() {
  const { cart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container className="py-32">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-muted-foreground">Cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-semibold">Total: {total.toFixed(2)}</p>
            <Button size="lg">Checkout</Button>
          </div>
        </>
      )}
    </Container>
  );
}
