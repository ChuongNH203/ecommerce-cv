import React, { useState, useEffect } from 'react';
import VoucherList from './voucher-list';
import VoucherAdd from './voucher-add';
import ActionButtonsVoucher from './action-buttons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const VoucherIndex: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [vouchers, setVouchers] = useState<any[]>([]);

  // Fetch danh sách voucher từ API
  const fetchVouchers = async () => {
    try {
      const response = await axiosInstanceL.get('/api/vouchers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setVouchers(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách voucher:', error);
    }
  };

  // Gọi fetchVouchers khi component được mount
  useEffect(() => {
    fetchVouchers();
  }, []);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleVoucherCreated = () => {
    setShowCreateForm(false);
    fetchVouchers();
  };

  return (
    <div className="flex-1 p-5">
      <div className="bg-white p-5 rounded-md shadow-sm border">
        <ActionButtonsVoucher onCreateVoucher={toggleCreateForm} />
        {showCreateForm && <VoucherAdd onCreated={handleVoucherCreated} />}
        <VoucherList vouchers={vouchers} fetchVoucher={fetchVouchers}/>
      </div>
    </div>
  );
};

export default VoucherIndex;
