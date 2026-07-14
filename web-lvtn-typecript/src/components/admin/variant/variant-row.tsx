import React, { useEffect, useState } from 'react';
import { Variant } from '../../../types/product';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { message } from 'antd';
import UpdateVariant from './update-variant';
import SpecificationListModal from './specification-modal';

interface VariantRowProps {
  variant: Variant;
  selectAll: boolean;
  onDeleted?: () => void;
  onUpdated?: () => void;
}

const VariantRow: React.FC<VariantRowProps> = ({ variant, selectAll, onDeleted, onUpdated }) => {
  const [isChecked, setIsChecked] = useState(selectAll);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [specData, setSpecData] = useState<any>(null); // Lưu thông số kỹ thuật vào state

  useEffect(() => {
    setIsChecked(selectAll);
  }, [selectAll]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

const handleDelete = async () => {
  const confirm = window.confirm(`Bạn có chắc muốn xóa biến thể "${variant.variant_name}"?`);
  if (!confirm) return;

  try {
    // Kiểm tra nếu biến thể có trong đơn hàng
    const check = await axiosInstanceL.get(`/api/variant/check-variant-used/${variant.id}`);
    if (check.data.inUse) {
      message.error('Biến thể này đã có trong đơn hàng! Không thể xóa.');
      return;
    }

    await axiosInstanceL.delete(`/api/variant/delete/${variant.id}`);
    message.success('Xoá biến thể thành công');
    onDeleted?.();
  } catch (error: any) {
    console.error('Lỗi khi xóa:', error);
    message.error(error?.response?.data?.message || 'Xóa thất bại!');
  }
};

  const handleOpenUpdate = async () => {
    try {
      const res = await axiosInstanceL.get(`/api/variant/product/${variant.product_id}`);
      const latest = res.data.data.find((v: Variant) => v.id === variant.id);
      if (latest) {
        setSelectedVariant(latest);
        setTimeout(() => setShowUpdate(true), 0);
      } else {
        message.warning('Không tìm thấy dữ liệu biến thể!');
      }
    } catch (error: any) {
      console.error('Lỗi khi tải biến thể:', error);
      message.error('Không thể tải dữ liệu biến thể!');
    }
  };

  const handleOpenSpecifications = async () => {
    if (specData) { // Nếu đã có dữ liệu, chỉ việc mở modal
      setShowSpecModal(true);
      return;
    }

    // Fetch dữ liệu nếu chưa có dữ liệu trong specData
    try {
      const res = await axiosInstanceL.get(`/api/variant/${variant.id}/detail`);
      const latest = res.data.data;
      if (latest) {
        setSpecData({ ...latest, category_id: latest.Product?.category_id }); // Lưu dữ liệu vào state
        setShowSpecModal(true);
      } else {
        message.warning('Không tìm thấy biến thể chi tiết!');
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết biến thể:', error);
      message.error('Không thể tải dữ liệu biến thể!');
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
        <td className="py-3 px-2">{variant.id}</td>
        <td className="py-3 px-2">{variant.product_id}</td>
        <td className="py-3 px-2">{variant.variant_name}</td>
        <td className="py-3 px-2">{variant.color}</td>
        <td className="py-3 px-2">{variant.size}</td>
        <td className="py-3 px-2">{variant.stock}</td>
        <td className="py-3 px-2">{Number(variant.price).toLocaleString('vi-VN')} đ</td>
        <td className="py-3 px-2">{variant.sku}</td>
        <td className="py-3 px-2">{variant.weight} kg</td>
        <td className="py-3 px-2">
          {variant.dimensions?.depth ?? 0} x {variant.dimensions?.width ?? 0} x {variant.dimensions?.height ?? 0} cm
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
              onClick={handleOpenUpdate}
              className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
            >
              Sửa
            </button>
            <button
              onClick={handleOpenSpecifications}
              className="bg-blue-400 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
            >
              Thông số
            </button>
          </div>
        </td>
      </tr>

      {showUpdate && selectedVariant && (
        <UpdateVariant
          variant={selectedVariant}
          visible={showUpdate}
          onClose={() => setShowUpdate(false)}
          onUpdated={() => {
            setShowUpdate(false);
            onUpdated?.();
          }}
        />
      )}

      {showSpecModal && specData && (
        <SpecificationListModal
          variantId={specData.id}
          categoryId={specData.category_id}
          onClose={() => setShowSpecModal(false)}
        />
      )}
    </>
  );
};

export default VariantRow;
