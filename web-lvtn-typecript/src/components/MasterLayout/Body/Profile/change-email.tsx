import React, { useState } from 'react';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';
import { message } from 'antd';

interface EmailChangeFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  isEditingEmail: boolean;
  setIsEditingEmail: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string | null;
}

const EmailChangeForm: React.FC<EmailChangeFormProps> = ({ email, setEmail, isEditingEmail, setIsEditingEmail, userId }) => {
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

const handleSendOtp = async () => {
  setLoading(true);
  setErrorMessage('');

  try {
    // Kiểm tra xem email mới có tồn tại trong hệ thống không
    const emailCheckResponse = await axiosInstanceL.post(`/api/users/check-email`, { email: newEmail });

    // Nếu email đã tồn tại, hiển thị lỗi và dừng quá trình gửi OTP
    if (emailCheckResponse.data.exists) {
      setErrorMessage('Email này đã tồn tại trong hệ thống');
      setLoading(false);
      return;
    }

    // Nếu email không tồn tại, tiếp tục gửi OTP
    console.log(`Sending OTP for new email: ${newEmail}`);
    const response = await axiosInstanceL.put(`/api/users/${userId}/change-email`, { new_email: newEmail });
    setIsOtpSent(true);
    message.success(response.data.message);
  } catch (error) {
    setErrorMessage('Đã có lỗi khi gửi mã OTP. Vui lòng thử lại!');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const handleVerifyOtp = async () => {
  setLoading(true);
  setErrorMessage('');

  try {
    console.log(`Verifying OTP for new email: ${newEmail}`);  // Log newEmail

    // Gửi OTP và email mới tới API để xác thực thay đổi email
    const response = await axiosInstanceL.put(`/api/users/${userId}/verify-email-change`, { otp, new_email: newEmail });

    // Kiểm tra phản hồi từ backend
    if (response.data && response.data.message) {
      setEmail(newEmail);  // Cập nhật email mới cho frontend
      setIsEditingEmail(false);  // Đóng chế độ chỉnh sửa email
      message.success(response.data.message);  // Hiển thị thông báo thành công từ backend
    } else {
      setErrorMessage('Mã OTP không hợp lệ hoặc đã hết hạn');
    }
  } catch (error) {
    setErrorMessage('Mã OTP không hợp lệ hoặc đã hết hạn');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      {isEditingEmail ? (
        <div>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Nhập email mới"
          />
          <button
            onClick={handleSendOtp}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md"
            disabled={loading}
          >
            {loading ? 'Đang gửi OTP...' : 'Gửi OTP'}
          </button>
          {isOtpSent && (
            <div>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleVerifyOtp}
                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-md"
                disabled={loading}
              >
                {loading ? 'Đang xác thực OTP...' : 'Xác thực OTP'}
              </button>
            </div>
          )}
        </div>
      ) : null}

      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
    </div>
  );
};

export default EmailChangeForm;
