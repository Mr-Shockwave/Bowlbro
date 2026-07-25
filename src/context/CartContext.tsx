"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { MENU_ITEMS, type MenuItem } from "@/data/menu";

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  hydrated: boolean;
  drawerOpen: boolean;
}

type CartAction =
  | { type: "add"; item: MenuItem }
  | { type: "remove"; id: string }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "setDrawer"; open: boolean };

const STORAGE_KEY = "food-order-cart";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find((l) => l.item.id === action.item.id);
      const lines = existing
        ? state.lines.map((l) =>
            l.item.id === action.item.id ? { ...l, quantity: l.quantity + 1 } : l
          )
        : [...state.lines, { item: action.item, quantity: 1 }];
      return { ...state, lines };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.item.id !== action.id) };
    case "setQuantity": {
      if (action.quantity <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.item.id !== action.id) };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.item.id === action.id ? { ...l, quantity: action.quantity } : l
        ),
      };
    }
    case "clear":
      return { ...state, lines: [] };
    case "hydrate":
      return { ...state, lines: action.lines, hydrated: true };
    case "setDrawer":
      return { ...state, drawerOpen: action.open };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  drawerOpen: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
    hydrated: false,
    drawerOpen: false,
  });

  useEffect(() => {
    let lines: CartLine[] = [];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Menu items are stored as ids and re-resolved so stale menu data never
        // renders; custom (build-your-own) items are stored inline.
        const parsed: { id: string; quantity: number; item?: MenuItem }[] =
          JSON.parse(saved);
        lines = parsed.flatMap((entry) => {
          const item =
            entry.item ?? MENU_ITEMS.find((m) => m.id === entry.id);
          return item && entry.quantity > 0
            ? [{ item, quantity: entry.quantity }]
            : [];
        });
      }
    } catch {
      // ignore corrupt storage
    }
    dispatch({ type: "hydrate", lines });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const compact = state.lines.map((l) =>
      l.item.id.startsWith("custom-")
        ? { id: l.item.id, quantity: l.quantity, item: l.item }
        : { id: l.item.id, quantity: l.quantity }
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
  }, [state.lines, state.hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = state.lines.reduce(
      (sum, l) => sum + l.item.price * l.quantity,
      0
    );
    return {
      lines: state.lines,
      itemCount,
      subtotal,
      drawerOpen: state.drawerOpen,
      addItem: (item) => dispatch({ type: "add", item }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      updateQuantity: (id, quantity) => dispatch({ type: "setQuantity", id, quantity }),
      clearCart: () => dispatch({ type: "clear" }),
      openDrawer: () => dispatch({ type: "setDrawer", open: true }),
      closeDrawer: () => dispatch({ type: "setDrawer", open: false }),
    };
  }, [state.lines, state.drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
