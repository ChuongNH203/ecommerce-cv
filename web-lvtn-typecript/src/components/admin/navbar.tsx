import React, { useEffect, useState } from 'react';
import { FiHome, FiLogOut } from 'react-icons/fi';
import { Switch, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstanceL from '../../api/api-login/axiosInstance-login'; // Điều chỉnh lại path nếu cần

const Navbar = () => {
  const navigate = useNavigate();
  const [limitMode, setLimitMode] = useState(false);

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const handleHomeRedirect = () => {
    navigate("/home");
  };

  const fetchLimitSetting = async () => {
    try {
      const res = await axiosInstanceL.get('/api/settings/limit-one-item');
      setLimitMode(res.data.value === 'true');
    } catch (error) {
      message.error('Không thể tải trạng thái chế độ giới hạn.');
    }
  };

  const toggleLimitSetting = async (checked: boolean) => {
    try {
      setLimitMode(checked);
      await axiosInstanceL.post('/api/settings/limit-one-item', {
        value: checked ? 'true' : 'false'
      });
      message.success(`Chế độ chỉ mua 1 sản phẩm đã ${checked ? 'bật' : 'tắt'}`);
    } catch (error) {
      message.error('Lỗi khi cập nhật chế độ.');
    }
  };

  useEffect(() => {
    fetchLimitSetting();
  }, []);

  return (
    <div className="w-full bg-indigo-950 text-white flex justify-between items-center p-3 shadow-md">
      {/* Home */}
      <div className="flex items-center gap-2">
        <button
          className="bg-green-500 p-2 rounded-lg text-white"
          onClick={handleHomeRedirect}
        >
          <FiHome className="text-white text-xl" />
        </button>
      </div>

      {/* Toggle chế độ giới hạn */}
      <div className="flex items-center gap-3">
        <span className="text-sm">Giới hạn mua 1 sản phẩm</span>
        <Switch checked={limitMode} onChange={toggleLimitSetting} />
      </div>

      {/* Logout */}
      <div className="flex items-center gap-2">
        <button className="bg-yellow-300 p-2 rounded-lg" onClick={handleLogout}>
          <FiLogOut className="text-black text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
