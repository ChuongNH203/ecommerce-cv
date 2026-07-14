import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import ResetPasswordForm from "../../components/Auth/reset-password-form";
import axiosInstanceL from "../../api/api-login/axiosInstance-login";
const banner = require("../../assets/LoginBanner.png");

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail") || "";
    setEmail(storedEmail);
  }, []);

  const handleResetPassword = async (newPassword: string) => {
    if (!email) {
      message.error("Không tìm thấy email để đặt lại mật khẩu");
      return;
    }
    try {
      await axiosInstanceL.post("/api/auth/reset-password", {
        email,
        newPassword,
      });
      message.success("Đổi mật khẩu thành công!");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (error: any) {
      message.error(error.response?.data?.error || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <div className="md:w-1/2 h-full text-white relative">
        <img
          src={banner}
          alt="Reset Password Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-100">
        <ResetPasswordForm email={email} onSubmit={handleResetPassword} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
