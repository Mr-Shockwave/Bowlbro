"use client";

import { useEffect, useRef, useState } from "react";

interface CalorieItem {
  name: string;
  portion: string;
  calories: number;
}

interface CalorieResult {
  is_food: boolean;
  dish_name: string;
  total_calories: number;
  calorie_range: { low: number; high: number };
  items: CalorieItem[];
  confidence: "low" | "medium" | "high";
  notes: string;
}

const CONFIDENCE_STYLE: Record<CalorieResult["confidence"], string> = {
  high: "bg-green-50 text-green-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-red-50 text-red-700",
};

export default function CalCalculator() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalorieResult | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFile(selected: File | null) {
    setFile(selected);
    setResult(null);
    setError(null);
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/calories", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Try again.");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Analysis failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm"
      data-testid="cal-calculator"
    >
      <p className="text-sm text-zinc-500">
        Upload a photo of a real dish and AI estimates its calories.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        aria-label="Upload a dish photo"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex h-40 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 text-zinc-400 transition-colors hover:border-orange-400 hover:text-orange-500"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: object URL, next/image can't optimize it
          <img
            src={previewUrl}
            alt="Selected dish"
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <span className="text-3xl" aria-hidden>
              📷
            </span>
            <span className="text-sm font-medium">Choose a dish photo</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={analyze}
        disabled={!file || loading}
        className="mt-3 w-full rounded-full bg-orange-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Calculate Calories"}
      </button>

      {error && (
        <p
          className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          data-testid="cal-error"
        >
          {error}
        </p>
      )}

      {result && !result.is_food && (
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
          That doesn&apos;t look like food — try a photo of a dish.
        </p>
      )}

      {result && result.is_food && (
        <div className="mt-4" data-testid="cal-result">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-zinc-900">{result.dish_name}</p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${CONFIDENCE_STYLE[result.confidence]}`}
            >
              {result.confidence} confidence
            </span>
          </div>

          <div className="mt-2 rounded-xl bg-orange-50 p-3 text-center">
            <p className="text-3xl font-extrabold text-orange-700">
              ~{result.total_calories}
              <span className="text-base font-semibold"> kcal</span>
            </p>
            <p className="text-xs text-orange-600">
              range {result.calorie_range.low}–{result.calorie_range.high} kcal
            </p>
          </div>

          {result.items.length > 0 && (
            <ul className="mt-3 divide-y divide-zinc-100 text-sm">
              {result.items.map((item) => (
                <li
                  key={`${item.name}-${item.portion}`}
                  className="flex items-baseline justify-between gap-2 py-1.5"
                >
                  <span className="text-zinc-700">
                    {item.name}
                    <span className="text-xs text-zinc-400"> · {item.portion}</span>
                  </span>
                  <span className="shrink-0 font-medium text-zinc-900">
                    {item.calories} kcal
                  </span>
                </li>
              ))}
            </ul>
          )}

          {result.notes && (
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {result.notes}
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-xs text-zinc-300">
        Estimates only — actual calories vary with ingredients and preparation.
      </p>
    </div>
  );
}
