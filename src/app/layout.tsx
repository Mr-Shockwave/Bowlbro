import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EmberEats — Fresh food, delivered fast",
  description:
    "Order appetizers, mains, desserts, and drinks from EmberEats for delivery or pickup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-orange-50/40 font-sans">
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
            {children}
          </main>
          <CartDrawer />
          <footer className="border-t border-orange-100 bg-white py-6 text-center text-sm text-zinc-400">
            EmberEats demo — no real orders or payments.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
