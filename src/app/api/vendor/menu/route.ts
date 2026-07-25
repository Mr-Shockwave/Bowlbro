import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES, CUISINES } from "@/data/menu";
import { ALLERGENS, type VendorDish } from "@/data/vendor";

const STORE_PATH = path.join(process.cwd(), "data", "vendor-menu.json");
const MAX_DISHES = 100;

async function readStore(): Promise<VendorDish[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json({ dishes: await readStore() });
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "dish"
  );
}

function validateDish(d: unknown, index: number): string | null {
  if (typeof d !== "object" || d === null) return `Dish ${index + 1}: invalid`;
  const dish = d as Record<string, unknown>;
  if (typeof dish.name !== "string" || !dish.name.trim())
    return `Dish ${index + 1}: name is required`;
  if (typeof dish.price !== "number" || dish.price <= 0 || dish.price > 500)
    return `${dish.name}: price must be between 0 and 500`;
  if (typeof dish.tagline !== "string" || !dish.tagline.trim())
    return `${dish.name}: one-sentence intro is required`;
  if (
    !Array.isArray(dish.allergens) ||
    dish.allergens.length === 0 ||
    !dish.allergens.every(
      (a) => typeof a === "string" && (ALLERGENS as readonly string[]).includes(a)
    )
  )
    return `${dish.name}: allergen info is required (pick "None" if allergen-free)`;
  if (!CATEGORIES.includes(dish.category as (typeof CATEGORIES)[number]))
    return `${dish.name}: invalid category`;
  if (!CUISINES.includes(dish.cuisine as (typeof CUISINES)[number]))
    return `${dish.name}: invalid cuisine`;
  return null;
}

export async function POST(req: NextRequest) {
  let dishes: unknown;
  try {
    ({ dishes } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return NextResponse.json(
      { error: "Publish at least one dish." },
      { status: 400 }
    );
  }
  if (dishes.length > MAX_DISHES) {
    return NextResponse.json(
      { error: `At most ${MAX_DISHES} dishes.` },
      { status: 400 }
    );
  }
  for (let i = 0; i < dishes.length; i++) {
    const problem = validateDish(dishes[i], i);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  }

  const cleaned: VendorDish[] = (dishes as VendorDish[]).map((d, i) => ({
    // "custom-" prefix so cart persistence stores these inline (they are not
    // part of the static MENU_ITEMS the cart re-resolves against).
    id: `custom-vendor-${i}-${slugify(d.name)}`,
    name: d.name.trim().slice(0, 80),
    description: (d.description ?? "").trim().slice(0, 300),
    price: Math.round(d.price * 100) / 100,
    category: d.category,
    cuisine: d.cuisine,
    emoji: d.emoji?.slice(0, 8) || "🍽️",
    tagline: d.tagline.trim().slice(0, 140),
    allergens: d.allergens.includes("None") ? ["None"] : d.allergens,
    vegetarian: !!d.vegetarian,
    spicy: !!d.spicy,
  }));

  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(cleaned, null, 2), "utf8");
  return NextResponse.json({ ok: true, count: cleaned.length });
}
