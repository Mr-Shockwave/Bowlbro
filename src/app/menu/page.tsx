"use client";

import { useCallback, useEffect, useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import VendorPortal from "@/components/VendorPortal";
import {
  CATEGORIES,
  CUISINES,
  CUISINE_EMOJI,
  CUISINE_GRADIENTS,
  MENU_ITEMS,
  type Category,
  type Cuisine,
  type MenuItem,
} from "@/data/menu";
import type { VendorDish } from "@/data/vendor";

type CategoryFilter = Category | "All";
type CuisineFilter = Cuisine | "All";

export default function MenuPage() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [cuisine, setCuisine] = useState<CuisineFilter>("All");
  const [vendorItems, setVendorItems] = useState<MenuItem[]>([]);
  const [vendorOpen, setVendorOpen] = useState(false);

  const loadVendorItems = useCallback(() => {
    fetch("/api/vendor/menu")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data.dishes)) return;
        setVendorItems(
          data.dishes.map((d: VendorDish) => ({
            ...d,
            gradient: CUISINE_GRADIENTS[d.cuisine],
          }))
        );
      })
      .catch(() => {});
  }, []);

  useEffect(loadVendorItems, [loadVendorItems]);

  const allItems = [...MENU_ITEMS, ...vendorItems];
  const items = allItems.filter(
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
        {allItems.length} dishes, made fresh when you order.
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

      <section className="mt-16 border-t border-zinc-200 pt-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">
              <span aria-hidden>🏪</span> Restaurant owner?
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Photograph your paper menu, let AI turn it into an e-menu,
              complete the required details, and publish it right here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVendorOpen((v) => !v)}
            className="shrink-0 rounded-full border border-orange-600 px-5 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
            data-testid="vendor-toggle"
          >
            {vendorOpen ? "Hide vendor tools" : "Upload your menu"}
          </button>
        </div>
        {vendorOpen && (
          <div className="mt-4">
            <VendorPortal onPublished={loadVendorItems} />
          </div>
        )}
      </section>
    </div>
  );
}
