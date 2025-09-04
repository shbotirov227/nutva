/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/apiClient";
import { getDiscount } from "@/lib/getDiscount";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { buyerName, phone, region, comment, products } = body;

  if (!buyerName || !phone || !region) {
    return NextResponse.json(
      { message: "Required fields are missing" },
      { status: 400 }
    );
  }

  const baseUrl = "https://crm.nutva.uz/rest/4/0rmhzl4g9pnvvw0c";

  // ✅ SOURCE_ID ni alohida ajratamiz
  const sourceId = "WEB"; // istasangiz bu yerga "INSTAGRAM", "TELEGRAM" kabi IDlarni qo'yishingiz mumkin

  // ✅ 1. Mahsulot nomlarini olish
  const allProducts = await apiClient.getAllProducts("uz");
  const productNameMap = allProducts.reduce((acc, p) => {
    acc[p.id] = p.name || "Noma'lum mahsulot";
    return acc;
  }, {} as Record<string, string>);

  const getProductName = (id: string): string =>
    productNameMap[id] || `ID: ${id}`;

  // Mijozni tekshirish yoki yaratish
  let contactId: number;
  const duplicateRes = await fetch(`${baseUrl}/crm.duplicate.findbycomm.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "PHONE", values: [phone] })
  });
  const duplicateData = await duplicateRes.json();
  const isRepeat = duplicateData.result.CONTACT?.length > 0;

  if (isRepeat) {
    contactId = duplicateData.result.CONTACT[0];
  } else {
    const contactRes = await fetch(`${baseUrl}/crm.contact.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          NAME: buyerName,
          PHONE: [{ VALUE: `+${phone}`, VALUE_TYPE: "MOBILE" }]
        }
      })
    });
    const contactData = await contactRes.json();
    if (!contactData.result) {
      return NextResponse.json({ message: "Contact creation failed" }, { status: 500 });
    }
    contactId = contactData.result;
  }

  // Takroriy so'rovlar soni
  let submissionCount = 1;
  if (isRepeat) {
    const timelineRes = await fetch(`${baseUrl}/crm.timeline.comment.list.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: {
          ENTITY_ID: contactId,
          ENTITY_TYPE: "contact"
        }
      })
    });
    const timelineData = await timelineRes.json();
    if (timelineData.result) {
      const previousSubmissions = timelineData.result.filter((item: any) =>
        item?.COMMENT?.includes("Yangi so'rov saytdan")
      );
      submissionCount = previousSubmissions.length + 1;
    }
  }

  const repeatPrefix = isRepeat ? `⚠️ Takroriy so'rov (${submissionCount})\n` : "";

  //  Mahsulotlar va narxlarni hisoblash (umumiy quantity asosida)
  let totalAmount = 0;
  const globalQuantity = products.reduce((sum: number, p: any) => sum + p.quantity, 0);

  const formattedProductList = products?.length
    ? products.map((p: { productId: string; quantity: number }, i: number) => {
      const name = getProductName(p.productId);
      const discount = getDiscount(name, p.quantity, globalQuantity);
      const amount = discount.totalPrice;
      totalAmount += amount;
      return `${i + 1}. ${name} — ${p.quantity} dona — ${amount.toLocaleString()} so'm`;
    }).join("\n")
    : "  - Mahsulotlar yo'q";

  // Deal yaratish
  const firstProductName = products?.length
    ? getProductName(products[0].productId)
    : "Buyurtma";

  const dealTitle = `${buyerName} — ${firstProductName}`;

  const dealRes = await fetch(`${baseUrl}/crm.deal.add.json`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fields: {
      TITLE: dealTitle,
      CONTACT_ID: contactId,
      SOURCE_ID: sourceId,
      CATEGORY_ID: 0, // hotsales voronka
      STAGE_ID: "NEW", // nutva site bosqichi (buni o'zing tasdiqlab ol)
      OPPORTUNITY: totalAmount,
      CURRENCY_ID: "UZS",
      IS_MANUAL_OPPORTUNITY: "Y",
      ASSIGNED_BY_ID: 630, // 👈 robi
      CREATED_BY_ID: 312    // 👈 foydalanuvchi ID (odatda admin yoki tizim foydalanuvchisi)
    }
  })
});


  

  const dealData = await dealRes.json();
  const dealId = dealData.result;

  // Komment qo‘shish (formatlangan holda)
  await fetch(`${baseUrl}/crm.timeline.comment.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        ENTITY_ID: dealId,
        ENTITY_TYPE: "deal",
        COMMENT: `
${repeatPrefix}📝 Yangi so'rov saytdan
🧍 Ism: ${buyerName}
📞 Telefon: +${phone}
🌍 Hudud: ${region}
💬 Izoh: ${comment || "Yo'q"}

🛍️ Mahsulotlar:
${formattedProductList}

💰 Umumiy narx: ${totalAmount.toLocaleString()} so'm
        `.trim()
      }
    })
  });

  return NextResponse.json({ success: true, dealId });
}
