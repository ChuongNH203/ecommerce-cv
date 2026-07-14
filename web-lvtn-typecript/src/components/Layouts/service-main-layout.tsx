import React, { ReactNode, useState, useEffect } from 'react';
import Sidebar from '../admin/sidebar'; // Sidebar chỉ nên được render ở đây
import Navbar from '../admin/navbar'; // Navbar sẽ hiển thị tiêu đề
import Header from '../admin/header';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // Import Outlet để render children tương ứng với route

interface ServiceMainLayoutProps {
  children?: ReactNode;
}

const ServiceMainLayout: React.FC<ServiceMainLayoutProps> = () => {
  const [title, setTitle] = useState('Danh Sách Đơn Hàng'); // Tiêu đề mặc định
  const [activeSection, setActiveSection] = useState(''); // Section mặc định là "Products"
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra xem trang hiện tại có phải là /service không
    if (location.pathname === '/service') {
      navigate('/service/orders'); // Điều hướng sang /service/orders
    }
  }, [location, navigate]); // Chạy khi location thay đổi

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar
          setTitle={setTitle}
          setActiveSection={setActiveSection}
          activeSection={activeSection}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />
        <div className="overflow-y-auto bg-gray-100">
          <Header title={title} />
        </div>
        {/* Content area cuộn được */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="p-4">
            {/* Render children tự động dựa trên route hiện tại */}
            <Outlet /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMainLayout;
