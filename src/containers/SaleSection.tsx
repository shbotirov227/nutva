"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';

const SaleSection = () => {
  const [phone, setPhone] = useState<string | undefined>("");
  const [name, setName] = useState("");

  return (
    <Container className="py-16">
      <div className="bg-[#BAE2FD] py-20 px-4 text-center rounded-xl max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#075385]">
          ПОЛУЧИТЕ СКИДКУ УЖЕ СЕЙЧАС!
        </h2>
        <p className="text-[#0362A1] mt-4 leading-relaxed">
          NUTVA — натуральные комплексы для поддержки суставов, костей, пищеварения и иммунитета.
          Оформите заявку и получите скидку на курс оздоровления уже сегодня.
        </p>

        {/* Имя */}
        <Input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto mt-8 border-[#33739D] bg-white focus-visible:border-[#33739D] ring-[#33739D]"
        />

        {/* Telefon raqam */}
        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto mt-4">
          <PhoneInput
            international
            defaultCountry="UZ"
            value={phone}
            onChange={setPhone}
            placeholder="Номер телефона"
            className="custom-phone-input w-full"
            countries={["UZ", "KZ", "RU", "KG", "TJ", "TM", "AZ", "AM", "UA", "BY", "GE", "TR", "AE", "DE", "PL", "US"]}
            // Agar faqat SNG + boshqa davlatlar bo‘lsin desang, yuqoridagi countries propsni yoz.
          />
        </div>

        <Button className="bg-[#075385] hover:bg-[#074265] mx-auto mt-8">
          Отправить заявку
        </Button>
      </div>
    </Container>
  );
};

export default SaleSection;
