/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

type FormDataType = {
  name: string;
  phone: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export async function POST(req: NextRequest) {
  const formData: FormDataType = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_BITRIX_WEBHOOK;

  try {
    let phoneDigits = formData.phone.replace(/[^+\d]/g, "");
    if (!phoneDigits.startsWith("+")) phoneDigits = `+${phoneDigits}`;

    const contactSearchRes = await fetch(`${baseUrl}/crm.contact.list.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: { PHONE: phoneDigits },
        select: ["ID", "NAME"],
      }),
    });

    const contactSearchResult = await contactSearchRes.json();
    const existingContact = contactSearchResult.result?.[0];
    let contactId: number;

    if (existingContact) {
      contactId = existingContact.ID;
    } else {
      const contactCreateRes = await fetch(`${baseUrl}/crm.contact.add.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            NAME: formData.name,
            PHONE: [{ VALUE: phoneDigits, VALUE_TYPE: "MOBILE" }],
          },
        }),
      });

      const contactCreateResult = await contactCreateRes.json();
      if (contactCreateResult.error) {
        return NextResponse.json({ success: false, message: contactCreateResult.error_description }, { status: 400 });
      }
      contactId = contactCreateResult.result;
    }

    const titlePrefix = existingContact ? "Повторная заявка" : "Новый клиент";
    const dealRes = await fetch(`${baseUrl}/crm.deal.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          TITLE: `${titlePrefix} — ${formData.name}`,
          CONTACT_ID: contactId,
          PHONE: [{ VALUE: phoneDigits, VALUE_TYPE: "MOBILE" }],
          SOURCE_ID: "19",
          CATEGORY_ID: 0,
          STAGE_ID: "UC_TCCXFR",
          ...(formData.utm_source && { UTM_SOURCE: formData.utm_source }),
          ...(formData.utm_medium && { UTM_MEDIUM: formData.utm_medium }),
          ...(formData.utm_campaign && { UTM_CAMPAIGN: formData.utm_campaign }),
          ...(formData.utm_term && { UTM_TERM: formData.utm_term }),
          ...(formData.utm_content && { UTM_CONTENT: formData.utm_content }),
        },
      }),
    });

    const dealResult = await dealRes.json();
    if (dealResult.error) {
      return NextResponse.json({ success: false, message: dealResult.error_description }, { status: 400 });
    }

    const dealId = dealResult.result;

    await fetch(`${baseUrl}/crm.timeline.comment.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          ENTITY_ID: dealId,
          ENTITY_TYPE: "deal",
          COMMENT: `📝 Новая заявка от ${formData.name} (${phoneDigits}) Товар: ${formData.productName}\n🔢 Кол-во: ${formData.quantity}`,
        },
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
