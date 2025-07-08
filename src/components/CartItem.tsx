import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import NoImage from "@/assets/images/noimage.webp";
import { GetOneProductType } from "@/types/products/getOneProduct";
import { useTranslation } from "react-i18next";
import { X, Equal, MinusIcon, PlusIcon } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

type Discount = {
  basePrice: number;
  pricePerUnit: number;
  totalPrice: number;
  discountPercent: number;
};

type Props = {
  item: GetOneProductType & {
    quantity: number;
    discount: Discount;
  };
};

export default function CartItem({ item }: Props) {
  const { removeFromCart, updateQuantity } = useCart();
  const { t } = useTranslation();

  const { basePrice, pricePerUnit, totalPrice, discountPercent } = item.discount;

  const handleIncrement = () => updateQuantity(item.id, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 sm:p-5 border border-gray-300 rounded-2xl bg-[#f9fafb] shadow-md hover:shadow-[5px_5px_5px_rgba(0,0,0,0.1)] transition-all">
      <div className="w-full sm:w-[180px] flex justify-center sm:justify-start">
        <Image
          src={item.imageUrls?.[0] || NoImage}
          alt={`Image of ${item.name}`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-[150px] sm:w-[180px] max-w-full h-[150px] object-contain rounded-xl border border-gray-200 bg-white"
        />
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 sm:gap-4">
        <div className="flex flex-col text-center sm:text-left flex-1 w-full">
          <h3 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 font-semibold text-gray-800 break-words">
            {item.name}
          </h3>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-8">
            <p className="flex flex-wrap items-center justify-center sm:justify-start text-sm text-gray-500">
              <span className="text-gray-700 font-medium text-base sm:text-xl">{t("common.price")}:</span>
              <span className="text-gray-800 font-semibold text-base sm:text-xl ml-2">
                {formatPrice(pricePerUnit)} {t("common.sum")}
              </span>

              {item?.quantity > 1 && (
                <span className="text-gray-700 font-semibold mx-2 flex items-center text-base sm:text-lg">
                  <X size={18} className="mx-1" />
                  {item?.quantity} {t("common.quantity")}
                  <Equal size={18} className="mx-1" />
                </span>
              )}

              {discountPercent > 0 && (
                <span className="text-gray-400 line-through text-sm sm:text-lg ml-2">
                  {formatPrice(basePrice * item.quantity)} {t("common.sum")}
                </span>
              )}
            </p>

            {discountPercent > 0 && (
              <span className="bg-yellow-300 text-black px-2 py-0.5 rounded-full text-xs sm:text-sm font-semibold">
                -{discountPercent}%
              </span>
            )}
          </div>

          <p className="mt-2 text-sm sm:text-lg text-gray-500">
            <span className="text-gray-700 font-medium">{t("common.total")}:</span>{" "}
            <span className="text-red-600 font-bold ml-1">
              {formatPrice(totalPrice)} {t("common.sum")}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden p-1 w-full sm:w-auto">
            <Button
              onClick={handleDecrement}
              className="px-3 py-1 bg-gray-200 text-black hover:bg-gray-300 text-base font-semibold cursor-pointer"
            >
              <MinusIcon />
            </Button>
            <span className="px-4 py-1 text-base min-w-[40px] text-center">{item.quantity}</span>
            <Button
              onClick={handleIncrement}
              className="px-3 py-1 bg-gray-200 text-black hover:bg-gray-300 text-base font-semibold cursor-pointer"
            >
              <PlusIcon />
            </Button>
          </div>

          <Button
            variant="secondary"
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-red-500 border border-red-300 hover:bg-red-50 px-4 py-2 rounded-xl cursor-pointer w-full sm:w-auto"
          >
            {t("common.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
