import React, { useState } from 'react';
import axiosInstanceL from "../../../../api/api-login/axiosInstance-login";
import { message } from "antd";

const PasswordChangeForm: React.FC<{ userId: string, setUserData: React.Dispatch<React.SetStateAction<any>> }> = ({ userId, setUserData }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    setLoading(true);
    setErrorMessage('');

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp hay không
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp');
      setLoading(false);
      return;
    }

    // Gửi dữ liệu thay đổi mật khẩu
    const data = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword  // Bạn có thể thêm trường này nếu cần.
    };

    try {
      const response = await axiosInstanceL.put(`/api/users/${userId}/change-password`, data);
      message.success('Đổi mật khẩu thành công!');
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage('Đã có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-3xl font-semibold text-gray-700">Đổi mật khẩu</div>

      {errorMessage && (
        <div className="bg-red-100 text-red-500 p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">Mật khẩu cũ</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Nhập mật khẩu cũ"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Xác nhận mật khẩu mới"
          />
        </div>
      </div>

      <div className="flex justify-start mt-6">
        <button
          onClick={handlePasswordChange}
          className="bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </button>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
