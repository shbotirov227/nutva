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

  // const defaultStyles = "w-full py-[29px] px-5 rounded-xl pl-15 text-[#6F6F6F] text-[15px] sm:text-base md:text-[17px] font-bold bg-white outline-none border-2 transition-all focus:shadow-[0_0_10px_rgba(0,0,0,0.1),_0_0_10px_rgba(0,0,0,0.7)]";

  const defaultStyle = "w-[35%] mx-auto mt-8 border-[#33739D] bg-white !focus-visible:border-[#33739D] ring-[#33739D]"

  const errorBorder = errors?.phone ? "!border-red-500" : "!border-transparent";

  return (
    <div ref={containerRef} className="relative">
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
          defaultStyle,
          !className ? errorBorder : "!border-[#FD902B]",
          "!w-full !border-2 focus:!shadow-[0_0_10px_rgba(0,0,0,0.1),_0_0_10px_rgba(0,0,0,0.7)] !transition-all",
        )}
        containerClass="!w-full !rounded-xl"
        buttonClass="!bg-white !border-none !hover:bg-gray-100 !hover:rounded-l-2xl"
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
          ...dropdownStyle,
        }}
      />
    </div>
  );
};

export default PhoneField;
