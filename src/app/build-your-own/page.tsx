"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  INGREDIENT_CATEGORIES,
  MAX_INGREDIENTS,
} from "@/data/ingredients";
import { formatPrice, type Cuisine, type MenuItem } from "@/data/menu";

interface Suggestion {
  name: string;
  description: string;
  cooking_method: string;
  cuisine: Cuisine;
  emoji: string;
  estimated_calories: number;
  price: number;
}

const CUISINE_GRADIENT: Record<Cuisine, string> = {
  Asian: "from-amber-200 to-orange-300",
  American: "from-orange-200 to-red-300",
  Mexican: "from-lime-200 to-green-300",
  Italian: "from-rose-200 to-red-300",
};

export default function BuildYourOwnPage() {
  const { addItem, openDrawer } = useCart();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [addedName, setAddedName] = useState<string | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, string>>({});

  function toggle(ingredient: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient)) {
        next.delete(ingredient);
      } else if (next.size < MAX_INGREDIENTS) {
        next.add(ingredient);
      }
      return next;
    });
  }

  async function recommend() {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    setAddedName(null);
    try {
      const res = await fetch("/api/build-your-own", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: [...selected] }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Recommendation failed. Try again.");
        return;
      }
      setSuggestions(data.suggestions);
      setImages({});
      setImageErrors({});
    } catch {
      setError("Recommendation failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function visualize(s: Suggestion) {
    setImageLoading((prev) => ({ ...prev, [s.name]: true }));
    setImageErrors((prev) => ({ ...prev, [s.name]: "" }));
    try {
      const res = await fetch("/api/dish-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: s.name, description: s.description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImageErrors((prev) => ({
          ...prev,
          [s.name]: data.error ?? "Image generation failed.",
        }));
        return;
      }
      setImages((prev) => ({ ...prev, [s.name]: data.image }));
    } catch {
      setImageErrors((prev) => ({
        ...prev,
        [s.name]: "Image generation failed. Try again.",
      }));
    } finally {
      setImageLoading((prev) => ({ ...prev, [s.name]: false }));
    }
  }

  function choose(s: Suggestion) {
    const item: MenuItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: s.name,
      description: `${s.cooking_method} · your pick: ${[...selected].join(", ")}`,
      price: Math.round(s.price * 100) / 100,
      category: "Mains",
      cuisine: s.cuisine,
      emoji: s.emoji,
      gradient: CUISINE_GRADIENT[s.cuisine] ?? "from-amber-200 to-orange-300",
    };
    addItem(item);
    setAddedName(s.name);
    openDrawer();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-zinc-900">Build Your Own</h1>
      <p className="mt-1 text-zinc-500">
        Pick your ingredients and AI suggests the three most popular ways to
        cook them — choose your favorite.
      </p>

      {INGREDIENT_CATEGORIES.map((cat) => (
        <section key={cat.name} className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400">
            <span aria-hidden>{cat.emoji}</span> {cat.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {cat.items.map((ing) => {
              const active = selected.has(ing);
              return (
                <button
                  key={ing}
                  type="button"
                  role="checkbox"
                  aria-checked={active}
                  onClick={() => toggle(ing)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-orange-600 bg-orange-600 text-white"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-400"
                  }`}
                >
                  {active ? "✓ " : ""}
                  {ing}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 mt-8 rounded-2xl border border-zinc-100 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            <span className="font-semibold text-zinc-900">{selected.size}</span>
            /{MAX_INGREDIENTS} ingredients selected
          </p>
          <button
            type="button"
            onClick={recommend}
            disabled={selected.size === 0 || loading}
            className="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking…" : "Suggest 3 Dishes"}
          </button>
        </div>
        {error && (
          <p className="mt-2 rounded-xl bg-red-50 p-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {addedName && (
          <p className="mt-2 rounded-xl bg-green-50 p-2 text-sm text-green-700">
            Added “{addedName}” to your cart.
          </p>
        )}
      </div>

      {suggestions && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3" data-testid="byo-results">
          {suggestions.map((s) => (
            <div
              key={s.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm"
            >
              <div
                className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${
                  CUISINE_GRADIENT[s.cuisine] ?? "from-amber-200 to-orange-300"
                }`}
              >
                {images[s.name] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- base64 data URL from image generation
                  <img
                    src={images[s.name]}
                    alt={`AI impression of ${s.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : imageLoading[s.name] ? (
                  <span className="animate-pulse text-sm font-medium text-zinc-600">
                    Cooking up a preview…
                  </span>
                ) : (
                  <>
                    <span className="text-5xl drop-shadow-sm" aria-hidden>
                      {s.emoji}
                    </span>
                    <button
                      type="button"
                      onClick={() => visualize(s)}
                      className="absolute bottom-2 right-2 rounded-full bg-zinc-900/75 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur transition-colors hover:bg-zinc-900"
                    >
                      ✨ See how it looks
                    </button>
                  </>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                {imageErrors[s.name] && (
                  <p className="rounded-lg bg-red-50 p-2 text-xs text-red-700">
                    {imageErrors[s.name]}
                  </p>
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-zinc-900">{s.name}</h3>
                  <span className="shrink-0 font-semibold text-orange-600">
                    {formatPrice(s.price)}
                  </span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-zinc-500">
                  {s.description}
                </p>
                <p className="text-xs text-zinc-400">
                  {s.cooking_method} · ~{s.estimated_calories} kcal
                </p>
                <button
                  type="button"
                  onClick={() => choose(s)}
                  className="mt-1 rounded-full bg-orange-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-95"
                >
                  Choose This
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
