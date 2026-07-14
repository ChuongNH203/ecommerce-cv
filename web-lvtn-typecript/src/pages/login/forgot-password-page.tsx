// pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import { message } from "antd";
import ForgotPasswordModal from "../../components/Auth/forgot-password-form";
import axiosInstanceL from "../../api/api-login/axiosInstance-login";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (email: string) => {
    try {
      const res = await axiosInstanceL.post("/api/auth/forgot-password", { email });
      message.success(res.data.message || "Mã OTP đã được gửi tới email của bạn.");
    } catch (error: any) {
      message.error(error.response?.data?.error || "Gửi mã OTP thất bại");
      throw error; // để modal biết lỗi, dừng bước
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
      console.log("➡️ VERIFY OTP - Sending data:", { email, otp });
    try {
      // Gọi API xác thực OTP riêng (nếu có)
      await axiosInstanceL.post("/api/auth/verify-forgot-otp", { email, otp });

      message.success("Xác thực OTP thành công. Mời bạn đổi mật khẩu.");
      localStorage.setItem("resetEmail", email);
      setModalVisible(false);
      navigate("/reset-password");
    } catch (error: any) {
      message.error(error.response?.data?.error || "Mã OTP không hợp lệ hoặc đã hết hạn");
      throw error;
    }
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => setModalVisible(true)}
      >
        Quên mật khẩu
      </button>

      <ForgotPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSendOtp={sendOtp}
        onVerifyOtp={verifyOtp}
      />
    </>
  );
};

export default ForgotPasswordPage;
