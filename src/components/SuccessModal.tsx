import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type SuccessModalProps = {
  onClose: () => void;
};

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence mode="wait">

      <motion.div
        className="!z-50 bg-white text-black rounded-2xl w-full  border-none"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          style={{
            fontFamily: "sans-serif",
            backgroundColor: "#FFF3D9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            margin: 0,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "1rem 2rem 2rem 2rem",
              borderRadius: "1rem",
              color: "black",
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "0 25px 30px rgba(0,0,0,0.6)",
              textAlign: "center",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <button
              style={{
                float: "right",
                background: "none",
                fontSize: "1.7rem",
                padding: "0.5rem 0.7rem",
                cursor: "pointer",
                color: "gray",
              }}
              onClick={onClose}
            >
              ✖
            </button>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", fontWeight: "bold", marginTop: "3.5rem" }}>✅ {t("success.title")}</h1>
            <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>{t("success.subtitle")}</p>
            <a
              href="https://t.me/nutvauz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-[#0a7cff] hover:!text-white"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "#0a7cff",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "0.5rem 1rem",
                border: "2px solid #0a7cff",
                borderRadius: "0.5rem",
                transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",


              }}
            >
              📲 {t("success.cta")}
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
