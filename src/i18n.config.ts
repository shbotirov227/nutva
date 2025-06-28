export const fallbackLng = "uz";
export const languages = ["uz", "ru", "en"] as const;

export function getOptions(lng = fallbackLng) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    interpolation: {
      escapeValue: false,
    },
  };
}
