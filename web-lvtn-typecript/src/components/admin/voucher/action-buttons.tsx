import React from 'react';
import { FaPlus } from 'react-icons/fa';

const ActionButtonsVoucher: React.FC<{ onCreateVoucher: () => void }> = ({ onCreateVoucher }) => {
  return (
    <div className="w-full border-b border-gray-300 pb-4 mb-4">
      <div className="flex flex-wrap gap-2.5 justify-start">
        <button
          onClick={onCreateVoucher}
          className="bg-green-300 text-green-950 text-xs font-black p-2 rounded-md flex items-center gap-1 mb-2"
        >
          <FaPlus className="text-lg" />
          <span>Thêm mới voucher</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtonsVoucher;
