"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { DELIVERY_FEE, TAX_RATE, formatPrice } from "@/data/menu";

export type OrderType = "delivery" | "pickup";

export interface PlacedOrder {
  orderNumber: string;
  name: string;
  phone: string;
  address?: string;
  orderType: OrderType;
  lines: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  estimatedMinutes: number;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();

  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryFee + tax;

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!/^[\d\s()+-]{7,}$/.test(phone.trim()))
      next.phone = "Please enter a valid phone number.";
    if (orderType === "delivery" && !address.trim())
      next.address = "Please enter a delivery address.";
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || lines.length === 0) return;

    setSubmitting(true);
    const order: PlacedOrder = {
      orderNumber: `EE-${Math.floor(100000 + Math.random() * 900000)}`,
      name: name.trim(),
      phone: phone.trim(),
      address: orderType === "delivery" ? address.trim() : undefined,
      orderType,
      lines: lines.map((l) => ({
        name: l.item.name,
        quantity: l.quantity,
        price: l.item.price,
      })),
      subtotal,
      deliveryFee,
      tax,
      total,
      estimatedMinutes: orderType === "delivery" ? 40 : 20,
    };
    window.sessionStorage.setItem("food-order-last", JSON.stringify(order));
    clearCart();
    router.push("/confirmation");
  }

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-2.5 text-zinc-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-100 ${
      hasError ? "border-red-400 bg-red-50" : "border-zinc-200 bg-white"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-zinc-700">
          Order type
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: "delivery", label: "🚚 Delivery", note: `+${formatPrice(DELIVERY_FEE)} fee` },
              { value: "pickup", label: "🏃 Pickup", note: "No fee" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-center transition-colors ${
                orderType === opt.value
                  ? "border-orange-600 bg-orange-50"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <input
                type="radio"
                name="orderType"
                value={opt.value}
                checked={orderType === opt.value}
                onChange={() => setOrderType(opt.value)}
                className="sr-only"
              />
              <span className="block font-semibold text-zinc-900">{opt.label}</span>
              <span className="text-xs text-zinc-500">{opt.note}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold text-zinc-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jamie Rivera"
          className={inputClass(!!errors.name)}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-zinc-700">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          className={inputClass(!!errors.phone)}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      {orderType === "delivery" && (
        <div>
          <label
            htmlFor="address"
            className="mb-1 block text-sm font-semibold text-zinc-700"
          >
            Delivery address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Apt 4B"
            className={inputClass(!!errors.address)}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
      )}

      <div className="rounded-xl bg-zinc-50 p-4 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-zinc-600">Subtotal</span>
          <span data-testid="checkout-subtotal">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-zinc-600">Delivery fee</span>
          <span data-testid="checkout-fee">
            {deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-zinc-600">Tax (8%)</span>
          <span data-testid="checkout-tax">{formatPrice(tax)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
          <span>Total</span>
          <span data-testid="checkout-total">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || lines.length === 0}
        className="rounded-full bg-orange-600 py-3.5 font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Placing order…" : `Place Order · ${formatPrice(total)}`}
      </button>
    </form>
  );
}
