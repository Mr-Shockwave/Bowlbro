"use client";

import DishPhoto from "@/components/DishPhoto";
import { useCart } from "@/context/CartContext";
import { CUISINE_EMOJI, formatPrice, type MenuItem } from "@/data/menu";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <DishPhoto item={item} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-900">{item.name}</h3>
          <span className="shrink-0 font-semibold text-orange-600">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.tagline && (
          <p className="text-sm italic text-orange-700">“{item.tagline}”</p>
        )}
        <p className="flex-1 text-sm leading-relaxed text-zinc-500">
          {item.description}
        </p>
        {item.allergens && !item.allergens.includes("None") && (
          <p className="text-xs text-zinc-400">
            Contains: {item.allergens.join(", ")}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
              {CUISINE_EMOJI[item.cuisine]} {item.cuisine}
            </span>
            {item.vegetarian && (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                🌱 Veg
              </span>
            )}
            {item.spicy && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                🌶️ Spicy
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => addItem(item)}
            className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-95"
          >
            Add +
          </button>
        </div>
      </div>
    </div>
  );
}
