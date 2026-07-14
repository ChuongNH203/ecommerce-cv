import React from "react";
import Modal from "react-modal";

const ProductSpecificationsModal = ({ isOpen, onRequestClose, specifications }: any) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thông số kỹ thuật"
      className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Thông số kỹ thuật</h2>
        <button onClick={onRequestClose} className="text-red-500 text-lg">X</button>
      </div>

      <div className="p-3 text-gray-700 space-y-2">
        {/* Hiển thị tất cả các thông số kỹ thuật */}
        <div className="w-full"> {/* Changed from grid-cols-1 gap-4 to w-full */}
          {specifications.map((spec: any, index: number) => (
            <div key={spec.id || index} className="flex border-b border-gray-200 py-2"> {/* Added flex and border for table-like row */}
              <div className="w-1/3 text-gray-500 font-normal pr-4"> {/* Left column for spec_name */}
                {spec.spec_name}
              </div>
              <div className="w-2/3 pl-4"> {/* Right column for spec_value */}
                {spec.spec_value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <button onClick={onRequestClose} className="bg-red-500 text-white p-2 rounded-md">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ProductSpecificationsModal;