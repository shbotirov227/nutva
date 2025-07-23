import { AlertBox } from "./AlertBox";
import { InfoBox } from "./InfoBox";
import { ContactFooter } from "./ContactFooter";

export function MainSection() {
  return (
    <div className="bg-[#C0E3BF] min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#105D3F]">
          🛡️ Return Policy
        </h1>
        <p className="text-center text-sm text-[#155E41]">
          <span className="block">Return Policy – Nutva.uz</span>
          <span className="inline-block px-4 py-1 mt-1 rounded-md bg-[#38C194] text-white font-semibold">
            Health-related products
          </span>
        </p>

        <AlertBox />

        <InfoBox />

        <ContactFooter />
      </div>
    </div>
  );
}
