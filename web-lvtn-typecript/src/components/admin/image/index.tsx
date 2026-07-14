import React, { useState, useEffect } from 'react';
import Pagination from './pagination';
import ImageList from './image-list';
import { debounce } from 'lodash';
import ImageAdd from './image-add';
import ActionButtonsImage from './action-buttons';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface Image {
  id: number;
  product_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

const ImageIndex = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Dữ liệu tìm kiếm
  const [showCreateForm, setShowCreateForm] = useState(false); // Hiển thị form tạo ảnh mới
  const [images, setImages] = useState<Image[]>([]); // Lưu trữ hình ảnh

  // Hàm fetch lại danh sách hình ảnh
  const fetchImages = async () => {
    try {
      const res = await axiosInstanceL.get('/api/product/images');
      setImages(res.data.data || []); // Lưu tất cả hình ảnh vào state
    } catch (error) {
      console.error('Lỗi khi tải danh sách hình ảnh:', error);
    }
  };

  // Hàm tìm kiếm với debounce
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query); // Cập nhật query tìm kiếm
  }, 1000);

  // Hàm toggle hiển thị form thêm sản phẩm
  const handleCreateProduct = () => {
    setShowCreateForm((prev) => !prev); // Chuyển đổi trạng thái hiển thị form
  };

  // Gọi hàm fetchImages khi component được mount hoặc sau khi thêm sản phẩm
  useEffect(() => {
    fetchImages(); // Gọi fetchImages để lấy danh sách hình ảnh
  }, []); // Chỉ gọi 1 lần khi component mount lần đầu tiên

  return (
    <div className="flex-1 p-5">
      <div className="bg-white p-5 rounded-md shadow-sm border">
        <ActionButtonsImage onCreateProduct={handleCreateProduct} />
        {showCreateForm && <ImageAdd onCreated={fetchImages} />} {/* Hiển thị form nếu cần */}
        <Pagination onSearch={handleSearch} />
        {/* Truyền images từ state và onDeleted vào ImageList */}
        <ImageList searchQuery={searchQuery} images={images} onDeleted={fetchImages} />
      </div>
    </div>
  );
};

export default ImageIndex;
