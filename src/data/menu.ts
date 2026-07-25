export type Category = "Appetizers" | "Mains" | "Desserts" | "Drinks";
export type Cuisine = "Asian" | "American" | "Mexican" | "Italian";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  cuisine: Cuisine;
  emoji: string;
  gradient: string;
  vegetarian?: boolean;
  spicy?: boolean;
  featured?: boolean;
}

export const CATEGORIES: Category[] = [
  "Appetizers",
  "Mains",
  "Desserts",
  "Drinks",
];

export const CUISINES: Cuisine[] = ["Asian", "American", "Mexican", "Italian"];

export const CUISINE_EMOJI: Record<Cuisine, string> = {
  Asian: "🥢",
  American: "🇺🇸",
  Mexican: "🌵",
  Italian: "🍝",
};

export const MENU_ITEMS: MenuItem[] = [
  // Appetizers
  {
    id: "app-1",
    cuisine: "Asian",
    name: "Crispy Spring Rolls",
    description:
      "Golden-fried rolls stuffed with cabbage, carrot, and glass noodles, served with sweet chili sauce.",
    price: 6.5,
    category: "Appetizers",
    emoji: "🥟",
    gradient: "from-amber-200 to-orange-300",
    vegetarian: true,
  },
  {
    id: "app-2",
    cuisine: "American",
    name: "Buffalo Wings",
    description:
      "Eight jumbo wings tossed in tangy buffalo sauce with blue cheese dip and celery sticks.",
    price: 9.95,
    category: "Appetizers",
    emoji: "🍗",
    gradient: "from-orange-300 to-red-400",
    spicy: true,
    featured: true,
  },
  {
    id: "app-3",
    cuisine: "American",
    name: "Garlic Parmesan Fries",
    description:
      "Hand-cut fries tossed with roasted garlic, parmesan, and fresh parsley.",
    price: 5.75,
    category: "Appetizers",
    emoji: "🍟",
    gradient: "from-yellow-200 to-amber-300",
    vegetarian: true,
  },
  {
    id: "app-4",
    cuisine: "Italian",
    name: "Caprese Skewers",
    description:
      "Cherry tomatoes, fresh mozzarella, and basil drizzled with balsamic glaze.",
    price: 7.25,
    category: "Appetizers",
    emoji: "🍢",
    gradient: "from-green-200 to-emerald-300",
    vegetarian: true,
  },
  {
    id: "app-5",
    cuisine: "Mexican",
    name: "Loaded Nachos",
    description:
      "Tortilla chips piled with cheddar, jalapeños, pico de gallo, guacamole, and sour cream.",
    price: 8.95,
    category: "Appetizers",
    emoji: "🧀",
    gradient: "from-yellow-300 to-orange-400",
    spicy: true,
  },
  // Mains
  {
    id: "main-1",
    cuisine: "American",
    name: "Classic Smash Burger",
    description:
      "Double smashed beef patties, American cheese, pickles, onions, and house sauce on a brioche bun.",
    price: 13.5,
    category: "Mains",
    emoji: "🍔",
    gradient: "from-amber-300 to-orange-400",
    featured: true,
  },
  {
    id: "main-2",
    cuisine: "Italian",
    name: "Margherita Pizza",
    description:
      "Wood-fired 12\" pizza with San Marzano tomatoes, fresh mozzarella, and basil.",
    price: 14.0,
    category: "Mains",
    emoji: "🍕",
    gradient: "from-red-300 to-rose-400",
    vegetarian: true,
    featured: true,
  },
  {
    id: "main-3",
    cuisine: "Asian",
    name: "Spicy Chicken Ramen",
    description:
      "Rich chicken broth, chili oil, soft egg, scallions, and bamboo shoots over fresh noodles.",
    price: 15.25,
    category: "Mains",
    emoji: "🍜",
    gradient: "from-orange-300 to-red-400",
    spicy: true,
  },
  {
    id: "main-4",
    cuisine: "Asian",
    name: "Grilled Salmon Bowl",
    description:
      "Miso-glazed salmon over jasmine rice with edamame, avocado, and sesame dressing.",
    price: 16.75,
    category: "Mains",
    emoji: "🍣",
    gradient: "from-teal-200 to-cyan-300",
  },
  {
    id: "main-5",
    cuisine: "Mexican",
    name: "Baja Fish Tacos",
    description:
      "Three beer-battered cod tacos with cabbage slaw, chipotle crema, and lime.",
    price: 12.95,
    category: "Mains",
    emoji: "🌮",
    gradient: "from-lime-200 to-green-300",
  },
  {
    id: "main-6",
    cuisine: "Asian",
    name: "Pad Thai",
    description:
      "Rice noodles stir-fried with tofu, egg, bean sprouts, peanuts, and tamarind sauce.",
    price: 13.95,
    category: "Mains",
    emoji: "🍤",
    gradient: "from-amber-200 to-yellow-300",
    vegetarian: true,
  },
  {
    id: "main-7",
    cuisine: "American",
    name: "BBQ Pulled Pork Sandwich",
    description:
      "Slow-smoked pulled pork with tangy BBQ sauce and coleslaw on a toasted bun.",
    price: 12.5,
    category: "Mains",
    emoji: "🥪",
    gradient: "from-orange-200 to-amber-400",
  },
  // Desserts
  {
    id: "des-1",
    cuisine: "American",
    name: "Molten Chocolate Cake",
    description:
      "Warm chocolate cake with a gooey center, served with vanilla ice cream.",
    price: 7.5,
    category: "Desserts",
    emoji: "🍫",
    gradient: "from-amber-400 to-orange-600",
    vegetarian: true,
    featured: true,
  },
  {
    id: "des-2",
    cuisine: "American",
    name: "New York Cheesecake",
    description:
      "Creamy classic cheesecake on a graham cracker crust with strawberry compote.",
    price: 6.95,
    category: "Desserts",
    emoji: "🍰",
    gradient: "from-rose-200 to-pink-300",
    vegetarian: true,
  },
  {
    id: "des-3",
    cuisine: "Asian",
    name: "Mango Sticky Rice",
    description:
      "Sweet coconut sticky rice with fresh mango slices and toasted sesame.",
    price: 6.5,
    category: "Desserts",
    emoji: "🥭",
    gradient: "from-yellow-200 to-amber-300",
    vegetarian: true,
  },
  {
    id: "des-4",
    cuisine: "Mexican",
    name: "Churros & Dulce de Leche",
    description:
      "Cinnamon-sugar churros with warm dulce de leche dipping sauce.",
    price: 5.95,
    category: "Desserts",
    emoji: "🥨",
    gradient: "from-orange-200 to-amber-400",
    vegetarian: true,
  },
  // Drinks
  {
    id: "drk-1",
    cuisine: "American",
    name: "Fresh Lemonade",
    description: "House-squeezed lemonade with a hint of mint.",
    price: 3.5,
    category: "Drinks",
    emoji: "🍋",
    gradient: "from-yellow-200 to-lime-300",
    vegetarian: true,
  },
  {
    id: "drk-2",
    cuisine: "Asian",
    name: "Mango Smoothie",
    description: "Ripe mango blended with yogurt and honey.",
    price: 4.95,
    category: "Drinks",
    emoji: "🥤",
    gradient: "from-amber-200 to-yellow-300",
    vegetarian: true,
  },
  {
    id: "drk-3",
    cuisine: "Asian",
    name: "Thai Iced Tea",
    description: "Sweet spiced black tea with condensed milk over ice.",
    price: 4.25,
    category: "Drinks",
    emoji: "🧋",
    gradient: "from-orange-200 to-amber-300",
    vegetarian: true,
  },
  {
    id: "drk-4",
    cuisine: "Italian",
    name: "Sparkling Water",
    description: "Chilled sparkling mineral water with lime.",
    price: 2.5,
    category: "Drinks",
    emoji: "💧",
    gradient: "from-sky-200 to-cyan-300",
    vegetarian: true,
  },
];

export const DELIVERY_FEE = 3.99;
export const TAX_RATE = 0.08;

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
