"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { formatPhoneNumber } from "@/lib/utils";
import MaskedInput from "react-text-mask";

type PhoneInputMaskProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PhoneInputMask = ({ value, onChange }: PhoneInputMaskProps) => {
  return (
    <MaskedInput
      mask={[
        "+",
        "9",
        "9",
        "8",
        " ",
        "(",
        /[1-9]/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
      ]}
      guide={false}
      value={value}
      onChange={onChange}
      render={(ref, props) => (
        <Input
          {...props}
          ref={ref as React.Ref<HTMLInputElement>}
          placeholder="Номер телефона"
          className="w-[35%] mx-auto mt-4 border-[#33739D] bg-white focus-visible:border-[#33739D] ring-[#33739D]"
        />
      )}
    />
  )
}

const SaleSection = () => {

  const [phone, setPhone] = useState("");

  return (
    <Container className="py-15">
      <div className="bg-[#BAE2FD] py-20 text-center rounded-xl max-w-[80%] mx-auto shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)]">
        <h2 className="text-2xl font-bold text-center text-[#075385]">ПОЛУЧИТЕ СКИДКУ УЖЕ СЕЙЧАС!</h2>
        <p className="w-[35%] mx-auto text-center text-[#0362A1] mt-4">
          NUTVA — натуральные комплексы для поддержки суставов, костей, пищеварения и иммунитета. Оформите заявку и получите скидку на курс оздоровления уже сегодня.
        </p>
        <Input type="text" placeholder="Ваше имя" className="w-[35%] mx-auto mt-8 border-[#33739D] bg-white !focus-visible:border-[#33739D] ring-[#33739D]" />
        <PhoneInputMask
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
        />

        <Button className="bg-[#075385] hover:bg-[#074265] mx-auto mt-8 cursor-pointer">Отправить заявку</Button>
      </div>
    </Container>
  )
}

export default SaleSection;