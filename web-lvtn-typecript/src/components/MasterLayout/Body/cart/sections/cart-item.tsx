import React from 'react';

interface CartItemProps {
  product: any;
  checked: boolean;
  getItemKey: (id: number, selectedClassify?: string) => string;
  getFullImageUrl: (thumbnail: string, images?: { image_url: string }[]) => string;
  handleCheckItem: (key: string) => void;
  decreaseQuantity: (id: number, selectedClassify?: string) => void;
  increaseQuantity: (id: number, selectedClassify?: string) => void;
  removeFromCart: (id: number, selectedClassify?: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  product,
  checked,
  getItemKey,
  getFullImageUrl,
  handleCheckItem,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  
}) => {
  const key = getItemKey(product.id, product.selectedClassify);
  const selectedVariant = product.variants?.find(
    (v: any) => v.id === product.variant_id || v.variant_name === product.selectedClassify
  );
  const price = selectedVariant?.price ?? product.price ?? 0;

  return (
    <div className="grid grid-cols-[auto_1fr_100px_100px_100px_80px] items-center py-4 border-t first:border-t-0">
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-red-600 rounded justify-self-center"
        checked={checked}
        onChange={() => handleCheckItem(key)}
      />
      <div className="flex items-center pl-2">
        <img
          className="w-20 h-20 object-cover rounded-sm border border-gray-200"
          src={getFullImageUrl(product.thumbnail, product.images)}
          alt={product.name}
        />
        <div className="ml-3">
          <p className="text-sm text-black/90 line-clamp-2">{product.name}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              Phân loại:
              <span className="font-semibold ml-1 mr-2">
                {selectedVariant?.variant_name || product.selectedClassify || "Không có"}
              </span>
            </p>

        </div>
      </div>
      <div className="text-center text-gray-800 text-sm whitespace-nowrap">
        {price.toLocaleString("vi-VN")}₫
      </div>
      <div className="flex items-center justify-center space-x-1">
        <button
          className="w-6 h-6 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-100 flex items-center justify-center text-base"
          onClick={() => decreaseQuantity(product.id, product.selectedClassify)}
        >
          -
        </button>
        <input
          type="text"
          value={product.quantity}
          readOnly
          className="w-10 text-center border-t border-b border-gray-300 text-sm py-0.5"
        />
        <button
          className="w-6 h-6 border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-100 flex items-center justify-center text-base"
          onClick={() => increaseQuantity(product.id, product.selectedClassify)}
        >
          +
        </button>
      </div>
      <div className="text-center text-red-500 font-semibold text-sm whitespace-nowrap">
        {(price * product.quantity).toLocaleString("vi-VN")}₫
      </div>
      <div className="text-center">
        <button
          className="text-blue-500 text-xs hover:underline block mb-1"
          onClick={() => removeFromCart(product.id, product.selectedClassify)}
        >
          Xóa
        </button>
        <button className="text-blue-500 text-xs hover:underline block">
          Tìm sản phẩm tương tự
        </button>
      </div>
    </div>
  );
};