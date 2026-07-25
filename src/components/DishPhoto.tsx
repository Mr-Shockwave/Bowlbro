"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/data/menu";

interface FoundImage {
  url: string;
  title: string;
  pageUrl: string;
}

const PHOTOS_KEY = "food-order-photos";

function loadPhotos(): Record<string, string> {
  try {
    return JSON.parse(window.localStorage.getItem(PHOTOS_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePhoto(id: string, url: string | null) {
  const photos = loadPhotos();
  if (url) photos[id] = url;
  else delete photos[id];
  window.localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
}

export default function DishPhoto({ item }: { item: MenuItem }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState(item.name);
  const [results, setResults] = useState<FoundImage[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setPhoto(loadPhotos()[item.id] ?? null);
  }, [item.id]);

  async function search(q: string) {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/food-image?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      const images: FoundImage[] = data.images ?? [];
      setResults(images);
      if (images.length === 0)
        setNotice("No photos found — try different words.");
    } catch {
      setResults([]);
      setNotice("Search failed — check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function openPicker() {
    setPickerOpen(true);
    if (results === null) search(query);
  }

  function choose(url: string | null) {
    savePhoto(item.id, url);
    setPhoto(url);
    setPickerOpen(false);
  }

  return (
    <>
      <div
        className={`relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br ${item.gradient}`}
      >
        {photo ? (
          <Image
            src={photo}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="text-6xl drop-shadow-sm" aria-hidden>
            {item.emoji}
          </span>
        )}
        <button
          type="button"
          onClick={openPicker}
          className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-zinc-900/75 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur transition-colors hover:bg-zinc-900"
          aria-label={`Search a photo for ${item.name}`}
          title="Search a photo"
        >
          🔍 Photo
        </button>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={`Photo search for ${item.name}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">
                Photo for {item.name}
              </h3>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100"
                aria-label="Close photo search"
              >
                ✕
              </button>
            </div>

            <form
              className="mb-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) search(query.trim());
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search food photos…"
                className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? "…" : "Search"}
              </button>
            </form>

            {loading && (
              <p className="py-8 text-center text-sm text-zinc-500">
                Searching photos…
              </p>
            )}
            {!loading && notice && (
              <p className="py-8 text-center text-sm text-zinc-500">{notice}</p>
            )}
            {!loading && !notice && results && results.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {results.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => choose(img.url)}
                    className="group relative h-24 overflow-hidden rounded-lg border-2 border-transparent transition-colors hover:border-orange-500"
                    title={img.title.replace(/^File:/, "")}
                  >
                    <Image
                      src={img.url}
                      alt={img.title.replace(/^File:/, "")}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                Photos from Wikimedia Commons
              </p>
              {photo && (
                <button
                  type="button"
                  onClick={() => choose(null)}
                  className="text-xs font-semibold text-zinc-500 underline hover:text-zinc-700"
                >
                  Reset to emoji
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
