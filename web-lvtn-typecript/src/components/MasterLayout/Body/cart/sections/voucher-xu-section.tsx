import React from 'react';

export const ShopeeVoucherXuSection: React.FC = () => {
  return (
    <>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Shopee Voucher</span>
        </div>
        <button className="text-blue-500 text-sm hover:underline">
          Chọn hoặc nhập mã
        </button>
      </div>

      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7.586 9H4a1 1 0 100 2h3.586l-2.293 2.293a1 1 0 101.414 1.414L10 12.414l2.293 2.293a1 1 0 001.414-1.414L12.414 11l2.293-2.293a1 1 0 00-1.414-1.414L10 10.586z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-600">Shopee Xu</span>
        </div>
        <div className="text-sm text-gray-500">
          Bạn chưa chọn sản phẩm @ -40
        </div>
      </div>
    </>
  );
};