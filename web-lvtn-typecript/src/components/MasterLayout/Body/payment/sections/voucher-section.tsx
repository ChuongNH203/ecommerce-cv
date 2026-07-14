import React, { useState } from "react";
import VoucherInput from './voucher-input'; // Import VoucherInput component

interface VoucherSectionProps {
  isVoucherChecked: boolean;
  onVoucherChange: (checked: boolean, discount: number, voucherCode: string) => void;
}

const VoucherSection: React.FC<VoucherSectionProps> = ({
  isVoucherChecked,
  onVoucherChange,
}) => {
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false); // State to control modal visibility
  const [appliedVouchers, setAppliedVouchers] = useState<{ code: string; discountAmount: number }[]>([]); // State to store applied vouchers
  const [totalDiscount, setTotalDiscount] = useState(0); // State to store the total discount
  const handleVoucherModalToggle = () => {
    setIsVoucherModalOpen(!isVoucherModalOpen); // Toggle modal visibility
  };

  const handleVoucherApplied = (voucherCode: string, discountAmount: number) => {
    // Check if voucher has already been applied
    if (appliedVouchers.some(voucher => voucher.code === voucherCode)) {
      return;
    }

    // Add the new voucher to the applied vouchers list
    const updatedVouchers = [...appliedVouchers, { code: voucherCode, discountAmount }];
    setAppliedVouchers(updatedVouchers);

    // Update the total discount
    const updatedTotalDiscount = updatedVouchers.reduce((total, voucher) => total + voucher.discountAmount, 0);
    setTotalDiscount(updatedTotalDiscount);
    onVoucherChange(isVoucherChecked, updatedTotalDiscount,voucherCode);
  };

  return (
    <div className="pb-4 mb-5 border-b border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="shopVoucher"
            checked={isVoucherChecked}
            onChange={(e) => {
              const latestCode = appliedVouchers.at(-1)?.code ?? '';
              onVoucherChange(e.target.checked, totalDiscount, latestCode);
            }}
            className="mr-2 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
          />
          <label htmlFor="shopVoucher" className="font-semibold text-gray-800 cursor-pointer">Shop Voucher</label>
        </div>
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
          onClick={handleVoucherModalToggle} // Open voucher modal
        >
          Chọn Voucher
        </button>
      </div>

      {/* Shopee Xu Section */}
      <div className="flex items-center justify-between text-gray-600 text-sm py-2">
        <div className="flex items-center">
          <span className="text-orange-500 text-lg mr-2">💰</span> {/* Coin icon placeholder */}
          {appliedVouchers.length > 0 ? (
            <span className="ml-2 text-gray-500">
              {appliedVouchers.length} Voucher đã áp dụng: Giảm ₫{totalDiscount.toLocaleString()}
            </span>
          ) : (
            <span className="ml-2 text-gray-500">Chưa có voucher</span>
          )}
        </div>
        <span className="text-gray-500">[-₫{totalDiscount.toLocaleString()}]</span> {/* Display the total discount */}
      </div>
      {/* Render modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <VoucherInput onClose={handleVoucherModalToggle} onVoucherApplied={handleVoucherApplied} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherSection;
