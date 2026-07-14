import React, { useState, useEffect } from "react";
import axiosInstanceL from "../../../../api/api-login/axiosInstance-login";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import EmailChangeForm from "./change-email";

const ProfileForm: React.FC<{ setUserData: React.Dispatch<React.SetStateAction<any>>, onUpdateUser: Function }> = ({ setUserData, onUpdateUser }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState({ day: '', month: '', year: '' });
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const accessToken = localStorage.getItem('accessToken');
  let userId: string | null = null;

  if (accessToken) {
    const decodedToken: any = jwtDecode(accessToken);
    userId = decodedToken.userId;
  }

  const fetchUserData = async () => {
    if (userId) {
      try {
        const response = await axiosInstanceL.get(`/api/users/${userId}`);
        const user = response.data;
        setName(user.full_name);
        setGender(user.gender || '');
        setPhone(user.phone_number);
        setBirthdate({
          day: user.date_of_birth ? user.date_of_birth.split('-')[2] : '',
          month: user.date_of_birth ? user.date_of_birth.split('-')[1] : '',
          year: user.date_of_birth ? user.date_of_birth.split('-')[0] : '',
        });
        setEmail(user.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Không có accessToken trong localStorage');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    const updatedData = {
      full_name: name || '', 
      phone_number: phone || '',  
      gender: gender || '',  
      date_of_birth: `${birthdate.year || ''}-${birthdate.month || ''}-${birthdate.day || ''}`,  
    };

    try {
      if (userId) {
        await onUpdateUser(updatedData);
        message.success('Cập nhật thành công!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const renderDateOptions = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString().padStart(2, '0'));
    }
    return days.map((day) => (
      <option key={day} value={day}>
        {day}
      </option>
    ));
  };

  const renderMonthOptions = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i.toString().padStart(2, '0'));
    }
    return months.map((month) => (
      <option key={month} value={month}>
        {month}
      </option>
    ));
  };

  const renderYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i.toString());
    }
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-3xl font-semibold text-gray-700">Thông tin tài khoản</div>

      {errorMessage && (
        <div className="bg-red-100 text-red-500 p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">Họ tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Giới tính</label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center text-lg">
              <input
                type="radio"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="mr-2 text-red-500 focus:ring-red-500"
              />
              Nam
            </label>
            <label className="flex items-center text-lg">
              <input
                type="radio"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className="mr-2 text-red-500 focus:ring-red-500"
              />
              Nữ
            </label>
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Số điện thoại</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Email</label>
          <div className="flex justify-between items-center">
            <span>{email}</span>
            <button onClick={() => setIsEditingEmail(true)} className="ml-2 text-blue-500">Thay đổi</button>
          </div>
        </div>
      </div>

      {/* Pass userId to EmailChangeForm */}
      <EmailChangeForm 
        email={email} 
        setEmail={setEmail} 
        isEditingEmail={isEditingEmail} 
        setIsEditingEmail={setIsEditingEmail} 
        userId={userId} 
      />

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700">Ngày sinh</label>
        <div className="flex gap-4 mt-2">
          <select
            value={birthdate.day}
            onChange={(e) => setBirthdate({ ...birthdate, day: e.target.value })}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Ngày</option>
            {renderDateOptions()}
          </select>
          <select
            value={birthdate.month}
            onChange={(e) => setBirthdate({ ...birthdate, month: e.target.value })}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Tháng</option>
            {renderMonthOptions()}
          </select>
          <select
            value={birthdate.year}
            onChange={(e) => setBirthdate({ ...birthdate, year: e.target.value })}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Năm</option>
            {renderYearOptions()}
          </select>
        </div>
      </div>

      <div className="flex justify-start mt-6">
        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white py-3 px-8 rounded-md hover:bg-red-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
