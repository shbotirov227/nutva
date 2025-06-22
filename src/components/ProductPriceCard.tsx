import { GetOneProductType } from "@/types/products/getOneProduct";
import React from "react";

interface Props {
  product: GetOneProductType;
  color: string;
}

const ProductPriceCard = ({ product, color }: Props) => {
  
  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2" style={{ color: color }}>
          {product.name}
        </h2>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold" style={{ color: color }}>
            {product.price} {product.slug === "uz" ? "so'm" : "USD"}
          </span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => alert("Product added to cart!")}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPriceCard;