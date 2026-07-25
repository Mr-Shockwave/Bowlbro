import CalCalculator from "@/components/CalCalculator";

export const metadata = {
  title: "Cal Calculator — EmberEats",
  description: "Upload a photo of a real dish and AI estimates its calories.",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold text-zinc-900">Cal Calculator</h1>
      <p className="mt-1 text-zinc-500">
        Curious what a dish is really worth? Snap a photo and find out.
      </p>
      <div className="mt-6">
        <CalCalculator />
      </div>
    </div>
  );
}
