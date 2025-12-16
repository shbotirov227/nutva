import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, phone, comment, source = "popup" } = body;

  if (!name || !phone) {
    return NextResponse.json(
      { message: "Ism va telefon raqam majburiy" },
      { status: 400 }
    );
  }

  const baseUrl = "https://crm.nutva.uz/rest/4/0rmhzl4g9pnvvw0c";

  let contactId: number;

  // Check for duplicate contact
  const duplicateRes = await fetch(`${baseUrl}/crm.duplicate.findbycomm.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "PHONE",
      values: [phone]
    })
  });

  const duplicateData = await duplicateRes.json();
  const isRepeat = duplicateData.result.CONTACT && duplicateData.result.CONTACT.length > 0;

  if (isRepeat) {
    contactId = duplicateData.result.CONTACT[0];
  } else {
    // Create new contact
    const contactRes = await fetch(`${baseUrl}/crm.contact.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          NAME: name,
          PHONE: [{ VALUE: `+${phone}`, VALUE_TYPE: "MOBILE" }]
        }
      })
    });

    const contactData = await contactRes.json();
    if (!contactData.result) {
      return NextResponse.json({ message: "Kontakt yaratib bo'lmadi" }, { status: 500 });
    }
    contactId = contactData.result;
  }

  // Create simple deal
  const dealRes = await fetch(`${baseUrl}/crm.deal.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        TITLE: `Vebsaytdan so'rov — ${name}`,
        CONTACT_ID: contactId,
        SOURCE_ID: "WEB",
        CATEGORY_ID: 0,
        STAGE_ID: "NEW",
      }
    })
  });

  const dealData = await dealRes.json();
  const dealId = dealData.result;

  // Add timeline comment
  const bitrixComment = comment 
    ? `📝 Vebsaytdan yangi kontakt so'rovi\n👤 Ism: ${name}\n📞 Telefon: +${phone}\n💬 Izoh: ${comment}`
    : `📝 Vebsaytdan yangi kontakt so'rovi\n👤 Ism: ${name}\n📞 Telefon: +${phone}`;
  
  await fetch(`${baseUrl}/crm.timeline.comment.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        ENTITY_ID: dealId,
        ENTITY_TYPE: "deal",
        COMMENT: bitrixComment
      }
    })
  });

  // Send to Telegram
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (telegramBotToken && telegramChatId) {
    try {
      const sourceText = source === "contact" ? "Contact Page" : "Popup (Chegirma)";
      let telegramMessage = `🔔 Yangi kontakt so'rovi\n\n👤 Ism: ${name}\n📞 Telefon: +${phone}`;
      
      if (comment) {
        telegramMessage += `\n💬 Izoh: ${comment}`;
      }
      
      telegramMessage += `\n\n🌐 Manba: ${sourceText}`;
      
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramMessage,
          parse_mode: "HTML"
        })
      });
    } catch (error) {
      console.error("Telegram xabar yuborishda xatolik:", error);
      // Don't fail the request if Telegram fails
    }
  }

  return NextResponse.json({ success: true, dealId });
}
