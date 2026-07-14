import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
  userId?: string;
  otpVerified?: boolean;
  role?: string; // Thêm trường role vào payload
}

interface PrivateRouteProps {
  children: React.ReactNode;
  roleRequired?: string; // Thêm tham số roleRequired để kiểm tra phân quyền
}

const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return false;
    const currentTime = Date.now() / 1000; // Giây
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roleRequired }) => {
  const token = localStorage.getItem('accessToken');

  if (!token || !isTokenValid(token)) {
    // Nếu không có token hoặc token hết hạn thì chuyển về /login
    return <Navigate to="/login" replace />;
  }
  const decodedToken: JwtPayload = jwtDecode(token);  // Giải mã token
  console.log("Decoded token:", decodedToken);  // Log toàn bộ token đã giải mã
  const role = decodedToken.role;  // Lấy role từ decoded token
  console.log("Decoded role:", role);  // Kiểm tra giá trị role
  
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/no-permission" replace />;  // Nếu không phải admin, hiển thị thông báo không có quyền
  }

  return <>{children}</>;
};

export default PrivateRoute;
