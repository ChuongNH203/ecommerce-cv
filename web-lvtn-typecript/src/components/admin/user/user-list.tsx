import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import UserRow from './user-row';
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  is_valid_email: boolean;
}

interface UserListProps {
  searchQuery: string;
  users: User[]; 
  onDeleted: () => void; 
}

const UserList: React.FC<UserListProps> = ({ searchQuery, users, onDeleted }) => {
  // Hàm kích hoạt tài khoản
  const handleActivateUser = async (userId: number) => {
    try {
      const response = await axiosInstanceL.put(`/api/users/activate/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.data.success) {
        onDeleted();  // Cập nhật lại danh sách người dùng sau khi thay đổi trạng thái
      } else {
        message.error('Kích hoạt tài khoản thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi kích hoạt tài khoản!');
      console.error('Lỗi khi kích hoạt tài khoản:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone_number.includes(searchQuery)
  );

  // Hàm xóa người dùng
  const handleDeleteUser = async (userId: number) => {
      const user = users.find(u => u.id === userId); // Tìm người dùng theo ID

  // Kiểm tra nếu người dùng đã xác thực email
  if (user?.is_valid_email) {
    const confirmDelete = window.confirm(
      'Người dùng này đã xác thực email, bạn có chắc chắn muốn xóa?'
    );
    if (!confirmDelete) {
      return;
    }
  }
    try {
      await axiosInstanceL.delete(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      message.success('Người dùng đã được xóa thành công!');
      onDeleted();  
    } catch (error) {
      message.error('Xóa người dùng này đang có đơn hàng!');
    }
  };
  const handleDeactivateUser = async (userId: number) => {
    try {
      const response = await axiosInstanceL.put(`/api/users/deactivate/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.data.success) {
        onDeleted();  // Cập nhật lại danh sách người dùng sau khi thay đổi trạng thái
      } else {
        message.error('Ngừng kích hoạt tài khoản thất bại!');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi ngừng kích hoạt tài khoản!');
    }
  };
  return (
    <div className="mt-4 border border-zinc-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm text-left text-gray-700">
          <thead>
            <tr>
              <th className="p-3 text-center">ID</th>
              <th className="p-3">Tên người dùng</th>
              <th className="p-3">Email</th>
              <th className="p-3">Số điện thoại</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Xác thực</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <UserRow 
                key={user.id} 
                user={user} 
                onDelete={handleDeleteUser} 
                onActivate={handleActivateUser}  
                onDeactivate={handleDeactivateUser} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
