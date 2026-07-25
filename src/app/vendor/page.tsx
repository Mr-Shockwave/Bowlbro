"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, CUISINES, type Category, type Cuisine } from "@/data/menu";
import { ALLERGENS, type VendorDish } from "@/data/vendor";

type Draft = Omit<VendorDish, "id"> & { id?: string };

function emptyRequired(d: Draft): string[] {
  const missing: string[] = [];
  if (!d.tagline.trim()) missing.push("one-sentence intro");
  if (d.allergens.length === 0) missing.push("allergens");
  if (!d.name.trim()) missing.push("name");
  if (!(d.price > 0)) missing.push("price");
  return missing;
}

export default function VendorPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [published, setPublished] = useState<number | null>(null);

  useEffect(() => {
    // Load the currently published menu so the vendor can edit it.
    fetch("/api/vendor/menu")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.dishes) && data.dishes.length > 0) {
          setDrafts(data.dishes);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function scan() {
    if (!file) return;
    setScanning(true);
    setScanError(null);
    setPublished(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/vendor/scan-menu", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setScanError(data.error ?? "Scan failed. Try again.");
        return;
      }
      if (!data.is_menu || data.dishes.length === 0) {
        setScanError(
          "Couldn't find dishes in that photo — try a clearer photo of the menu."
        );
        return;
      }
      setRestaurantName(data.restaurant_name ?? "");
      setDrafts(
        data.dishes.map(
          (d: Omit<Draft, "tagline" | "allergens">): Draft => ({
            ...d,
            price: d.price > 0 ? d.price : 9.99,
            tagline: "",
            allergens: [],
          })
        )
      );
    } catch {
      setScanError("Scan failed. Check your connection and try again.");
    } finally {
      setScanning(false);
    }
  }

  function update(index: number, patch: Partial<Draft>) {
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d))
    );
    setPublished(null);
  }

  function toggleAllergen(index: number, allergen: string) {
    setDrafts((prev) =>
      prev.map((d, i) => {
        if (i !== index) return d;
        let next: string[];
        if (allergen === "None") {
          next = d.allergens.includes("None") ? [] : ["None"];
        } else {
          next = d.allergens.includes(allergen)
            ? d.allergens.filter((a) => a !== allergen)
            : [...d.allergens.filter((a) => a !== "None"), allergen];
        }
        return { ...d, allergens: next };
      })
    );
    setPublished(null);
  }

  function remove(index: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  }

  const incomplete = drafts
    .map((d, i) => ({ index: i, missing: emptyRequired(d) }))
    .filter((e) => e.missing.length > 0);

  async function publish() {
    setPublishing(true);
    setPublishError(null);
    try {
      const res = await fetch("/api/vendor/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishes: drafts }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.error ?? "Publish failed. Try again.");
        return;
      }
      setPublished(data.count);
    } catch {
      setPublishError("Publish failed. Check your connection and try again.");
    } finally {
      setPublishing(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-zinc-900">Restaurant Portal</h1>
      <p className="mt-1 text-zinc-500">
        Photograph your paper menu, let AI turn it into an e-menu, complete the
        required details, and publish.
      </p>

      <section className="mt-6 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-zinc-900">
          <span aria-hidden>📸</span> Step 1 — Scan your menu
        </h2>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          aria-label="Upload a menu photo"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-32 flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 text-zinc-400 transition-colors hover:border-orange-400 hover:text-orange-500"
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob: object URL
              <img
                src={previewUrl}
                alt="Menu photo"
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <span className="text-2xl" aria-hidden>
                  📄
                </span>
                <span className="text-sm font-medium">Choose a menu photo</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={scan}
            disabled={!file || scanning}
            className="self-center rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? "Reading menu…" : "Scan Menu"}
          </button>
        </div>
        {scanError && (
          <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {scanError}
          </p>
        )}
      </section>

      {drafts.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold text-zinc-900">
            <span aria-hidden>📝</span> Step 2 — Complete dish details
            {restaurantName && (
              <span className="ml-2 text-sm font-normal text-zinc-400">
                {restaurantName}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Fields marked <span className="text-red-600">*</span> are required —
            they power customer recommendations.
          </p>

          <div className="mt-4 flex flex-col gap-4" data-testid="vendor-drafts">
            {drafts.map((d, i) => {
              const missing = emptyRequired(d);
              return (
                <div
                  key={i}
                  className={`rounded-2xl border bg-white p-4 shadow-sm ${
                    missing.length > 0 ? "border-amber-200" : "border-green-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl" aria-hidden>
                      {d.emoji}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="text-xs text-zinc-400 underline hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-zinc-500">
                      Dish name <span className="text-red-600">*</span>
                      <input
                        type="text"
                        value={d.name}
                        onChange={(e) => update(i, { name: e.target.value })}
                        className={`mt-1 ${inputClass}`}
                      />
                    </label>
                    <label className="text-xs font-semibold text-zinc-500">
                      Price (USD) <span className="text-red-600">*</span>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={d.price}
                        onChange={(e) =>
                          update(i, { price: parseFloat(e.target.value) || 0 })
                        }
                        className={`mt-1 ${inputClass}`}
                      />
                    </label>
                    <label className="text-xs font-semibold text-zinc-500">
                      Category
                      <select
                        value={d.category}
                        onChange={(e) =>
                          update(i, { category: e.target.value as Category })
                        }
                        className={`mt-1 ${inputClass}`}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-zinc-500">
                      Cuisine
                      <select
                        value={d.cuisine}
                        onChange={(e) =>
                          update(i, { cuisine: e.target.value as Cuisine })
                        }
                        className={`mt-1 ${inputClass}`}
                      >
                        {CUISINES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="mt-3 block text-xs font-semibold text-zinc-500">
                    One-sentence intro <span className="text-red-600">*</span>
                    <input
                      type="text"
                      value={d.tagline}
                      maxLength={140}
                      placeholder="e.g. Our signature wok dish — smoky, saucy, ready in 8 minutes."
                      onChange={(e) => update(i, { tagline: e.target.value })}
                      className={`mt-1 ${inputClass}`}
                    />
                  </label>

                  <div className="mt-3">
                    <p className="text-xs font-semibold text-zinc-500">
                      Allergens <span className="text-red-600">*</span>{" "}
                      <span className="font-normal">
                        (pick “None” if allergen-free)
                      </span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {ALLERGENS.map((a) => {
                        const active = d.allergens.includes(a);
                        return (
                          <button
                            key={a}
                            type="button"
                            role="checkbox"
                            aria-checked={active}
                            onClick={() => toggleAllergen(i, a)}
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                              active
                                ? "border-orange-600 bg-orange-600 text-white"
                                : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-400"
                            }`}
                          >
                            {a}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-4 text-xs font-medium text-zinc-600">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={d.vegetarian}
                        onChange={(e) =>
                          update(i, { vegetarian: e.target.checked })
                        }
                      />
                      🌱 Vegetarian
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={d.spicy}
                        onChange={(e) => update(i, { spicy: e.target.checked })}
                      />
                      🌶️ Spicy
                    </label>
                  </div>

                  {missing.length > 0 && (
                    <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                      Missing: {missing.join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-4 mt-6 rounded-2xl border border-zinc-100 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-500">
                {drafts.length} {drafts.length === 1 ? "dish" : "dishes"}
                {incomplete.length > 0 && (
                  <span className="text-amber-600">
                    {" "}
                    · {incomplete.length} incomplete
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={publish}
                disabled={publishing || incomplete.length > 0 || drafts.length === 0}
                className="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishing ? "Publishing…" : "Publish Menu"}
              </button>
            </div>
            {publishError && (
              <p className="mt-2 rounded-xl bg-red-50 p-2 text-sm text-red-700">
                {publishError}
              </p>
            )}
            {published !== null && (
              <p className="mt-2 rounded-xl bg-green-50 p-2 text-sm text-green-700">
                Published {published} {published === 1 ? "dish" : "dishes"}!{" "}
                <Link href="/menu" className="font-semibold underline">
                  View the customer menu →
                </Link>
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
