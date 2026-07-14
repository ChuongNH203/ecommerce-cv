import React, { useState } from 'react';
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaEye, FaSignOutAlt, FaLock } from 'react-icons/fa';
import AvatarModal from './avatar-modal';


const BASE_URL = "http://localhost:3000";

interface SidebarMenuProps {
  onMenuClick: (form: string) => void;
  activeItem: string;
  avatar: string;
  name: string;
  onAvatarChange: (file: File) => void; 
  onAvatarRemove: () => void; 
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onMenuClick, activeItem, avatar, name, onAvatarChange, onAvatarRemove }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAvatarClick = () => {
    setIsModalVisible(true); 
  };

  const handleAvatarSelect = (file: File) => {
    onAvatarChange(file); 
    setIsModalVisible(false); 
  };

  const menuItems = [
    { id: 'profile', label: 'Thông tin tài khoản', icon: FaUser },
    { id: 'address', label: 'Số địa chỉ', icon: FaMapMarkerAlt },
    { id: 'order', label: 'Quản lý đơn hàng', icon: FaShoppingBag },
    { id: 'change-password', label: 'Đổi mật khẩu', icon: FaLock },
    { id: 'logout', label: 'Đăng xuất', icon: FaSignOutAlt },
  ];

  return (
    <div className="w-1/3 p-4 bg-white shadow-md rounded-md mr-5 font-sans">
      <div className="flex flex-col items-center pb-4 border-b border-gray-200 mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 mb-2">
          {avatar ?(
            <img
              src={`${BASE_URL}${avatar}`}
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full cursor-pointer"
              onClick={handleAvatarClick} 
            />
          ): (
            <FaUser className="w-10 h-10 text-gray-500 cursor-pointer" onClick={handleAvatarClick} />
          )}

        </div>
        <div className="text-lg font-semibold text-gray-800">{name}</div>
      </div>

      {/* Menu Items Section */}
      <div className="flex flex-col gap-3 ml-14">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          const isLogout = item.id === 'logout';

          return (
            <div
              key={item.id}
              onClick={() => onMenuClick(item.id)}
              className={`flex items-center gap-3 py-2 cursor-pointer
                ${isActive ? 'text-red-500' : (isLogout ? 'text-gray-500' : 'text-gray-700')}
                ${isLogout ? 'hover:text-red-500' : 'hover:text-red-500'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-red-500' : (isLogout ? 'text-gray-500' : 'text-gray-500')}`} />
              <span className="text-lg font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Avatar Modal */}
      <AvatarModal
        visible={isModalVisible}
        avatarUrl={`${BASE_URL}${avatar}`}
        onClose={() => setIsModalVisible(false)}
        onAvatarSelect={handleAvatarSelect}
        onAvatarRemove={onAvatarRemove}
      />
    </div>
  );
};

export default SidebarMenu;
