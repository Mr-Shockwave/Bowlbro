import type { Category, Cuisine } from "@/data/menu";

export const ALLERGENS = [
  "None",
  "Peanuts",
  "Tree nuts",
  "Shellfish",
  "Fish",
  "Egg",
  "Dairy",
  "Gluten",
  "Soy",
  "Sesame",
] as const;

export interface VendorDish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  cuisine: Cuisine;
  emoji: string;
  /** Required one-sentence intro shown to customers and used by recommendations. */
  tagline: string;
  /** Required; ["None"] means explicitly allergen-free. */
  allergens: string[];
  vegetarian: boolean;
  spicy: boolean;
}
