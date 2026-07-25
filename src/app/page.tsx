import Link from "next/link";
import MenuItemCard from "@/components/MenuItemCard";
import { MENU_ITEMS } from "@/data/menu";

export default function Home() {
  const featured = MENU_ITEMS.filter((item) => item.featured);

  return (
    <div className="flex flex-col gap-12">
      <section className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-100">
          Fresh · Fast · Delicious
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
          Your favorite food, delivered to your door
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-orange-50">
          Hand-crafted dishes made to order. Delivery in about 40 minutes, or
          skip the fee and pick up in 20.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-orange-600 shadow-lg transition-transform hover:scale-105"
        >
          Order Now
        </Link>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-zinc-900">Customer favorites</h2>
          <Link
            href="/menu"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View full menu →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            emoji: "🚚",
            title: "Fast delivery",
            text: "Hot food at your door in about 40 minutes.",
          },
          {
            emoji: "🥬",
            title: "Fresh ingredients",
            text: "Sourced daily from local markets.",
          },
          {
            emoji: "💳",
            title: "Easy checkout",
            text: "Order in a few taps — delivery or pickup.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm"
          >
            <span className="text-3xl" aria-hidden>
              {f.emoji}
            </span>
            <h3 className="mt-2 font-semibold text-zinc-900">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
