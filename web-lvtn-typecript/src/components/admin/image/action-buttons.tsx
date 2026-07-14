import React, { useState } from 'react';
import { FaPlus, FaFileImport, FaPrint, FaClipboard, FaFileExcel, FaFilePdf, FaTrashAlt } from 'react-icons/fa';

const ActionButtonsImage = ({ onCreateProduct }: { onCreateProduct: () => void }) => {
  return (
    <div className="w-full border-b border-gray-300 pb-4 mb-4">
      <div className="flex flex-wrap gap-2.5 justify-start">
        <button
          onClick={onCreateProduct} // Gọi callback để thay đổi trạng thái showCreateForm
          className="bg-green-300 text-green-950 text-xs font-black p-2 rounded-md flex items-center gap-1 mb-2"
        >
          <FaPlus className="text-lg" />
          <span>Thêm hình ảnh</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtonsImage;
