import React, { useState, useEffect } from 'react';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import UpdateProduct from './update-product';
import ManageVariants from './manage-variant';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  categoryDetail?: {
    id: number;
    name: string;
  };
  discount_percentage: number | string;
  brand: string;
  thumbnail: string;
}

interface ProductRowProps {
  product: Product;
  selectAll: boolean;
  onDeleted?: () => void;
  onUpdated?: () => void;
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  selectAll,
  onDeleted,
  onUpdated
}) => {
  const [isChecked, setIsChecked] = useState(selectAll);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsChecked(selectAll);
  }, [selectAll]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

const handleDelete = async () => {
  try {
    const response = await axiosInstanceL.get(`/api/product/order-items/non-completed/${product.id}`);
    if (response.data && response.data.length > 0) {
      message.error('Sản phẩm này đã có trong đơn hàng! Không thể xóa.');
      return; 
    }

    await axiosInstanceL.delete(`/api/product/delete/${product.id}`);
    message.success('Đã xóa sản phẩm thành công!');
    onDeleted?.();
  } catch (err) {
    console.error('Lỗi khi xóa sản phẩm:', err);
    message.error('Lỗi khi xóa sản phẩm');
  }
};

  // Kiểm tra nếu không có ảnh thì hiển thị dấu +
  const imageUrl = product.thumbnail?.startsWith('/')
    ? `http://localhost:3000${product.thumbnail}`
    : product.thumbnail;

  const handleAddImage = () => {
    if (!product.thumbnail) {
      navigate(`/service/images`); 
    }
  };

  return (
    <>
      <tr className="text-sm text-gray-800 border-b border-gray-200 hover:bg-gray-50 transition-all">
        <td className="text-center py-3">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-4 h-4 accent-blue-500"
          />
        </td>
        <td className="py-3 px-2">{product.id}</td>
        <td className="py-3 px-2">{product.name}</td>
        <td className="py-3 px-2 ">{product.description}</td>
        <td className="py-3 px-2">{product.categoryDetail?.name || 'Không rõ'}</td>
        <td className="py-3 px-2">{product.discount_percentage}%</td>
        <td className="py-3 px-2">{product.brand}</td>
        <td className="py-3 px-2">
          <div className="flex justify-start">
            {/* Hiển thị ảnh hoặc dấu cộng */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-16 h-16 object-cover rounded border shadow-sm"
              />
            ) : (
              <div
                onClick={handleAddImage}
                className="w-16 h-16 flex justify-center items-center cursor-pointer border border-dashed rounded"
              >
                <PlusOutlined />
                <div className="text-xs mt-2">Thêm ảnh</div>
              </div>
            )}
          </div>
        </td>
        <td className="py-3 px-2">
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
            >
              Xóa
            </button>
            <button
              onClick={() => setShowUpdate(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
            >
              Sửa
            </button>
            <button
              onClick={() => setShowManageModal(true)} // Mở cửa sổ quản lý phân loại
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
            >
              Xem phân loại
            </button>
          </div>
        </td>
      </tr>

      {showUpdate && (
        <UpdateProduct
          product={product}
          visible={showUpdate}
          onClose={() => setShowUpdate(false)}
          onUpdated={() => {
            setShowUpdate(false);
            onUpdated?.();
          }}
        />
      )}
      {showManageModal && (
        <ManageVariants
          visible={showManageModal}
          onClose={() => setShowManageModal(false)}
          productId={product.id} // Truyền productId để lấy thông tin phân loại của sản phẩm
        />
      )}
    </>
  );
};

export default ProductRow;
