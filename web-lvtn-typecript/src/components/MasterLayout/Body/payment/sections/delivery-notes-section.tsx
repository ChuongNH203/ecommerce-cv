import React from 'react';

interface DeliveryAndNotesSectionProps {
  standardShippingFee: number;
  selectedShippingOption: 'standard' | 'express';
  onShippingOptionChange: (option: 'standard' | 'express') => void;
  onMessageChange: (message: string) => void;
}

const DeliveryAndNotesSection: React.FC<DeliveryAndNotesSectionProps> = ({
  selectedShippingOption,
  onShippingOptionChange,
  onMessageChange,
}) => {
  const shipping =20000;
  const shippingpro = 50000;
  return (
    <div className="flex justify-between mb-5">
      <div className="w-5/12">
        <h4 className="m-0 mb-2 font-semibold text-base">Lời nhắn:</h4>
        <input
          type="text"
          placeholder="Lưu ý cho Người bán..."
          onChange={(e) => onMessageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="w-6/12">
        <h4 className="m-0 mb-2 font-semibold text-base">Phương thức vận chuyển:</h4>
        <div className="flex flex-col gap-y-3">
          {/* Standard Shipping */}
          <label htmlFor="standardShipping" className="flex items-start justify-between border border-gray-200 p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <input
                type="radio"
                id="standardShipping"
                name="shippingOption"
                value="standard"
                checked={selectedShippingOption === 'standard'}
                onChange={() => onShippingOptionChange('standard')}
                className="mr-2 w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="font-bold mr-2 text-sm">Nhanh</span>
              <span className="text-gray-600 text-sm">{shipping.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="text-xs text-gray-600 text-right ml-4">
              <p className="m-0">Đảm bảo nhận hàng từ 27 Tháng 6 - 30 Tháng 6</p>
              <p className="mt-1">Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau 30 Tháng 6 2025.</p>
            </div>
          </label>

          {/* Express Shipping */}
          <label htmlFor="expressShipping" className="flex items-start justify-between border border-gray-200 p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              <input
                type="radio"
                id="expressShipping"
                name="shippingOption"
                value="express"
                checked={selectedShippingOption === 'express'}
                onChange={() => onShippingOptionChange('express')}
                className="mr-2 w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="font-bold mr-2 text-sm">Hỏa tốc</span>
              <span className="text-gray-600 text-sm">{shippingpro.toLocaleString('vi-VN')}₫</span>
              <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-xs leading-none ml-1">
                🚀 giao hàng vào ngày mai
              </span>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-lg cursor-pointer ml-4 p-0.5 leading-none">
              &gt;
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAndNotesSection;