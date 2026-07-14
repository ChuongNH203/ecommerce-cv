import React from 'react';

interface PaymentMethodSectionProps {
  selectedPaymentMethod: 'COD' | 'Momo'; // Added Momo as a payment method
  onPaymentMethodChange: (method:  'COD' | 'Momo') => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  selectedPaymentMethod,
  onPaymentMethodChange,
}) => {
  return (
    <div className="pb-4 mb-5">
      <h3 className="font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
      <div className="flex gap-x-2">
        {/* Momo Button */}
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            selectedPaymentMethod === 'Momo'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
          onClick={() => onPaymentMethodChange('Momo')}
        >
          Momo
        </button>

        {/* COD Button */}
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium relative ${
            selectedPaymentMethod === 'COD'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
          onClick={() => onPaymentMethodChange('COD')}
        >
          Thanh toán khi nhận hàng
          {/* Red triangle icon for COD */}
          <span className="absolute -top-1 -right-1 text-red-500 text-xs">
            <svg className="w-4 h-4 text-red-500 absolute -top-1 -right-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0L0 20h20L10 0z" />
            </svg>
          </span>
        </button>
      </div>

      {/* Show details if 'COD' is selected */}
      {selectedPaymentMethod === 'COD' && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
          <p className="font-semibold m-0">Thanh toán khi nhận hàng</p>
          <p className="mt-1 m-0 text-xs">Phí thu hộ: ₫0 VND. Ưu đãi về phí vận chuyển (nếu có) áp dụng cả với phí thu hộ.</p>
        </div>
      )}

      {/* Show details if 'Momo' is selected */}
      {selectedPaymentMethod === 'Momo' && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
          <p className="font-semibold m-0">Thanh toán qua Momo</p>
          <p className="mt-1 m-0 text-xs">Ưu đãi giảm giá 10% cho thanh toán qua Momo (nếu có).</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSection;
