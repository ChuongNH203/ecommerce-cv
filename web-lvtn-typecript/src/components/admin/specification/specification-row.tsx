import React, { useState, useEffect } from 'react';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { message } from 'antd';
import UpdateSpecification from './specification-update';

interface Specification {
  id: number;
  variant_id: number | null;
  spec_name: string;
  spec_value: string;
  spec_group?: string;
}

interface SpecificationRowProps {
  spec: Specification;
  selectAll: boolean;
  onDeleted?: () => void;
  onUpdated?: () => void;
}

const SpecificationRow: React.FC<SpecificationRowProps> = ({ spec, selectAll, onDeleted, onUpdated }) => {
  const [isChecked, setIsChecked] = useState(selectAll);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    setIsChecked(selectAll);
  }, [selectAll]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleDelete = async () => {
    const confirm = window.confirm(`Bạn có chắc muốn xoá thông số "${spec.spec_name}"?`);
    if (!confirm) return;

    try {
      await axiosInstanceL.delete(`/api/specifications/variant/${spec.variant_id}/${spec.id}`);
      message.success('Xóa thông số kỹ thuật thành công');
      onDeleted?.();
    } catch (error: any) {
      console.error('Lỗi khi xóa thông số:', error);
      message.error(error?.response?.data?.message || 'Xóa thất bại!');
    }
  };

  const handleEdit = () => {
    setIsEditModalVisible(true); // Mở modal khi nhấn nút "Sửa"
  };

  return (
    <>
      <tr className="text-neutral-800 text-sm border-b border-zinc-300 text-left">
        <td className="text-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-4 h-4"
          />
        </td>
        <td>{spec.id}</td>
        <td>{spec.variant_id}</td>
        <td>{spec.spec_name}</td>
        <td>{spec.spec_value}</td>
        <td></td>
        <td className="flex gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
          >
            Xóa
          </button>
          <button
            onClick={handleEdit}
            className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
          >
            Sửa
          </button>
        </td>
      </tr>

      {/* Modal UpdateSpecification */}
      <UpdateSpecification
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}  // Đóng modal khi đóng
        variantId={spec.variant_id || -1}  // Nếu variant_id là null, truyền giá trị mặc định là -1
        specificationId={spec.id}
        specName={spec.spec_name}
        specValue={spec.spec_value}
        onUpdated={onUpdated || (() => {})} // Đảm bảo onUpdated là một hàm
      />
    </>
  );
};

export default SpecificationRow;
