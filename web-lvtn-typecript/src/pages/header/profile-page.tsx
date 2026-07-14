import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ProfileForm from '../../components/MasterLayout/Body/Profile/profile-form';
import SidebarMenu from '../../components/MasterLayout/Body/Profile/sidebar-nemu';
import OrderManagement from '../../components/MasterLayout/Body/Profile/order-management';
import { message } from 'antd';
import axiosInstanceL from '../../api/api-login/axiosInstance-login';
import { jwtDecode } from 'jwt-decode';
import AddressForm from '../../components/MasterLayout/Body/Profile/address-form';
import OrderTracking from '../../components/MasterLayout/Body/Profile/order-tracking';
import PasswordChangeForm from '../../components/MasterLayout/Body/Profile/password-change';


const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathSegments = location.pathname.split('/');
  const currentActiveItem = pathSegments[pathSegments.length - 1] || 'profile';

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      message.error('Không có accessToken trong localStorage');
      navigate('/login');
      return;
    }

    const decodedToken: any = jwtDecode(accessToken);
    const userId = decodedToken.userId;

    try {
      const response = await axiosInstanceL.get(`/api/users/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [userData]);

  const handleMenuClick = (formId: string) => {
    if (formId === 'logout') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      message.success('Bạn đã đăng xuất thành công!');
      navigate('/login');
    } else {
      navigate(`/account/${formId}`);
    }
  };

  const handleAvatarChange = (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    axiosInstanceL
      .put(`/api/users/${userData.id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setUserData((prevData: any) => ({
          ...prevData,
          avatar: response.data.avatar, 
        }));
        fetchUserData();
        message.success("Cập nhật avatar thành công!");
      })
      .catch((error) => {
        console.error("Error updating avatar:", error);
        message.error("Cập nhật avatar thất bại!");
      });
  };

  const handleUpdateUser = (updatedData: any) => {
    setLoading(true);
    axiosInstanceL.put(`/api/users/${userData.id}`, updatedData)
      .then((response) => {
        setUserData((prevData: any) => ({
          ...prevData,
          full_name: response.data.full_name,
        }));
        fetchUserData();
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
        message.error('Cập nhật thông tin thất bại!');
      })
      .finally(() => setLoading(false));
  };

  const handleAvatarRemove = () => {
    axiosInstanceL.delete(`/api/users/${userData.id}/avatar`)
    .then(() => {
      setUserData((prevData: any) => ({
        ...prevData,
        avatar: '',
      }));
      message.success('Xóa avatar thành công!');
    })
    .catch((error) => {
      message.error('Không thể xóa avatar!');
    });
  };

  if (loading) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100 p-8">
      <SidebarMenu
        onMenuClick={handleMenuClick}
        activeItem={currentActiveItem}
        avatar={userData?.avatar}
        name={userData?.full_name}
        onAvatarChange={handleAvatarChange}
        onAvatarRemove={handleAvatarRemove}
      />
      <div className="w-full p-6 bg-white shadow-lg rounded-md">
        <Routes>
          <Route path="profile" element={<ProfileForm setUserData={setUserData} onUpdateUser={handleUpdateUser}/>} />
          <Route path="address" element={<AddressForm />} />
          <Route path="order" element={<OrderManagement />} />
          <Route path="order-tracking" element={<OrderTracking />} />
          <Route path="change-password" element={<PasswordChangeForm userId={userData.id} setUserData={setUserData} />} />
          <Route path="/" element={<ProfileForm setUserData={setUserData} onUpdateUser={handleUpdateUser}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default ProfilePage;
