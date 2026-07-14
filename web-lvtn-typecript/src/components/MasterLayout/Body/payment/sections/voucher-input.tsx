import React, { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi'; // Import the help circle icon from Feather Icons
import axiosInstanceL from '../../../../../api/api-login/axiosInstance-login';


interface VoucherInputProps {
  onClose: () => void; // Prop to close the modal
  onVoucherApplied: (voucherCode: string, discountAmount: number) => void; // Prop to send the voucher details back to the parent component
}

const VoucherInput: React.FC<VoucherInputProps> = ({ onClose, onVoucherApplied }) => {
  const [voucherCode, setVoucherCode] = useState(''); // State for the voucher code input
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [validVoucher, setValidVoucher] = useState(false); // State to check if voucher is valid
  const [voucherDiscount, setVoucherDiscount] = useState(0); // State to store discount amount
  const [confirmationMessage, setConfirmationMessage] = useState(''); // State for confirmation message

  // Function to handle voucher code change
  const handleVoucherCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  // Function to handle voucher application
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      setErrorMessage('Vui lòng nhập mã voucher');
      return;
    }

    try {
      // Use axiosInstanceL to check the voucher
      const response = await axiosInstanceL.get(`/api/vouchers/${voucherCode}`);

      if (response.data) {
        // If voucher is valid, set discount amount and valid voucher flag
        setVoucherDiscount(response.data.discount_amount || 0);
        setValidVoucher(true); // Voucher is valid
        setErrorMessage(''); // Clear error message if the voucher is valid
        setConfirmationMessage(`Voucher hợp lệ, bạn sẽ được giảm ₫${response.data.discount_amount.toLocaleString()}! Bạn có muốn sử dụng voucher này?`);
      }
    } catch (error) {
      setErrorMessage('Voucher không hợp lệ hoặc đã hết hạn');
      setVoucherDiscount(0);
      setValidVoucher(false); 
    }
  };

  // Function to apply the voucher
  const handleConfirmVoucher = () => {
    if (validVoucher) {
      onVoucherApplied(voucherCode, voucherDiscount); // Apply the discount and pass the voucher details
      onClose(); // Close the modal after applying the voucher
    }
  };

  return (
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Nhập Voucher</h2>
        <button
          className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1 -mr-1"
          onClick={onClose} // Close modal when the close button is clicked
        >
          <span className="mr-1 text-base">Đóng</span>
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="voucherCode" className="text-gray-600 whitespace-nowrap text-sm">Mã Voucher</label>
        <input
          type="text"
          id="voucherCode"
          placeholder="Mã Shopee Voucher"
          value={voucherCode}
          onChange={handleVoucherCodeChange} // Handle voucher code input change
          className="flex-grow p-2 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        <button
          onClick={handleApplyVoucher} // Apply voucher
          className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md font-medium text-sm"
        >
          ÁP DỤNG
        </button>
      </div>

      {/* Show error message if voucher is invalid */}
      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

      {/* Show confirmation message if voucher is valid */}
      {validVoucher && (
        <div className="mt-4">
          <p className="text-green-500 font-medium">{confirmationMessage}</p>
          <button
            onClick={handleConfirmVoucher} // Apply voucher if confirmed
            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium text-sm mt-2"
          >
            Áp dụng voucher
          </button>
        </div>
      )}
    </div>
  );
};

export default VoucherInput;
