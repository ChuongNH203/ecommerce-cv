import React, { useState, useMemo } from 'react';
import { message } from 'antd';
import ImageRow from './image-row';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface Image {
  id: number;
  product_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface ImageListProps {
  searchQuery: string;
  images: Image[]; // Nhận images từ props
  onDeleted: () => void; // Callback khi xóa thành công
}

const ImageList: React.FC<ImageListProps> = ({ searchQuery, images, onDeleted }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Lọc danh sách hình ảnh theo searchQuery
  const filteredImages = useMemo(() => {
    return images.filter(image =>
      image.product_id.toString().includes(searchQuery)
    );
  }, [images, searchQuery]);

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setSelectedIds(newState ? filteredImages.map(img => img.id) : []);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa các ảnh đã chọn?')) return;

    try {
      for (const id of selectedIds) {
        const image = images.find(img => img.id === id);
        if (image) {
          await axiosInstanceL.delete('/api/product/delete-image', {
            data: {
              productId: image.product_id,
              imageUrl: image.image_url,
            },
          });
        }
      }

      // Gọi lại fetchImages để cập nhật lại danh sách hình ảnh
      onDeleted();

      message.success('Xóa hình ảnh thành công!');
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Lỗi khi xóa nhiều ảnh:', error);
      message.error('Xóa thất bại!');
    }
  };

  return (
    <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 transition"
          >
            Xóa ảnh đã chọn
          </button>
          <span className="text-sm text-gray-700">
            {selectedIds.length} ảnh được chọn
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 font-semibold">
              <tr>
                <th className="p-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-blue-500"
                  />
                </th>
                <th className="p-3">Mã hình ảnh</th>
                <th className="p-3">Mã sản phẩm</th>
                <th className="p-3">Ảnh</th>
                <th className="p-3">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredImages.map((image) => (
                <ImageRow
                  key={image.id}
                  image={image}
                  isChecked={selectedIds.includes(image.id)}
                  onCheckboxChange={handleCheckboxChange}
                  onDeleted={onDeleted}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ImageList;
