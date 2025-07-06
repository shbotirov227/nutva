import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneFieldProps {
  placeholder: string;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  setErrors?: React.Dispatch<React.SetStateAction<{ name?: string; phone?: string }>>;
  errors?: { name?: string; phone?: string };
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  dropdownStyle?: React.CSSProperties;
}

const PhoneField = ({ placeholder, phone, setPhone, setErrors, errors, className, containerRef, dropdownStyle }: PhoneFieldProps) => {
  const [defaultCountry, setDefaultCountry] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    // fetch("https://ipapi.co/json")
    //   .then((res) => res.json())
    //   .then((data) => setDefaultCountry(data.country_code.toLowerCase()))
    //   .catch(() => setDefaultCountry("uz"));
    setDefaultCountry("uz");
  }, []);

  return (
    <div ref={containerRef} className="mx-auto w-full gap-1 transition-all !z-30">
      <PhoneInput
        country={defaultCountry}
        searchPlaceholder={t("form.searchCountry")}
        searchNotFound={t("form.searchCountryNotFound")}
        searchStyle={{
          width: "100%",
          borderRadius: "10px",
          padding: "10px",
          color: "#6F6F6F",
          border: "1px solid #D9D9D9",
          marginRight: "10px",
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
          errors?.phone ? "relative border-red-500 !ring-red-500 focus:!ring" : "border-blue-400",
                    "!w-full !py-[22px] !pl-[55px] px-4 py-4 sm:px-5 sm:py-3 !rounded-xl text-[15px] font-bold bg-white outline-none border-2 border-gray-800 focus:shadow-[0_0_10px_rgba(10,10,10,0.8)] transition-all",
          // "!w-full   !rounded-[13px] overflow-hidden !border-2 focus:!shadow-[0_0_8px_rgba(0,0,0,0.1),_0_0_5px_rgba(10,10,10,0.8)] !transition-all",
        )}
        containerClass="!w-full !rounded-xl"
        buttonClass="h-[80%] m-auto !ml-[3px] !bg-white !border-none !hover:bg-gray-100 !hover:rounded-l-2xl"
        specialLabel=""
        onFocus={() => setErrors && setErrors((prev) => ({ ...prev, phone: undefined }))}
        dropdownClass="custom-phone-dropdown"
        dropdownStyle={{
          borderRadius: "13px",
          color: "#6F6F6F",
          boxSizing: "border-box",
          zIndex:"99 !important",
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
