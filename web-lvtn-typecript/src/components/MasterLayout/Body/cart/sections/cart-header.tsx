import React from 'react';

interface CartHeaderProps {
  isAllChecked: boolean;
  handleCheckAll: () => void;
}

export const CartHeader: React.FC<CartHeaderProps> = ({ isAllChecked, handleCheckAll }) => {
  return (
    <div className="grid grid-cols-[auto_1fr_100px_100px_100px_80px] items-center text-sm font-semibold text-gray-600 border-b p-4">
      <label className="flex items-center cursor-pointer col-span-2">
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-red-600 rounded accent-orange-500"
          checked={isAllChecked}
          onChange={handleCheckAll}
          id="check-all-header"
        />
        <span className="ml-2">Sản phẩm</span>
      </label>
      <div className="text-center">Đơn giá</div>
      <div className="text-center">Số lượng</div>
      <div className="text-center">Số Tiền</div>
      <div className="text-center">Thao Tác</div>
    </div>
  );
};