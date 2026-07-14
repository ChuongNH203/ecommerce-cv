import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEye, FaSignOutAlt, FaUser } from 'react-icons/fa'; // Import các biểu tượng
import { MdOutlineWavingHand } from "react-icons/md";
import axiosInstanceL from '../../../api/api-login/axiosInstance-login';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = "http://localhost:3000";

const TopInformationBar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [userData, setUserData] = useState<{ full_name: string; avatar: string; role: string }>({ full_name: '', avatar: '', role: '' });
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decoded: any = jwtDecode(accessToken);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp > now) {
          setIsLoggedIn(true);
          // fetch user info như bạn đang làm
          const userId = decoded.userId;

          axiosInstanceL.get(`/api/users/${userId}`).then((response) => {
            setUserData({
              full_name: response.data.full_name,
              avatar: response.data.avatar || '',
              role: response.data.role || '',
            });
          });
        }
      } catch (error) {
        console.error('Invalid token');
      }
    }
  }, []);
  return (
    <div className="flex justify-between items-center px-8 py-2 bg-gray-900 text-white">
      <div className="flex gap-8">
        <span className="text-xs">+84-387118144</span>
        <span className="text-xs">nguyenhoangchuong7506@gmail.com</span>
        <span className="text-xs">1734 Stonecoal Road</span>
      </div>
      <div className="flex gap-5 text-xs cursor-pointer relative">
        {isLoggedIn ? (
          // Đã đăng nhập
          <div className="flex items-center gap-2">
            {userData.avatar ? (
              <img
                src={`${BASE_URL}${userData.avatar}`}
                alt="avatar"
                className="w-8 h-8 bg-gray-300 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
            )}
            <span className="text-white" onMouseEnter={handleMouseEnter}>
              {userData.full_name || 'Người dùng'}
            </span>
          </div>
        ) : (
          // Chưa đăng nhập
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
            <FaUser />
            </div>
            <span className="text-white">Đăng nhập</span>
          </div>
        )}

        {/* Dropdown chỉ khi đã đăng nhập */}
        {isLoggedIn && isHovered && (
          <div
            className="absolute bg-white text-black shadow-lg rounded-md mt-6 right-0 w-64 z-20"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/account">
              <div className="flex items-center gap-2 p-3 text-sm cursor-pointer">
                <div className="w-8 h-8 bg-gray-300 rounded-full">
                  <MdOutlineWavingHand className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm">Xin chào, {userData.full_name || 'Người dùng'}</div>
              </div>
            </Link>

            <div className="p-2 text-sm border-t">
              <Link to="/account/order">
                <div className="flex items-center gap-2 mb-2 cursor-pointer">
                  <FaShoppingCart /> <span>Đơn hàng của tôi</span>
                </div>
              </Link>
            </div>

            {/* Hiển thị nút chuyển tới /service nếu là admin */}
            {userData.role === 'admin' && (
              <div className="p-2 text-sm border-t">
                <Link to="/service">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser /> <span>Quản lý dịch vụ</span>
                  </div>
                </Link>
              </div>
            )}

            <div className="p-2 text-sm border-t">
              <div className="flex items-center gap-2" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Đăng xuất</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopInformationBar;
