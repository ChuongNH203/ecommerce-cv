import React, { useState, useEffect } from 'react';
import Pagination from './pagination';
import VariantList from './variant-list';
import ActionButtonsVariant from './action-buttons';
import VariantAdd from './variant-add'; // Import VariantAdd component
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { debounce } from 'lodash';

const VariantIndex = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Dữ liệu tìm kiếm
  const [showCreateForm, setShowCreateForm] = useState(false); // Hiển thị form tạo variant mới
  const [variants, setVariants] = useState<any[]>([]); // Lưu trữ danh sách biến thể

  // Hàm fetch lại danh sách biến thể
  const fetchVariants = async () => {
    try {
      const res = await axiosInstanceL.get('/api/variant/all');
      setVariants(res.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách biến thể:', error);
    }
  };

  // Hàm tìm kiếm với debounce
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query); // Cập nhật query tìm kiếm
  }, 1000);

  // Hàm toggle hiển thị form thêm variant
  const handleCreateVariant = () => {
    setShowCreateForm((prev) => !prev); // Chuyển đổi trạng thái hiển thị form
  };

  // Gọi hàm fetchVariants khi component mount
  useEffect(() => {
    fetchVariants();
  }, []);

  return (
    <div className="flex-1 p-5">
      <div className="bg-white p-5 rounded-md shadow-sm border">
        <ActionButtonsVariant onCreateVariant={handleCreateVariant} />
        {showCreateForm && <VariantAdd onCreated={fetchVariants} />} {/* Pass onCreated to VariantAdd */}
        <Pagination onSearch={handleSearch} /> {/* Pass debounced search function */}
        <VariantList searchQuery={searchQuery} variants={variants} onDeleted={fetchVariants} onUpdated={fetchVariants} />
      </div>
    </div>
  );
};

export default VariantIndex;
