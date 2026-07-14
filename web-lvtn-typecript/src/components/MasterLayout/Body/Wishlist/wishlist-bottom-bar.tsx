import React from "react";

interface BottomBarProps {
  allChecked: boolean;
  onCheckAll: () => void;
  onDeleteSelected: () => void;
  onAddToCart: () => void;
  totalSelected: number;
  totalPrice: number;
}

const WishlistBottomBar: React.FC<BottomBarProps> = ({
  allChecked,
  onCheckAll,
  onDeleteSelected,
  onAddToCart,
  totalSelected,
  totalPrice,
}) => {
  return (
    <div className="bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between shadow-md z-50">
      <div className="flex items-center space-x-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-red-600"
            checked={allChecked}
            onChange={onCheckAll}
          />
          <span className="ml-2 select-none">Chọn tất cả</span>
        </label>

        <button
          onClick={onDeleteSelected}
          className="text-sm text-red-600 hover:underline"
        >
          Xóa
        </button>

        <button
          onClick={onAddToCart}
          className="text-sm text-red-600 hover:underline truncate max-w-xs"
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-sm">
          Tổng cộng ({totalSelected} sản phẩm):{" "}
          <span className="text-xl font-bold text-red-600">
            ₫{totalPrice.toLocaleString()}
          </span>
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-semibold">
          Mua hàng
        </button>
      </div>
    </div>
  );
};

export default WishlistBottomBar;
