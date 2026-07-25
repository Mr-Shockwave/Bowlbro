"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/menu";

export default function CartDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, updateQuantity, removeItem } =
    useCart();

  return (
    <>
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeDrawer}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-lg font-bold text-zinc-900">Your Cart</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="text-5xl" aria-hidden>
              🛒
            </span>
            <p className="font-medium text-zinc-900">Your cart is empty</p>
            <p className="text-sm text-zinc-500">
              Add something delicious from the menu.
            </p>
            <Link
              href="/menu"
              onClick={closeDrawer}
              className="mt-2 rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto px-5">
              {lines.map(({ item, quantity }) => (
                <li key={item.id} className="flex items-center gap-3 py-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient}`}
                  >
                    <span className="text-2xl" aria-hidden>
                      {item.emoji}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-900">{item.name}</p>
                    <p className="text-sm text-zinc-500">{formatPrice(item.price)}</p>
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
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="ml-1 text-zinc-400 transition-colors hover:text-red-500"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-zinc-100 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span
                  data-testid="cart-subtotal"
                  className="text-lg font-bold text-zinc-900"
                >
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mb-3 text-xs text-zinc-400">
                Delivery fee and tax calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="block w-full rounded-full bg-orange-600 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Go to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
