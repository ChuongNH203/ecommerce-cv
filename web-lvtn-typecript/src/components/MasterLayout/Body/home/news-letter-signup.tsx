import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstanceL from '../../../../api/api-login/axiosInstance-login';  // Đảm bảo đúng đường dẫn

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // Trạng thái email
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Thông báo thành công

  // Hàm xử lý thay đổi email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Hàm kiểm tra tính hợp lệ của email
  const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);  // Kiểm tra email với regex
  };

  // Hàm gửi email đăng ký
  const handleSubscribe = async () => {
    if (!email) {
      setError('Vui lòng nhập email của bạn');
      return;
    }

    if (!validateEmail(email)) {  // Kiểm tra tính hợp lệ của email
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    setIsLoading(true); // Bắt đầu loading
    setError(null); // Reset lỗi trước khi gửi

    try {
      // Gửi yêu cầu đăng ký tới API backend
      const response = await axiosInstanceL.post('/api/newsletter/subscribe', { email });

      if (response.data) {
        setSuccessMessage('Đăng ký nhận bản tin thành công!');
        setEmail(''); // Reset email sau khi đăng ký thành công
      }
    } catch (err) {
      setError('Đã xảy ra lỗi, vui lòng thử lại!');
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="bg-white pt-0">
      <div className="container mx-auto flex flex-col items-center text-center p-10 border-t-4 border-b-2 border-red-600">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-semibold mb-4">
          Đăng ký <span className="text-red-600">NEWSLETTER</span>
        </h2>

        {/* Form đăng ký */}
        <div className="flex justify-center items-center space-x-4">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="w-80 px-4 py-2 border rounded-full"
            value={email}
            onChange={handleEmailChange} // Xử lý thay đổi email
          />
          <button
            className="bg-red-600 text-white rounded-full px-6 py-2 text-center"
            onClick={handleSubscribe}
            disabled={isLoading} // Vô hiệu hóa khi đang gửi yêu cầu
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </div>

        {/* Thông báo lỗi hoặc thành công */}
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}

        {/* Các icon mạng xã hội */}
        <div className="flex space-x-6 mt-6">
          <a href="https://www.facebook.com/chuoghn" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
            <Facebook className="w-7 h-7" />
          </a>
          <Link to="#" className="text-gray-600 hover:text-gray-800">
            <Twitter className="w-7 h-7" />
          </Link>
          <Link to="#" className="text-gray-600 hover:text-gray-800">
            <Instagram className="w-7 h-7" />
          </Link>
          <Link to="#" className="text-gray-600 hover:text-gray-800">
            <Youtube className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
