import React from 'react';
import VoucherRow from './voucher-row';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { message } from 'antd';

interface VoucherListProps {
  vouchers: any[];
  fetchVoucher: () => void;
}

const VoucherList: React.FC<VoucherListProps> = ({ vouchers, fetchVoucher }) => {

  const handleDeleteVoucher = async (voucherId: number) => {
    try {
      await axiosInstanceL.delete(`/api/vouchers/${voucherId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchVoucher(); // Fetch lại sau khi xóa
    } catch (error) {
      message.error('Xóa voucher thất bại!');
    }
  };

  const handleActivateVoucher = async (voucherId: number) => {
    try {
      await axiosInstanceL.put(`/api/vouchers/activate/${voucherId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchVoucher(); // Fetch lại sau khi kích hoạt
    } catch (error) {
      message.error('Kích hoạt voucher thất bại!');
    }
  };

  const handleDeactivateVoucher = async (voucherId: number) => {
    try {
      await axiosInstanceL.put(`/api/vouchers/deactivate/${voucherId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchVoucher(); // Fetch lại sau khi ngừng kích hoạt
    } catch (error) {
      message.error('Ngừng kích hoạt voucher thất bại!');
    }
  };

  return (
    <div className="mt-4 border border-zinc-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm text-left text-gray-700">
          <thead>
            <tr>
              <th className="py-3 px-2">Mã Voucher</th>
              <th className="py-3 px-2">Giảm giá</th>
              <th className="py-3 px-2">Thời gian</th>
              <th className="py-3 px-2">Trạng thái</th>
              <th className="py-3 px-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <VoucherRow
                key={voucher.id}
                voucher={voucher}
                onDelete={handleDeleteVoucher}
                onActivate={handleActivateVoucher}
                onDeactivate={handleDeactivateVoucher}  
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherList;
