"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PlacedOrder } from "@/components/CheckoutForm";
import { formatPrice } from "@/data/menu";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("food-order-last");
      if (saved) setOrder(JSON.parse(saved));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-6xl" aria-hidden>
          🤔
        </span>
        <h1 className="text-2xl font-bold text-zinc-900">No recent order found</h1>
        <p className="text-zinc-500">Head to the menu to place an order.</p>
        <Link
          href="/menu"
          className="mt-2 rounded-full bg-orange-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-orange-700"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
        <span className="text-6xl" aria-hidden>
          ✅
        </span>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">
          Order confirmed!
        </h1>
        <p className="mt-1 text-zinc-500">
          Thanks, {order.name}! Your order number is{" "}
          <span className="font-semibold text-zinc-900" data-testid="order-number">
            {order.orderNumber}
          </span>
          .
        </p>
        <p className="mt-4 inline-block rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
          {order.orderType === "delivery"
            ? `🚚 Delivering to ${order.address} in ~${order.estimatedMinutes} min`
            : `🏃 Ready for pickup in ~${order.estimatedMinutes} min`}
        </p>

        <ul className="mt-8 divide-y divide-zinc-100 text-left text-sm">
          {order.lines.map((line) => (
            <li key={line.name} className="flex justify-between py-2.5">
              <span className="text-zinc-700">
                {line.quantity} × {line.name}
              </span>
              <span className="font-medium text-zinc-900">
                {formatPrice(line.price * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-2 space-y-1 border-t border-zinc-200 pt-3 text-sm">
          <div className="flex justify-between text-zinc-500">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Delivery fee</span>
            <span>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : "Free"}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-bold text-zinc-900">
            <span>Total</span>
            <span data-testid="confirmation-total">{formatPrice(order.total)}</span>
          </div>
        </div>

        <Link
          href="/menu"
          className="mt-8 inline-block rounded-full bg-orange-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-700"
        >
          Order Again
        </Link>
      </div>
    </div>
  );
}
