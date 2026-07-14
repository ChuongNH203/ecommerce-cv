import React, { useState } from 'react';
import Pagination from './pagination';
import OrderList from './order-list';
import ActionButtonsOrder from './action-buttons';

const OrderIndex = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);  // Cập nhật giá trị tìm kiếm
  };

  return (
    <div className="flex-1 p-5">
      <div className="bg-white p-5 rounded-md shadow-sm border">
        <ActionButtonsOrder />
        <Pagination onSearch={handleSearch} />  {/* Truyền hàm tìm kiếm */}
        <OrderList searchQuery={searchQuery} />  {/* Truyền giá trị tìm kiếm */}
      </div>
    </div>
  );
};

export default OrderIndex;
