import React from 'react';
import { message } from 'antd';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';  // Đảm bảo import axiosInstanceL đúng

interface UserRowProps {
  user: any;
  onDelete: (userId: number) => void; 
  onActivate: (userId: number) => void; 
  onDeactivate: (userId: number) => void; 
}

const UserRow: React.FC<UserRowProps> = ({ user, onDelete, onActivate, onDeactivate }) => {
  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      onDelete(user.id);  // Gọi hàm xóa
    }
  };

  const handleActivate = () => {
    if (window.confirm('Bạn có chắc muốn kích hoạt người dùng này?')) {
      onActivate(user.id);  // Gọi hàm xóa
    }
  };
  const handleDeactivate = () => {
    if (window.confirm('Bạn có chắc muốn khóa người dùng này?')) {
      onDeactivate(user.id);  // Gọi hàm xóa
    }
  };

  return (
    <tr className="text-sm text-gray-700 border-b border-gray-200 hover:bg-gray-50 transition-all">
      <td className="text-center py-3">{user.id}</td>
      <td className="py-3 px-2">{user.full_name}</td>
      <td className="py-3 px-2">{user.email}</td>
      <td className="py-3 px-2">{user.phone_number}</td>
      <td className={`py-3 px-2 ${user.is_active ? 'text-green-500' : 'text-red-500'}`}>
        {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
      </td>
      <td className={`py-3 px-2 ${user.is_valid_email ? 'text-green-500' : 'text-red-500'}`}>
        {user.is_valid_email ? 'Đã xác thực' : 'Chưa xác thực'}
      </td>
      <td className="py-3 px-2">{user.role}</td>
      <td className="py-3 px-2">
        <div className="flex gap-2 justify-center">
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded shadow">
            Xóa
          </button>

          {!user.is_active ? (
            <button onClick={handleActivate} className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded shadow">
              Kích hoạt
            </button>
          ) : (
            <button onClick={handleDeactivate} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium px-3 py-1.5 rounded shadow">
              Khóa tài khoản
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
