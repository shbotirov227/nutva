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
import { useLang } from "@/context/LangContext";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsComponent from "@/containers/Products";
import SaleSection from "@/containers/SaleSection";
import { Skeleton } from "@/components/ui/skeleton";
import ProductImage from "@/assets/images/product-green.png";
import ProductDetailImage from "@/assets/images/product-detail-img.png";
import DefaultVideoImg from "@/assets/images/reviewcard-img.png";
import GinsengImg from "@/assets/images/ginseng.png";
import CertificateImg from "@/assets/images/certificate-img.png";
import ProductDetailSkeleton from "@/components/ProductDetailSkleton";

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
    return <ProductDetailSkeleton />;
  }

  console.log("Product details:", product, id);

  return (
    <div className="relative pt-32 overflow-hidden">
      <div
        className="absolute inset-0 -z-20"
        style={{ backgroundColor: bgColor }}
      />

      <div
        className="absolute inset-0 -z-10 object-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="relative z-10">
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

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="my-10">
            <TabsList className="flex gap-4 bg-transparent">
              {["1", "2", "3", "4"].map((tab) => (
                <TabsTrigger key={tab} value={tab} asChild className={clsx("cursor-pointer shadow-md", activeTab === tab ? "!bg-black text-white" : "")}>
                  <Button
                    size="lg"
                    variant={activeTab === tab ? "default" : "outline"}
                    className="w-full p-5 text-base font-semibold"
                  >
                    {t(`product.tab.${tab}`)}
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>


            <TabsContent key={`tab-1-${lang}`} value={"1"}>
              <ul className="space-y-4 my-12 list-disc grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                <li className="text-base font-semibold">
                  Nutva Complex состоит из 100% натуральных компонентов.
                </li>
                <li className="text-base font-semibold">
                  Грыжа позвоночника - нарушение целостности внешней оболочки межпозвоночного диска!
                </li>
                <li className="text-base font-semibold">
                  Гонартроз - хроническое дегенеративное заболевание коленного
                  сустава.
                </li>
                <li className="text-base font-semibold">
                  Запускает процесс регенерации и улучшает качества
                  синовиальной жидкости, возобновляет ее нормальную
                  циркуляцию.
                </li>
                <li className="text-base font-semibold">
                  Остеопороз - хрупкость костей.
                </li>
                <li className="text-base font-semibold">
                  Коксартроз - эрозия тазобедренного сустава.
                </li>
                <li className="text-base font-semibold">
                  Полиартрит - воспаление суставов.
                </li>
                <li className="text-base font-semibold">
                  Способствуют выведению токсинов и воздействуют на
                  восстановление тканей, питает его необходимыми веществами.
                </li>
              </ul>

              <div className="mt-10 w-full flex justify-center">
                <Image src={DefaultVideoImg} alt="Product Image" width={500} className="w-[600px] rounded-xl h-auto" />
              </div>

              <div className="mt-10">
                <h4 className="text-lg font-semibold mb-6">
                  Дополнительно:
                </h4>
                <ul className="space-y-3">
                  <li className="text-base">
                    Эффективно помогает при таких заболеваниях как:
                  </li>
                  <li className="text-base">
                    Грыжа позвоночника - нарушение целостности внешней оболочки межпозвоночного диска;
                  </li>
                  <li className="text-base">
                    Коксартроз - эрозия тазобедренного сустава;
                  </li>
                  <li className="text-base">
                    Гонартроз - хроническое дегенеративное заболевание коленного сустава;
                  </li>
                  <li className="text-base">
                    Полиартрит - воспаление суставов;
                  </li>
                  <li className="text-base">
                    Остеопороз - хрупкость костей;
                  </li>
                </ul>
              </div>

              <div className="flex justify-center mt-10">
                <Image src={ProductDetailImage} alt="Product Detail Image" width={500} className="w-[500px] rounded-xl h-auto" />
              </div>
            </TabsContent>

            <TabsContent key={`tab-2-${lang}`} value={"2"}>
              <div className="mb-10">
                {[1, 2, 3].map((item, index) => (
                  <div
                    key={item}
                    className={clsx(
                      "grid grid-cols-1 md:grid-cols-2 gap-6 items-center",
                      index % 2 === 1 && "md:flex-row-reverse md:flex"
                    )}
                  >
                    <div className="flex justify-center">
                      <Image
                        src={GinsengImg}
                        alt="Ginseng Image"
                        width={500}
                        className="w-[500px] rounded-xl h-auto"
                      />
                    </div>

                    <div className="mt-10">
                      <h4 className="text-lg font-semibold mb-6">
                        Дополнительно:
                      </h4>
                      <ul className="space-y-3">
                        <li className="text-base">
                          Эффективно помогает при таких заболеваниях как:
                        </li>
                        <li className="text-base">
                          Грыжа позвоночника - нарушение целостности внешней оболочки межпозвоночного диска;
                        </li>
                        <li className="text-base">
                          Коксартроз - эрозия тазобедренного сустава;
                        </li>
                        <li className="text-base">
                          Гонартроз - хроническое дегенеративное заболевание коленного сустава;
                        </li>
                        <li className="text-base">
                          Полиартрит - воспаление суставов;
                        </li>
                        <li className="text-base">
                          Остеопороз - хрупкость костей;
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent key={`tab-3-${lang}`} value={"3"}>
              <div className="my-12 max-w-[80%] mx-auto">
                <h4 className="text-base leading-10 font-semibold mb-2">
                  Клиническая фармакология:
                </h4>
                <p className="text-base mb-4 leading-10">
                  Комплексный продукт для поддержания здоровья суставов и костей: Оказывает питательную поддержку соединительной ткани, улучшает синтез коллагена и эластина, оказывает общеукрепляющее воздействие на организм. Способствует купированию воспалительных процессов в тканях, снижению болевого синдрома.
                </p>

                <h4 className="text- leading-10 font-semibold mb-2">
                  Показания к применению:
                </h4>
                <p className="text-base mb-4 leading-10">
                  В качестве биологически активной добавки рекомендуется при нарушениях функции опорно-двигательного аппарата (остеохондроз позвоночника, артриты и артрозы, тендовагиниты, миозиты, в восстановительном периоде после травм), как ежедневная поддержка костно-суставной системы для спортсменов и других лиц, имеющих повышенную нагрузку на опорно-двигательный аппарат; заболевания сосудов, в том числе тромбофлебиты, геморрой; патологии со стороны клапанов сердца; аномалии и другие заболевания со стороны соединительной ткани. Способствует укреплению волос, ногтей, повышению эластичности кожи и улучшению ее внешнего вида, помогает при воспалении и напряжении в суставах, мышцах, связках.
                </p>
                <h4 className="text-base leading-10 font-semibold mb-2">
                  Способ применения и дозировка:
                </h4>
                <p className="text-base mb-4 leading-10">
                  Взрослым по 2 капсулы в день, вечером за 30 минут до еды. Продукт рекомендуется принимать длительными курсами в течение 3-4 месяцев.
                </p>
                <h4 className="text-base leading-10 font-semibold mb-2">
                  Противопоказания:
                </h4>
                <p className="text-base mb-4 leading-10">
                  Индивидуальная непереносимость компонентов продукта, беременность, кормление грудью.
                </p>
              </div>
            </TabsContent>

            <TabsContent key={`tab-4-${lang}`} value={"4"}>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-6 items-center my-12">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="">
                    <Image
                      src={CertificateImg}
                      alt="product"
                      width={250}
                      height={350}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <ProductsComponent isAviableBackground={false} />
          <SaleSection />
        </Container>
      </div>
    </div>
  );
}
