"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import Container from "@/components/Container";
import { useProductVisuals } from "@/hooks/useProductVisuals";
import { ProductName } from "@/types/enums";
import ProductPriceCard from "@/components/ProductPriceCard";
import ProductImage from "@/assets/images/product-green.png";
import { useLang } from "@/context/LangContext";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState("1");
  const { id } = useParams();
  const { lang } = useLang();
  const { t } = useTranslation();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id, lang],
    queryFn: () => apiClient.getOneProductById(id as string, lang),
    enabled: !!id,
  });

  const localizedProduct = useMemo(() => {
    if (!product) return null;

    const supportedLangs = ["uz", "ru", "en"];
    const currentLang = supportedLangs.includes(lang) ? lang : "uz";

    return product[currentLang as "uz" | "ru" | "en"];
  }, [product, lang]);


  const { color, bgImage } = useProductVisuals(localizedProduct?.name as ProductName);

  if (isLoading || !product) {
    return (
      <div className="pt-32">
        <Container>
          <h1 className="text-center">Yuklanmoqda...</h1>
        </Container>
      </div>
    );
  }

  console.log("Product details:", product, id);

  return (
    <div className={clsx("pt-32", `bg-${color}`)}>
      <Container>
        <div
          className="absolute h-full w-full inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        <div className="flex items-center justify-between">
          <Image
            src={ProductImage}
            alt={localizedProduct?.name || "Product Image"}
            // width={300}
            className="w-auto h-auto"
          />

          <div className="mt-8">
            <ProductPriceCard product={product} color={color} />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className={clsx("mt-10", activeTab ? "bg-black text-white" : "")}>
          <TabsList className="flex gap-4 bg-transparent">
            {["1", "2", "3", "4"].map((tab) => (
              <TabsTrigger key={tab} value={tab} asChild>
                <Button
                  size="lg"
                  variant={activeTab === tab ? "default" : "outline"}
                >
                  {t(`product.tab.${tab}`)}
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>


          <TabsContent key={lang} value={t("product.tab.1")}>
            <ul className="space-y-4 mt-4 list-disc grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
              <li className="text-lg font-semibold">
                Nutva Complex состоит из 100% натуральных компонентов.
              </li>
              <li className="text-gray-700">
                Грыжа позвоночника - нарушение целостности внешней оболочки межпозвоночного диска!
              </li>
              <li className="text-gray-500">
                Гонартроз - хроническое дегенеративное заболевание коленного
                сустава.
              </li>
              <li className="text-gray-500">
                Запускает процесс регенерации и улучшает качества
                синовиальной жидкости, возобновляет ее нормальную
                циркуляцию.
              </li>
              <li className="text-gray-500">
                Остеопороз - хрупкость костей.
              </li>
              <li className="text-gray-500">
                Коксартроз - эрозия тазобедренного сустава.
              </li>
              <li className="text-gray-500">
                Полиартрит - воспаление суставов.
              </li>
              <li className="text-gray-500">
                Способствуют выведению токсинов и воздействуют на
                восстановление тканей, питает его необходимыми веществами.
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
