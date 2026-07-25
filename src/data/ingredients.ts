export interface IngredientCategory {
  name: string;
  emoji: string;
  items: string[];
}

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    name: "Protein",
    emoji: "🍗",
    items: [
      "Chicken",
      "Beef",
      "Pork",
      "Shrimp",
      "Salmon",
      "White fish",
      "Tofu",
      "Egg",
      "Bacon",
    ],
  },
  {
    name: "Vegetables",
    emoji: "🥦",
    items: [
      "Broccoli",
      "Bell pepper",
      "Onion",
      "Mushroom",
      "Carrot",
      "Zucchini",
      "Spinach",
      "Tomato",
      "Bok choy",
      "Corn",
      "Green beans",
      "Cabbage",
      "Eggplant",
      "Potato",
    ],
  },
  {
    name: "Base & Carbs",
    emoji: "🍚",
    items: ["Rice", "Egg noodles", "Rice noodles", "Pasta", "Tortilla", "Bread"],
  },
  {
    name: "Extras & Flavor",
    emoji: "🧄",
    items: [
      "Cheese",
      "Avocado",
      "Peanuts",
      "Garlic",
      "Ginger",
      "Chili",
      "Lime",
      "Cilantro",
      "Basil",
      "Soy sauce",
      "Coconut milk",
      "Curry paste",
    ],
  },
];

export const MAX_INGREDIENTS = 12;
