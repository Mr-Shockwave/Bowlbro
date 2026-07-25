"use client";

import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/menu";

export default function CheckoutPage() {
  const { lines, updateQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-6xl" aria-hidden>
          🛒
        </span>
        <h1 className="text-2xl font-bold text-zinc-900">Your cart is empty</h1>
        <p className="text-zinc-500">
          Add some dishes from the menu before checking out.
        </p>
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
    <div>
      <h1 className="text-3xl font-bold text-zinc-900">Checkout</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Your order
          </h2>
          <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-100 bg-white px-5 shadow-sm">
            {lines.map(({ item, quantity }) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}
                >
                  <span className="text-2xl" aria-hidden>
                    {item.emoji}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-900">{item.name}</p>
                  <p className="text-sm text-zinc-500">
                    {formatPrice(item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <span className="w-16 text-right font-semibold text-zinc-900">
                  {formatPrice(item.price * quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-zinc-400 transition-colors hover:text-red-500"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Your details
          </h2>
          <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
            <CheckoutForm />
          </div>
        </section>
      </div>
    </div>
  );
}
