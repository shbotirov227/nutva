type InputItem = {
  id: string;
  quantity: number;
};

export function getPurchaseProductsPayload(items: InputItem[] | InputItem) {
  const productArray = Array.isArray(items) ? items : [items];
  return productArray.map(item => ({
    productId: item.id,
    quantity: item.quantity,
  }));
}
