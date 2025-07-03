import { useTranslation } from "react-i18next";

export const useReviewVideos = () => {
  const { t } = useTranslation();

  return [
    {
      url: "https://youtu.be/FwY7VvfJ02A",
      title: t("reviewSection.videoData.1.title"),
      description: t("reviewSection.videoData.1.description"),
    },
    {
      url: "https://youtu.be/ehAX2BxwqHg",
      title: t("reviewSection.videoData.2.title"),
      description: t("reviewSection.videoData.2.description"),
    },
    {
      url: "https://youtu.be/OTv06iR91qg",
      title: t("reviewSection.videoData.3.title"),
      description: t("reviewSection.videoData.3.description"),
    },
    {
      url: "https://youtu.be/Kn7tcajOlXg",
      title: t("reviewSection.videoData.4.title"),
      description: t("reviewSection.videoData.4.description"),
    },
    {
      url: "https://youtu.be/N_KCczIuti0",
      title: t("reviewSection.videoData.5.title"),
      description: t("reviewSection.videoData.5.description"),
    },
  ];
};
