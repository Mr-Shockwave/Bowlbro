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
  /** Real photo under /public; falls back to emoji when absent. */
  image?: string;
  vegetarian?: boolean;
  spicy?: boolean;
  featured?: boolean;
  /** Vendor-provided one-sentence intro (required on vendor dishes). */
  tagline?: string;
  /** Vendor-declared allergens; ["None"] means explicitly allergen-free. */
  allergens?: string[];
}

export const CUISINE_GRADIENTS: Record<Cuisine, string> = {
  Asian: "from-amber-200 to-orange-300",
  American: "from-orange-200 to-red-300",
  Mexican: "from-lime-200 to-green-300",
  Italian: "from-rose-200 to-red-300",
};

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
    name: "春卷 Spring Rolls",
    description:
      "Golden-fried rolls stuffed with cabbage, carrot, and glass noodles, served with sweet chili sauce.",
    price: 6.5,
    category: "Appetizers",
    cuisine: "Asian",
    emoji: "🥟",
    gradient: "from-amber-200 to-orange-300",
    image: "/dishes/spring-rolls.jpg",
    vegetarian: true,
  },
  {
    id: "app-2",
    name: "锅贴 Potstickers",
    description:
      "Pan-fried pork and chive dumplings with a crispy golden base, served with black vinegar dip.",
    price: 8.5,
    category: "Appetizers",
    cuisine: "Asian",
    emoji: "🥟",
    gradient: "from-amber-200 to-orange-300",
    image: "/dishes/potstickers.jpg",
  },
  {
    id: "app-3",
    name: "拍黄瓜 Smashed Cucumber Salad",
    description:
      "Chilled smashed cucumbers tossed with garlic, rice vinegar, and chili oil.",
    price: 5.95,
    category: "Appetizers",
    cuisine: "Asian",
    emoji: "🥒",
    gradient: "from-green-200 to-emerald-300",
    image: "/dishes/cucumber-salad.jpg",
    vegetarian: true,
    spicy: true,
  },
  {
    id: "app-4",
    name: "酸辣汤 Hot & Sour Soup",
    description:
      "Classic thick soup with tofu, bamboo shoots, wood ear mushrooms, and white pepper.",
    price: 6.95,
    category: "Appetizers",
    cuisine: "Asian",
    emoji: "🍲",
    gradient: "from-orange-200 to-amber-300",
    image: "/dishes/hot-sour-soup.jpg",
    spicy: true,
  },
  // Mains
  {
    id: "main-1",
    name: "水煮鱼 Sichuan Boiled Fish",
    description:
      "Tender fish fillets poached in fiery chili-and-Sichuan-peppercorn broth over bean sprouts.",
    price: 22.95,
    category: "Mains",
    cuisine: "Asian",
    emoji: "🐟",
    gradient: "from-red-300 to-rose-400",
    image: "/dishes/shuizhuyu.jpg",
    spicy: true,
    featured: true,
  },
  {
    id: "main-2",
    name: "清蒸鱼 Steamed Whole Fish",
    description:
      "Whole fish steamed Cantonese-style with ginger, scallion, and light soy — delicate and fresh.",
    price: 24.95,
    category: "Mains",
    cuisine: "Asian",
    emoji: "🐠",
    gradient: "from-teal-200 to-cyan-300",
    image: "/dishes/steamed-fish.jpg",
  },
  {
    id: "main-3",
    name: "左宗棠鸡 General Tso's Chicken",
    description:
      "Crispy chicken glazed in sweet-tangy-spicy sauce with dried chilies and broccoli.",
    price: 16.5,
    category: "Mains",
    cuisine: "Asian",
    emoji: "🍗",
    gradient: "from-orange-300 to-red-400",
    image: "/dishes/general-tso.jpg",
    spicy: true,
    featured: true,
  },
  {
    id: "main-4",
    name: "牛肉炒芥兰 Beef with Gai Lan",
    description:
      "Wok-seared beef and Chinese broccoli in a savory oyster-ginger sauce.",
    price: 17.95,
    category: "Mains",
    cuisine: "Asian",
    emoji: "🥦",
    gradient: "from-green-200 to-emerald-300",
    image: "/dishes/beef-gailan.jpg",
  },
  {
    id: "main-5",
    name: "白灼虾 Blanched Shrimp",
    description:
      "Sweet whole shrimp flash-poached and served with ginger-scallion soy dip — simple and pure.",
    price: 18.95,
    category: "Mains",
    cuisine: "Asian",
    emoji: "🦐",
    gradient: "from-amber-200 to-yellow-300",
    image: "/dishes/baizhuoxia.jpg",
    featured: true,
  },
  {
    id: "main-6",
    name: "麻婆豆腐 Mapo Tofu",
    description:
      "Silky tofu in numbing-spicy chili bean sauce with minced pork and Sichuan peppercorn.",
    price: 13.95,
    category: "Mains",
    cuisine: "Asian",
    emoji: "🌶️",
    gradient: "from-red-300 to-rose-400",
    image: "/dishes/mapo-tofu.jpg",
    spicy: true,
  },
  {
    id: "main-7",
    name: "宫保鸡丁 Kung Pao Chicken",
    description:
      "Diced chicken stir-fried with peanuts, dried chilies, and scallion in a glossy sweet-savory sauce.",
    price: 15.95,
    category: "Mains",
    cuisine: "Asian",
    emoji: "🥜",
    gradient: "from-orange-300 to-red-400",
    image: "/dishes/kungpao.jpg",
    spicy: true,
  },
  {
    id: "main-8",
    name: "扬州炒饭 Yangzhou Fried Rice",
    description:
      "Classic fried rice with shrimp, char siu, egg, and peas — every grain separate.",
    price: 12.95,
    category: "Mains",
    cuisine: "Asian",
    emoji: "🍚",
    gradient: "from-amber-200 to-yellow-300",
    image: "/dishes/yangzhou-rice.jpg",
  },
  // Desserts
  {
    id: "des-1",
    name: "蛋挞 Egg Tarts",
    description:
      "Flaky Hong Kong-style tarts with silky egg custard, baked to order.",
    price: 5.95,
    category: "Desserts",
    cuisine: "Asian",
    emoji: "🥧",
    gradient: "from-yellow-200 to-amber-300",
    image: "/dishes/egg-tart.jpg",
    vegetarian: true,
    featured: true,
  },
  {
    id: "des-2",
    name: "芝麻球 Sesame Balls",
    description:
      "Crispy-chewy glutinous rice balls rolled in sesame, filled with sweet red bean paste.",
    price: 5.5,
    category: "Desserts",
    cuisine: "Asian",
    emoji: "🍡",
    gradient: "from-amber-200 to-orange-300",
    image: "/dishes/sesame-balls.jpg",
    vegetarian: true,
  },
  {
    id: "des-3",
    name: "芒果布丁 Mango Pudding",
    description: "Chilled silky mango pudding topped with fresh mango and evaporated milk.",
    price: 6.5,
    category: "Desserts",
    cuisine: "Asian",
    emoji: "🥭",
    gradient: "from-yellow-200 to-amber-300",
    image: "/dishes/mango-pudding.jpg",
    vegetarian: true,
  },
  // Drinks
  {
    id: "drk-1",
    name: "珍珠奶茶 Bubble Milk Tea",
    description: "Hong-Kong-style milk tea with chewy tapioca pearls over ice.",
    price: 5.25,
    category: "Drinks",
    cuisine: "Asian",
    emoji: "🧋",
    gradient: "from-orange-200 to-amber-300",
    image: "/dishes/bubble-tea.jpg",
    vegetarian: true,
  },
  {
    id: "drk-2",
    name: "菊花茶 Chrysanthemum Tea",
    description: "Lightly sweet chrysanthemum flower tea, served hot or iced.",
    price: 3.95,
    category: "Drinks",
    cuisine: "Asian",
    emoji: "🌼",
    gradient: "from-yellow-200 to-lime-300",
    image: "/dishes/chrysanthemum-tea.jpg",
    vegetarian: true,
  },
  {
    id: "drk-3",
    name: "豆浆 Fresh Soy Milk",
    description: "House-made soy milk, lightly sweetened — served warm or cold.",
    price: 3.5,
    category: "Drinks",
    cuisine: "Asian",
    emoji: "🥛",
    gradient: "from-amber-100 to-yellow-200",
    image: "/dishes/soy-milk.jpg",
    vegetarian: true,
  },
];

export const DELIVERY_FEE = 3.99;
export const TAX_RATE = 0.08;

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
