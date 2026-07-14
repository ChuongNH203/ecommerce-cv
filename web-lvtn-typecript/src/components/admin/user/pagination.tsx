import React from 'react';

// Định nghĩa kiểu cho props của Pagination
interface PaginationProps {
  onSearch: (query: string) => void;  // onSearch nhận giá trị kiểu string
}

const Pagination: React.FC<PaginationProps> = ({ onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);  // Gọi hàm onSearch khi thay đổi giá trị tìm kiếm
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
            placeholder="Nhập tên sản phẩm"
            className="bg-transparent outline-none text-sm text-neutral-800"
            onChange={handleSearchChange}  // Đặt sự kiện thay đổi để gọi onSearch
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
