import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/Auth/login";
import { useCart } from "../../components/MasterLayout/Body/context";
import ForgotPasswordModal from "../../components/Auth/forgot-password-form";
import { jwtDecode } from "jwt-decode";
const banner = require("../../assets/LoginBanner.png");
interface FormData {
  username: string;
  password: string;
}
interface JwtPayload {
  exp?: number;
  userId?: string;
  otpVerified?: boolean;
  role?: string;  // Đảm bảo thêm trường role vào đây
}
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { fetchCart } = useCart();
  const handleLogin = async (data: FormData) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", data);
      const { access, refresh } = response.data.result;
  
      // Log ra giá trị của accessToken
      console.log("Access Token:", access);
  
      // Giải mã JWT để lấy thông tin role
      const decodedToken = jwtDecode<JwtPayload>(access);
      console.log("Decoded token:", decodedToken);
  
      const role = decodedToken.role;  // Lấy role từ decoded token
      console.log("Decoded role:", decodedToken.role);
      // Kiểm tra nếu không có accessToken
      if (!access) {
        message.warning("Bạn cần xác thực OTP trước khi đăng nhập.");
        return;
      }
  
      // Lưu token vào localStorage (chỉ để lưu access và refresh token)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
  
      await fetchCart();
      message.success("Đăng nhập thành công!");
  
      // Điều hướng người dùng dựa vào role
      if (role === 'admin') {
        navigate("/service");  // Điều hướng tới /service nếu role là admin
      } else {
        navigate("/home");  // Điều hướng tới /home nếu không phải admin
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.error;
  
      if (errMsg === "Sai mật khẩu" || errMsg === "Không tìm thấy người dùng") {
        setAuthError("Tên đăng nhập hoặc mật khẩu không chính xác");
      } else {
        message.error(errMsg || "Đăng nhập thất bại!");
      }
    }
  };
  // Gửi mã OTP cho quên mật khẩu
  const sendOtp = async (email: string) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      message.success(res.data.message || "Mã OTP đã được gửi tới email của bạn.");
    } catch (error: any) {
      message.error(error.response?.data?.error || "Gửi mã OTP thất bại");
      throw error;
    }
  };

  // Xác thực OTP
  const verifyOtp = async (email: string, otp: string) => {
    try {
      await axios.post("http://localhost:3000/api/auth/verify-forgot-otp", { email, otp });
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
    <div className="h-screen w-screen flex overflow-hidden">
      <div className="md:w-1/2 h-full text-white relative">
      <img
          src={banner}
          alt="Login Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-100">
        <LoginForm
          onSubmit={handleLogin}
          authError={authError}
          onForgotPasswordClick={() => setModalVisible(true)}
        />

        <ForgotPasswordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSendOtp={sendOtp}
          onVerifyOtp={verifyOtp}
        />
      </div>
    </div>
  );
};

export default LoginPage;
