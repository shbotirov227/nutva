import { StaticImageData } from "next/image";
import { ProductName } from "@/types/enums";
import ProductDetailGreenMiddleImg from "@/assets/images/product-detail-green-middle-img.jpg";
import ProductDetailOrangeMiddleImg from "@/assets/images/product-detail-orange-middle-img.jpg";
import ProductDetailRedMiddleImg from "@/assets/images/product-detail-red-middle-img.jpg";
import ProductDetailPinkMiddleImg from "@/assets/images/product-detail-pink-middle-img.jpg";
import ProductDetailBlueMiddleImg from "@/assets/images/product-detail-blue-middle-img.jpg";
import DefaultImg from "@/assets/images/product-detail-img.png";

interface ProductType {
  name?: string;
  detailImage?: string;
}



export function getProductDetailMiddleImage(product: ProductType): string | StaticImageData {
  if (product?.detailImage) {
    return product.detailImage;
  }

  switch (product.name) {
    case ProductName.COMPLEX:
      return ProductDetailGreenMiddleImg;
    case ProductName.GELMIN_KIDS:
      return ProductDetailOrangeMiddleImg;
    case ProductName.COMPLEX_EXTRA:
      return ProductDetailRedMiddleImg;
    case ProductName.FERTILIA_WOMEN:
      return ProductDetailPinkMiddleImg;
    case ProductName.VIRIS_MEN:
      return ProductDetailBlueMiddleImg;
    default:
      return DefaultImg;
  }
}
