import React from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axiosInstanceL from '../../api/api-login/axiosInstance-login';
import RegisterVerifyForm from '../../components/Auth/RegisterForm'; // Đã không còn export type RegisterFormValues
const banner = require("../../assets/LoginBanner.png");

const RegisterVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = React.useState(false);

  const handleSendOtp = async (data: {
    username: string;
    fullname: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await axiosInstanceL.post("/api/auth/register", {
        username: data.username,
        full_name: data.fullname,
        email: data.email,
        password: data.password,
      });

      const accessToken = response.data?.result?.access;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        setOtpSent(true);
        message.success("Đăng ký thành công! Vui lòng nhập mã OTP.");
      } else {
        message.warning("Đăng ký thành công nhưng không nhận được token.");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Đăng ký thất bại!";
      message.error(errMsg);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await axiosInstanceL.post("/api/auth/verify-otp", {
        otp: data.otp,
      });
      message.success("Xác minh thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Xác minh OTP thất bại, vui lòng thử lại.";
      message.error(errMsg);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <div className="md:w-1/2 h-full text-white relative">
        <img
          src={banner}
          alt="Login Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-100">
        <RegisterVerifyForm
          otpSent={otpSent}
          onSendOtp={handleSendOtp}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RegisterVerifyPage;
