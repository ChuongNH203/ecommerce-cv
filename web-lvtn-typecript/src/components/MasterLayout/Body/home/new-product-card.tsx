import React from 'react';
import { HeartOutlined, DiffOutlined, EyeOutlined } from '@ant-design/icons';

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  images: string[];
  price: number;
  discount_percentage: number | string;
  rating: number;
  description?: string;
  stock?: number;
  brand?: string;
  thumbnail?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  images,
  price,
  discount_percentage,
  rating,
}) => {
  const discount = typeof discount_percentage === 'number' ? discount_percentage : parseFloat(discount_percentage as string);
  const originalPrice = Math.round(price / (1 - discount / 100));

  return (
    <div className="relative w-full max-w-xs bg-white border overflow-hidden mx-auto group hover:border-red-900 transition-shadow duration-300">
      {discount_percentage !== undefined && discount_percentage !== null && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 my-1 mx-1 origin-top-left z-10">
          -{discount.toFixed(2)}%
        </div>
      )}

      <img src={images[0]} alt={name} className="w-full h-64 object-cover" />

      <div className="p-4 flex flex-col justify-start items-center space-y-2">
        <div className="text-sm text-gray-500">{category}</div>

        <h3 className="text-lg font-semibold my-2 overflow-hidden text-ellipsis whitespace-nowrap text-center w-full">
          {name}
        </h3>

        <div className="flex gap-x-4 items-center w-full justify-center">
          <div className="text-xl font-bold text-red-600">
            {(price*1).toLocaleString('vi-VN')} đ
          </div>
          <div className="text-sm line-through text-gray-400">
            {originalPrice.toLocaleString('vi-VN')} đ
          </div>
        </div>

        <div className="my-2 w-full flex items-center justify-center relative">
          {Array.from({ length: Math.floor(rating) }, (_, i) => (
            <span key={i} className="text-red-500 text-xl">★</span>
          ))}
          {rating % 1 >= 0.5 && (
            <span className="text-red-500 text-xl">⯪</span> 
          )}
          {Array.from(
            { length: 5 - Math.ceil(rating) },
            (_, i) => (
              <span key={i + 5} className="text-gray-300 text-xl">★</span>
            )
          )}
          <div className="absolute bottom-0 left-0 w-full border-b border-gray-300 z-0"></div>
        </div>

        <div className="flex gap-4 text-lg h-full text-gray-600 pb-7 pt-1">
          <HeartOutlined className="cursor-pointer hover:text-red-600" />
          <DiffOutlined className="cursor-pointer hover:text-blue-600" />
          <EyeOutlined className="cursor-pointer hover:text-green-600" />
        </div>
      </div>


    </div>
  );
};

export default ProductCard;
