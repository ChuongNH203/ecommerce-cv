import React from 'react';

interface PaginationProps {
  onSearch: (query: string) => void;  // Thêm kiểu cho onSearch
}

const Pagination: React.FC<PaginationProps> = ({ onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);  // Gọi onSearch khi người dùng nhập tìm kiếm
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
            placeholder="Nhập id sản phẩm"
            className="bg-transparent outline-none text-sm text-neutral-800"
            onChange={handleSearchChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
