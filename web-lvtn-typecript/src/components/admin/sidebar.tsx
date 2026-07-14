import React, { useEffect, useState } from 'react';
import {
  FaShoppingCart,
  FaTachometerAlt,
  FaClipboardList,
  FaBoxOpen,
  FaTruck,
  FaTags,
  FaSlidersH,
  FaUser,
  FaImage,
  FaDiscord,
  FaDiscourse,
  FaTicketAlt,
  FaChartBar,
  FaRing,
  FaPaperclip,
  FaPaperPlane,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstanceL from '../../api/api-login/axiosInstance-login';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = "http://localhost:3000";

interface SidebarProps {
  setTitle: (title: string) => void;
  setActiveSection: (section: string) => void;
  activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setTitle, setActiveSection, activeSection }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [userData, setUserData] = useState<{ full_name: string; avatar: string }>({
    full_name: '',
    avatar: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          // Giải mã token và lấy userId
          const decodedToken: any = jwtDecode(accessToken);
          const userId = decodedToken.userId;

          // Gọi API để lấy thông tin người dùng
          const response = await axiosInstanceL.get(`/api/users/${userId}`);
          setUserData({
            full_name: response.data.full_name,
            avatar: response.data.avatar || '', // Nếu không có avatar, để trống
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Dynamically set active section based on the current URL
    const path = location.pathname;
    if (path.includes('orders')) {
      setActiveSection('Orders');
      setTitle('Danh Sách Đơn Hàng');
    } else if (path.includes('product')) {
      setActiveSection('Products');
      setTitle('Danh Sách Sản Phẩm');
    } else if (path.includes('images')) {
      setActiveSection('Images');
      setTitle('Danh Sách Hình Ảnh');
    } else if (path.includes('variants')) {
      setActiveSection('Variants');
      setTitle('Danh Sách Phân Loại');
    } else if (path.includes('specifications')) {
      setActiveSection('Specifications');
      setTitle('Danh Sách Thông Số Kỹ Thuật');
    } else if (path.includes('users')) {
      setActiveSection('Users');
      setTitle('Danh Sách Người Dùng');
    } else if (path.includes('vouchers')) {
      setActiveSection('Vouchers');
      setTitle('Danh Sách Mã Khuyến Mãi');
    }
  }, [location, setActiveSection, setTitle]);

  const handleNavigation = (path: string, newTitle: string, section: string) => {
    setTitle(newTitle);
    setActiveSection(section);
    navigate(path);
  };

  const getButtonClass = (sectionKey: string) => {
    return `flex items-center gap-2 p-3 rounded-md font-medium transition-all duration-200 ${
      activeSection === sectionKey
        ? 'bg-blue-200 text-indigo-950 font-bold'
        : 'text-white hover:bg-blue-100 hover:text-indigo-950'
    }`;
  };

  return (
    <div className="w-64 min-h-screen bg-indigo-950 text-white overflow-auto border-r-4 border-black p-4 flex flex-col">
      <div className="flex flex-col items-center gap-2">
        <img className="w-16 h-16 rounded-full border-2 border-white" src={`${BASE_URL}${userData.avatar}`} alt="avatar" />
        <div className="text-center text-white text-sm font-bold">{userData.full_name || 'Người dùng'}</div>
      </div>
      <div className="text-center text-white text-sm font-normal">Chào mừng bạn trở lại</div>
      <div className="mt-4 h-px bg-white/25" />

      <div className="flex flex-col gap-2 mt-6">

        <button
          onClick={() => handleNavigation('/service/orders', 'Danh Sách Đơn Hàng', 'Orders')}
          className={getButtonClass('Orders')}
        >
          <FaTruck className="w-6 h-6" />
          <span>Quản lý đơn hàng</span>
        </button>

        <button
          onClick={() => handleNavigation('/service/salesStatistics', 'Thống Kê Bán Hàng', 'SalesStatistics')}
          className={getButtonClass('SalesStatistics')}
        >
          <FaChartBar className="w-6 h-6" />
          <span className="text-left">Thống kê bán hàng</span>
        </button>

        <button
          onClick={() => handleNavigation('/service/product', 'Danh Sách Sản Phẩm', 'Products')}
          className={getButtonClass('Products')}
        >
          <FaBoxOpen className="w-6 h-6" />
          <span>Quản lý sản phẩm</span>
        </button>

        <button
          onClick={() => handleNavigation('/service/images', 'Danh Sách Hình Ảnh', 'Images')}
          className={getButtonClass('Images')}
        >
          <FaImage className="w-6 h-6" />
          <span className="text-left">Quản lý hình ảnh</span>
        </button>

        <button
          onClick={() => handleNavigation('/service/variants', 'Danh Sách Phân Loại', 'Variants')}
          className={getButtonClass('Variants')}
        >
          <FaTags className="w-6 h-6" />
          <span>Quản lý phân loại</span>
        </button>

        <button
          onClick={() => handleNavigation('/service/specifications', 'Danh Sách Thông Số kỹ thuật', 'Specifications')}
          className={getButtonClass('Specifications')}
        >
          <FaSlidersH className="w-6 h-6" />
          <span className="text-left">Quản lý thông số kỹ thuật</span>
        </button>

        <button
          onClick={() => handleNavigation('/service/users', 'Danh Sách Người Dùng', 'Users')}
          className={getButtonClass('Users')}
        >
          <FaUser className="w-6 h-6" />
          <span className="text-left">Quản lý người dùng</span>
        </button>

        <button
          onClick={() => handleNavigation('/service/vouchers', 'Danh Sách Mã Khuyến Mãi', 'Vouchers')}
          className={getButtonClass('Vouchers')}
        >
          <FaTicketAlt className="w-6 h-6" />
          <span className="text-left">Quản lý khuyến mãi</span>
        </button>

        <button
          onClick={() => handleNavigation('/service/letters', 'Quản Lý Bản Tin', 'Letters')}
          className={getButtonClass('Letters')}
        >
          <FaPaperPlane className="w-6 h-6" />
          <span className="text-left">Quản lý bản tin</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
