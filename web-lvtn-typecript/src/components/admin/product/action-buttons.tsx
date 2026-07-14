import React, { useState } from 'react';
import { FaPlus} from 'react-icons/fa';

interface ActionButtonsProductProps {
  onToggleCreateForm: () => void;
}

const ActionButtonsProduct: React.FC<ActionButtonsProductProps> = ({ onToggleCreateForm }) => {
  return (
    <div className="w-full border-b border-gray-300 pb-4 mb-4">
      <div className="flex flex-wrap gap-2.5 justify-start">
        <button
          onClick={onToggleCreateForm}
          className="bg-green-300 text-green-950 text-xs font-black p-2 rounded-md flex items-center gap-1 mb-2"
        >
          <FaPlus className="text-lg" />
          <span>Tạo mới sản phẩm</span>
        </button>

      </div>
    </div>
  );
};

export default ActionButtonsProduct;
