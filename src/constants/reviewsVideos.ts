import { useTranslation } from "react-i18next";

export interface ReviewVideo {
  url: string;
  title: string;
  description: string;
  category: "gelmin" | "complex" | "complexExtra";
}

export const useReviewVideos = () => {
  const { t } = useTranslation();

  const videos: ReviewVideo[] = [
    // Nutva Complex
    {
      url: "https://www.youtube.com/shorts/etU2nz3W1f4",
      title: t("reviewSection.videoData.complex.1.title"),
      description: t("reviewSection.videoData.complex.1.description"),
      category: "complex",
    },
    {
      url: "https://www.youtube.com/shorts/9XdIdMlxuKQ",
      title: t("reviewSection.videoData.complex.2.title"),
      description: t("reviewSection.videoData.complex.2.description"),
      category: "complex",
    },
    {
      url: "http://youtube.com/shorts/pdl6EVISs1c",
      title: t("reviewSection.videoData.complex.3.title"),
      description: t("reviewSection.videoData.complex.3.description"),
      category: "complex",
    },
    // Nutva Complex Extra
    // {
    //   url: "https://www.youtube.com/shorts/PV_g2TX5-vU",
    //   title: t("reviewSection.videoData.complexExtra.1.title"),
    //   description: t("reviewSection.videoData.complexExtra.1.description"),
    //   category: "complexExtra",
    // },
    // {
    //   url: "https://www.youtube.com/shorts/bKwulM3MkAY",
    //   title: t("reviewSection.videoData.complexExtra.2.title"),
    //   description: t("reviewSection.videoData.complexExtra.2.description"),
    //   category: "complexExtra",
    // },
    // {
    //   url: "https://www.youtube.com/shorts/7pio6_7tpjA",
    //   title: t("reviewSection.videoData.complexExtra.3.title"),
    //   description: t("reviewSection.videoData.complexExtra.3.description"),
    //   category: "complexExtra",
    // },
    // Nutva Gelmin Kids
    {
      url: "https://www.youtube.com/shorts/mL5ctwSqUTg",
      title: t("reviewSection.videoData.gelmin.1.title"),
      description: t("reviewSection.videoData.gelmin.1.description"),
      category: "gelmin",
    },
    {
      url: "https://youtube.com/shorts/DT9XRDFZQZE",
      title: t("reviewSection.videoData.gelmin.2.title"),
      description: t("reviewSection.videoData.gelmin.2.description"),
      category: "gelmin",
    },
    {
      url: "https://www.youtube.com/shorts/-F6q4T4jSjE",
      title: t("reviewSection.videoData.gelmin.3.title"),
      description: t("reviewSection.videoData.gelmin.3.description"),
      category: "gelmin",
    },
  ];

  return videos;
};

// Kategoriya bo'yicha filtrlash funksiyasi
export const useReviewVideosByCategory = (category?: "gelmin" | "complex" | "complexExtra") => {
  const videos = useReviewVideos();
  
  if (!category) return videos;
  
  return videos.filter(video => video.category === category);
};
