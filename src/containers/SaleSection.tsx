"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormInputWrapper } from "@/components/FormInputWrapper";
import Container from "@/components/Container";
import PhoneField from "@/components/PhoneField";
import { toast } from "react-toastify";

const SaleSection = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: () => apiClient.postContactForm({ name, phone, comment: "" }),
    onSuccess: () => {
      toast.success(t("form.applicationSuccess") || "So'rov yuborildi", {
        position: "top-center",
        autoClose: 1200,
      });
      setPhone("");
      setName("");
      setErrors({});
    },
    onError: () => {
      toast.error(t("form.errors.requestFailed") || "Xatolik yuz berdi", {
        position: "top-center",
        autoClose: 1200,
      });
    },
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = t("form.errors.nameRequired");
    }

    if (!phone || phone.replace(/\D/g, "").length < 9) {
      newErrors.phone = t("form.errors.phoneNotValid");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Form is valid. Submitting:", { name, phone });
      mutate()
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container className="py-16 px-4 sm:px-6 lg:px-8 mb-36">
        <div className="bg-[#BAE2FD] py-12 sm:py-16 px-4 sm:px-10 text-center rounded-xl max-w-5xl mx-auto border-2 border-[rgb(7,83,133,0.2)] shadow-[10px_10px_10px_rgba(0,0,0,0.1),_10px_10px_10px_rgba(0,0,0,0.1)]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#075385]">
            {t("saleSection.title")}
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#0362A1] max-w-2xl mx-auto">
            {t("saleSection.subtitle")}
          </p>

          <div className="xl:w-[45%] sm:w-[80%] md:w-[70%] mx-auto">
            <FormInputWrapper error={errors.name}>
              <Input
                type="text"
                placeholder={t("form.input.name")}
                className="w-full mx-auto mt-8 mb-3 transition-all bg-white rounded-lg"
                style={{ padding: "22px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormInputWrapper>

            <FormInputWrapper error={errors.phone}>
              <PhoneField
                placeholder={t("form.input.phone")}
                phone={phone}
                setPhone={setPhone}
                setErrors={setErrors}
                errors={errors}
              />
            </FormInputWrapper>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#075385] hover:bg-[#074265] w-full sm:w-auto mt-5 cursor-pointer"
          >
            {t("saleSection.button")}
          </Button>
        </div>
      </Container>
    </form>
  );
};

export default SaleSection;
