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
    <Container className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#BAE2FD] py-12 sm:py-16 px-4 sm:px-10 text-center rounded-xl max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#075385]">
          ПОЛУЧИТЕ СКИДКУ УЖЕ СЕЙЧАС!
        </h2>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-[#0362A1] max-w-2xl mx-auto">
          NUTVA — натуральные комплексы для поддержки суставов, костей, пищеварения и иммунитета.
          Оформите заявку и получите скидку на курс оздоровления уже сегодня.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-6 flex-wrap">
          <Input
            type="text"
            placeholder="Ваше имя"
            className="w-full sm:w-[280px] border-[#33739D] bg-white !focus-visible:border-[#33739D] ring-[#33739D]"
          />

          <FormInputWrapper error={errors.phone}>
            <PhoneField
              placeholder="Ваш номер телефона"
              phone={phone}
              setPhone={setPhone}
              setErrors={setErrors}
              errors={errors}
            />
          </FormInputWrapper>

          <Button className="bg-[#075385] hover:bg-[#074265] w-full sm:w-auto mt-2 sm:mt-0">
            Отправить заявку
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default SaleSection;