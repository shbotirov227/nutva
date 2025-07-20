"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const PriceTable = ({ color }: { color: string }) => {

  const { t } = useTranslation();

  const priceData = [
    { quantity: "1 dona mahsulot", discount: "0 % to’liq narx" },
    { quantity: "2 dona mahsulot", discount: "15% - 20%" },
    { quantity: "3 yoki 4 dona mahsulot", discount: "40% - 45%" },
    { quantity: "5 dona yoki undan ko’p mahsulot uchun", discount: "50% - 55%" },
  ];

  return (
    <div className="w-full mx-auto my-10 bg-white rounded-2xl shadow-lg border-2 overflow-hidden" style={{ borderColor: color }}>
      <h2 className="text-xl font-bold bg-[#0FB759AB] px-5 py-7 text-white" style={{ color }}>{t("sale.table.title")}</h2>

      <div className="p-5">
        <h4 className="text-lg font-bold my-4" style={{ color }}>{t("common.total")} {t("common.product")} ({t("common.box")})</h4>

        <div className="grid gap-6">
          {priceData.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-[#32BF6833] font-semibold rounded-lg flex items-center" style={{ color }}>
                <span className="mr-4 font-bold text-white rounded-full bg-[#0FB759AB] px-4 py-2">{index + 1}</span>
                {item.quantity}
              </div>
              <div className="p-4 bg-[#32BF6833] font-semibold rounded-lg h-full ">
                <p className="w-[30%] max-md:w-full max-xl:w-[55%] h-full flex items-center justify-center py-2 px-5 text-white rounded-3xl bg-[#0FB759C4]">
                  {item.discount}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default PriceTable;