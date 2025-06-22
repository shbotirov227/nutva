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
import ProductDetailImage from "@/assets/images/product-detail-img.png";
import DefaultVideoImg from "@/assets/images/reviewcard-img.png";
import { useLang } from "@/context/LangContext";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsComponent from "@/containers/Products";
import SaleSection from "@/containers/SaleSection";

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


  const { color, bgImage, bgColor } = useProductVisuals(localizedProduct?.name as ProductName, { includeBgColor: true });

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
    <div className="pt-32">
        <div
          className="absolute h-full w-full inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      <Container>

        <div className="grid grid-cols-1 md:grid-cols-2 mb-8">
          <Image
            src={ProductImage}
            alt={localizedProduct?.name || "Product Image"}
            width={500}
            height={500}
            priority
            className="w-auto h-auto"
          />

          <div className="">
            <ProductPriceCard product={product} color={color} />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-10">
          <TabsList className="flex gap-4 bg-transparent">
            {["1", "2", "3", "4"].map((tab) => (
              <TabsTrigger key={tab} value={tab} asChild className={clsx("cursor-pointer shadow-md", activeTab === tab ? "!bg-black text-white" : "")}>
                <Button
                  size="lg"
                  variant={activeTab === tab ? "default" : "outline"}
                >
                  {t(`product.tab.${tab}`)}
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>


          <TabsContent key={lang} value={"1"}>
            <ul className="space-y-4 mt-4 list-disc grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
              <li className="text-lg font-semibold">
                Nutva Complex состоит из 100% натуральных компонентов.
              </li>
              <li className="text-lg font-semibold">
                Грыжа позвоночника - нарушение целостности внешней оболочки межпозвоночного диска!
              </li>
              <li className="text-lg font-semibold">
                Гонартроз - хроническое дегенеративное заболевание коленного
                сустава.
              </li>
              <li className="text-lg font-semibold">
                Запускает процесс регенерации и улучшает качества
                синовиальной жидкости, возобновляет ее нормальную
                циркуляцию.
              </li>
              <li className="text-lg font-semibold">
                Остеопороз - хрупкость костей.
              </li>
              <li className="text-lg font-semibold">
                Коксартроз - эрозия тазобедренного сустава.
              </li>
              <li className="text-lg font-semibold">
                Полиартрит - воспаление суставов.
              </li>
              <li className="text-lg font-semibold">
                Способствуют выведению токсинов и воздействуют на
                восстановление тканей, питает его необходимыми веществами.
              </li>
            </ul>

            <div className="mt-10 w-full flex justify-center">
              <Image src={DefaultVideoImg} alt="Product Image" width={500} className="w-[600px] rounded-xl h-auto" />
            </div>

            <div className="mt-10">
              <h4 className="text-2xl font-semibold mb-4">
                Дополнительно:
              </h4>
              <ul>
                <li className="text-lg">
                  Эффективно помогает при таких заболеваниях как:
                </li>
                <li className="text-lg">
                  Грыжа позвоночника - нарушение целостности внешней оболочки межпозвоночного диска;
                </li>
                <li className="text-lg">
                  Коксартроз - эрозия тазобедренного сустава;
                </li>
                <li className="text-lg">
                  Гонартроз - хроническое дегенеративное заболевание коленного сустава;
                </li>
                <li className="text-lg">
                  Полиартрит - воспаление суставов;
                </li>
                <li className="text-lg">
                  Остеопороз - хрупкость костей;
                </li>
              </ul>
            </div>

            <div className="flex justify-center mt-10">
              <Image src={ProductDetailImage} alt="Product Detail Image" width={500} className="w-[500px] rounded-xl h-auto" />
            </div>

            <ProductsComponent isAviableBackground={false} />
            <SaleSection />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
