import React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  images: string[];
  price: number;
  discount_percentage: number;
  rating: number;
  description?: string;
  stock?: number;
  brand?: string;
  thumbnail?: string;
}

const TopProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  images,
  price,
  discount_percentage,
  rating,
}) => {
  const originalPrice = Math.round(price / (1 - discount_percentage / 100));

  return (
    <div className="bg-white rounded-md p-1 flex items-center gap-4">
      <img
        src={images[0] || "/fallback-image.jpg"} // Có thể thay bằng ảnh dự phòng
        alt={name}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="flex-1 overflow-hidden">
        <p className="text-gray-500 text-sm mb-1">{category}</p>
        <h3 className="text-lg font-semibold text-gray-800 mb-1 block truncate">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold">{(price*1).toLocaleString('vi-VN')} đ</span>
          {discount_percentage > 0 && (
            <span className="text-gray-400 line-through">{originalPrice.toLocaleString('vi-VN')} đ</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProductCard;
