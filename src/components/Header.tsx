"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { itemCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-zinc-900">
          <span className="text-2xl" aria-hidden>
            🍜
          </span>
          <span>
            Ember<span className="text-orange-600">Eats</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/menu"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-orange-600"
          >
            Menu
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-orange-600"
          >
            <span aria-hidden>🔥</span> Cal Calculator
          </Link>
          <Link
            href="/build-your-own"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-orange-600"
          >
            <span aria-hidden>🥘</span> Build Your Own
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
            aria-label={`Open cart, ${itemCount} items`}
          >
            <span aria-hidden>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span
                data-testid="cart-count"
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-xs font-bold text-white"
              >
                {itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
