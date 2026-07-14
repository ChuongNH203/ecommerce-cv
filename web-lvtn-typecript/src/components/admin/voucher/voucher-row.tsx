import React from 'react';
import { message } from 'antd';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface VoucherRowProps {
  voucher: any;
  onDelete: (voucherId: number) => void;
  onActivate: (voucherId: number) => void;
  onDeactivate: (voucherId: number) => void;  // Callback for deactivating voucher
}

const VoucherRow: React.FC<VoucherRowProps> = ({ voucher, onDelete, onActivate, onDeactivate }) => {
  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa voucher này?')) {
      onDelete(voucher.id);
    }
  };

  const handleActivate = async () => {
    if (window.confirm('Bạn có chắc muốn kích hoạt voucher này?')) {
      onActivate(voucher.code);  
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm('Bạn có chắc muốn ngừng kích hoạt voucher này?')) {
      onDeactivate(voucher.code);
    }
  };

  return (
    <tr>
      <td className="py-3 px-2">{voucher.code}</td>
      <td className="py-3 px-2">{voucher.discount_amount || voucher.discount_percentage}đ</td>
      <td className="py-3 px-2">{voucher.valid_from} - {voucher.valid_until}</td>
      <td className="py-3 px-2">{voucher.is_active ? 'Hoạt động' : 'Không hoạt động'}</td>
      <td className="py-3 px-2">
        {!voucher.is_active ? (
          <button onClick={handleActivate} className="bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow mr-3">
            Kích hoạt
          </button>
        ) : (
          <button onClick={handleDeactivate} className="bg-yellow-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow mr-3">
            Ngừng kích hoạt
          </button>
        )}
        <button onClick={handleDelete} className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow">
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default VoucherRow;
