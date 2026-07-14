import React from 'react';

interface OrderTotalSummaryProps {
  productPrice: number;
  shippingFee: number;
  totalPrice: number;
  voucherAmount: number; // Thêm props để nhận giá trị voucher
}

const OrderTotalSummary: React.FC<OrderTotalSummaryProps> = ({
  productPrice,
  shippingFee,
  totalPrice,
  voucherAmount, // Nhận giá trị voucher từ props
}) => {
  const totalProductPrice = productPrice;
  const totalShippingFee = shippingFee;
  const finalTotalPrice = totalPrice ; // Tính tổng tiền sau khi trừ voucher

  return (
    <div className="pt-4 mt-5 border-t border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700">Tổng tiền hàng</span>
        <span className="font-medium text-gray-800">{totalProductPrice.toLocaleString('vi-VN')}₫</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700">Tổng tiền phí vận chuyển</span>
        <span className="font-medium text-gray-800">{totalShippingFee.toLocaleString('vi-VN')}₫</span>
      </div>
      
      {/* Thêm dòng voucher */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700">Voucher</span>
        <span className="font-medium text-gray-800">-{voucherAmount.toLocaleString('vi-VN')}₫</span>
      </div>

      <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-gray-200">
        <span className="text-gray-800 font-semibold text-lg">Tổng thanh toán</span>
        <span className="text-orange-500 font-bold text-3xl">{finalTotalPrice.toLocaleString('vi-VN')}₫</span>
      </div>
    </div>
  );
};

export default OrderTotalSummary;
