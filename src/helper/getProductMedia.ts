import { ProductName } from "@/types/enums";
import ComplexImg from "@/assets/images/product-detail-img.png";
import ComplexExtraImg from "@/assets/images/product-detail-red-middle-img2.jpg";
import GelminKidsImg from "@/assets/images/product-detail-orange-middle-img2.jpg";
import FertiliaWomenImg from "@/assets/images/product-detail-pink-middle-img2.jpg";
import VirisMenImg from "@/assets/images/product-detail-blue-middle-img2.jpg";
import { StaticImageData } from "next/image";

export function getProductMedia(productName: ProductName): {
  youtubelink: string | null;
  image: StaticImageData;
} {
  let youtubelink: string | null = null;
  let image: StaticImageData;

  switch (productName) {
    case ProductName.COMPLEX:
      youtubelink = "https://youtube.com/shorts/u1tJ-GuZpOA?feature=share";
      image = ComplexImg;
      break;
    case ProductName.COMPLEX_EXTRA:
      youtubelink = "https://youtube.com/shorts/PV_g2TX5-vU?feature=share";
      image = ComplexExtraImg;
      break;
    case ProductName.GELMIN_KIDS:
      youtubelink = null;
      image = GelminKidsImg;
      break;
    case ProductName.FERTILIA_WOMEN:
      youtubelink = null;
      image = FertiliaWomenImg;
      break;
    case ProductName.VIRIS_MEN:
      youtubelink = null;
      image = VirisMenImg;
      break;
    default:
      youtubelink = null;
      image = VirisMenImg;
  }

  return { youtubelink, image };
}
