import React from 'react';

export const VoucherShippingSection: React.FC = () => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center mb-3">
        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
        </svg>
        <span className="text-sm">Voucher giảm đến 5%</span>
        <button className="ml-3 text-blue-500 text-sm hover:underline">
          Xem voucher
        </button>
      </div>
      <div className="flex items-start">
        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <div className="text-sm">
          <p>Giảm ₫70.000 phí vận chuyển đơn tối thiểu ₫10;</p>
          <p>Giảm ₫1.000.000 phí vận chuyển đơn tối thiểu ₫500.000</p>
        </div>
        <button className="ml-auto text-blue-500 text-sm hover:underline">
          Tìm hiểu thêm
        </button>
      </div>
    </div>
  );
};