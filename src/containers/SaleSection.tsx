"use client";

import React, { useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneField from "@/components/PhoneField";
import { FormInputWrapper } from "@/components/FormInputWrapper";
// import { formatPhoneNumber } from "@/lib/utils";

// type PhoneInputMaskProps = {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// };
const SaleSection = () => {

  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  return (
    <Container className="py-15">
      <div className="bg-[#BAE2FD] py-20 text-center rounded-xl max-w-[80%] mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#075385]">ПОЛУЧИТЕ СКИДКУ УЖЕ СЕЙЧАС!</h2>
        <p className="w-[35%] mx-auto text-center text-[#0362A1] mt-4">
          NUTVA — натуральные комплексы для поддержки суставов, костей, пищеварения и иммунитета. Оформите заявку и получите скидку на курс оздоровления уже сегодня.
        </p>
        <Input type="text" placeholder="Ваше имя" className="w-[35%] mx-auto mt-8 border-[#33739D] bg-white !focus-visible:border-[#33739D] ring-[#33739D]" />
        <FormInputWrapper error={errors.phone}>
          <PhoneField
            placeholder={"Ваш номер телефона"}
            phone={phone}
            setPhone={setPhone}
            setErrors={setErrors}
            errors={errors}
          />
        </FormInputWrapper>

        <Button className="bg-[#075385] hover:bg-[#074265] mx-auto mt-8 cursor-pointer">Отправить заявку</Button>
      </div>
    </Container>
  )
}

export default SaleSection;