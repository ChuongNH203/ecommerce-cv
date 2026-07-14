import React, { useState, useRef, useCallback } from 'react';
import ProductList from './product-list';
import Pagination from './pagination';
import ActionButtonsProduct from './action-buttons';
import ProductAdd from './product-add';
import { debounce } from 'lodash';

const ProductIndex = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const productListRef = useRef<{ fetchProducts: () => void }>(null);

  const handleToggleCreateForm = () => {
    setShowCreateForm(prev => !prev);
  };

  const handleProductAdded = () => {
    setShowCreateForm(false);  // Đóng form sau khi thêm
    productListRef.current?.fetchProducts();  // Gọi lại danh sách sản phẩm
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);  // Cập nhật giá trị tìm kiếm
  };

  // Dùng lodash debounce để trì hoãn việc gọi API
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      productListRef.current?.fetchProducts(); // Gọi API với giá trị tìm kiếm đã debounce
    }, 200), // 1 giây debounce
    []
  );

  React.useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery); // Gọi hàm debounce khi searchQuery thay đổi
    }
  }, [searchQuery, debouncedSearch]);

  return (
    <div className="flex-1 p-5">
      <div className="bg-white p-5 rounded-md shadow-sm border">
        <ActionButtonsProduct onToggleCreateForm={handleToggleCreateForm} />
        {showCreateForm && <ProductAdd onProductAdded={handleProductAdded} />}
        <Pagination onSearch={handleSearch} />  {/* Truyền hàm tìm kiếm */}
        <ProductList ref={productListRef} searchQuery={searchQuery} />  {/* Truyền giá trị tìm kiếm */}
      </div>
    </div>
  );
};

export default ProductIndex;
