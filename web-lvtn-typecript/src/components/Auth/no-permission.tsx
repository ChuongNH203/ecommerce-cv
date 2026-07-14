// src/components/NoPermission.tsx

import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NoPermission: React.FC = () => {
  const navigate = useNavigate();

  // Chuyển hướng về trang home khi người dùng nhấn nút
  const goHome = () => {
    navigate("/home");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center p-5 bg-red-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-red-600">Bạn không có quyền truy cập vào trang này!</h2>
        <p className="mt-4 text-lg">Đây là khu vực chỉ dành cho admin. Vui lòng liên hệ với quản trị viên.</p>
        <Button className="mt-6" onClick={goHome} type="primary">
          Quay lại trang chính
        </Button>
      </div>
    </div>
  );
};

export default NoPermission;
