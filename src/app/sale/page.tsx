"use client";

import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { productBgColors } from "@/types/records";
import PriceTable from "./components/PriceTable";
// import SaleCard from "./components/SaleCard";
// import SaleTotalCard from "./components/SaleTotalCard";
import SaleHeroImg from "@/assets/images/sale-page-hero-img.png";
import StarIcon from "@/assets/images/star-icon.svg";
// import ProductGreen from "@/assets/images/product-green.png";
// import ProductRed from "@/assets/images/product-red.png";
// import ProductOrange from "@/assets/images/product-orange.png";
import CheckedIcon from "@/assets/images/checked-icon.svg";
import { Button } from "@/components/ui/button";

// const renderDiscount = (
//   products: {
//     title: string;
//     discountPrice: string;
//     originalPrice: string;
//   }[],
//   description: string,
//   color: string
// ) => {
//   const isThree = products.length === 3;

//   return (
//     <div
//       className="w-full mx-auto my-10 bg-white rounded-2xl shadow-lg border-2 overflow-hidden"
//       style={{ borderColor: color }}
//     >
//       <li
//         className="text-xl font-bold bg-[#0FB759AB] px-5 py-7 text-white !list-disc"
//         style={{ color }}
//       >
//         {description}
//       </li>

//       <div
//         className={cn(
//           "p-5 gap-6",
//           isThree
//             ? "flex flex-col items-center justify-center"
//             : "grid grid-cols-1 md:grid-cols-2"
//         )}
//       >
//         <div
//           className={cn(
//             "w-full",
//             isThree
//               ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//               : "grid grid-cols-1 sm:grid-cols-2 gap-6"
//           )}
//         >
//           <h4 className="text-lg font-bold col-span-full" style={{ color }}>
//             Mahsulotlar:
//           </h4>
//           {products.map((item, index) => (
//             <SaleCard
//               key={index}
//               color={color}
//               title={item.title}
//               discountPrice={item.discountPrice}
//               originalPrice={item.originalPrice}
//             />
//           ))}
//         </div>

//         <div className="w-full">
//           <SaleTotalCard color={color} />
//         </div>
//       </div>
//     </div>
//   );
// };

const SalePage = () => {
  const { t } = useTranslation();
  const color = productBgColors.Complex;

  // const productsDataThree = [
  //   {
  //     title: "2 ta Complex: 990 000 x 2 = 1 980 000 so‘m (chegirmasiz narx: 2 340 000 so‘m) ",
  //     itemData: [
  //       {
  //         title: "Nutva Complex",
  //         discountPrice: "990 000",
  //         originalPrice: "1 170 000",
  //       },
  //       {
  //         title: "Nutva Complex",
  //         discountPrice: "990 000",
  //         originalPrice: "1 170 000",
  //       },
  //     ],
  //     totalPriceSection: {
  //       totalPrice: "1 980 000",
  //       originalPrice: "2 340 000",
  //       discountPrice: "360 000",
  //     },
  //   },

  //   {
  //     title: "1ta Complex + 1ta Complex Extra + 1ta Gelmin Kids = 1 570 000 so'm (chegirmasiz narxi: 2 830 000 so'm)",
  //     itemData: [
  //       {
  //         title: "Nutva Complex",
  //         discountPrice: "640 000",
  //         originalPrice: "1 170 000",
  //       },
  //       {
  //         title: "Complex Extra",
  //         discountPrice: "640 000",
  //         originalPrice: "1 170 000",
  //       },
  //       {
  //         title: "Gelmin Kids",
  //         discountPrice: "290 000",
  //         originalPrice: "490 000",
  //       },
  //     ],
  //     totalPriceSection: {
  //       totalPrice: "1 570 000",
  //       originalPrice: "2 830 000",
  //       discountPrice: "1 260 000",
  //     },
  //   },

  //   {
  //     title: "2ta Complex + 2ta Complex Extra + 1ta Gelmin Kids = 2 460 000 so'm (chegirmasiz narxi: 5 170 000 so'm)",
  //     itemData: [
  //       {
  //         title: "Nutva Complex 2 ta",
  //         discountPrice: "390 000",
  //         originalPrice: "1 170 000",
  //       },
  //       {
  //         title: "Complex Extra 2 ta",
  //         discountPrice: "390 000",
  //         originalPrice: "1 170 000",
  //       },
  //       {
  //         title: "Gelmin Kids",
  //         discountPrice: "220 000",
  //         originalPrice: "490 000",
  //       },
  //     ],
  //     totalPriceSection: {
  //       totalPrice: "2 460 000",
  //       originalPrice: "5 170 000",
  //       discountPrice: "2 710 000",
  //     },
  //   },
  // ];



  return (
    <Container className="pt-32 pb-25">
      <div className="flex max-md:flex-col items-center justify-between text-center">
        <div className="w-[55%] max-md:w-full flex flex-col items-center justify-center">
          <h1 className="text-6xl max-md:text-4xl font-bold mb-5" style={{ color }}>{t("sale.title")}</h1>
          <p className="text-3xl max-md:text-2xl" style={{ color }}>{t("sale.subtitle")}</p>
        </div>

        <div className="w-[45%] max-md:w-[90%]">
          <Image
            src={SaleHeroImg}
            alt="Sale"
            className="w-full object-cover"
            priority
          />
        </div>
      </div>

      <PriceTable color={color} />

      <section className="w-full mx-auto my-10 rounded-2xl font-semibold p-15 text-white bg-[#0FB759AB] border-2" style={{ borderColor: color }}>
        <p className="text-2xl text-center mb-2">
          🎯 Chegirmadagi Maxsus Takliflar
        </p>

        <p className="text-2xl text-center mb-2">
          Kop miqdorda xarid qiling — 55% gacha tejang!
        </p>
        <p className="text-2xl text-center flex items-center justify-center">
          <Image src={StarIcon} alt="Star" className="inline-block mr-2 size-7" />
          Eng yaxshi narx va sifat kafolati!
          <Image src={StarIcon} alt="Star" className="inline-block ml-2 size-7" />
        </p>
      </section>

      <section className="w-full mx-auto mt-10">
        <h4 className="text-3xl font-bold text-center mb-5" style={{ color }}>🎁 Chegirma misollari</h4>

        {/* {productsDataThree.map((item, index) => {
          // const isThree = item.itemData.length === 3;

          return (
            <div
              key={index}
              className="w-full mx-auto my-10 bg-white rounded-2xl shadow-lg border-2 overflow-hidden"
              style={{ borderColor: color }}
            >
              <li className="text-xl font-bold bg-[#0FB759AB] px-5 py-7 text-white !list-disc" style={{ color }}>
                {item.title}
              </li>

              <div className="grid gap-6 p-5 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-[60%_40%] items-center">

                <div>
                  <h4 className="text-lg font-bold my-4" style={{ color }}>
                    Mahsulotlar:
                  </h4>
                  <div
                    className={`grid gap-6 ${item.itemData.length >= 3
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2"
                      }`}
                  >
                    {item.itemData.map((product, pIndex) => (
                      <SaleCard
                        key={pIndex}
                        color={color}
                        img={product.title.includes("Complex Extra") ? ProductRed : product.title.includes("Complex") ? ProductGreen : ProductOrange}
                        title={product.title}
                        discountPrice={product.discountPrice}
                        originalPrice={product.originalPrice}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full mt-10 md:mt-0 flex justify-center">
                  <SaleTotalCard
                    color={color}
                    totalPrice={item.totalPriceSection.totalPrice}
                    originalPrice={item.totalPriceSection.originalPrice}
                    discountPrice={item.totalPriceSection.discountPrice}
                  />
                </div>
              </div>

            </div>
          );
        })} */}
      </section>



      <div className="w-full mx-auto my-15 bg-white rounded-2xl shadow-lg border-2 overflow-hidden" style={{ borderColor: color }}>
        <h2 className="text-xl font-bold bg-[#0FB759AB] text-center px-5 py-7 text-white">Chegirmalar qanday ishlaydi?</h2>

        <div className="flex flex-col lg:flex-row justify-center gap-7 p-7">

          <div className="flex items-center rounded-2xl p-5 bg-[#32BF6833]">
            <Image
              src={CheckedIcon}
              alt="Checked icon"
              className="inline-block mr-4 size-6"
              priority
            />

            <p className="text-lg font-semibold text-gray-700" style={{ color }}>
              1-qadam: Mahsulot(lar)ni tanlang
            </p>
          </div>

          <div className="flex items-center rounded-2xl p-5 bg-[#32BF6833]">
            <Image
              src={CheckedIcon}
              alt="Checked icon"
              className="inline-block mr-4 size-6"
              priority
            />

            <p className="text-lg font-semibold text-gray-700" style={{ color }}>
              2-qadam: Savatga joylang
              narx avtomatik kamayadi
            </p>
          </div>

          <div className="flex items-center rounded-2xl p-5 bg-[#32BF6833]">
            <Image
              src={CheckedIcon}
              alt="Checked icon"
              className="inline-block mr-4 size-6"
              priority
            />

            <p className="text-lg font-semibold text-gray-700" style={{ color }}>
              3-qadam: Buyurtma bering va yetkazib berishlarini kuting!
            </p>
          </div>

        </div>
      </div>

      <div className="w-full mx-auto mt-12 bg-linear-270 text-white from-[#51FFAE] to-[#6DB19E] rounded-2xl shadow-lg p-10 text-center">
        <h3 className="text-3xl font-bold text-center mb-5">Ajoyib chegirmalarga tayyormisiz?</h3>
        <p className="text-lg font-semibold text-center">Cheklangan takliflardan foydalanib qoling!</p>
        <Button className="mx-auto mt-10 bg-white text-[#339668] hover:text-white cursor-pointer p-5" size="lg">Xaridni boshlash</Button>
      </div>

    </Container>
  )
}

export default SalePage;