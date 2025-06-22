import { ProductName } from "./enums";

export const productBgColors: Record<ProductName, string> = {
	[ProductName.COMPLEX]: "#166534",
    [ProductName.GELMIN_KIDS]: "#C2410C",
    [ProductName.COMPLEX_EXTRA]: "#7F1D1D",
    [ProductName.FERTILIA_WOMEN]: "#9D174D",
    [ProductName.VIRIS_MEN]: "#1E2B66",
};

export const bgColors: Record<ProductName, string> = {
  [ProductName.COMPLEX]: "#D8F6D1",
  [ProductName.GELMIN_KIDS]: "#FFE1D5",
  [ProductName.COMPLEX_EXTRA]: "#FEE2E2",
  [ProductName.FERTILIA_WOMEN]: "#FCE7EF",
  [ProductName.VIRIS_MEN]: "#DCE8FD",
};