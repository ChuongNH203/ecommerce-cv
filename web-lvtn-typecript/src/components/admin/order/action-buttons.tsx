import React, { useState } from 'react';
import { FaPlus, FaFileImport, FaPrint, FaClipboard, FaFileExcel, FaFilePdf, FaTrashAlt } from 'react-icons/fa';
import OrderAdd from './order-add'; // Import component OrderAdd

const ActionButtonsOrder = () => {
  const [showCreateForm, setShowCreateForm] = useState(false); // State để quản lý việc hiển thị form

  const toggleCreateOrderForm = () => {
    setShowCreateForm(!showCreateForm); // Đảo ngược trạng thái form hiển thị hoặc ẩn đi
  };

  return (
    <div className="w-full border-b border-gray-300 pb-4 mb-4">
      <div className="flex flex-wrap gap-2.5 justify-start">
        <button
          onClick={toggleCreateOrderForm} // Sử dụng toggle khi nhấn nút
          className="bg-green-300 text-green-950 text-xs font-black p-2 rounded-md flex items-center gap-1 mb-2"
        >
          <FaPlus className="text-lg" />
          <span>Tạo mới đơn hàng</span>
        </button>

      </div>

      {/* Hiển thị form khi nhấn "Tạo mới đơn hàng" */}
      {showCreateForm && <OrderAdd />} {/* Hiển thị hoặc ẩn form tùy theo trạng thái */}
    </div>
  );
};

export default ActionButtonsOrder;
