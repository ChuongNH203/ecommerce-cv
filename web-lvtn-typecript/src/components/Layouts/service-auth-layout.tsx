import React from 'react';
import { Outlet } from 'react-router-dom'; // Sử dụng Outlet để render các component con

const ServiceAuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Render các trang con */}
        <Outlet />
      </div>
    </div>
  );
};

export default ServiceAuthLayout;
