import React, { useState } from 'react';

interface PaginationProps {
  onSearch: (query: string) => void;  // Thêm kiểu cho onSearch
}

const Pagination: React.FC<PaginationProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);  // Cập nhật giá trị tìm kiếm
    onSearch(query); // Gọi onSearch khi người dùng nhập tìm kiếm
  };

  return (
    <div className="flex justify-end items-center pt-4">


      {/* Phần Tìm kiếm và phân trang */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md p-2">
          <label htmlFor="search" className="text-sm text-neutral-800 mr-2">Tìm kiếm:</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Nhập id phân loại sản phẩm"
            className="bg-transparent outline-none text-sm text-neutral-800 w-60"
          />
        </div>

      </div>
    </div>
  );
};

export default Pagination;
