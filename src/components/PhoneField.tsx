import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneFieldProps {
  placeholder: string;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setErrors: React.Dispatch<React.SetStateAction<{ name?: string; phone?: string }>>;
  errors?: { name?: string; phone?: string };
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  dropdownStyle?: React.CSSProperties;
}

const PhoneField = ({ placeholder, phone, setPhone, setErrors, errors, className, containerRef, dropdownStyle }: PhoneFieldProps) => {
  const [defaultCountry, setDefaultCountry] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => setDefaultCountry(data.country_code.toLowerCase()))
      .catch(() => setDefaultCountry("uz"));
  }, []);

  return (
    <div ref={containerRef} className="mx-auto w-[35%]  flex flex-col gap-1 transition-all">
      <PhoneInput
        country={defaultCountry}
        searchPlaceholder={t("form.searchCountry")}
        searchNotFound={t("form.searchCountryNotFound")}
        searchStyle={{
          width: "85%",
          borderRadius: "10px",
          padding: "10px",
          color: "#6F6F6F",
          border: "1px solid #D9D9D9",
        }}
        searchClass="w-full"
        enableSearch
        countryCodeEditable
        disableCountryCode={false}
        placeholder={placeholder}
        value={phone}
        onChange={(value) => setPhone(value)}
        inputClass={clsx(
          className,
          errors?.phone ? "border-red-500 !ring-red-500 focus:!ring" : "border-blue-400 !ring-blue-400 focus:!ring",
          "!w-full !py-[17px] !rounded-[8px] !ring-[1px] ring-blue-400 focus:ring-[#33739D] focus:ring-[#33739D] focus:!shadow-[0_0_8px_rgba(0,0,0,0.1),_0_0_5px_rgba(0,0,0,0.5)] !transition-all",
        )}
        containerClass="!w-full !rounded-xl"
        buttonClass="h-[80%] m-auto ml-[3px] !bg-white !border-none !hover:bg-gray-100 !hover:rounded-l-2xl"
        specialLabel=""
        onFocus={() => setErrors((prev) => ({ ...prev, phone: undefined }))}
        dropdownClass="custom-phone-dropdown"
        dropdownStyle={{
          borderRadius: "13px",
          color: "#6F6F6F",
          boxSizing: "border-box",
          zIndex: 50,
          overflowY: "scroll",
          scrollbarWidth: "none",
          maxHeight: "300px",
          padding: "0 0 5px",
          textAlign: "left",
          ...dropdownStyle,
        }}
      />
    </div>
  );
};

export default PhoneField;
