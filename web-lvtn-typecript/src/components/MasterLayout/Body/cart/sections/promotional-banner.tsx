import React from 'react';
import { Link } from 'react-router-dom';

export const PromotionalBanner: React.FC = () => {
  return (
    <div className="p-3 bg-orange-50 border-b border-orange-200 flex justify-between items-center">
      <span className="flex items-center text-red-500 text-xs">
        <svg className="w-4 h-4 mr-1 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm.82 15H11.18c-.377 0-.683-.306-.683-.683s.306-.683.683-.683h1.64c.377 0 .683.306.683.683s-.306.683-.683.683zm.18-3.5a1.5 1.5 0 100-3h-1c-.552 0-1-.448-1-1s.448-1 1-1h1.5a2.5 2.5 0 000-5h-2a.5.5 0 010-1h2.5a.5.5 0 01.5.5v1c0 .552-.448 1-1 1h-1.5a1.5 1.5 0 000 3h1c.552 0 1 .448 1 1s-.448 1-1 1h-1.5a.5.5 0 010 1h2a.5.5 0 01.5-.5v-1z"/>
        </svg>
        Mua tối thiểu ₫160.000 để nhận quà
      </span>
      <Link to="/product" className="text-red-500 text-sm hover:underline">
        Thêm &gt;
      </Link>
    </div>
  );
};