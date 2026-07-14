import React from 'react';
import { Link } from 'react-router-dom';

const CollectionCard: React.FC<{ title: string, link: string, image: string }> = ({ title, link, image }) => (
  <div className="relative w-full h-80 overflow-hidden  group">
    {/* Chéo đỏ nền */}
    <div className="absolute top-0 left-0 w-full h-full bg-red-600 bg-opacity-90 transform rotate-[40deg] origin-top-left z-10"></div>

    {/* Hình ảnh */}
    <img 
      src={image} 
      alt={`${title} Collection`} 
      className="w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-110"
    />

    {/* Nội dung */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20">
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <div className="text-lg font-semibold flex items-center justify-center">
        <Link to={link} className="flex items-center justify-center">
          Mua ngay <span className="ml-2">→</span>
        </Link>
      </div>
    </div>

    {/* Liên kết */}
    <Link to={link} className="absolute top-0 left-0 w-full h-full"></Link>
  </div>
);

export default CollectionCard;