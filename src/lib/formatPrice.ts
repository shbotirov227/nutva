export function formatPrice(price: number) {
  return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : price;
}
