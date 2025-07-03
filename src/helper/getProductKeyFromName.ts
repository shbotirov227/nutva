import { ProductName } from "@/types/enums";

export function getProductKeyFromName(name: string): string | null {
  switch (name) {
    case ProductName.COMPLEX:
      return "complex";
    case ProductName.COMPLEX_EXTRA:
      return "complexExtra";
    case ProductName.GELMIN_KIDS:
      return "gelminKids";
    case ProductName.FERTILIA_WOMEN:
      return "fertiliaWomen";
    case ProductName.VIRIS_MEN:
      return "virisMen";
    default:
      return null;
  }
}