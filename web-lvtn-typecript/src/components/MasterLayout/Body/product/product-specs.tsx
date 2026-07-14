import React from "react";
import { Product } from "../../../../types/product";

interface Props {
  product: Product;
  selectedClassify: string;
}

const ProductSpecs: React.FC<Props> = ({ product,selectedClassify }) => {
  const selectedVariant = product.variants?.find(
    (v) => v.variant_name === selectedClassify
  );
  return (
    <div className="w-full p-4 rounded-lg shadow-md">
      <div className="bg-slate-50 p-3 font-semibold mt-4">THÔNG TIN SẢN PHẨM</div>
      <div className="p-3 text-gray-700 space-y-1">
        <div className="flex">
          <p className="text-gray-500 font-normal w-40">Thương hiệu</p>
          <p>{product.brand}</p>
        </div>
        <div className="flex">
          <p className="text-gray-500 font-normal w-40">Mã SKU</p>
          <p>{selectedVariant?.sku}</p>
        </div>
        <div className="flex">
          <p className="text-gray-500 font-normal w-40">Trọng lượng</p>
          <p>{product.weight} kg</p>
        </div>
        <div className="flex">
          <p className="text-gray-500 font-normal w-40">Kích thước</p>
          <p className="font-normal">{selectedVariant?.dimensions?.width}cm x {selectedVariant?.dimensions?.height}cm x {selectedVariant?.dimensions?.depth}cm</p>
        </div>
      </div>
      <div className="bg-slate-50 p-3 font-semibold">MÔ TẢ SẢN PHẨM</div>
      <div className="p-3 text-gray-700">{product.description}</div>
    </div>
  );
};

export default ProductSpecs;