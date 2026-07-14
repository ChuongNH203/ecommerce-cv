import React, { useEffect, useState } from 'react';
import Pagination from './pagination';
import ActionButtonsSpecification from './action-buttons';
import SpecificationList from './specification-list';
import SpecificationAdd from './specification-add';
import { debounce } from 'lodash';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

const SpecificationIndex = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Dữ liệu tìm kiếm
  const [showCreateForm, setShowCreateForm] = useState(false); // Hiển thị form tạo variant mới
  const [specifications, setSpecifications] = useState<any[]>([]); // Lưu trữ danh sách thông số kỹ thuật

  // Hàm fetch lại danh sách thông số kỹ thuật
  const fetchSpecifications = async () => {
    try {
      const res = await axiosInstanceL.get('/api/specifications/all');
      setSpecifications(res.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách thông số kỹ thuật:', error);
    }
  };

  // Hàm tìm kiếm với debounce
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query); // Cập nhật query tìm kiếm
  }, 1000);

  // Hàm toggle hiển thị form thêm specification
  const handleCreateSpecification = () => {
    setShowCreateForm((prev) => !prev); // Chuyển đổi trạng thái hiển thị form
  };

  // Gọi hàm fetchSpecifications khi component mount
  useEffect(() => {
    fetchSpecifications();
  }, []);

  return (
    <div className="flex-1 p-5">
      {/* Wrapper div for the ActionButtons, Pagination, and Dynamic Content */}
      <div className="bg-white p-5 rounded-md shadow-sm border">
        <ActionButtonsSpecification onCreateSpecification={handleCreateSpecification} />
        {showCreateForm && <SpecificationAdd onCreated={fetchSpecifications} />}
        <Pagination onSearch={handleSearch} /> {/* Pass debounced search function */}
        <SpecificationList searchQuery={searchQuery} specifications={specifications} onDeleted={fetchSpecifications} onUpdated={fetchSpecifications} />
      </div>
    </div>
  );
};

export default SpecificationIndex;
