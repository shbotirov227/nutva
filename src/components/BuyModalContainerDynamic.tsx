// components/BuyModalContainerDynamic.tsx
"use client";

import dynamic from "next/dynamic";

const BuyModalContainer = dynamic(() => import("@/components/BuyModal"), {
  ssr: false,
});

export default function BuyModalContainerDynamic() {
  return <BuyModalContainer />;
}
