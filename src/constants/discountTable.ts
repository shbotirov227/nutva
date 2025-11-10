// export const DISCOUNT_TABLE: Record<
//   string,
//   { [quantity: number]: number }
// > = {
//   VIRIS_MEN: {
//     1: 860000,
//     2: 690000,
//     3: 490000,
//     5: 390000,
//   },
//   FERTILIA_WOMEN: {
//     1: 860000,
//     2: 690000,
//     3: 490000,
//     5: 390000,
//   },
//   GELMIN_KIDS: {
//     1: 490000,
//     2: 390000,
//     3: 290000,
//     5: 220000,
//   },
//   COMPLEX: {
//     1: 1170000,
//     2: 990000,
//     3: 640000,
//     5: 560000,
//   },
//   COMPLEX_EXTRA: {
//     1: 1170000,
//     2: 990000,
//     3: 640000,
//     5: 560000,
//   },
// };

export const DISCOUNT_TABLE: Record<
  string,
  {
    [quantity: number]: {
      price: number;
      discount: number;
      boxPrice?: number;
    };
  }
> = {
  COMPLEX: {
    1: { price: 1170000, discount: 0, boxPrice: 1170000 },
    2: { price: 820000, discount: 30, boxPrice: 1640000 },
    3: { price: 560000, discount: 50, boxPrice: 1680000 },
    // 5: { price: 560000, discount: 52, boxPrice: 2800000 },
  },
  COMPLEX_EXTRA: {
    1: { price: 990000, discount: 0, boxPrice: 990000 },
    2: { price: 730000, discount: 26, boxPrice: 1460000 },
    3: { price: 520000, discount: 47, boxPrice: 1560000 },
    // 5: { price: 520000, discount: 50, boxPrice: 1560000 },
  },
  GELMIN_KIDS: {
    1: { price: 490000, discount: 0 },
    2: { price: 390000, discount: 20 },
    3: { price: 290000, discount: 41 },
    5: { price: 220000, discount: 55 },
  },
};
