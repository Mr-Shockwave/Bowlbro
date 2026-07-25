"use client";

import { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import {
  CATEGORIES,
  CUISINES,
  CUISINE_EMOJI,
  MENU_ITEMS,
  type Category,
  type Cuisine,
} from "@/data/menu";

type CategoryFilter = Category | "All";
type CuisineFilter = Cuisine | "All";

export default function MenuPage() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [cuisine, setCuisine] = useState<CuisineFilter>("All");

  const items = MENU_ITEMS.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      (cuisine === "All" || item.cuisine === cuisine)
  );

  const sections = CUISINES.map((c) => ({
    cuisine: c,
    items: items.filter((item) => item.cuisine === c),
  })).filter((section) => section.items.length > 0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900">Menu</h1>
      <p className="mt-1 text-zinc-500">
        {MENU_ITEMS.length} dishes, made fresh when you order.
      </p>

      <div
        className="mt-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Cuisines"
      >
        {(["All", ...CUISINES] as CuisineFilter[]).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cuisine === c}
            onClick={() => setCuisine(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              cuisine === c
                ? "bg-orange-600 text-white"
                : "bg-white text-zinc-600 hover:bg-orange-100"
            }`}
          >
            {c === "All" ? "🌍 All Cuisines" : `${CUISINE_EMOJI[c]} ${c}`}
          </button>
        ))}
      </div>

      <div
        className="mt-3 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Menu categories"
      >
        {(["All", ...CATEGORIES] as CategoryFilter[]).map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? "border-orange-600 bg-orange-50 text-orange-700"
                : "border-zinc-200 bg-white text-zinc-500 hover:border-orange-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {sections.length === 0 ? (
        <p className="mt-12 text-center text-zinc-500">
          No dishes match these filters.
        </p>
      ) : (
        sections.map((section) => (
          <section key={section.cuisine} className="mt-10">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold text-zinc-900">
                <span aria-hidden>{CUISINE_EMOJI[section.cuisine]}</span>{" "}
                {section.cuisine}
              </h2>
              <span className="text-sm text-zinc-400">
                {section.items.length}{" "}
                {section.items.length === 1 ? "dish" : "dishes"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
