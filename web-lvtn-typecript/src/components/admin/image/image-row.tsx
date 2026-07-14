import React from 'react';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface Image {
  id: number;
  product_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface ImageRowProps {
  image: Image;
  isChecked: boolean;
  onCheckboxChange: (id: number) => void;
  onDeleted?: () => void; // Callback function to trigger refetch of the images
}

const ImageRow: React.FC<ImageRowProps> = ({
  image,
  isChecked,
  onCheckboxChange,
  onDeleted
}) => {
  const handleDelete = async () => {
    try {
      // Thực hiện xóa hình ảnh
      await axiosInstanceL.delete('/api/product/delete-image', {
        data: {
          productId: image.product_id,
          imageUrl: image.image_url
        }
      });
      alert('Đã xóa hình ảnh!');
      
      // Gọi callback onDeleted để fetch lại danh sách hình ảnh sau khi xóa
      onDeleted?.();
    } catch (error) {
      console.error('Lỗi xóa hình ảnh:', error);
      alert('Xóa thất bại');
    }
  };

  return (
    <tr className="text-sm text-gray-700 border-b border-gray-200 hover:bg-gray-50 transition-all">
      <td className="text-center py-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onCheckboxChange(image.id)}
          className="w-4 h-4 accent-blue-500"
        />
      </td>
      <td className="py-3 px-2">{image.id}</td>
      <td className="py-3 px-2">{image.product_id}</td>
      <td className="py-3 px-2">
        <div className="flex justify-start">
          <img
            src={`http://localhost:3000${image.image_url}`}
            alt={`Product ${image.product_id}`}
            className="w-20 h-20 object-cover rounded shadow-md border"
          />
        </div>
      </td>

      <td className="py-3 px-2">
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
          >
            Xóa
          </button>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-medium px-3 py-1.5 rounded shadow"
          >
            Sửa
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ImageRow;
